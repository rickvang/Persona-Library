# Decision history fidelity Work Order

## Header

- Work Order ID: `WO-2026-09-16-decision-history-fidelity`
- Issue: #117
- Status: ready-for-review
- Created: 2026-09-16
- Last updated: 2026-09-16
- Requester: repository owner
- Current owner: implementation agent
- Request mode: update
- Authorized repository: `rickvang/Persona-Library`
- Branch: `fix/issue-117-decision-history-fidelity`
- Base: `main @ 86721fced192d5b27c8a2e86f39d7c09ef7b4243`

## Outcome

Make the canonical Decision migration lossless for pre-#112 Decision history while preserving the current authored → generated Decisions architecture and the Riley/Priya routing/operator decisions that landed afterward.

## Scope

- Use pre-#112 `dist/decisions.html` at `8f77c24ec63f063a801943fc6d5d4f3009b666c7` as the historical wording reference.
- Preserve legacy title/summary/line text and meaningful labels such as `Why parked` and `Notes` without discarding current structured metadata.
- Preserve DEC-010 corrections.
- Preserve DEC-011 historical wording; keep DEC-013 and DEC-014 as later qualifying decisions.
- Rebuild generated Decisions output from authored source.
- Add focused regression validation for the restored historical content.

## Non-goals

- No routing changes.
- No Riley/Priya/Playbook ownership changes.
- No rewrite of DEC-013 or DEC-014.
- No hand-editing generated `dist/decisions.html`.
- No new Decision identity.

## Mara placement / boundary review

- Existing canonical owner: `docs/decisions/records.json`.
- Historical preservation metadata belongs on the existing Decision records rather than in a second Decision source.
- Rendering support belongs in `scripts/build-decisions.mjs`, the existing deterministic Decisions renderer.
- Focused regression checks belong in the existing validation layer.
- This Work Order belongs in the active `docs/work-orders/<id>/` namespace until terminal.
- No new library concept, space, or parallel source of truth is justified.

## Evidence

- Current authored source: `docs/decisions/records.json`.
- Current renderer: `scripts/build-decisions.mjs`.
- Historical reference: pre-#112 `dist/decisions.html` at `8f77c24ec63f063a801943fc6d5d4f3009b666c7`.
- Issue #117 defines the fidelity boundary.

## Success criteria

- Pre-#112 Decision text is preserved verbatim or losslessly in canonical authored source.
- Legacy parked labels/notes render correctly.
- DEC-008, DEC-009, and DEC-012 regain the content lost during normalization.
- DEC-010 corrections remain intact.
- DEC-011 remains historical; DEC-013/014 remain additive qualifiers.
- Build/content/focused validation and diff checks pass.

## Current phase

Ready for review.

## Validation

Passed on GitHub Actions:

- `node scripts/build-library.mjs`
- `node scripts/validate-content.mjs`
- `node --test scripts/validation/validation.test.mjs`
- `node eval/isolated-persona-skill.mjs validate`
- `node --check scripts/build-decisions.mjs`
- `git diff --check`
- focused generated-output checks for parked labels, DEC-008/009/012 restored wording, DEC-011 historical wording, and DEC-013/014 preservation

## Reconciliation

Required: canonical Decision source, Decisions renderer, generated Decisions output, and this Work Order. Unchanged: Riley/Priya routing, Playbook/operator semantics, Persona/Skill records, job-search contracts, and later Decision conclusions.

## Next action

Open one focused PR for independent review. Merge remains separately authorized.
