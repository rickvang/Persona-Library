# Conformance and workflow observability Work Order

## Header

- Work Order ID: `WO-2026-09-08-conformance-observability`
- Title: Implement Issues #37 and #43
- Status: complete (implementation scope)
- Created: 2026-09-08
- Requester: rickvang
- Implementation owner: Codex
- Request mode: update and artifact-generation
- Change mode: record update plus artifact generation and generated-site update
- Change domain: conformance evaluation, canonical Persona and workflow records, Docs, and generated Site data
- Artifact home: `docs/work-orders/WO-2026-09-08-conformance-observability/`
- Authorized repository target: `C:\_Projects\Persona-Library`
- Related issues: [#37](https://github.com/rickvang/Persona-Library/issues/37), [#43](https://github.com/rickvang/Persona-Library/issues/43)
- Problem context: [`docs/collaboration/problem-context-conformance-observability.json`](../../collaboration/problem-context-conformance-observability.json)
- Stopping condition: the file-based conformance contract, observer Persona, observation path, validation report, limitations, and follow-up work are linked and reviewable.

## Request and scope

Implement a small, dependency-light conformance suite that can evaluate normalized results from different LLM or assistant surfaces. Add the conformance and workflow-observability specialist as a working-draft Persona, reuse existing Skills where appropriate, and give future runs a Work Order observation record.

The first implementation is file-based. It defines comparable inputs and checks, but it does not claim that live runs against two external providers were executed in this repository session.

## Placement and identity decisions

Mara’s placement gate was applied before mutation:

- `content/library-data.js` remains the canonical source for the Persona, its Skill applications, and its workflow map.
- `eval/` is the smallest repository-local home for conformance fixtures, evaluator code, adapter contracts, and sanitized examples.
- Active run evidence belongs in the existing Work Order package, beginning with `observations.md`.
- No new top-level Persona Library space, Tool record, Playbook, database, or runtime service is created.

Issue #37 names Noor Vale as a Context Access Observer. The catalog also contains Riley Morgan’s adjacent orchestration responsibilities. The role boundary is now explicit: Noor owns conformance observation and classification; Riley coordinates the evaluation, prepares comparable conditions, and invokes Noor for every evaluated run. The portable `Evaluation and observability` Skill remains a shared catalog identity, with Noor as the conformance-specific application and Riley’s role narrowed to orchestration coordination.

## Artifacts

- [`problem-context-conformance-observability.json`](../../collaboration/problem-context-conformance-observability.json) — named multi-Persona problem context and attributable handoffs.
- [`observations.md`](observations.md) — this implementation’s observation log and reusable entry shape.
- [`eval/cases.json`](../../../eval/cases.json) — ten concise routing and safety fixtures.
- [`eval/contract.mjs`](../../../eval/contract.mjs) — case and normalized-result validation plus verdict checks.
- [`eval/run.mjs`](../../../eval/run.mjs) — local validation, single-result evaluation, and result-directory scan commands.
- [`eval/adapters/recorded-result.mjs`](../../../eval/adapters/recorded-result.mjs) — sanitized recorded-result adapter.
- [`eval/observation-template.md`](../../../eval/observation-template.md) — compact observation template for future Work Orders.
- `content/library-data.js` — Noor Persona, Skill applications, and workflows.
- `content/library-model.js` — Persona maintenance and reconciliation metadata generated from the canonical source.
- `content/site-orientation.json` — conformance route and artifact availability guidance.
- Generated `dist/data/*` — rebuilt copies only.

## Implementation progress

- [x] Read orientation, architecture, Work Order, and collaboration guidance.
- [x] Apply Mara placement review and initialize the problem context.
- [x] Define ten concise conformance fixtures and the normalized result contract.
- [x] Add recorded-result adapter and local evaluator commands.
- [x] Add Noor working-draft Persona and workflow map with reused Skills.
- [x] Add observation template and Work Order handoff path.
- [x] Reconcile the Riley/Noor boundary and declare the required Riley-to-Noor handoff for every evaluated run.
- [x] Rebuild generated Site data; source and generated orientation files are equal.
- [x] Repository validator passes; the governance package declares the required `skill_layer` metadata.
- [x] Run concise conformance checks and record findings, including a negative unsupported-claim check.
- [x] Run Persona-specific and universal change-impact reconciliation as a bounded, read-only review.
- [x] Record three authorized LLM-surface run bundles, normalize them through the local evaluator, and update Issues #37 and #43.

## Evidence and uncertainty

| Item | Status | Boundary |
| --- | --- | --- |
| Issue requirements | `sourced` | Defines intended suite and observer behavior, not runtime results. |
| Persona and workflow | `synthetic_assumption` | Working model for a specialist; not a claim about an observed individual. |
| Fixture and evaluator behavior | `repository_observed` after validation | Structural and policy checks are tested locally; they do not measure model quality by themselves. |
| Live cross-LLM comparison | `recorded; parity unknown` | Cursor Grok 4.6, Claude Cowork, and ChatGPT Codex Luna extra-high supplied sanitized ten-fixture packets. Conditions and access differed, so the records establish exercise across surfaces but do not prove behavioral parity. |
| Tool and permission findings | `unknown` until a recorded result supplies conditions | Missing access must remain an access gap. |
| Repository validator | `passed` | `node scripts/validate-content.mjs` passes on the current source and generated data. |

## Change-impact reconciliation plan

The implementation changes a canonical Persona, flow map, skill applications, orientation route, generated data, and evaluation artifacts. After editing, the read-only reconciliation pass will review:

- Persona index/detail and workflow counts;
- normalized Skill catalog and Riley’s shared capabilities;
- orientation route and generated guide/data consumers;
- Work Order and problem-context links;
- evaluation fixtures and future adapter handoffs;
- unchanged Tools, Playbooks, runtime integrations, and private data boundaries.

The Persona-specific adapter runs before the universal reconciliation pass. The reconciliation report will record required, optional, unchanged, contradictory, and unknown effects without silently expanding the implementation.

## Reconciliation report

### Persona-specific adapter

- Status: `complete for repository scope` because the canonical source and declared relationships are reconciled; live provider behavior and independent Noor enforcement remain explicitly unknown.
- Change observed: a working-draft `conformance-observer` / Noor Vale record, seven Persona-specific applications of existing Skills, six Noor workflows, and a required Riley-to-Noor per-run handoff were added from Issues #37 and #43.
- Classification: `extends` the catalog with a bounded observer role; `qualifies` Riley’s evaluation responsibility as orchestration coordination; `reuses` the portable Skill without assigning conformance ownership to Riley; `qualifies` runtime enforcement as untested; no existing Persona was replaced.
- Checked: Persona index/detail, Skill links and applications, workflow maps, resources, confidence, needs, implications, normalized maintenance records, Tool requirements, Playbook records, and generated data.
- Required follow-up moved to [Issue #51](https://github.com/rickvang/Persona-Library/issues/51): exercise the declared Riley-to-Noor handoff in an independent runtime before making cross-LLM claims.
- Unchanged: canonical Tool records, Playbooks, private data, credentials, runtime integrations, and existing Persona source claims outside the new record.

### Universal change-impact pass

- Status: `complete for repository scope` with no unsafe mutation detected.
- Checked: orientation route, `eval/` artifacts, Work Order and problem-context links, source/generated Persona data, validation commands, and the repository mutation boundary.
- Required follow-up moved to [Issue #51](https://github.com/rickvang/Persona-Library/issues/51): improve independent runtime and trace coverage.
- Unknown: provider adapter availability, runtime trace retention, whether every runtime enforces the declared handoff, and behavioral parity under materially equivalent conditions.
- Handoff count: one Persona-specific review followed by one universal pass; no recursive handoff.

## Completion gate

The repository implementation is complete: the validator passes, the evaluator validates the fixture set and normalized recorded-result bundles, the Persona and workflows appear in generated data, and this Work Order records the three surface runs and their limitations. Independent handoff enforcement and controlled parity remain in [Issue #51](https://github.com/rickvang/Persona-Library/issues/51).

## Follow-up work

- [Issue #51](https://github.com/rickvang/Persona-Library/issues/51) — independently validate the Riley-to-Noor handoff, cold-start fairness, trace access, and provider metadata.
- Provider-specific adapters remain optional until their runtime, permissions, and retention boundaries are explicit.
- Promote recurring, independently reusable observation logic to a Skill only after repeated use demonstrates that boundary.
