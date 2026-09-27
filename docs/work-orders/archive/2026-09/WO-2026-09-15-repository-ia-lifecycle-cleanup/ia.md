# Issue #103 move matrix

See [the Work Order](work-order.md) for scope and current state.

## Classification

- Canonical authored source: content/; unchanged.
- Current callable packages: .agents/skills/; unchanged and flat.
- Current reusable guidance: moved into docs/job-search/, docs/playbooks/, and docs/ux/.
- Historical/internal evidence: moved into docs/internal/skill-rebuild/.
- Active work: four ready-for-review Work Orders plus one blocked reopened Work Order remain directly under docs/work-orders/.
- Historical work: 29 terminal Work Order packages moved under docs/work-orders/archive/2026-09/.
- Evaluation evidence: eval/; unchanged.
- Generated output: dist/; unchanged except generated orientation copies refreshed from source.
- Scratch/transient work: not committed.

## Path-risk checks

- Current Markdown links and operational references were resolved against the post-move tree and remapped when their current target moved.
- Archived Work Order package contents preserve their original execution-era bytes, including historical commands and displayed paths; archival changes location, not historical facts.
- The reopened bounded-parallel live-proof Work Order is restored to the active namespace because #96 and #97 are open and its prior terminal classification is no longer truthful.
- Current orientation route package paths and validator reads were updated to the new authored locations.
- The generated orientation route copies are derived from their updated content/orientation sources.
- No nested Skill package namespace, canonical catalog, runtime, schema, hosting target, or product feature was changed.

## Separate library-data.js follow-up

content/library-data.js remains a large authored aggregation entrypoint. This PR does not split it because the issue explicitly requires a separate behavior-preserving workstream with export, ordering, helper-coupling, validator-import, and generated-parity evidence. The next action is a focused follow-up issue/PR after this IA/lifecycle cleanup is independently reviewed.
