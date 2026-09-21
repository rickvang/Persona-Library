# Change-impact reconciliation — issue #165

- Status: partial — consumer changes are staged; final upstream revision and repository CI remain pending.
- Change observed: Persona-Library now defers reusable GitHub mutation, merge-authorization, and linked-issue completion semantics to the pinned `rickvang/tool-repo` GitHub Tool package.
- Initiating contract: docs/playbooks update + Work Order lifecycle guidance; reconciliation required by the selected routes and repository contract.
- Authority: issue #165, current Persona-Library `main`, root `AGENTS.md`, `content/site-orientation.json`, Docs/Playbooks routes, and `change-impact-reconciliation`.

## Scope checked

- root `AGENTS.md`;
- `docs/work-orders.md` and the active Work Order;
- `docs/playbooks/bounded-parallel-implementation.md`;
- `content/orientation/playbooks.json` and generated `dist/data/orientation/playbooks.json`;
- focused generated-output validation and regression tests;
- current Bounded Parallel Decision/route ownership;
- archived Work Orders as historical evidence boundary only;
- upstream `rickvang/tool-repo` issue #9 / PR #10.

## Impacts

| Dependent | Relationship | Class | Evidence | Action |
| --- | --- | --- | --- | --- |
| Root `AGENTS.md` | activates reusable GitHub Tool contract | qualifies | duplicate mutation list removed; exact Tool pin and linked-completion pointer retained | Finalize the pin to the exact landed tool-repo revision after PR #10 merges |
| Bounded Parallel Playbook | owns implementation coordination and Authorizer process | qualifies | explicit merge gate remains; GitHub mutation semantics now point to the pinned Tool contract | Retain process ownership; do not reintroduce linked-issue policy |
| Playbooks orientation route | activates Bounded Parallel procedure | qualifies | merge/close semantics replaced with Tool-contract handoff | Retain; generated mirror must match |
| `docs/work-orders.md` | owns project lifecycle/progress | qualifies | lifecycle and permission boundary unchanged; GitHub-specific semantics now delegated | Retain |
| Focused validation | guards reusable governance boundary | extends | new helper rejects the old pre-split pin and duplicate reusable merge wording | Retain |
| DEC-010 / current Decisions | historical rationale for distinct Playbook identity | confirms | Authorizer/merge-gate rationale remains compatible; it does not define linked-issue close behavior | No change |
| Archived Work Orders | historical evidence | unrelated to reusable policy | historical merge/close records describe past state and authorization | Do not rewrite |

## Generated outputs

`content/orientation/playbooks.json` and `dist/data/orientation/playbooks.json` are byte-identical on the implementation branch after the route change. Full generated-output freshness and repository validation remain pending GitHub CI.

## Required updates

1. Merge or otherwise land tool-repo PR #10 under its own authorization path.
2. Refresh the exact landed tool-repo revision.
3. Replace the provisional Persona-Library pin if the landed revision differs from PR #10 head.
4. Run/verify repository validation and generated-output freshness.
5. Update the Work Order from blocked to review-ready only after the upstream dependency is satisfied.

## Optional follow-ups

- Other consuming repositories may update their GitHub Tool pins in separately scoped changes if they use the older pre-split package revision.
- A future validator may generalize pin provenance across repositories if multiple consumers need the same check; no new registry is justified here.

## Unchanged checked

- no Persona, Skill, Tool, Operating Pack, Template, or Playbook identity changes;
- no GitHub runtime, access, credential, or connector behavior changes;
- no change to independent review or fresh pre-merge state checks;
- no historical Work Order rewrite.

## Blockers and incomplete visibility

The Persona-Library consumer pin is intentionally provisional at tool-repo PR #10 head `2626ef2154595cc7f20a1560bc34e353ebb3c153`. PR #10 is open, not merged, so issue #165 cannot satisfy its final pin acceptance criterion yet.

## Next action

Open the Persona-Library change as a draft dependency PR. After tool-repo PR #10 lands, refresh the upstream revision, finalize the pin, verify CI/reconciliation, and move the consumer PR to review-ready.
