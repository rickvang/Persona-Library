# Seen-job deduplication contract

Reusable contract for avoiding duplicate job results across repeated job-search checks. This is intentionally small: it remembers which openings have already been presented so a later “what’s new?” search can suppress the same jobs by default.

The file name is retained for compatibility with existing references. This contract does **not** define a full job-opportunity ledger or application tracker.

## Ownership boundary

```text
Creative Job Search / job-discovery capability
→ finds current openings
→ derives a stable identity for each result
→ checks the private seen-job set
→ presents only results not already shown by default
→ records newly presented results after they are shown

Elena Marin / career search strategist
→ owns search strategy, targeting, fit judgment, and opportunity evaluation when those judgments are requested

Priya Desai · Job search orchestrator
→ may use search results inside a full-outcome Playbook run
→ does not own the seen-job store

Persona-Library
→ owns this reusable behavior contract only
→ does not store the user’s seen-job history
```

The actual seen-job set belongs to the consuming private Skill/runtime state.

## Required behavior

```text
search
→ normalize each returned job enough to derive identity
→ check private seen-job set
→ already presented?
   ├─ yes → suppress from default new-results output
   └─ no  → present → add identity to seen-job set
```

The goal is simple: repeated searches should surface genuinely new openings instead of repeatedly showing the same ones.

## Identity order

Use the strongest available identity first:

1. provider/source + stable provider job ID;
2. normalized canonical posting URL;
3. conservative normalized `company + title + location` fingerprint.

Tracking-only URL parameters should not make the same posting look new. The fallback fingerprint should be conservative so distinct roles are not collapsed merely because they are similar.

## Minimum private record

Keep the stored state as small as practical. A record may contain only:

| Field | Purpose |
| --- | --- |
| `key` | Stable identity used for deduplication |
| `company` | Human-readable reference |
| `title` | Human-readable reference |
| `first_shown` | When the job was first presented |

A simple private structured file, Skill state, or equivalent lightweight store is sufficient. Do not add a database service merely for this behavior.

## Explicit non-goals

This contract does not require:

- application lifecycle tracking;
- rejected / applied / expired status management;
- `last_seen` observation history;
- repost/material-change state machines;
- campaign analytics or campaign-health persistence;
- application references;
- a remote database, scheduler, queue, daemon, or sync service;
- importing or integrating JobAgent;
- storing private job-search history inside Persona-Library.

JobAgent remains reference evidence only. The retained concept here is repeated-result deduplication, not JobAgent’s broader state model.

## Validation questions

- Does the first search present a matching job?
- Does a later equivalent search suppress that same job by default?
- Do tracking-only URL differences avoid creating duplicates?
- Are stable provider job IDs preferred when available?
- Does the fallback fingerprint avoid obvious duplicates without collapsing clearly different roles?
- Do genuinely new jobs continue to appear normally?
- Is the implementation still a small private seen-results mechanism rather than a general job-tracking system?

## Runtime proof status

Persona-Library defines the contract only. The consuming Skill/runtime must provide the small persistent seen-job set if repeated-run memory is required. If that runtime cannot persist state across runs, record the limitation instead of adding unrelated infrastructure.
