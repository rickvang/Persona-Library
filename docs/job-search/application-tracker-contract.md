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

## Application-packet handoff

Application-packet work can update the browser-local tracker through a transient, versioned handoff link rather than a server-backed API.

The handoff payload shape is:

```json
{
  "format": "persona-library-job-application-handoff",
  "version": 1,
  "operation": "upsert",
  "record": {
    "company": "Example",
    "role": "Staff Product Designer",
    "status": "Packet Ready",
    "sourceUrl": "https://example.com/job/123",
    "packetUrl": "https://drive.google.com/...",
    "foundDate": "2026-09-18",
    "nextAction": "Review packet and confirm application answers."
  }
}
```

Encode the UTF-8 JSON as base64url and append it to the deployed Applications route as `#handoff=<payload>`. URL fragments are processed client-side and are not sent to the web server.

When the Applications page opens a handoff:

1. require the exact handoff format, supported version, and `upsert` operation;
2. sanitize allowed fields and restrict posting/packet links to HTTP(S);
3. identify the existing record by canonical posting URL when available, otherwise by normalized company + role + location;
4. ask the user to confirm the add/update;
5. merge only fields present in the handoff so existing notes or metadata are not erased accidentally;
6. save the resulting record to the browser-local store;
7. remove the fragment from the address after success, decline, or error.

A handoff link is a **private transient artifact, not encryption**. Base64url makes the payload URL-safe but does not hide its contents from anyone who receives the link. Do not put secrets, credentials, demographic answers, or unsupported private candidate evidence into the payload.

### Workflow state mapping

- role discovered → `Found`;
- active evaluation / packet work → `Reviewing`;
- packet created and reviewable → `Packet Ready` with `packetUrl`;
- explicitly submitted application → `Applied` with `appliedDate`;
- interview activity → `Interviewing`;
- offer → `Offer`;
- rejected, withdrawn, expired, or intentionally stopped → `Closed`.

Creating or opening a tracker handoff never authorizes application submission, outreach, interview scheduling, or another external action. The handoff records an event that has already been authorized or completed.

## Persistence and privacy

MVP persistence uses browser `localStorage` key `persona-library.job-applications.v1`.

- No real application records are committed to Persona Library.
- No analytics or remote sync are implied.
- Export/import uses versioned JSON for backups and migration.
- Publishing Persona Library source must not publish local tracker contents.
- Clearing browser data can remove the local tracker; export is the recovery path.

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
