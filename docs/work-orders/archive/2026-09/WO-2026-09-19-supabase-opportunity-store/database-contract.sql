-- Design contract for issue #156.
-- This is not a Supabase migration-history file. Create the real migration with
-- the Supabase CLI/MCP only after project organization and cost are explicitly approved.

create schema if not exists app;

create table if not exists app.opportunities (
  row_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  company text not null,
  role text not null,
  status text not null check (status in ('Found','Reviewing','Packet Ready','Applied','Interviewing','Offer','Closed')),
  location text not null default '',
  compensation text not null default '',
  source_url text,
  normalized_source_url text,
  packet_url text,
  posted_at date,
  found_at date,
  applied_at date,
  next_action text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint opportunities_user_id_record_id_key unique (user_id, id)
);

create unique index if not exists opportunities_user_source_url_key
  on app.opportunities (user_id, normalized_source_url)
  where normalized_source_url is not null and normalized_source_url <> '';

alter table app.opportunities enable row level security;

revoke all on schema app from anon;
revoke all on app.opportunities from anon;

grant usage on schema app to authenticated;
grant select, insert, update, delete on app.opportunities to authenticated;

create policy "owners_select_opportunities"
  on app.opportunities
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "owners_insert_opportunities"
  on app.opportunities
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "owners_update_opportunities"
  on app.opportunities
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "owners_delete_opportunities"
  on app.opportunities
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Project configuration still must explicitly expose the app schema through the
-- Data API. RLS and grants are both required; neither substitutes for the other.
-- Keep sign-ups disabled or invite/create the intended owner before using the
-- browser magic-link flow. Never place a secret/service-role key in client code.
