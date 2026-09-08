# Personas system architecture

## Current boundary

The library remains a static Site. Persona content is the source of truth; the browser page is a renderer of that content.

```text
content/library-data.js + content/library-model.js
        |
        v
scripts/build-library.mjs
        |
        v
dist/data/*.js + dist/js/*.js + dist/*.html
        |
        v
private Sites deployment
```

## Source of truth

- `content/library-data.js` owns authored personas, workflow maps, skill profiles, resource trails, modular skill guidance and practice overrides, primitive skill units, typed skill relationships, tool-use recipes, and explicit persona tool requirements.
- `content/site-orientation.json` is the canonical machine-readable bootstrap manifest for routing requests, scoping reads and writes, and describing the system's response contract.
- `content/library-model.js` is the canonical normalizer. It derives stable skill IDs, merges persona-specific skill applications, maps workflow reach, resolves operating and quality guidance plus modular building blocks and related connections, attaches tool-use recipes to the portable skills they make practical, and filters persona tool requirements to known personas.
- `client/library-ui.js` owns shared browser render helpers for lists, resources, revision history, escaping, and trigger chips.
- `client/library-state.js` owns small URL-aware page state such as role filters, search terms, and selected records.
- `dist/data/*.js` and `dist/js/*.js` are generated output consumed by `dist/index.html` and `dist/skills.html`.
- `dist/index.html` owns persona presentation and page-specific interaction, not persona records or shared render primitives. Persona detail shows explicit tool requirements for architect and orchestrator activities, including capability, preferred path, mode, scope, fallback, and linked recipe context.
- `dist/skills.html` is the cross-persona Skills space: it indexes reusable capabilities and opens their triggers, operating model, quality signals, observable actions, workflow reach, evidence, modular anatomy, and persona applications.
- `dist/tools.html` is the first-class Tools space: it catalogs tools, research references, execution environments, and MCP adapters by capability, availability, scope, and risk. It also indexes representative tool-use recipes.
- `dist/tool.html` is the first canonical tool detail record. It demonstrates the execution-ready contract: capability, connector, workspace, permission, approval, verification, fallback, tool-use recipes, lessons, failure modes, and version history.
- `tool-discovery-and-safe-execution/` is a reusable skill for resolving a capability to the safest available tool or MCP, running a bounded probe, and promoting reviewed usage evidence into reusable guidance without silent permission or content changes.
- `tool-record-maintenance/` is a reusable skill for adding, updating, relating, reconciling, auditing, and retiring canonical tool records without executing tools or changing access.
- `persona-panel-orchestration/` is a reusable reasoning skill for consultations and panels. It requires explicitly named participants, processes each persona independently, preserves material disagreement, and synthesizes a clean response without silently updating durable records.
- `multi-perspective-skill-synthesis/` is the shared-capability formation gate: it compares distinct Persona evidence, checks Skill identity boundaries, and hands a bounded build brief to Persona Skills without silently mutating live records.
- `playbook-composer/` is the reusable Playbook composition layer: it coordinates canonical Personas, Skills, Tools, workflows, artifacts, state, decision rights, quality gates, recovery, and learning without executing the Playbook.
- `docs/collaboration/problem-context.md`, its schema, and `scripts/problem-context.mjs` define the file-based shared context MVP for multi-Persona work; the collaboration Playbook coordinates it without replacing canonical library records or providing a concurrent runtime.
- `change-impact-reconciliation/` is the universal post-change consistency protocol. Domain workflows call it after source, record, decision, prototype, or generated-artifact changes; `persona-reconciliation/` remains the Persona-specific adapter.
- `dist/playbooks.html` is the Playbooks space: it explains how personas, skills, workflows, artifacts, evidence, and quality gates compose around an outcome. Detailed playbooks can live behind it as deep links, such as `dist/job-search.html`.
- Persona and skill maintenance metadata records semantic revisions alongside file-level Git history.
- `dist/prototyping.html` is the active prototype index. It also owns isolated persona prototypes such as `proto-persona-surface-aware-partner`; these are test records, not live Personas, and must not affect counts, filters, shared skill catalogs, or production workflows until explicitly promoted.
- `dist/activity-views.html` and `dist/skill-views.html` are focused prototype detail surfaces; future experiments should be added here before they affect the current system.
- `dist/guide.html` is the wiki for using the system, including the mental model and playbook composition rules. `dist/decisions.html` is the private archive of individually addressable decision records with status filters, prototype evidence, affected surfaces, and revisit conditions; `dist/job-search.html` is the first detailed playbook surface.
- The `Persona Library Guide` is currently an isolated prototype. It is an onboarding and routing interface for newly connected LLMs; it prepares context and handoffs but does not become a live dependency until promoted through Decisions.
- `AGENTS.md` is the repository activation entry point. It points agents to the orientation manifest before they modify the project; `dist/data/site-orientation.json` is the generated copy for Site and other read-only consumers.
- `JOB_SEARCH_IMPLEMENTATION.md` is the scope and sequencing document for that future workspace. The current Site exposes its responsive MVP reference page without implying scraping, autonomous outreach, mass submission, or persistent tracking.

## Docs, prototyping, and decisions boundary

Keep the three spaces complementary:

- Docs contain the current truth: definitions, boundaries, instructions, examples, prompts, and the current information architecture. They should be enough for orientation and reuse.
- Prototyping contains active experiments: alternative structures, interaction directions, sample content, and temporary comparison surfaces. It is safe to change or discard a prototype.
- Decisions contain the reasoning and history behind that truth: explorations, alternatives, tradeoffs, evidence, status, affected surfaces, and revisit conditions. They should make change understandable and accountable.

The working rule is: **Prototyping explores; Decisions archive; Docs explain what is true now.** Link a prototype to its decision record, link the decision to the Docs section or product surface it changed, and avoid copying whole explanations between the three spaces.

Docs provide the human-readable orientation page; the orientation manifest provides the compact machine-readable contract. Keep the two aligned through the build and validation checks rather than maintaining separate instructions by hand.

Work Orders are the repository-wide active-work packet and progress record for non-trivial work. They capture scope, evidence, decisions, gate status, handoffs, and next action without becoming a transcript or permission grant. The specialized artifacts remain distinct: problem-context coordinates shared Persona state, traceability matrices prove coverage, Decisions preserve durable rationale, prototypes explore, and issues or pull requests track implementation. See [Work Orders](docs/work-orders.md).

Use prototype status `Active → Selected → Archived`. Persona prototypes additionally use a `Testing` state and a promotion gate: representative test scenarios, observed behavior, open questions, and an explicit Decisions record before promotion. Use decision status `Proposed → Decided → Applied → Superseded`. Use `Parked` for a useful idea intentionally deferred.

The working rule for persona prototypes is: **prototype records can reference live personas and skills, but live records cannot depend on prototype records.** A promotion creates a deliberate change set and reconciliation pass; an archive leaves the live system untouched.

Each archived decision should preserve its question, chosen direction, rationale, tradeoffs, affected surfaces, source prototype, and revisit condition. A changed conclusion creates a new record and marks the previous record `Superseded`; it does not rewrite the old rationale.

Tools follow a separate boundary: **Tools describe what can act; Skills describe portable capability and quality; Persona tool requirements declare what an activity needs; Tool-use recipes bind a skill to a task in a specific tool; Personas describe why and when a person uses it; Playbooks coordinate the pieces toward an outcome.** A requirement is a capability need, not proof of availability. A recipe is not a new skill unless it contains independent reusable judgment. A tool record must not imply that a connector, credential, workspace, or permission is configured. A usage note is evidence of one attempt; only reviewed or repeated evidence can become shared guidance.

Durable creation has a placement gate: **Mara Okoye, the knowledge systems architect, reviews whether a proposed Persona, Skill, Tool, Playbook, Doc, Decision, generated artifact, space, or file belongs as an extension of an existing record, relationship, workflow, recipe, or source file before a domain skill mutates it.** The review records the exact destination and closest alternatives; it does not grant write authority. Generated `dist/` files remain build outputs, never authoring destinations.

Change handling follows a universal boundary: **the workflow that performs the research or mutation owns the domain work; Change Impact Reconciliation checks the downstream consequences before handoff.** It is read-only by default, classifies dependents as confirms, extends, qualifies, contradicts, invalidates, or unrelated, and reports incomplete dependency visibility instead of pretending the review is exhaustive. Explicit relationships and declared artifact provenance are the supported dependency sources.

Every maintained skill declares a small change contract in its frontmatter: `change_mode`, `change_domain`, and `reconciliation`. Read-only skills skip the gate unless they create a durable artifact; prototype skills check isolation only; source-update, record-update, artifact-generation, and applicable external-execution skills invoke the universal gate; domain reconciliation adapters run once before the universal pass. Missing metadata falls back to read-only behavior and is reported as a contract gap.

Project context and reference routing is a Docs-owned method layered over the Work Order and UX practice. It selects tagged project lenses and reference IDs without duplicating canonical Personas, Skills, Tools, Playbooks, or project evidence. Project-specific assumptions stay in the Work Order or linked context artifact; only reviewed, generalizable lessons may be promoted to shared Docs.

For non-trivial work authorized against this repository, the default project artifact home is docs/work-orders/<work-order-id>/. The Work Order indexes that package and records paths or URLs for specialized artifacts. External project work stays in the external target; trivial changes may record why a package was not warranted.

## Invariants

Run `node scripts/build-library.mjs` after changing content or client modules, then run `node scripts/validate-content.mjs` before publishing. Validation checks stable IDs, supported roles and flow tiers, complete workflow activity rows, skill-profile references, normalized catalog relationships, resource URLs, generated module freshness, orientation-manifest freshness and schema, the skill-contract manifest, and the page script boundary. Tool-use recipes should additionally check that their skill, tool, persona, and playbook references resolve, and that every recipe has a mode, prerequisite, output, fallback, and verification path. Persona tool requirements should additionally check that the persona and linked recipe resolve and that capability, preferred path, mode, scope, fallback, status, and rationale are present. Tool records should additionally check that every capability has a scope, permission, approval rule, verification method, and fallback, and that lessons carry evidence status and revision context. Source-update and mutation workflows should additionally run a reconciliation pass over affected records and generated outputs, checking stale placeholders, assumptions, statuses, duplicate sections, contradictions, blockers, and semantic revision notes.

Counts and filters should be derived from the content module. Do not hand-edit persona totals or role totals as the library grows.

## When to expand the stack

Keep the static-first architecture while content is primarily authored in Git and the library is read-only. Add a database and authenticated authoring only when the product needs collaborative editing, comments, permissions, persistent user-created personas, or server-backed search. Keep page state in the URL-aware helper until state must persist across users or sessions.
