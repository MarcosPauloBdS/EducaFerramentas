-- Execute apenas no projeto EducaFerramentas. Tudo é revertido ao final.
begin;
select set_config('educa.test_a',gen_random_uuid()::text,true),set_config('educa.test_b',gen_random_uuid()::text,true);
insert into auth.users(id,aud,role,email) values
 (current_setting('educa.test_a')::uuid,'authenticated','authenticated','rls-a-'||current_setting('educa.test_a')||'@example.invalid'),
 (current_setting('educa.test_b')::uuid,'authenticated','authenticated','rls-b-'||current_setting('educa.test_b')||'@example.invalid');
select set_config('educa.class_a',gen_random_uuid()::text,true),set_config('educa.class_b',gen_random_uuid()::text,true),
 set_config('educa.student_a',gen_random_uuid()::text,true),set_config('educa.student_b',gen_random_uuid()::text,true);
insert into public.classrooms(id,owner_id,name) values
 (current_setting('educa.class_a')::uuid,current_setting('educa.test_a')::uuid,'Turma teste A'),
 (current_setting('educa.class_b')::uuid,current_setting('educa.test_b')::uuid,'Turma teste B');
insert into public.students(id,owner_id,classroom_id,name) values
 (current_setting('educa.student_a')::uuid,current_setting('educa.test_a')::uuid,current_setting('educa.class_a')::uuid,'Aluno fictício A'),
 (current_setting('educa.student_b')::uuid,current_setting('educa.test_b')::uuid,current_setting('educa.class_b')::uuid,'Aluno fictício B');
insert into public.grade_reports(owner_id,student_id,entries) values
 (current_setting('educa.test_a')::uuid,current_setting('educa.student_a')::uuid,'[{"grade":8,"weight":1}]'),
 (current_setting('educa.test_b')::uuid,current_setting('educa.student_b')::uuid,'[{"grade":9,"weight":1}]');
insert into public.exams(owner_id,title) values(current_setting('educa.test_a')::uuid,'Prova A'),(current_setting('educa.test_b')::uuid,'Prova B');
set local role authenticated;
select set_config('request.jwt.claims',json_build_object('sub',current_setting('educa.test_a'),'role','authenticated')::text,true);
do $$ declare t text; n integer; begin
 for t in select unnest(array['classrooms','students','grade_reports','exams']) loop
   if has_table_privilege('authenticated','public.'||t,'TRUNCATE') then raise exception 'Unexpected truncate grant: %',t; end if;
   execute format('select count(*) from public.%I',t) into n;
   if n<>1 then raise exception 'RLS select failed: %',t; end if;
   execute format('update public.%I set owner_id=owner_id where owner_id=$1',t) using current_setting('educa.test_b')::uuid;
   get diagnostics n=row_count; if n<>0 then raise exception 'RLS update cross-owner failed: %',t; end if;
   execute format('delete from public.%I where owner_id=$1',t) using current_setting('educa.test_b')::uuid;
   get diagnostics n=row_count; if n<>0 then raise exception 'RLS delete cross-owner failed: %',t; end if;
   begin
     execute format('update public.%I set owner_id=$1',t) using current_setting('educa.test_b')::uuid;
     raise exception 'Owner reassignment allowed: %',t;
   exception when insufficient_privilege then null; end;
 end loop;
 begin insert into public.classrooms(owner_id,name) values(current_setting('educa.test_b')::uuid,'Forged');
   raise exception 'Forged owner insert allowed'; exception when insufficient_privilege then null; end;
 begin insert into public.students(owner_id,classroom_id,name) values(current_setting('educa.test_a')::uuid,current_setting('educa.class_b')::uuid,'Forged relation');
   raise exception 'Cross-owner classroom association allowed'; exception when foreign_key_violation then null; end;
 begin insert into public.grade_reports(owner_id,student_id,entries) values(current_setting('educa.test_a')::uuid,gen_random_uuid(),'[{"grade":11,"weight":1}]');
   raise exception 'Invalid grade allowed'; exception when check_violation then null; end;
 if public.valid_grade_entries('[{"grade":5,"weight":0}]') or public.valid_exam_questions('[{"id":"x"}]') then raise exception 'Invalid JSON accepted'; end if;
 insert into public.classrooms(owner_id,name) values(current_setting('educa.test_a')::uuid,'Own insert');
 update public.classrooms set name='Own update' where name='Own insert';
 get diagnostics n=row_count; if n<>1 then raise exception 'Own write failed'; end if;
 delete from public.classrooms where name='Own update';
end $$;
select set_config('request.jwt.claims',json_build_object('sub',current_setting('educa.test_b'),'role','authenticated')::text,true);
do $$ declare t text; n integer; begin
 for t in select unnest(array['classrooms','students','grade_reports','exams']) loop
   execute format('select count(*) from public.%I',t) into n;
   if n<>1 then raise exception 'Reverse isolation failed: %',t; end if;
 end loop;
end $$;
set local role anon;
select set_config('request.jwt.claims','{}',true);
do $$ declare t text; begin
 for t in select unnest(array['classrooms','students','grade_reports','exams']) loop
   begin execute format('select * from public.%I',t); raise exception 'Anonymous read allowed: %',t;
   exception when insufficient_privilege then null; end;
 end loop;
end $$;
reset role;
select 'PASS: isolation, owner checks, cross-owner FK, validation, own writes and anonymous denial; rollback follows' as result;
rollback;
