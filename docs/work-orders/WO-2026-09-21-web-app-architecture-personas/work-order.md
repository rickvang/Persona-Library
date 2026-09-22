# Work Order — Issue #183 Web application architecture Personas

- Work Order ID: WO-2026-09-21-web-app-architecture-personas
- Updated: 2026-09-21
- Requester: repository owner
- Owner: Riley Morgan / ChatGPT implementation agent
- Explicit collaborator: Mara Okoye · knowledge systems architect (placement/boundary review)
- Request mode: update
- GitHub issue: https://github.com/rickvang/Persona-Library/issues/183
- Research source: https://github.com/rickvang/Persona-Library/issues/182
- Branch: `feat/issue-183-web-app-architecture-personas`
- Base refreshed: `main` at `d9e3261e06269029884f1361934beb4df0a1588d`
- Change mode: source update
- Change domain: Personas, Skills, workflows, handoffs, generated library data
- Reconciliation: Persona adapter first, then one universal impact pass

## Outcome

Add two live specialist Personas with a deliberately narrow collaboration boundary:

1. **Frontend Systems Engineer** — production web implementation and frontend runtime architecture.
2. **Application & Data Architect** — source-of-truth, content/domain modeling, persistence, service/API/auth boundaries, schema evolution, CMS architecture, and scaling/revisit decisions.

Add only the smallest justified new reusable Skills:

- Architecture decision-making
- Web application architecture
- Application and data architecture

Reuse existing portable capabilities rather than duplicating them.

## Authorization

The requester explicitly asked to add the researched Personas. Persona-Library standing completion authorization covers the normal implementation path, PR review corrections, and merge once current completion gates pass. This Work Order does not authorize unrelated repository changes or external-system mutations.

## Placement

Mara’s creation gate resolves both additions as new Persona records rather than extensions of Camille Ortiz, Jordan Lee, Mara Okoye, Alex Rowan, or Riley Morgan. See `ia.md`.

Canonical destinations:

- Persona identities: `content/library-data/personas-systems.js`
- Persona Skill applications: `content/library-data/skills-specialists.js`
- Persona workflows: `content/library-data/workflows-systems.js`
- Explicit Persona handoffs: `content/library-data/tool-integration.js`
- Authored Skill operating/quality guidance: `content/library-data/skill-practice.js`
- Maintenance/revision context: `content/library-model.js`
- Focused invariant validation: `scripts/validation/generated.mjs`
- Generated browser data: normal `scripts/build-library.mjs` output

## Evidence

### Frontend systems engineering

- O*NET Web Developers, updated 2026: web applications, code structure, browser/device compatibility, performance, scalability, server-side concerns, integration, architecture/technology evaluation.
- Next.js current documentation: full-stack React application framework, App Router, Server Components, rendering and data-mutation/cache boundaries.
- W3C WCAG 2.2: accessibility remains a testable implementation quality dimension.

### Application and data architecture

- O*NET Database Architects, updated 2026: architectural strategy, application data models, integration, scalability, security, performance, reliability, and schema communication.
- Sanity current schema documentation: content schemas express types, fields, relationships, and constraints independently of presentation.
- Microsoft Azure Well-Architected ADR guidance: architecture decisions should capture context, options, tradeoffs, confidence, consequences, status, and supersession.

Evidence supports the responsibility model; the Personas remain synthesized working models until validated through repeated real project use.

## Boundaries

- Camille owns interface-design judgment; Frontend Systems Engineer owns production implementation/runtime judgment.
- Jordan owns user/task/content-structure judgment; Application & Data Architect owns technical source-of-truth and persistence architecture.
- Mara owns Persona-Library knowledge-system placement and taxonomy, not application architecture.
- Alex owns capability-aware cross-surface execution, not software architecture.
- Riley remains the default durable orchestrator and routes bounded architecture work to the specialists.
- Next.js, Vercel, Supabase, Sanity, Payload, Prisma, ORMs, databases, and similar technologies do not become Persona identities or technology-named core Skills.
- No vendor Tool availability or account permission is inferred.

## Tool integration review

Current canonical Tool records and recipes do not justify new direct Persona Tool requirements for these roles.

- Frontend runtime/browser/repository tooling: **representative Tool hypothesis only** until a stable Tool identity and reusable recipe are separately established.
- Database/CMS/schema administration: **representative Tool hypothesis only** until a stable Tool identity and reusable recipe are separately established.
- Vercel remains a canonical Tool, but its existing Riley review-checkpoint recipe is an orchestration/deployment evidence path, not proof that these new Personas require Vercel.
- Do not create Tool records or recipes as a side effect of this Persona implementation.

## Validation scenarios

The final model must preserve clear decision ownership for:

- static Next.js portfolio;
- structured case-study / MDX content;
- headless CMS introduction;
- authenticated editing;
- API/auth/data persistence;
- CMS/storage-provider replacement;
- image-heavy performance regression;
- framework/dependency evaluation;
- multi-editor draft/review/publish workflow;
- schema/database migration.

## Completion gate

- Persona records validate and render.
- Workflow maps resolve.
- Skill identities deduplicate correctly and include inspectable operating/quality guidance.
- Handoffs resolve to real Persona IDs.
- No unsupported Tool requirement is introduced.
- Generated library/model outputs are current.
- Focused architecture-Persona invariant passes.
- Full repository validation and required GitHub checks pass.
- Persona reconciliation and one universal impact pass are recorded.
- PR is mergeable with no blocking review or failing required check.
