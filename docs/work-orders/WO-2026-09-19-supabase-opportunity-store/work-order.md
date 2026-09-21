# Work Order — Supabase opportunity persistence

- Work Order ID: `WO-2026-09-19-supabase-opportunity-store`
- Title: Supabase-backed opportunity persistence and catalog projection foundation
- Status: active follow-up
- Created: 2026-09-19
- Last updated: 2026-09-21
- Requester: repository owner
- Current owner: ChatGPT / implementation agent
- Request mode: update
- Tracking issue: [#156](https://github.com/rickvang/Persona-Library/issues/156)
- Repository: `rickvang/Persona-Library`
- Base: `main @ bb41dac2b9dc887547ff00f7ab305c8e26b270a3`
- Working branch: `feat/issue-156-supabase-opportunity-store`

## Objective

Implement the first executable milestone from #156: make the Applications surface storage-implementation-independent, add an authenticated Supabase persistence path, preserve a safe local migration/rollback path, and prepare the database contract without publishing private opportunity records.

Do not begin the read-only catalog projection until the opportunity-store path is proven against a real authorized Supabase project.

## Placement / Mara boundary review

Classification:

- existing Applications surface extension, not a new Persona-Library top-level space;
- new storage adapter and deployment configuration behavior;
- durable architecture/source-of-truth clarification;
- external private persistence remains outside canonical Persona/Skill/Tool/Playbook records.

Destination:

- `client/job-tracker-store.js` — storage/auth adapter boundary;
- `client/job-tracker.js` — Applications UI orchestration only;
- `content/job-tracker-page.html` — auth, storage-state, and migration controls;
- `scripts/build-library.mjs` — generated runtime config and copied storage module;
- `docs/job-search/application-tracker-contract.md` — current persistence contract;
- `ARCHITECTURE.md` and Decisions — accepted source-of-truth boundary;
- `scripts/validation/*` — regression checks.

Rejected placement alternatives:

- storing real opportunity rows in `content/library-data/*`;
- reusing an unrelated existing Supabase project;
- committing a SQLite/JSON/CSV private tracker database;
- making Supabase canonical for Personas, Skills, Playbooks, or Decisions;
- starting the catalog projection before remote opportunity persistence is validated.

## Current evidence

Sourced / observed:

- Current tracker stores records under `persona-library.job-applications.v1`.
- Current main includes safe merge/import behavior from commit `bb41dac2b9dc887547ff00f7ab305c8e26b270a3`.
- Supabase account access currently exposes organization `ACME` and two unrelated projects: `rs3trade` and `Pursando`; neither is authorized as the Persona-Library data store.
- Current Supabase docs support browser `supabase-js` clients with publishable keys, custom schemas, Auth sessions, explicit Data API grants, and RLS.
- Current npm release observed for `@supabase/supabase-js`: `2.116.0`; browser CDN dependency will be version-pinned if used.

Unknown / blocked:

- new project cost has not yet been retrieved/confirmed;
- requester has not yet explicitly selected the Supabase organization for project creation;
- final project URL/publishable key and auth redirect origins do not exist yet;
- remote RLS behavior cannot be claimed verified until a project is created.

## Authorization

Authorized now:

- branch/file changes in `rickvang/Persona-Library` required to implement #156;
- Work Order, Docs, Decision, client, build, and validation changes;
- PR creation for review.

Not yet authorized:

- creating a paid Supabase project without the explicit organization + cost confirmation required by the connector;
- repurposing `rs3trade` or `Pursando`;
- merging a PR;
- closing #153 or #156;
- committing private opportunity rows or secret keys.

## Scope

1. Introduce an asynchronous `OpportunityStore` boundary.
2. Keep `LocalStorageOpportunityStore` as explicit fallback/migration source.
3. Add `SupabaseOpportunityStore` using authenticated user sessions and the `app` schema.
4. Add signed-in / signed-out / local-mode UI states.
5. Add explicit one-time local → Supabase migration review.
6. Keep JSON import/export portable.
7. Generate public runtime config from deployment environment variables without committing credentials.
8. Specify the first database schema/RLS contract for later application once a project is authorized.
9. Update architecture/Decision/validation contracts.

## Non-goals

- catalog projection implementation in this milestone;
- job scraping or autonomous submission;
- recruiter CRM features;
- replacing candidate context;
- bidirectional Supabase → Git catalog authoring;
- creating a standalone tracker repository;
- deleting local backups immediately after migration.

## Success criteria

Repository milestone is ready for remote proof when:

- tracker UI no longer directly owns persistence;
- remote mode never silently falls back to local writes;
- signed-out remote mode cannot mutate tracker data;
- local migration is explicit and reviewable;
- remote CRUD maps between current tracker records and the proposed database columns;
- generated config contains no service/secret key;
- existing import/export behavior remains available;
- build/validation contracts cover the new boundary;
- private opportunity records remain absent from repository content.

Remote milestone remains blocked until:

- a new Supabase project is explicitly authorized and created;
- schema/RLS are applied;
- security advisors and cross-user isolation tests pass;
- current local opportunity data is migrated and verified.

## Current phase

Phase: repository source implementation complete; remote proof blocked.

Gate result: storage adapter, auth/migration UI, generated deployment config, database contract, DEC-017, architecture changes, and validation contracts are implemented on the working branch. Connected-tool syntax/contract checks passed for the browser modules. Canonical Node build/test commands remain unexecuted on this tool surface and are not claimed passed.

Live project created: `persona-workspace-data` (`spqruezbccrabmliuijm`) in ACME / `us-east-2` at an approved cost of $0/month. Migrations `create_app_opportunities` and `expose_app_schema` are applied. `app.opportunities` has RLS enabled; authenticated has CRUD grants; anon has no schema/table access; Supabase security and performance advisors both report no findings. PostgREST role config includes `pgrst.db_schemas=public, app`.

Live wiring update: the private Supabase Auth owner exists (`auth.users` count = 1) and has a password credential. The requester connected `persona-workspace-data` to the Persona-Library Vercel project. The build accepts both `SUPABASE_*` and `NEXT_PUBLIC_SUPABASE_*` URL/publishable-key pairs.

Deployment verification checkpoint: Vercel Supabase integration environment scope was saved for Production, Preview, and Development on 2026-09-21. The Applications login was changed from magic-link email to direct Supabase email + password authentication to remove SMTP delivery as a dependency. Store/runtime/page JavaScript syntax checks passed, no magic-link auth residue remains in those runtime surfaces, and the latest Vercel Preview for commit `5224860677dab35b0ef47086763e7e4b75620ce7` is READY. Supabase Security Advisor now reports one Auth warning: leaked-password protection is disabled; this is not blocking the private owner sign-in proof but should be reviewed before broader use.

Vercel connection checkpoint: requester confirmed `persona-workspace-data` is explicitly connected to the `persona-library` Vercel project. Fresh Preview deployment `f99d66420a457bb9bee9870ad4526b82d3534281` is READY and its generated `job-tracker-config.js` was directly verified as `mode: supabase` with project URL `https://spqruezbccrabmliuijm.supabase.co`, publishable key, and schema `app`. The previous no-op login was traced to an older Preview built in `mode: local`, not to the user's Auth credentials.

Live Auth proof: requester successfully signed in through the Supabase-mode Preview; Supabase `auth.users.last_sign_in_at` confirms the session at 2026-09-21 14:46 UTC. Screenshot evidence also exposed a UI issue where the login form remained visible while signed in; commit `5518518ae21c2f33e0e7da81e10ca70ca09ce7bf` adds an explicit `.auth-form[hidden]{display:none!important}` rule. Its Preview deployment is READY.

Remote CRUD checkpoint: authenticated Preview create/read is proven. The requester created `supabase test` / `crud smoke test` with status `Found`; direct Supabase verification found the row in `app.opportunities` at 2026-09-21 14:49 UTC. Update/delete client-path proof remains.

Remote CRUD proof complete: the authenticated Preview successfully created the temporary `supabase test` / `crud smoke test` row, read it back, updated status from `Found` to `Reviewing`, and deleted it through the UI. Direct Supabase verification confirmed each state transition and now reports zero matching rows. The authenticated application CRUD path is proven end-to-end.

## Validation closeout

- Live Preview is verified in `mode: supabase`.
- Authenticated email/password sign-in is proven against the live Supabase project.
- UI CRUD is proven end-to-end: create → read → update → delete, with direct database verification after each step.
- RLS isolation smoke test passed: the owner JWT could read the temporary row, a different authenticated JWT subject could not, anon has neither schema USAGE nor table SELECT, and the transaction left zero residual rows.
- `node --test scripts/validation/validation.test.mjs` passed in an isolated Vercel build.
- The normal Vercel build `node scripts/build-library.mjs` passes and the final Preview is READY.
- `node scripts/validate-content.mjs` was executed and fails on a pre-existing main-branch inconsistency: `.agents/skills/local-video-inspection` exists on `main`, but `content/orientation/skills.json` on `main` does not route it. The same condition exists on this branch and was not introduced by #157.
- Supabase Security Advisor has one non-blocking Auth warning: leaked-password protection is disabled.

## Next action

Merge PR #157 under the requester's explicit authorization. After production deploy, sign in on the production origin and migrate the existing production-origin local tracker rows.


## Follow-up — Posting date (#158)

Issue #158 extends the existing opportunity record with an optional employer posting date. The live Supabase table now includes nullable `posted_at date`; existing rows remain valid and currently retain blank posting dates unless a trusted source supplies one. The tracker portable shape uses `postingDate`, the Add/Edit form exposes a Posting date field, the Dates column renders Posted / Found / Applied, and import/export plus Supabase mapping preserve the value without inferring it.

Validation checkpoint: browser store/import/runtime modules parse successfully; Supabase confirms `posted_at` is nullable; the tracker Node test suite passed in an isolated Vercel validation build; Supabase performance advisor is clean and the only security advisor warning remains the existing leaked-password-protection Auth warning. The normal Vercel build command was restored afterward.
