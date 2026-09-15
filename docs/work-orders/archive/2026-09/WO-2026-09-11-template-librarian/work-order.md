# Template Librarian Persona Work Order

- Work Order ID: WO-2026-09-11-template-librarian
- Title: Add and integrate a Template Librarian Persona
- Status: complete
- Created: 2026-09-11
- Last updated: 2026-09-11
- Requester: repository user
- Current owner: Codex
- Explicit collaborators: Mara Okoye for architecture escalation; Camille Ortiz, Jordan Lee, and Sofia Calder for scoped domain handoffs
- Request mode: update
- GitHub issue: [#63 — Add and integrate a Template Librarian Persona](https://github.com/rickvang/Persona-Library/issues/63)
- Related architecture audit: [#60](https://github.com/rickvang/Persona-Library/issues/60), out of scope for this work
- Branch: `codex/template-librarian-persona`
- Artifact home: `docs/work-orders/WO-2026-09-11-template-librarian/`

## Request and outcome

Add one live Persona that stewards the reusable Template collection. The Persona should maintain identity, discoverability, provenance, source verification, status, lifecycle, duplication control, promotion, and reconciliation, and should route substantive Template research and composition to the relevant domain specialist.

Persona-Library remains the owner of Template metadata and relationships. `rickvang/template-library` remains the intended host of reusable artifact content. The Template Librarian does not become the domain expert for every Template and does not own Operating Pack methodology, Tool permissions, Playbook orchestration, or Persona-Library architecture.

## Scope

- Add the `template-librarian` Persona and four workflows using the current Persona schema.
- Reuse existing portable Skills for routing, rationale, and cross-functional communication; do not add a new Skill package.
- Declare conditional handoffs to Camille, Jordan, and Sofia for domain work and to Mara for architecture or concept-boundary escalation.
- Add a focused Templates stewardship route to the orientation manifest and root quick routing.
- Update the architecture boundary, Docs guidance, and Decisions archive.
- Refresh generated data and validate Persona, workflow, Skill, handoff, navigation, and reconciliation contracts.

## Non-goals and constraints

- Do not change Template artifact ownership or the three existing Template records.
- Do not attach the librarian globally to every Template or attach `$template-composer` as a librarian-owned domain capability.
- Do not create a Template Team, Template Owner, registry, manifest, package manager, or new first-class governance concept.
- Do not make Mara the routine Template researcher, composer, or catalog maintainer.
- Do not infer Tool access from a Persona record; activity tool entries remain representative capability needs.
- Preserve unrelated working-tree changes already present in the repository.

## Evidence and uncertainty

- **Observed:** `origin/main` contains the merged Templates implementation from PR #61, including the current Template source, model, orientation, catalog, and lifecycle Skills.
- **Observed:** current records use `content/library-data.js` as the authored source, `flowLibrary` for Persona workflows, `skillLibrary` for Persona Skill applications, and `personaHandoffs` for required conditional handoffs.
- **Observed:** Mara, Camille, Jordan, and Sofia already exist with the IDs used in the planned handoffs.
- **Sourced:** current repository architecture and Skill contracts define Template ownership, domain routing, placement review, and reconciliation boundaries.
- **Synthetic assumption:** `Elena Park` is a modeled Persona name and is not an observed individual. Its role and workflows require validation through later catalog maintenance and specialist handoff use.
- **Unknown:** no live runtime evidence yet demonstrates that the librarian route is preferred by contributors or that the external Template repository is accessible from every environment.

## Placement and authorization

Mara’s placement review is recorded in [ia.md](ia.md). The exact destination is the existing `personas` collection in `content/library-data.js`, with its matching `flowLibrary` and `skillLibrary` entries plus explicit `personaHandoffs`. The orientation route points to the Persona identity while keeping Template lifecycle Skills as the callable research and reconciliation paths.

The repository user explicitly authorized the live Persona and related integration changes. This Work Order records that authorization boundary; it does not grant additional repository, Tool, account, or external communication permission.

## Success criteria

- `template-librarian` is a valid live Persona with four minimal workflows.
- The record clearly states the stewardship boundary and the specialist and Mara escalation boundaries.
- Existing Template catalog records remain unchanged and continue to normalize with planned external artifact paths and entrypoints unknown.
- Handoffs and reused Skill applications resolve through the current model and validator.
- Orientation, root routing, architecture Docs, Decisions, generated data, and the Persona Site expose the role.
- Persona reconciliation and one universal impact review identify no required unrelated record mutations.
- Required validation commands pass and generated changes are explained.

## Reconciliation and validation

The Persona-specific review and one universal change-impact pass are recorded in [reconciliation.md](reconciliation.md). The review checked the new Persona, reused Skill applications, workflows, handoffs, Template catalog, Operating Pack and Playbook references, Tool-use context, Docs, Decisions, routing, generated Site output, and prototype boundaries. No required unrelated record mutation was identified.

Required checks passed:

- `node scripts/build-library.mjs`
- `node scripts/validate-content.mjs`
- `node --check content/library-model.js`
- `node --check scripts/validate-content.mjs`
- `node eval/isolated-persona-skill.mjs validate`
- `git diff --check`

The build left source and generated data in parity. Existing unrelated worktree changes remain preserved and are outside this Work Order.

## Phase and next action

Phase: implementation, validation, and reconciliation complete.

Next action: validate the Persona through observed catalog stewardship and specialist handoffs; reverify external Template artifacts separately when their paths and entrypoints exist.
