begin;
select set_config('educa.ai_test_user',gen_random_uuid()::text,true);
insert into auth.users(id,aud,role,email) values(current_setting('educa.ai_test_user')::uuid,'authenticated','authenticated','ai-quota-'||current_setting('educa.ai_test_user')||'@example.invalid');
insert into educa_internal.ai_project_daily(day_utc,calls,last_requested_at) values((now() at time zone 'UTC')::date,0,null) on conflict(day_utc) do update set calls=0,last_requested_at=null;
set local role authenticated;
do $$ begin
 begin perform public.reserve_ai_generation(current_setting('educa.ai_test_user')::uuid);raise exception 'Authenticated must not reserve directly';exception when insufficient_privilege then null;end;
 begin perform * from educa_internal.ai_user_daily;raise exception 'Authenticated must not read private counters';exception when insufficient_privilege then null;end;
end $$;
set local role anon;
do $$ begin
 begin perform public.reserve_ai_generation(current_setting('educa.ai_test_user')::uuid);raise exception 'Anon must not reserve';exception when insufficient_privilege then null;end;
end $$;
set local role service_role;
do $$ declare r jsonb; i integer; begin
 r:=public.reserve_ai_generation(current_setting('educa.ai_test_user')::uuid);
 if (r->>'allowed')::boolean is not true or (r->>'remaining')::integer<>9 then raise exception 'First reservation failed';end if;
 r:=public.reserve_ai_generation(current_setting('educa.ai_test_user')::uuid);
 if r->>'code'<>'COOLDOWN' then raise exception 'Cooldown failed';end if;
 for i in 2..10 loop
   update educa_internal.ai_project_daily set last_requested_at=now()-interval '61 seconds' where day_utc=(now() at time zone 'UTC')::date;
   r:=public.reserve_ai_generation(current_setting('educa.ai_test_user')::uuid);
   if (r->>'allowed')::boolean is not true then raise exception 'Reservation % failed',i;end if;
 end loop;
 r:=public.reserve_ai_generation(current_setting('educa.ai_test_user')::uuid);
 if r->>'code'<>'USER_DAILY_LIMIT' then raise exception 'User limit failed';end if;
 update educa_internal.ai_project_daily set calls=30 where day_utc=(now() at time zone 'UTC')::date;
 r:=public.reserve_ai_generation(current_setting('educa.ai_test_user')::uuid);
 if r->>'code'<>'PROJECT_DAILY_LIMIT' then raise exception 'Project limit failed';end if;
end $$;
reset role;
select 'PASS: role restrictions, cooldown, user and project daily caps; rollback follows' as result;
rollback;
