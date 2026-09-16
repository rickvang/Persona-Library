# Change-impact reconciliation — issue #111

- Status: complete for review — Mara placement review, single Decision source-to-generated path, source correction, validation, and reconciliation complete; merge remains separately unauthorized.
- Change observed: Riley canonical record and default-routing semantics, Docs job-search route/guidance, Riley workflow wording, append-only maintenance revision, behavior-level validators, explicit routing-case tests, Decision collection, generated Decisions renderer, and generated data output.
- Authority: issue #111, current `main` at `8f77c24ec63f063a801943fc6d5d4f3009b666c7`, `AGENTS.md`, `content/site-orientation.json`, selected route groups, and post-refactor modular source ownership.
- Authorization: authorized one focused PR against `main`; merge remains separately unauthorized.

## Initiating contracts

- Persona adapter: `persona-reconciliation` — `change_mode: reconciliation_adapter`, `change_domain: personas`, `reconciliation: change-impact-reconciliation`.
- Universal pass: `change-impact-reconciliation` — `change_mode: reconciliation_adapter`, `change_domain: cross-space`, `reconciliation: skip`.
- Both repository-local contracts were read. No recursive handoff was invoked.

## Scope checked

Checked `content/site-orientation.json`; Docs, Playbooks, Personas, and Decisions route groups; Riley’s authored Persona and workflow; the Evidence-led Job Search catalog identity; `content/library-model.js`; `docs/job-search/implementation.md`; the job-ledger contract; focused validators/tests; generated data parity; active Work Orders with Riley/job-search/Playbook references; and the current Decision search boundary. Archived Work Orders were treated as historical and not rewritten.

## Impact classifications

| Dependent | Relationship | Class | Evidence and action |
| --- | --- | --- | --- |
| Riley authored identity and workflow | Persona → workflow/routing | Extends | `roleLabel` remains `AI orchestrator`; the framing workflow now names unqualified requests; no job-search expertise was added. Retain. |
| Riley maintenance history | Persona → semantic revision | Extends | `content/library-model.js` appends version `1.3` and preserves versions `1.1`/`1.2`. Retain. |
| Evidence-led Job Search catalog | Playbook identity | Confirms | `playbook-evidence-led-job-search` remains a working model. No catalog edit required. |
| Job-search specialists | Playbook → bounded domain owners | Confirms | `career-strategist`, `role-calibrator`, `application-editor`, `outreach-interview-coach`, `ui-expert`, and `document-designer` remain present; no generic `job-search` Persona exists. Retain. |
| Docs `resume-application-work` route | Orientation → routing contract | Qualifies | Unqualified requests now begin with Riley; narrow/full-outcome selection and explicit direct invocation are stated. Generated route copy refreshed. |
| Job-search implementation guidance | Docs → current instruction | Qualifies | Playbook remains outcome/procedure owner; Riley is default entry/routing owner; direct named invocation remains valid. Retain. |
| Playbooks route/catalog | Playbook → procedural ownership | Confirms | Existing route and catalog preserve reusable stages, state, handoffs, gates, recovery, and learning; no universal front-door change was required there. |
| Job-ledger contract | Specialist/shared-state boundary | Unrelated | Riley remains outside ledger ownership and Persona-Library storage; no source change. |
| Focused generated validator | Source semantics → regression guard | Extends | Old Playbook-first error framing was removed; checks now cover Riley identity, Playbook identity, six specialists, and all four routing cases. Retain. |
| Generated data | Authored source → `dist/data/**` | Extends | `node scripts/build-library.mjs` refreshed library/model/Docs-route output; parity checks pass. Retain. |
| Decision placement | Mara gate → Decisions layer | Extends | Decisions remain an existing repository layer; the placement review selects one authored collection rather than a new space or a Persona/Skill data module. |
| Decision history | Decision → current rationale | Extends | `docs/decisions/records.json` preserves DEC-011/012 and appends DEC-013. DEC-011's history remains intact while its front-door conclusion is qualified by DEC-013. |
| Generated Decisions page | Authored collection/template → generated Site output | Extends | `scripts/build-decisions.mjs` renders `docs/decisions/records.json` through `content/decisions-page.html` into `dist/decisions.html`; the output contains the preserved historical records and DEC-013. |
| Active Work Orders | Work Order → current execution state | Unrelated | Bounded search found only historical/reference mentions and this new active package; no existing active package requires wording edits. |

## Required updates and unchanged items

Required source updates were applied to the Docs guidance, Docs route, Riley authored record/model maintenance, focused validator, four explicit routing tests, Decision collection, authored Decisions template/renderer, and Work Order. Generated data and the Decisions page were rebuilt. The Playbook catalog, Playbooks route, site bootstrap, job-ledger contract, specialist records, and archived Work Orders were checked and left unchanged where their current contracts already held.

The Decisions route now names `docs/decisions/records.json` as the repository-local authored owner. DEC-011, DEC-012, and DEC-013 are all represented in that source; `scripts/build-decisions.mjs` produces the current `dist/decisions.html` output, so no generated file is an authoring destination.

## Validation evidence

- `node scripts/build-library.mjs` — pass.
- Decision provenance check — pass; 14 authored records render deterministically from `docs/decisions/records.json` through `content/decisions-page.html` to `dist/decisions.html`.
- `node scripts/validate-content.mjs` — pass; 20 personas, 2 operators, 2 leaders, 16 specialists, 20 workflow maps.
- `node --test scripts/validation/validation.test.mjs` — pass; 11 tests, including four explicit routing cases.
- `node eval/isolated-persona-skill.mjs validate` — pass; 97 cases, 14 Personas, 75 Skills.
- Changed-module and all modular data `node --check` — pass.
- Authored/generated route/model parity — pass.
- `git diff --check` — pass.

## Review boundary and next action

The source blocker is resolved by Mara’s selected single Decision collection and deterministic generated-page path. The focused PR is ready for a fresh review of its current head; no merge or generated-page hand edit is authorized by this packet.
