-- Aplicado somente no EducaFerramentas: 20261103185805_private_exam_media_and_header_design
alter table public.exam_headers add column design jsonb not null default '{}'::jsonb check (jsonb_typeof(design)='object' and pg_column_size(design)<=12000);
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('exam-media','exam-media',false,1048576,array['image/png','image/jpeg']);
create policy exam_media_read_own on storage.objects for select to authenticated using(bucket_id='exam-media' and (select auth.uid())::text=(storage.foldername(name))[1]);
create policy exam_media_insert_own on storage.objects for insert to authenticated with check(bucket_id='exam-media' and (select auth.uid())::text=(storage.foldername(name))[1] and name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.(png|jpg)$');
create policy exam_media_delete_own on storage.objects for delete to authenticated using(bucket_id='exam-media' and (select auth.uid())::text=(storage.foldername(name))[1]);

