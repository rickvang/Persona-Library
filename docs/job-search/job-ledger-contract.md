# Seen-job deduplication contract

Reusable contract for avoiding duplicate job results across repeated job-search checks. It answers one question only: **has this opening already been presented to this authenticated user?**

The file name is retained for compatibility with existing references. This contract does **not** define a full job-opportunity ledger or application tracker.

Application lifecycle tracking is defined separately in [`application-tracker-contract.md`](application-tracker-contract.md). The two stores may reference the same posting identity, but neither contract silently absorbs the other.

## Ownership boundary

```text
Creative Job Search / job-discovery capability
→ finds current openings
→ derives the strongest stable identity for each result
→ reads the authenticated private seen-job store before presentation
→ suppresses identities already shown from default “what’s new?” output
→ presents genuinely new results
→ records only the results actually presented, after they are shown

Applications tracker
→ stores only opportunities intentionally selected for lifecycle tracking
→ remains canonical for Found → Reviewing → Packet Ready → Applied → Interviewing → Offer / Closed

Persona-Library
→ owns this reusable behavior, identity precedence, client/storage integration contract,
  and the private database schema/migration required for the feature
→ does not own or commit user-specific seen-job rows

persona-workspace-data Supabase private state
→ owns the actual per-user seen-job rows in app.seen_jobs
→ uses the existing authenticated app schema and Data API boundary
```

JobAgent remains reference evidence only. Do not integrate JobAgent, import its broader model, or recreate its lifecycle.

## Required behavior

```text
search
→ normalize each returned job enough to derive identity
→ query app.seen_jobs for the authenticated user
→ already presented?
   ├─ yes → suppress from default new-results output
   └─ no  → present
             ↓
           after presentation succeeds
             ↓
           insert identity into app.seen_jobs
```

Reading happens **before** presentation. Recording happens **after** presentation. A discovered job that was never shown must not be marked seen merely because it appeared in an intermediate search result.

## Stable identity order

Use the strongest available identity first:

1. provider/source + stable provider job ID;
2. normalized canonical posting URL;
3. conservative normalized `company + title + location` fingerprint.

Tracking-only URL parameters must not make the same posting appear new. The fallback fingerprint should require enough information to avoid collapsing distinct openings; if company, title, and location are not all available and there is no stronger identity, treat identity as unresolved instead of guessing.

## Authenticated private record

The private seen-job set is persisted in the dedicated `app.seen_jobs` store in the existing `persona-workspace-data` Supabase project.

| Field | Purpose |
| --- | --- |
| `user_id` | Authenticated owner; RLS binds access to `auth.uid()` |
| `stable_key` | Identity used for repeated-result suppression |
| `provider_job_id` | Stable provider/source job identifier when available |
| `source_url` | Presented posting URL when available |
| `normalized_source_url` | Canonical URL used for URL identity |
| `company` | Human-readable employer |
| `title` | Human-readable job title |
| `location` | Location used by the conservative fallback when available |
| `first_shown_at` | Time the opening was first actually presented |

The table intentionally has no application status, rejection state, recruiter fields, campaign fields, observation history, or `last_seen`.

## Security boundary

The seen-job table follows the same private-data principles as Applications while remaining a separate table and workflow:

- `app` is the existing explicitly exposed Data API schema;
- `authenticated` receives only the table privileges required for deduplication;
- anonymous access is revoked;
- RLS limits reads and inserts to `(select auth.uid()) = user_id`;
- browser/runtime code uses only the publishable project key plus the authenticated user session;
- secret/service-role credentials are prohibited from client code;
- real seen-job rows never appear in Persona-Library source, fixtures, generated output, Work Orders, or test evidence.

## Client/storage integration

`client/seen-job-store.js` provides the reusable integration boundary.

- `deriveIdentity(job)` applies provider ID → canonical URL → conservative fingerprint precedence.
- `canonicalizeSourceUrl(url)` removes fragments and tracking-only parameters while preserving identity-bearing URL data.
- `filterUnseen(results)` reads the authenticated `app.seen_jobs` table before results are presented.
- `recordPresented(shownResults)` inserts identities only after those results were actually shown.
- Duplicate inserts are ignored so `first_shown_at` is not rewritten on later equivalent runs.
- There is no local-storage fallback for seen-job suppression; configured repeated-run memory is the authenticated private Supabase store.

## Applications relationship

A seen job is not automatically a tracked opportunity.

```text
seen job
→ optionally selected for tracking
→ create/update Applications opportunity
→ lifecycle begins at Found
```

The same posting may therefore exist in both stores for different reasons. Seen-job state answers whether it has been presented; Applications state answers what is happening with an intentionally tracked opportunity.

## Explicit non-goals

This contract does not require:

- application lifecycle fields in `seen_jobs`;
- rejected / applied / expired state;
- `last_seen` observation history;
- repost/material-change state machines;
- campaign analytics or campaign-health persistence;
- recruiter CRM data;
- a new Supabase project;
- a scheduler, queue, daemon, or sync service;
- autonomous job discovery or application submission;
- JobAgent integration;
- `rickvang/ai-job-search` as an implementation target.

## Validation

Use synthetic/test rows and an authorized private runtime. Do not commit live private history.

1. A first search returns a synthetic matching job as unseen.
2. The runtime presents it, then records it.
3. A later equivalent search suppresses it.
4. Tracking-only URL differences resolve to the same identity.
5. Stable provider job IDs take precedence when available.
6. Conservative fallback identity does not collapse clearly distinct locations/roles.
7. Genuinely new jobs still pass through.
8. The same posting can independently be added to Applications as `Found`.
9. Anonymous and different-user contexts cannot read or mutate the row.

## Completion boundary

Issue #96 is complete only when the repository contract and client adapter, the live private `app.seen_jobs` schema, repeated-run proof, and owner-isolation/security validation all agree. Applications remains a separate lifecycle store and no real seen-job history is committed to Git.
