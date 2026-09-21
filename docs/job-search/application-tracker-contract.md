# Job application tracker contract

## Purpose

Define the standalone-friendly application-tracking surface that can live inside Persona Library without making Persona Library the source of private candidate history.

This contract is separate from the lightweight seen-job deduplication contract in `job-ledger-contract.md`. Seen-job deduplication answers “have I already been shown this opening?” The application tracker answers “what is the current state of an opportunity I chose to track?”

## Ownership boundary

```text
Persona-Library
→ owns the tracker UI, portable record schema, lifecycle vocabulary, storage adapter, migration/export behavior, and database contract
→ may link to job-search Playbook guidance
→ does not own or commit the user’s actual application history

Authenticated private opportunity store
→ owns real opportunity/application records when Supabase mode is configured
→ is protected by Supabase Auth, explicit Data API grants, and row-level security
→ remains independent of canonical Persona, Skill, Tool, Template, Pack, and Playbook records

Browser-local private state
→ remains an explicit fallback, migration source, and rollback/recovery copy
→ is never a silent fallback when configured remote persistence fails
→ can be exported/imported as versioned JSON

Evidence-led Job Search Playbook / Priya Desai
→ may use or update application state during an authorized job-search run
→ does not become the storage layer

Future standalone application
→ may adopt the same record schema and authenticated store
→ may move the UI without migrating Persona/Skill identities or canonical library records
```

## Record schema

Each portable record uses a tracker-generated stable `id` and may contain:

| Field | Purpose |
| --- | --- |
| `company` | Employer name |
| `role` | Job title |
| `status` | Current lifecycle state |
| `location` | Location or work-mode note |
| `compensation` | Human-readable compensation note |
| `sourceUrl` | Canonical job posting |
| `packetUrl` | Private application packet/folder link |
| `foundDate` | Date the opportunity was first tracked |
| `appliedDate` | Date submitted, when applicable |
| `nextAction` | Smallest current follow-up |
| `notes` | Candidate-owned working notes |
| `updatedAt` | State freshness marker |

The Supabase adapter maps this portable shape into database columns while preserving the portable ID. Database-only ownership and row identifiers do not become part of the public tracker export contract.

## Lifecycle

`Found → Reviewing → Packet Ready → Applied → Interviewing → Offer / Closed`

The tracker does not infer transitions. External submission, outreach, or interview actions remain separately authorized actions.

## Persistence and privacy

### Configured remote mode

When deployment supplies a complete Supabase URL + publishable-key pair, the generated tracker runtime uses authenticated Supabase storage as the primary persistence layer. The build accepts either `SUPABASE_URL` + `SUPABASE_PUBLISHABLE_KEY` or the Vercel/Next.js aliases `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

- Browser code may use only a publishable key; secret/service-role keys are prohibited.
- The exposed `app` schema must be explicitly allowed through the Supabase Data API.
- Opportunity tables require explicit grants plus RLS; neither mechanism replaces the other.
- RLS policies must bind reads and writes to `auth.uid() = user_id`.
- UPDATE requires both `USING` and `WITH CHECK`.
- Signed-out remote mode cannot mutate opportunity records.
- A remote error must not silently write the same change into browser-local state.

### Local fallback mode

If no remote deployment config exists, the tracker uses browser `localStorage` key `persona-library.job-applications.v1`.

- Local mode is explicit in the UI.
- Existing local records remain available as a migration source after remote mode is enabled.
- Migration never deletes the local copy automatically.
- A successful migration records a local migration marker but preserves the underlying local backup.

### Repository privacy

- No real application records are committed to Persona Library.
- No candidate-specific opportunity rows are embedded in fixtures, generated output, or database contract files.
- Export/import uses versioned JSON for backups and migration.
- Publishing Persona Library source must not publish private tracker contents.

## Storage adapter

The Applications runtime depends on an `OpportunityStore` boundary rather than direct page-owned persistence.

Expected adapters:

- `LocalStorageOpportunityStore` — explicit fallback/migration implementation.
- `SupabaseOpportunityStore` — authenticated remote implementation.

Both expose the operations needed by the UI: load, upsert, remove, safe batch save, explicit replace-all restore, and authentication state where applicable.

The UI must not decide that a failed remote write should become a local write.

## Import behavior

The normal import path is a non-destructive merge/upsert into the current active store.

- Read the current active-store records before applying incoming JSON.
- Match by stable `id` first, then by canonicalized `sourceUrl` when IDs differ.
- Do not use company/title similarity as an automatic overwrite identity.
- Add records with no stable identity match.
- Preserve existing non-empty lifecycle fields and user-owned `notes` and `nextAction`.
- Advance lifecycle state only when the incoming state is further along; never downgrade an existing `Applied`, `Interviewing`, or `Offer` record to an earlier state.
- Fill empty metadata such as `packetUrl`, `location`, and `compensation`; an incoming posting URL may correct a matched record.
- Surface ambiguous or conflicting identities in the import review before committing safe changes.
- Show counts for new, updated, unchanged, and conflicting records before the merge is committed.
- Keep an explicit `Replace all` action for restoring a backup; it is never the default.
- Malformed, unsupported, or invalid imports fail without changing active-store state.
- Export format remains `format: "persona-library-job-applications"` with `version: 1`.

## Local-to-remote migration

When remote mode is configured and the user is authenticated:

1. read existing browser-local records without modifying them;
2. read current authenticated remote records;
3. preview the normal non-destructive merge;
4. require explicit user action to commit safe changes;
5. write through the Supabase adapter;
6. re-read remote records to verify the save returned;
7. record the local migration marker only after successful remote persistence;
8. retain local records and JSON export as rollback/recovery.

A Work Order or application process must not claim migration is complete without inspecting the remote result.

## Deployment configuration

The static build produces `dist/js/job-tracker-config.js`.

- No remote env config → explicit `local` mode.
- A complete `SUPABASE_URL` + `SUPABASE_PUBLISHABLE_KEY` pair, or a complete `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` pair → `supabase` mode.
- Supplying a URL without a matching publishable key, or vice versa, is a build error.
- `SUPABASE_SCHEMA` may select the exposed application schema and defaults to `app`.
- The build never reads or emits a secret/service-role key.

The browser client dependency must be version-pinned and reviewed when upgraded.

## Extraction boundary

The tracker must remain extractable:

- no Persona or Skill ID is required as a primary record key;
- no tracker record is a canonical Persona-Library record;
- links to job-search guidance are integrations, not storage dependencies;
- UI/runtime code remains isolated from library data normalization;
- persistence stays behind the storage adapter so a later app can replace the UI or client without rewriting canonical library identities;
- Supabase catalog projections, if later added, remain separate from private opportunity storage.

## Non-goals

- autonomous application submission;
- scraping or background job discovery;
- recruiter CRM functionality;
- email/calendar synchronization;
- multi-user collaboration UI;
- storing candidate resume evidence in opportunity rows;
- making Supabase canonical for Personas, Skills, Tools, Templates, Operating Packs, Playbooks, Docs, Decisions, or Work Orders;
- replacing the Evidence-led Job Search Playbook or the seen-job deduplication contract.
