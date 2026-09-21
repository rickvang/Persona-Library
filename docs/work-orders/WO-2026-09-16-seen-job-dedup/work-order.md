# Seen-job deduplication Work Order

## Header

- Work Order ID: WO-2026-09-16-seen-job-dedup
- Issue: #96
- Status: active
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
- `docs/work-orders/WO-2026-09-16-seen-job-dedup/database-contract.sql` — repository-side database contract;
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

Still required before issue completion:

- execute repository build and focused test commands against the branch;
- inspect the final diff and generated asset parity;
- open the review PR and verify CI/deployment checks;
- record final repository validation evidence.

Merge and issue closure remain governed by the pinned GitHub Tool contract and are not implied by this Work Order.

## Posting-date follow-up

The requester separately asked to backfill missing Applications posting dates from the stored posting links. This is private data maintenance, not part of the seen-job schema.

Rules:

- use an exact employer/ATS-published date only when the posting or its structured data exposes one;
- do not derive a date from the Applications found date, crawl time, search-result age, or a vague “30+ days ago” label;
- leave `posted_at` blank where no exact date is available.

## Next action

Run branch validation, finish the source-backed posting-date backfill, then open the issue #96 PR with the live Supabase proof summarized.
