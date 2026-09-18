# Work Order — Persona Tool Integration Review

- **Work Order ID:** WO-2026-09-18-persona-tool-integration
- **Title:** Integrate Tool-use review into Persona creation workflow
- **Status:** ready-for-review
- **Created:** 2026-09-18
- **Last updated:** 2026-09-18
- **Requester:** repository owner
- **Current owner:** ChatGPT / implementation agent
- **Request mode:** update
- **Related issue:** https://github.com/rickvang/Persona-Library/issues/146
- **Authorized repository target:** `rickvang/Persona-Library`
- **Artifact home:** `docs/work-orders/WO-2026-09-18-persona-tool-integration/`

## Objective

Implement issue #146 so Persona creation and recheck explicitly review Tool implications for material workflows and Skills while preserving the existing boundaries among portable Skills, Persona applications, Tool requirements, Tool-use recipes, and runtime Tool resolution.

## Scope

Primary expected source changes:

- `.agents/skills/persona-research/SKILL.md`
- `content/orientation/personas.json`
- `docs/internal/skill-rebuild/tests/persona-research.golden.md`

Inspect but change only if required by demonstrated inconsistency:

- `.agents/skills/persona-skills/SKILL.md`
- `.agents/skills/tool-discovery-and-safe-execution/SKILL.md`
- `.agents/skills/tool-record-maintenance/SKILL.md`
- `content/orientation/tools.json`
- `content/library-data/tool-integration.js`
- `scripts/validation/relationships.mjs`
- `content/library-model.js`
- `ARCHITECTURE.md`

## Non-goals

- No new first-class Tool/Skill concept.
- No Tool schema redesign unless current contracts prove insufficient.
- No automatic Tool record or Tool-use recipe creation.
- No automatic change to a Persona's preferred Tool from one experiment.
- No credential, connector, permission, or workspace configuration.
- No requirement that every Skill have a Tool.
- No fix for the separate `local-video-inspection` routing defect.

## Placement gate

**Outcome:** extend existing records and the existing Work Order convention.

- The implementation belongs in the current Persona research/routing contracts; no new library space is warranted.
- The Work Order belongs in the existing `docs/work-orders/<work-order-id>/` package defined by repository guidance.
- Closest rejected alternatives: a new Tool-integration Skill, a new first-class domain, or embedding vendor behavior into portable Skills. These duplicate existing responsibilities.
- This placement review chooses destinations only; it does not grant mutation authority.

## Evidence and current state

- Issue #146 documents the desired Tool integration classifications and modular Tool-selection behavior.
- Current `persona-research` already models Skill and Tool candidates but does not require a final Tool/recipe integration review.
- Current `persona-skills` already classifies vendor-bound procedures as Tool-use recipes rather than portable Skills.
- Current Tool discovery and Tool record maintenance workflows already separate runtime availability from canonical catalog maintenance.
- Current relationship validation already enforces explicit recipe-to-Skill and Persona-requirement-to-recipe relationships.

## Authorization

The requester explicitly said: **"Okay implement 146"**.

This authorizes implementation of issue #146 within `rickvang/Persona-Library`, including branch/file changes and opening a reviewable pull request. It does not independently authorize merge.

## Success criteria

- Persona create/recheck includes a bounded Tool integration review.
- The review distinguishes existing recipe reuse, recipe candidate, Tool-record candidate, Tool hypothesis, and no-Tool-needed.
- Preferred/default Tool remains separable from bounded alternate-Tool experiments.
- Alternate Tool testing does not mutate the Persona or portable Skill automatically.
- Persona routing can inspect Tools when materially relevant without making Tools primary.
- Golden scenarios encode the expected behavior.
- Build, focused regression, and top-level validation are run and reported accurately.
- Persona-specific reconciliation and one universal reconciliation pass are completed.

## Current phase

**Review — implementation and validation complete**

Gate result: **pass**. Existing architecture is sufficient; no new concept or schema is required. Source changes are limited to the Persona research contract, Persona routing, and Persona-research golden scenarios.

## Validation evidence

- Normal branch build for source commit `4b5bd0bf8d8c71511f65a398defd6f15badc59ad`: Vercel deployment `dpl_fZY5ZBojUswC5D7caxGbCTe18ZKQ` reached **READY** and copied the updated Persona orientation source into generated output.
- Focused regression run on temporary branch-only validation instrumentation: deployment `dpl_8b9kAcPRtfBGym67R6u6A4AuXsnG` reached **READY**.
  - tests: 11
  - pass: 11
  - fail: 0
- Top-level validation was executed on deployment `dpl_HdNMAFDo7GSboPvD18916dXhLy1Q`.
  - build completed;
  - validation stopped at the known unrelated defect: `Skill package is missing from the onboarding routing map: local-video-inspection`;
  - no #146-specific validation failure was reported before that blocker.
- Temporary `vercel.json` instrumentation was restored exactly to the canonical build command in commit `e6dfbd712f65d850a4507a61d19a5bdd6a214625`.

## Persona reconciliation

**Status:** complete within the bounded #146 scope.

- **Change observed:** Persona research/routing now requires a Tool integration review when execution capability is material.
- **Extends:** Persona creation/recheck can classify existing recipe reuse, recipe candidates, Tool-record candidates, representative hypotheses, and no-Tool-needed cases.
- **Confirms:** portable Skills remain separate from vendor-specific Tool-use recipes; preferred Tools remain defaults rather than runtime lock-in.
- **Confirms:** Tool record maintenance and Tool discovery remain separate handoffs; Persona research does not gain credential, permission, connector, or execution authority.
- **Unchanged checked:** live Persona records, Persona Tool requirements, Tool-use recipe records, Skill identities, workflow maps, handoffs, and maintenance history.
- **Required Persona updates:** none beyond the contract/routing changes already implemented.

## Universal change-impact reconciliation

**Status:** complete with one known external validation blocker.

| Dependent | Impact | Evidence | Action |
| --- | --- | --- | --- |
| `persona-skills` | confirms | Already separates portable capability from Tool-use recipes and checks recipes before new Skill identities | none |
| `tool-discovery-and-safe-execution` | confirms | Already owns actual runtime exposure, permission, fallback, bounded probes, and usage evidence | none |
| `tool-record-maintenance` | confirms | Already owns canonical Tool record add/change/relate operations | none |
| `content/orientation/tools.json` | confirms | Existing Tool routes match the new Persona handoffs | none |
| `content/library-data/tool-integration.js` | confirms | Existing Persona requirements and Tool-use recipes already model the relationships #146 needs | none |
| `scripts/validation/relationships.mjs` | confirms | Existing validation already enforces recipe→Skill and Persona requirement→recipe integrity | none |
| `content/library-model.js` | confirms | Existing normalizer attaches Tool-use recipes to Skills and filters Persona Tool requirements | none |
| `ARCHITECTURE.md` | confirms | Current Tool/Skill/Persona boundaries already describe the implemented model | none |
| generated Persona orientation | extends | Vercel build copied updated `content/orientation/personas.json` to generated output | rebuild verified |
| Operating Packs / Templates / Playbooks | unrelated | No relationship identity, application, process, or ownership contract changed | none |

Dependency visibility is bounded to explicit repository relationships, declared provenance, the named issue scope, and the inspected current sources; repository search is not treated as an exhaustive dependency graph.

## Current blocker / fallback

The top-level validator remains non-green because `.agents/skills/local-video-inspection` is missing from the onboarding routing map. This defect predates #146 and is out of scope. The focused regression suite and normal branch build are green.

## Next action

Open a reviewable pull request for #146 with the final diff and validation/reconciliation evidence. Merge remains separately authorized.
