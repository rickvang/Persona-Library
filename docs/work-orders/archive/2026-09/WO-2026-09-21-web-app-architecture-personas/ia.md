# Placement review — Web application architecture Personas

## Review owner

Mara Okoye · Knowledge systems architect

This is a repository-defined placement review based on the current Persona/Skill/workflow/Tool boundaries. It is not a claim of a live human consultation.

## Decision

Create two new specialist Persona identities:

- `frontend-systems-engineer`
- `application-data-architect`

Do not create a generic Full-Stack Architect or a pure Database Architect.

## Why these are Personas

Both roles describe stable operating contexts with recurring decisions, workflows, handoffs, failure modes, and quality signals across projects. They are not merely technology procedures.

The Frontend Systems Engineer repeatedly decides how a web application should execute and remain reliable across rendering boundaries, components, browsers, devices, performance constraints, accessibility implementation, tests, and framework/dependency evolution.

The Application & Data Architect repeatedly decides where information should live, which source is authoritative, when persistence is justified, how content/domain models and service boundaries evolve, how authentication/authorization affects the data model, and how migrations preserve continuity.

## Closest alternatives checked

| Alternative | Result | Boundary |
| --- | --- | --- |
| Camille Ortiz / `ui-expert` | Do not extend | Camille owns interface intent, interaction design, visual hierarchy, design-system judgment, accessibility design, and built-versus-designed QA. Runtime architecture is a separate engineering responsibility. |
| Jordan Lee / `ux-senior` | Do not extend | Jordan owns product/UX framing, content model semantics, task flow, navigation, and evaluation. Technical persistence/source-of-truth architecture is separate. |
| Mara Okoye / `knowledge-systems-architect` | Do not extend | Mara governs Persona-Library concepts, taxonomy, placement, dependencies, and knowledge architecture, not application/database architecture. |
| Alex Rowan / `context-aware-systems-collaborator` | Do not extend | Alex adapts execution to available capabilities and permissions across assistant surfaces; Alex is not a software architecture specialist. |
| Riley Morgan / `ai-orchestrator` | Do not extend | Riley routes and coordinates substantial work; Riley should hand domain architecture to the specialist rather than absorb it. |
| Generic Full-Stack Architect | Reject | Collapses frontend runtime quality and persistent application/data evolution into one overly broad responsibility. |
| Database Architect | Reject | Too narrow because the role must be able to recommend files/MDX or no database and delay persistence until requirements justify it. |

## Skill placement

Reuse:

- Problem framing and systems thinking
- Evidence-led validation
- Decision communication and rationale documentation
- Cross-functional systems communication
- Component and design-system thinking (frontend application)
- Accessibility and inclusive design (frontend application)

Create:

- **Architecture decision-making** — portable evaluation of requirements, constraints, options, tradeoffs, reversibility, evidence, confidence, decision, and revisit conditions.
- **Web application architecture** — portable judgment about frontend/runtime structure and quality.
- **Application and data architecture** — portable judgment about source-of-truth, domain/content models, persistence, service/auth boundaries, schema evolution, reliability, and migration.

Do not split performance, testing, CMS architecture, API design, schema migration, caching, or data modeling into additional Skills yet. Promote a narrower capability only after repeated evidence demonstrates an independently reusable judgment boundary.

## Handoff model

- Riley routes frontend/runtime architecture to Frontend Systems Engineer.
- Riley routes persistent application/data architecture to Application & Data Architect.
- Frontend Systems Engineer routes unsettled interaction/visual intent to Camille and unsettled task/content/navigation semantics to Jordan.
- Frontend Systems Engineer routes persistent data/source-of-truth/API/auth/schema questions to Application & Data Architect.
- Application & Data Architect routes browser/runtime/component integration consequences to Frontend Systems Engineer and user-facing content/workflow semantics to Jordan.
- Persona-Library placement remains governed by Mara’s universal creation gate rather than duplicated as a special domain handoff.

## Tool boundary

No new Tool record, recipe, or direct Tool requirement is required for creation. Technology vendors remain replaceable implementation paths beneath the Personas and Skills.
