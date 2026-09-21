# Seen-job deduplication Work Order

## Header

- Work Order ID: WO-2026-09-16-seen-job-dedup
- Issue: #96
- Status: complete
- Last updated: 2026-09-21
- Authorized repository: `rickvang/Persona-Library`
- Working branch: `feat/issue-96-supabase-seen-jobs`
- Change mode: source update + private Supabase migration + runtime proof
- Current owner: ChatGPT / implementation agent
- Explicit collaborator: Mara Okoye · knowledge systems architect (placement/boundary review)

## Outcome

Prevent repeated Creative Job Search / job-discovery runs from presenting the same opening again by using the existing authenticated `persona-workspace-data` Supabase project as the durable private seen-job store.

Keep this separate from the Applications tracker. Seen-job persistence answers “have I already been shown this opening?” Applications continues to answer “what is the lifecycle state of an opportunity I intentionally chose to track?”

## Placement / boundary review

Selected placement:

- `client/seen-job-store.js` — dedicated stable-identity + authenticated storage adapter;
- `dist/js/seen-job-store.js` — generated/copied runtime asset;
- `docs/job-search/job-ledger-contract.md` — current reusable behavior/security contract;
- `docs/work-orders/archive/2026-09/WO-2026-09-16-seen-job-dedup/database-contract.sql` — archived repository-side database contract;
- existing private Supabase `app.seen_jobs` — actual user-specific state.

Rejected alternatives:

- putting all discovered jobs into `app.opportunities`;
- expanding Applications with seen/rejected/expired observation state;
- creating a new Supabase project or job database;
- storing private job-search history in Git;
- importing JobAgent or `rickvang/ai-job-search`.

## Implemented repository contract

The adapter now:

1. prefers provider/source + stable provider job ID;
2. otherwise uses a canonical posting URL with tracking-only parameters removed;
3. otherwise requires a conservative normalized `company + title + location` fingerprint;
4. reads the authenticated `app.seen_jobs` table before display;
5. leaves unseen results unpersisted until the caller has actually presented them;
6. records shown results afterward with `first_shown_at`;
7. ignores duplicate inserts so first-shown time remains stable;
8. provides no local-storage fallback for repeated-run memory.

Applications remains unchanged as the lifecycle store.

## Live Supabase state

Project: `persona-workspace-data` (`spqruezbccrabmliuijm`).

Migration `create_app_seen_jobs` was applied on 2026-09-21.

`app.seen_jobs` contains only:

- `row_id`
- `user_id`
- `stable_key`
- `provider_job_id`
- `source_url`
- `normalized_source_url`
- `company`
- `title`
- `location`
- `first_shown_at`

Security boundary:

- RLS enabled;
- anonymous table access revoked;
- authenticated gets SELECT + INSERT only;
- owner-bound SELECT and INSERT policies use `(select auth.uid()) = user_id`;
- browser/runtime integration uses the existing publishable-key + authenticated-session model;
- no real seen-job rows are committed as evidence.

## Validation status

Observed:

- live table exists with RLS enabled;
- synthetic owner row could be inserted under an authenticated owner JWT context;
- a different authenticated JWT subject saw zero rows for that owner record;
- the synthetic proof row was deleted afterward, leaving no test residue;
- Supabase performance advisor reports no findings;
- Supabase security advisor reports only the pre-existing Auth warning that leaked-password protection is disabled;
- focused Node tests cover provider-ID precedence, tracking-parameter canonicalization, conservative fallback identity, read-before-record behavior, repeated-run suppression, and no silent local fallback.

Repository validation complete:

- PR #170 opened against `main`;
- GitHub Actions Repository validation run #36 passed;
- final GitHub Actions Repository validation run #45 passed on merge candidate `5dbf78b1c4b288ba9fd5583d0e78664dc3d014bc`;
- build generated library output passed;
- authored/generated content validation passed;
- repository tests passed, including the new seen-job identity and repeated-run tests;
- pull-request whitespace check passed;
- generated-output parity check passed;
- final Supabase privilege proof confirms anon has no app schema usage and no SELECT/INSERT on `app.seen_jobs`;
- authenticated has SELECT + INSERT only, with UPDATE/DELETE denied by grants;
- `app.seen_jobs` contains zero rows after synthetic proof cleanup.

Merge is authorized by the requester’s explicit instruction to merge issue #96 and by the current Persona-Library standing completion contract; the pinned GitHub Tool contract still governs fresh preflight and linked-issue completion.

## Posting-date follow-up

The requester separately asked to backfill missing Applications posting dates from the stored posting links. This is private data maintenance, not part of the seen-job schema.

Result:

- 8 of 12 previously blank posting dates were backfilled from exact employer/ATS metadata;
- Cengage Group: 2026-05-27;
- Filevine: 2026-07-15;
- Function Health: 2026-01-28;
- HighLevel: 2026-09-05;
- Render: 2026-08-07;
- Tessera Labs: 2026-05-13;
- Vanta: 2026-06-26;
- Workiva: 2026-08-03;
- Apollo.io, Future, ngrok, and Order.co remain blank because their linked pages did not expose an exact published date that could be verified without inference.

## Decision-history correction

Codex review identified that moving the private seen-job set from caller/runtime-only state to a dedicated authenticated Supabase table is a durable architecture change that requires Decision history. DEC-020 now records that choice, qualifies DEC-011 and DEC-017, preserves the Applications separation, and defines the revisit conditions.

The earlier VM cross-realm test issue and implementation-guide ownership mismatch are also corrected on this branch.

## Completion

- all Codex review threads were addressed and resolved;
- DEC-020 records the authenticated seen-job storage decision;
- PR #170 merged to `main` as `143612e152fd32fab1950f70d1e1c21ebdfb7ad6` on 2026-09-21;
- GitHub automatically closed issue #96 from the existing in-scope closing keyword;
- the linked Current Work record was reconciled to `Done / Reference` with checkpoint C04 before completion was reported;
- this terminal Work Order package was moved to the September 2026 archive under the repository's archive lifecycle.

## Next action

Reference only. Reopen with a new GitHub issue and a new active Work Order if seen-job persistence or deduplication requires further changes.
