# Work Order — Persona Tool Integration Review

- **Work Order ID:** WO-2026-09-18-persona-tool-integration
- **Title:** Integrate Tool-use review into Persona creation workflow
- **Status:** active
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

**Build — source contract update**

Gate result: **pass**. Existing architecture is sufficient; no new concept or schema is required.

## Current blocker / fallback

No implementation blocker identified at start. The known `local-video-inspection` onboarding-routing validator defect remains explicitly out of scope if it reappears during top-level validation.

## Next action

Update the Persona research contract, Persona routing, and Persona-research golden scenarios on the issue branch, then inspect the diff and run validation.
