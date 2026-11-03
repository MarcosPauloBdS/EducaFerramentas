-- Destino exclusivo: EducaFerramentas (ywhynggtlxqlrkshttch).
-- Aplicado como migration pelo conector; não contém dados de professores.
create function public.valid_grade_entries(entries jsonb) returns boolean
language plpgsql immutable security invoker set search_path = '' as $$
declare item jsonb; total numeric := 0;
begin
  if jsonb_typeof(entries) <> 'array' or jsonb_array_length(entries) not between 1 and 6 then return false; end if;
  for item in select value from jsonb_array_elements(entries) loop
    if jsonb_typeof(item->'grade') is distinct from 'number' or jsonb_typeof(item->'weight') is distinct from 'number' then return false; end if;
    if (item->>'grade')::numeric not between 0 and 10 or (item->>'weight')::numeric < 0 then return false; end if;
    total := total + (item->>'weight')::numeric;
  end loop;
  return total > 0;
end $$;
revoke all on function public.valid_grade_entries(jsonb) from public;
grant execute on function public.valid_grade_entries(jsonb) to authenticated;

create function public.valid_exam_questions(questions jsonb) returns boolean
language plpgsql immutable security invoker set search_path = '' as $$
declare q jsonb; opt jsonb;
begin
  if jsonb_typeof(questions) <> 'array' or jsonb_array_length(questions) > 200 then return false; end if;
  for q in select value from jsonb_array_elements(questions) loop
    if jsonb_typeof(q->'id') is distinct from 'string' or jsonb_typeof(q->'statement') is distinct from 'string'
      or length(trim(q->>'statement')) not between 1 and 4000
      or jsonb_typeof(q->'correctId') is distinct from 'string'
      or jsonb_typeof(q->'options') is distinct from 'array' then return false; end if;
    if jsonb_array_length(q->'options') <> 4 then return false; end if;
    for opt in select value from jsonb_array_elements(q->'options') loop
      if jsonb_typeof(opt->'id') is distinct from 'string' or jsonb_typeof(opt->'text') is distinct from 'string'
        or length(trim(opt->>'text')) not between 1 and 1000 then return false; end if;
    end loop;
    if (select count(distinct value->>'id') from jsonb_array_elements(q->'options')) <> 4
      or not exists(select 1 from jsonb_array_elements(q->'options') where value->>'id' = q->>'correctId') then return false; end if;
  end loop;
  return (select count(distinct value->>'id') from jsonb_array_elements(questions)) = jsonb_array_length(questions);
end $$;
revoke all on function public.valid_exam_questions(jsonb) from public;
grant execute on function public.valid_exam_questions(jsonb) to authenticated;

create table public.classrooms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (length(trim(name)) between 1 and 100),
  school text not null default '' check (length(school) <= 150),
  created_at timestamptz not null default now(), unique(id,owner_id)
);
create index classrooms_owner_idx on public.classrooms(owner_id);
create table public.students (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  classroom_id uuid not null,
  name text not null check (length(trim(name)) between 1 and 150),
  created_at timestamptz not null default now(), unique(id,owner_id),
  foreign key(classroom_id,owner_id) references public.classrooms(id,owner_id) on delete restrict
);
create index students_owner_idx on public.students(owner_id);
create index students_classroom_owner_idx on public.students(classroom_id,owner_id);
create table public.grade_reports (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  student_id uuid not null unique,
  entries jsonb not null check (public.valid_grade_entries(entries)),
  version integer not null default 1 check(version > 0),
  foreign key(student_id,owner_id) references public.students(id,owner_id) on delete cascade
);
create index grade_reports_owner_idx on public.grade_reports(owner_id);
create index grade_reports_student_owner_idx on public.grade_reports(student_id,owner_id);
create table public.exams (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check(length(trim(title)) between 1 and 150),
  questions jsonb not null default '[]'::jsonb check(public.valid_exam_questions(questions)),
  shuffle boolean not null default false,
  version integer not null default 1 check(version > 0),
  created_at timestamptz not null default now()
);
create index exams_owner_idx on public.exams(owner_id);

alter table public.classrooms enable row level security;
alter table public.students enable row level security;
alter table public.grade_reports enable row level security;
alter table public.exams enable row level security;
create policy own_classrooms on public.classrooms for all to authenticated
  using ((select auth.uid())=owner_id) with check ((select auth.uid())=owner_id);
create policy own_students on public.students for all to authenticated
  using ((select auth.uid())=owner_id) with check ((select auth.uid())=owner_id);
create policy own_grade_reports on public.grade_reports for all to authenticated
  using ((select auth.uid())=owner_id) with check ((select auth.uid())=owner_id);
create policy own_exams on public.exams for all to authenticated
  using ((select auth.uid())=owner_id) with check ((select auth.uid())=owner_id);
revoke all on public.classrooms,public.students,public.grade_reports,public.exams from public,anon,authenticated;
grant select,insert,update,delete on public.classrooms,public.students,public.grade_reports,public.exams to authenticated;
