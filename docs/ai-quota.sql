-- Somente EducaFerramentas. Contadores internos; nenhum tema ou dado de aluno é armazenado.
create schema educa_internal;
revoke all on schema educa_internal from public,anon,authenticated;
grant usage on schema educa_internal to service_role;
create table educa_internal.ai_project_daily (
  day_utc date primary key,
  calls integer not null default 0 check(calls>=0),
  last_requested_at timestamptz
);
create table educa_internal.ai_user_daily (
  owner_id uuid not null references auth.users(id) on delete cascade,
  day_utc date not null,
  calls integer not null default 0 check(calls>=0),
  primary key(owner_id,day_utc)
);
alter table educa_internal.ai_project_daily enable row level security;
alter table educa_internal.ai_user_daily enable row level security;
create policy deny_direct_access on educa_internal.ai_project_daily for all to anon,authenticated using(false) with check(false);
create policy deny_direct_access on educa_internal.ai_user_daily for all to anon,authenticated using(false) with check(false);
revoke all on educa_internal.ai_project_daily,educa_internal.ai_user_daily from public,anon,authenticated,service_role;
grant select,insert,update on educa_internal.ai_project_daily,educa_internal.ai_user_daily to service_role;
create function public.reserve_ai_generation(p_user_id uuid) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare
  v_now timestamptz := now();
  v_day date := (now() at time zone 'UTC')::date;
  v_global educa_internal.ai_project_daily%rowtype;
  v_user educa_internal.ai_user_daily%rowtype;
  v_reset integer;
begin
  if p_user_id is null then raise exception 'User required'; end if;
  insert into educa_internal.ai_project_daily(day_utc) values(v_day) on conflict do nothing;
  select * into v_global from educa_internal.ai_project_daily where day_utc=v_day for update;
  insert into educa_internal.ai_user_daily(owner_id,day_utc) values(p_user_id,v_day) on conflict do nothing;
  select * into v_user from educa_internal.ai_user_daily where owner_id=p_user_id and day_utc=v_day for update;
  v_reset:=greatest(1,ceil(extract(epoch from (((v_day+1)::timestamp at time zone 'UTC')-v_now)))::integer);
  if v_global.calls>=30 then return jsonb_build_object('allowed',false,'code','PROJECT_DAILY_LIMIT','retryAfter',v_reset); end if;
  if v_user.calls>=10 then return jsonb_build_object('allowed',false,'code','USER_DAILY_LIMIT','retryAfter',v_reset); end if;
  if v_global.last_requested_at is not null and v_global.last_requested_at>v_now-interval '60 seconds' then
    return jsonb_build_object('allowed',false,'code','COOLDOWN','retryAfter',greatest(1,ceil(60-extract(epoch from (v_now-v_global.last_requested_at)))::integer));
  end if;
  update educa_internal.ai_project_daily set calls=calls+1,last_requested_at=v_now where day_utc=v_day;
  update educa_internal.ai_user_daily set calls=calls+1 where owner_id=p_user_id and day_utc=v_day;
  return jsonb_build_object('allowed',true,'remaining',9-v_user.calls);
end $$;
revoke all on function public.reserve_ai_generation(uuid) from public,anon,authenticated;
grant execute on function public.reserve_ai_generation(uuid) to service_role;
