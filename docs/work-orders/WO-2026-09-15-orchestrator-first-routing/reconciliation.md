# Change-impact reconciliation — issue #111

- Status: partial — source correction and validation complete; canonical Decision-source gap remains.
- Change observed: Riley default-routing semantics, Docs job-search route/guidance, Riley workflow wording, append-only maintenance revision, behavior-level validators, and generated data output.
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
| Decision history | Decision → current rationale | Contradicts / blocked | DEC-011 and DEC-012 exist only in `dist/decisions.html`; no authored Decision source or page generator exists, while repository guidance forbids hand-editing `dist/`. Append DEC-013 only after the canonical source is supplied or authorized. |
| Active Work Orders | Work Order → current execution state | Unrelated | Bounded search found only historical/reference mentions and this new active package; no existing active package requires wording edits. |

## Required updates and unchanged items

Required source updates were applied to the Docs guidance, Docs route, Riley workflow/model maintenance, focused validator, and focused tests. Generated data was rebuilt. The Riley Persona record, Playbook catalog, Playbooks route, site bootstrap, job-ledger contract, specialist records, and archived Work Orders were checked and left unchanged where their current contracts already held.

The required new Decision is not yet applied because its canonical authored owner is absent. Creating a parallel `docs/decisions/` source or hand-editing `dist/decisions.html` would introduce or violate a repository boundary rather than reconcile it.

## Validation evidence

- `node scripts/build-library.mjs` — pass.
- `node scripts/validate-content.mjs` — pass; 20 personas, 2 operators, 2 leaders, 16 specialists, 20 workflow maps.
- `node --test scripts/validation/validation.test.mjs` — pass; 7 tests.
- `node eval/isolated-persona-skill.mjs validate` — pass; 97 cases, 14 Personas, 75 Skills.
- Changed-module and all modular data `node --check` — pass.
- Authored/generated route/model parity — pass.
- `git diff --check` — pass.

## Blocker and next action

The smallest remaining action is for the repository owner to identify or authorize the canonical authored Decision source (and, if needed, the supported page-generation path), then append DEC-013 preserving DEC-011 history. After that, rerun the generated Decision check and complete this Work Order. No merge or generated-page hand edit is authorized by this packet.
