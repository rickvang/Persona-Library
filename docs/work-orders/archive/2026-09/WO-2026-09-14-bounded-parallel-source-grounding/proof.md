# External-repository source-grounding proof

This is a live source-grounding demonstration in a repository other than Persona-Library. It is not a claim that a full bounded-parallel run was executed, and it does not mutate the target repository.

Playbook selection happened in Persona-Library because that is the catalog host for this authorized #86 update. After the Playbook was selected, implementation truth for the candidate workstream was established only from `template-library` files and that repository’s GitHub issue. Persona-Library records were **not** loaded to decide what should be built there.

## Candidate workstream

```text
repository: rickvang/template-library
base branch / revision: main @ a275a487e5ee5aea40821a484b02504c83ac11d5
issue / requested outcome: template-library #1 first PR as written
```

Requested framing, taken from the still-open plan issue: replace an empty repository (audit dated 2026-09-11: only a root README) by creating root instructions, a validator, tests, and the first complete `templates/design-systems/web-app` Template.

## Inspected target-repository authority

| Surface | Observed in current `template-library` `main` |
| --- | --- |
| Repo-local `AGENTS.md` | Absent |
| Architecture / ownership | [`ARCHITECTURE.md`](https://github.com/rickvang/template-library/blob/main/ARCHITECTURE.md) present; it still says the repo contained only README plus this file when it was added |
| Canonical source | [`README.md`](https://github.com/rickvang/template-library/blob/main/README.md) lists three Templates; [`templates/README.md`](https://github.com/rickvang/template-library/blob/main/templates/README.md) matches |
| Existing Templates | `templates/design-systems/web-app`, `templates/design-systems/resume-document`, `templates/resumes/classic-single-column` |
| Tests / validators | `scripts/` and `tests/` absent; no `package.json` |
| Issue state | [#1](https://github.com/rickvang/template-library/issues/1) still open; body still claims the 2026-09-11 empty-repo audit |

Git history on current `main`: `cc06036` architecture, `c01e9e6` web-app Template, `f8cd3e4` / `0a5c3fc` resume-document Template, `a275a48` classic single-column resume.

## Comparison result

**contradicted** for “implement issue #1’s first PR as written.”

Current source already owns the first Template and two later Templates. The issue’s “current contents: only README.md” claim is false. Dispatching that first-PR packet would recreate or overwrite files the repository already has.

A **qualified** remainder exists only after re-scope, and is not dispatched from this proof:

- possibly add root `AGENTS.md` and `CONTRIBUTING.md`;
- possibly add the planned dependency-free validator and tests;
- do **not** recreate existing Templates;
- do **not** treat the 2026-09-11 audit as current truth;
- do **not** add `templates/design-systems/multi-product` merely because the stale plan listed it later.

That remainder was not authorized by Persona-Library #86 and was not implemented.

## Dispatch packet that must not be sent

The contradicted first-PR packet fails the source-grounding gate. Example of the packet that would have been used only if the work had been re-scoped to remaining contract files:

```text
repository: rickvang/template-library
base revision: a275a487e5ee5aea40821a484b02504c83ac11d5
issue / workstream: template-library #1 remaining repository contract (re-scoped)
source-grounding result: qualified
canonical owner / relevant paths: root AGENTS.md, CONTRIBUTING.md, scripts/validate.mjs, tests/validate.mjs
branch: (not opened)
required validation: whatever local validator/tests the re-scoped work adds; current repo has none
non-goals: recreate existing Templates; mutate Persona-Library catalog from this workstream
stop condition: reviewable PR for remaining contract files, or blocker
```

This packet was **not** dispatched. The contradicted original request stopped.

## Did Persona-Library have to be loaded after Playbook selection?

**No.** Target-repository README, ARCHITECTURE, `templates/` tree, Git history, and GitHub issue #1 were sufficient to classify the requested work. Persona-Library’s Template catalog would have agreed that those Templates exist, but it was not required to establish implementation truth.

## What this proves

| Required behavior | Result |
| --- | --- |
| Fresh agent can start in a target repository | Inspected `template-library` locally and on GitHub without using Persona-Library records as authority |
| Source-ground before dispatch | Grounding record completed before any implementer packet |
| confirmed / qualified / contradicted | Original first-PR request is contradicted; remaining contract files would be qualified only after re-scope |
| Contradicted work stops | No `template-library` branch, PR, or file write |
| One canonical Playbook | Used `playbook-bounded-parallel-implementation`; no second identity |

## Limits

This is a source-grounding and stop/re-scope proof, not a live two-lane parallel implementation. Compact handoff, independent review, correction loop, and merge remain covered by the Playbook contract and the earlier `tool-repo` #3/#4 retrospective, not by this case.
