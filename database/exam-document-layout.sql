-- Aplicado ao projeto EducaFerramentas em 03/11/2026 via migration 20261103080910_reusable_exam_headers_and_layout.
create table public.exam_headers (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 name text not null check (length(trim(name)) between 1 and 100),
 body text not null check (length(body) <= 4000),
 created_at timestamptz not null default now()
);
create index exam_headers_owner_idx on public.exam_headers(owner_id);
alter table public.exam_headers enable row level security;
create policy own_headers on public.exam_headers for all to authenticated
 using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
revoke all on public.exam_headers from public, anon, authenticated;
grant select, insert, update, delete on public.exam_headers to authenticated;
alter table public.exams add column layout jsonb not null default '{}'::jsonb
 check (jsonb_typeof(layout) = 'object' and pg_column_size(layout) <= 12000);
