# Job application tracker contract

## Purpose

Define the standalone-friendly application-tracking surface that can live inside Persona Library without making Persona Library the source of private candidate history.

This contract is separate from the lightweight seen-job deduplication contract in `job-ledger-contract.md`. Seen-job deduplication answers “have I already been shown this opening?” The application tracker answers “what is the current state of an opportunity I chose to track?”

## Ownership boundary

```text
Persona-Library
→ owns the tracker UI, portable record schema, lifecycle vocabulary, and migration/export behavior
→ may link to job-search Playbook guidance
→ does not own or commit the user’s actual application history

Browser-local private state
→ owns real opportunity/application records for the MVP
→ stays on the user’s device
→ can be exported/imported as versioned JSON

Evidence-led Job Search Playbook / Priya Desai
→ may use or update application state during an authorized job-search run
→ does not become the storage layer

Future standalone application
→ may adopt the same record schema
→ may replace localStorage with authenticated/private persistence without changing Persona/Skill identities
```

## Record schema

Each record uses a tracker-generated stable `id` and may contain:

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
| `updatedAt` | Local state freshness marker |

## Lifecycle

`Found → Reviewing → Packet Ready → Applied → Interviewing → Offer / Closed`

The tracker does not infer transitions. External submission, outreach, or interview actions remain separately authorized actions.

## Persistence and privacy

MVP persistence uses browser `localStorage` key `persona-library.job-applications.v1`.

- No real application records are committed to Persona Library.
- No analytics or remote sync are implied.
- Export/import uses versioned JSON for backups and migration.
- Publishing Persona Library source must not publish local tracker contents.
- Clearing browser data can remove the local tracker; export is the recovery path.

## Import behavior

The normal import path is a non-destructive merge/upsert into the current browser-local records.

- Read the current `persona-library.job-applications.v1` records before applying incoming JSON.
- Match by stable `id` first, then by canonicalized `sourceUrl` when IDs differ.
- Do not use company/title similarity as an automatic overwrite identity.
- Add records with no stable identity match.
- Preserve existing non-empty lifecycle fields and user-owned `notes` and `nextAction`.
- Advance lifecycle state only when the incoming state is further along; never downgrade an existing `Applied`, `Interviewing`, or `Offer` record to an earlier state.
- Fill empty metadata such as `packetUrl`, `location`, and `compensation`; an incoming posting URL may correct a matched record.
- Surface ambiguous or conflicting identities in the import review before committing safe changes.
- Show counts for new, updated, unchanged, and conflicting records before the merge is committed.
- Keep an explicit `Replace all` action for restoring a backup; it is never the default.
- Malformed, unsupported, or invalid imports fail without changing local state.
- Export format remains `format: "persona-library-job-applications"` with `version: 1`.

## Extraction boundary

The tracker must remain extractable:

- no Persona or Skill ID is required as a primary record key;
- no tracker record is a canonical Persona-Library record;
- links to job-search guidance are integrations, not storage dependencies;
- UI/runtime code remains isolated from library data normalization;
- persistence is behind a small storage boundary so a later app can replace localStorage.

## Non-goals

- autonomous application submission;
- scraping or background job discovery;
- email/calendar synchronization;
- recruiter CRM functionality;
- multi-user collaboration;
- server-backed accounts in the MVP;
- replacing the Evidence-led Job Search Playbook or the seen-job deduplication contract.
