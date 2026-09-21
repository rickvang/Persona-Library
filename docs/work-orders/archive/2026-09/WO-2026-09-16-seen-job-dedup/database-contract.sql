-- Design contract for issue #96.
-- The live schema is applied through the authorized Supabase project migration surface.
-- Real seen-job rows remain private Supabase data and are never committed here.

create schema if not exists app;

create table if not exists app.seen_jobs (
  row_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stable_key text not null,
  provider_job_id text,
  source_url text,
  normalized_source_url text,
  company text not null,
  title text not null,
  location text,
  first_shown_at timestamptz not null default now(),
  constraint seen_jobs_user_stable_key unique (user_id, stable_key)
);

alter table app.seen_jobs enable row level security;

revoke all on schema app from anon;
revoke all on app.seen_jobs from anon;
revoke all on app.seen_jobs from service_role;

grant usage on schema app to authenticated;
grant select, insert on app.seen_jobs to authenticated;

create policy "owners_select_seen_jobs"
  on app.seen_jobs
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "owners_insert_seen_jobs"
  on app.seen_jobs
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- The app schema must remain explicitly exposed through the Supabase Data API.
-- Grants control object access and RLS controls row access; both are required.
-- The browser/runtime uses only the project publishable key plus the authenticated
-- user's session. Never place a secret/service-role key in client code.
