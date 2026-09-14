# Job opportunity ledger contract

Reusable contract for durable job-search opportunity state. Use with the **Evidence-led Job Search Playbook**. This is a schema and behavior contract, not a Persona-Library data store.

## Ownership boundary

```text
Evidence-led Job Search Playbook
→ treats the ledger as shared durable search state

Elena Marin / career search strategist (and the search capability)
→ discovers and evaluates opportunities; decides disposition

Job-search Skill / search capability
→ normalizes, deduplicates, reads/writes the ledger

Riley Morgan · AI orchestrator
→ coordinates contributors
→ does not own the ledger or job-search domain data
```

Private job-search history belongs in the candidate’s private workspace or runtime state. Persona-Library must not become the storage location for real opportunity history. Store only the contract, relationships, and Work Order pointers here.

## Required behavior

```text
search
→ normalize discovered job
→ check durable job ledger
→ already seen?
   ├─ yes → update last_seen / status; normally do not resurface as new
   └─ no  → add to ledger → evaluate → present
```

Do not treat a repost or materially changed posting as an ordinary duplicate. Update `last_seen` and surface it as changed/reposted when useful.

## Status vocabulary

Distinguish at least:

```text
discovered
reviewed
shortlisted
rejected
applied
expired
reposted / refreshed
```

Rejected, applied, and expired jobs remain queryable. They must not silently reappear as new discoveries.

## Minimum record shape

Start small. A private structured file or SQLite store is sufficient for v1. Do not introduce a database service unless evidence requires one.

| Field | Purpose |
| --- | --- |
| `job_id` | Stable local identity |
| `source` | Provider or channel name |
| `source_job_id` | Provider’s stable job ID when available |
| `canonical_url` | Normalized posting URL |
| `company` | Employer name |
| `title` | Role title |
| `location` | Location or work-mode label |
| `first_seen` | First discovery timestamp |
| `last_seen` | Most recent observation |
| `status` | Disposition from the vocabulary above |
| `fit_score` / `fit_notes` | Specialist evaluation notes |
| `rejection_reason` | Why the role was declined, when known |
| `application_reference` | Link to application Work Order or packet when applied |

## Deduplication order

Use the strongest available identity first:

1. provider/source + stable source job ID;
2. normalized canonical URL;
3. fallback fingerprint such as normalized `company + title + location`.

Recognize the same role when it appears repeatedly or across providers without treating every result as new.

## Playbook and specialist use

- Full-outcome search runs load the ledger as Playbook shared state.
- Elena (or the active search specialist) owns discovery, fit judgment, and status disposition.
- Application packets may link an `application_reference`; they do not replace the ledger.
- Riley may ask whether the ledger was checked; Riley does not write opportunity records as domain owner.

## Non-goals

- No Persona-Library-hosted private candidate job history.
- No mass scraping or autonomous apply loop implied by this contract.
- No new generic Job Search Persona.
- No Riley identity drift into job-search domain ownership.

## Validation questions

- Do repeated searches avoid presenting previously seen jobs as new by default?
- Can previously seen jobs update `last_seen` without creating duplicates?
- Can reposted or materially changed jobs be surfaced deliberately?
- Do rejected, applied, and expired jobs remain queryable?
- Does deduplication prefer source IDs, then URLs, then a conservative fingerprint?
- Is the ledger durable across runs in private workspace state?
- Does Riley remain orchestration-only for this state?
