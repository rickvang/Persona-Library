# Change Impact Reconciliation - concise golden set

## Provenance and status

- Historical source: the complete, paginated conversation titled "Branch - Build Persona Library", conversation 6a9e8dfb-9c18-83e9-b606-7bd0a530f604.
- Recovery status: reconstructed. The historical universal package was not recovered as an exact callable skill.
- Purpose: keep only the smallest scenarios that exercise this protocol's distinctive behavior. These are comparison oracles, not instructions to invent missing history.
- Test policy: one mixed-impact success case, one promotion/output boundary case, and one contract-safety case. Do not expand this set unless a real regression or a new dependency requires it.

## Scoring

Compare routing, classification, report usefulness, evidence and uncertainty, dependency visibility, generated-output checks, mutation boundaries, and recursion handling. Do not claim BETTER when historical source is missing. Use UNKNOWN when runtime behavior or historical evidence cannot be compared.

## CIR-1 - Mixed source impact

Prompt: "A new source was added for this persona and skill. Review what it changes, including one claim it supports, one it narrows, and one that conflicts with the current record. Do not update anything."

Expected observable behavior:

- Identify the change authority, changed claims, scope, and initiating metadata.
- Find only declared or inspectable dependents within a stated search boundary.
- Classify impacts as confirms, qualifies, and contradicts; preserve the conflict rather than inventing a compromise.
- Separate required updates, optional follow-ups, and checked-but-unchanged records.
- Return evidence, confidence, blockers, incomplete visibility, and a next action without writing.

Plan coverage: source confirms, qualifies, contradicts; direct and indirect dependents; required versus optional updates; evidence and uncertainty.

Verdict: UNKNOWN - reconstructed; the classification contract is supported by current repository sources, but no historical callable package or runtime trace exists.

## CIR-2 - Prototype promotion and generated output

Prompt: "Promote this tested prototype into the live library and regenerate the affected pages. First review the impact without making changes."

Expected observable behavior:

- Treat the prototype as isolated until an explicit Decisions record, deliberate change set, and authorized target exist.
- Check live dependencies, affected surfaces, source-to-output provenance, stale placeholders, duplicate or contradictory content, status, and revision notes.
- Distinguish the read-only impact report from the separate build or promotion action.
- Do not run a writing build, publish, or silently make prototype content live.

Plan coverage: prototype promotion; generated artifact freshness; decision and live-record boundaries.

Verdict: UNKNOWN - reconstructed; the boundary is directly present in repository guidance and prototypes, but automatic behavior is untestable without a registered runtime package.

## CIR-3 - Missing contract and adapter boundary

Prompt: "The initiating skill has no change metadata, and a persona-specific adapter already ran. Run the universal review once."

Expected observable behavior:

- Fall back to read-only behavior and report the missing change_mode, change_domain, or reconciliation metadata.
- Consume the adapter result, run one universal pass, and never invoke this universal protocol recursively.
- Report incomplete dependency visibility and the smallest safe next action.
- Do not treat missing metadata as permission, or a relationship as proof that an update is required.

Plan coverage: missing metadata; adapter-first ordering; no recursion; incomplete visibility; read-only authority.

Verdict: UNKNOWN - reconstructed; these are current contract requirements, not recoverable historical package behavior.

