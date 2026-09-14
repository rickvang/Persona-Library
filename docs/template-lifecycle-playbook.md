# Research, promote, and maintain a reusable Template

- Playbook ID: `playbook-template-lifecycle`
- Status: Working model
- Audience: Template Librarian stewards, domain specialists composing starters, and operators deciding whether a starter stays local or becomes canonical
- Canonical catalog identity: `content/library-data.js` `playbookCatalog`
- Orientation route: `template-lifecycle`
- Related Skills: `$template-research`, `$template-composer`, `$template-reconciliation`
- Related Persona: Elena Park / `template-librarian`
- Related Decisions: DEC-008 (Templates are reusable starting artifacts), DEC-009 (Template Librarian stewards the collection)

This Playbook coordinates existing Template stewardship, lifecycle Skills, domain specialists, Work Orders, and reconciliation. It is not a runtime executor and does not redefine Template Librarian, Template Skills, domain expertise, or external artifact ownership.

## Outcome

Move a reusable Template need from discovery through reuse-or-create, specialist quality when required, validation, promotion-or-local decision, and reconciliation—without confusing library stewardship with domain authorship or copying external starters into Persona-Library.

Success is an inspectable lifecycle decision with truthful source/provenance evidence, the correct specialist review when domain quality matters, and one bounded reconciliation pass after a material change. Success is not automatic promotion, inferred runtime access, or a Playbook run for every bounded Skill action.

The run stops when the need is satisfied by reuse/adaptation, a local/candidate starter is intentionally kept local, a canonical source/catalog change is authorized and reconciled, or the run is blocked at a named gate (unverified source, missing specialist, insufficient reuse evidence, unauthorized promotion, or architecture escalation).

## When to use

Use this Playbook when:

- the work crosses Template Librarian stewardship and at least one other owner (domain specialist, Mara placement, external source change, or reconciliation);
- the outcome is a reusable Template lifecycle decision, not a one-off file edit;
- catalog-first discovery, specialist quality, promotion evidence, and reconciliation need a shared stage contract.

## When not to use

Do not use this Playbook when:

- a single bounded Skill action is enough (catalog lookup, research brief, local compose, or a read-only reconciliation pass);
- the request is ordinary domain design/writing that does not need a reusable starter;
- the work is Operating Pack methodology, Tool permission, or Playbook orchestration disguised as a Template;
- promotion, external fetch/install, or runtime access is being treated as implied by catalog presence.

## Why this is a distinct Playbook

Existing Template Skills already own discovery, composition, and Template-specific reconciliation. Elena Park already owns stewardship workflows. Those pieces remain authoritative.

This Playbook is justified because the repeated outcome now crosses owners:

```text
Elena Park / Template Librarian → stewardship, provenance, duplication, promotion coordination
$template-research → catalog-first discovery and source verification
domain specialists → substantive Template quality
$template-composer → smallest useful starter after the boundary is accepted
Mara Okoye → architecture / placement escalation
$template-reconciliation → read-only Template downstream review
$change-impact-reconciliation → one universal pass when required
rickvang/template-library → canonical reusable starter artifacts
Persona-Library → Template identity, applicability, relationships, provenance, lifecycle context
```

That is a reusable multi-stage coordination model. It is not a profile of Evidence-led Job Search, Skill formation, or Bounded Parallel Implementation.

## Ownership boundaries

```text
Playbook
→ stages, handoffs, gates, stop conditions, recovery

Elena Park
→ catalog stewardship and lifecycle coordination

Domain specialists (for example Camille Ortiz, Jordan Lee, Sofia Calder)
→ discipline-specific Template quality

Mara Okoye
→ architecture, taxonomy, placement, cross-library escalation

Template Skills
→ professional/library-management procedures inside stages

template-library
→ canonical reusable starter files

Persona-Library Template records
→ identity, applicability, relationships, evidence, lifecycle metadata

Work Order
→ run-specific authorization and progress
```

Do not create a new Persona, Skill, registry, package manager, sync service, or runtime for this Playbook. Do not copy Template Skills or Persona methods into this document beyond references.

## Participants and decision rights

| Role | Owner | Recommends | Approves / stops | Notes |
| --- | --- | --- | --- | --- |
| Steward / coordinator | Elena Park | catalog action, promotion readiness, specialist routing | can stop on provenance, duplication, or unauthorized promotion | Not a universal domain author |
| Domain specialist | Named discipline Persona | substantive starter quality | owns domain quality gate for that discipline | Required only when composition/adaptation needs domain judgment |
| Architecture escalation | Mara Okoye | placement / boundary | required before new durable space/file/concept | Not the routine Template operator |
| Research Skill | `$template-research` | reuse / adapt / create / catalog | proposal only until authorized | Catalog-first |
| Composer Skill | `$template-composer` | starter manifest and boundary | creates only after research acceptance + authorization | Does not auto-promote |
| Reconciliation | `$template-reconciliation` then `$change-impact-reconciliation` | required downstream updates | read-only | One universal pass; no recursion |

## Stages

### 01 / DEFINE — Scope the Template need

- **Purpose:** Make the task, destination, reuse-versus-project-local intent, and authorization visible.
- **Owner:** Elena Park (stewardship) with the requester.
- **Entry:** A Template need is stated or suspected.
- **Actions:** Capture intended artifact, constraints, destination, and whether broader reuse is claimed.
- **Exit:** Need brief exists; Playbook is used only if cross-owner coordination is required; otherwise stop and use the matching Template route/Skill.
- **Gate:** Do not enter discovery pretending a project output is already a reusable Template.

### 02 / DISCOVER — Search catalog and verify sources

- **Purpose:** Prefer existing Templates before creating anything.
- **Owner:** Elena Park using `$template-research`.
- **Actions:** Search the live catalog; compare purpose, category, use-when, source path, entrypoint, status, availability, and evidence; verify external path/revision when claimed.
- **Exit:** Candidate comparison with reuse, adapt, create-local, or planned/canonical recommendation.
- **Gate:** Repository existence alone is not verified artifact availability. Unverified source → stop or defer.

### 03 / ROUTE — Hand off domain quality when needed

- **Purpose:** Keep stewardship separate from domain authorship.
- **Owner:** Elena Park routes; named specialist performs substantive work.
- **Actions:** Classify discipline; select the smallest capable specialist; pass catalog/source/boundary context; receive specialist result without mixing methodology into the starter.
- **Exit:** Specialist review complete, not required, or blocked pending a named specialist.
- **Gate:** Missing required specialist review stops composition/promotion. Mara is used only for architecture/placement escalation.

### 04 / COMPOSE — Create or adapt the smallest starter

- **Purpose:** Produce only the useful starting structure after the boundary is accepted.
- **Owner:** `$template-composer` with the relevant specialist when domain quality is in scope.
- **Entry:** Accepted research result and explicit authorization for the target location.
- **Actions:** Reuse or adapt first; create only needed starter files; preserve provenance; keep methodology/permissions/orchestration out of the Template.
- **Exit:** Local, candidate, planned, or authorized canonical starter with an explicit boundary note.
- **Gate:** No silent promotion of a project starter into the reusable catalog.

### 05 / VALIDATE — Prove source, boundary, and quality

- **Purpose:** Make validation inspectable before lifecycle mutation.
- **Owner:** Elena Park coordinates; specialist owns domain checks; research/composer evidence remains attached.
- **Checks:** source/path/entrypoint/revision truthfulness; reusable structure vs project output vs operating guidance; domain quality when required; availability claims not inferred.
- **Exit:** Pass, revise, or block with named gaps.
- **Gate:** Failed source verification or missing specialist review cannot be waved through as “good enough to promote.”

### 06 / LIFECYCLE — Keep local, promote, update, or deprecate

- **Purpose:** Decide the durable collection action from reuse evidence.
- **Owner:** Elena Park coordinates; authorized operator performs canonical source/catalog mutation.
- **Actions:** Evaluate reuse/promotion evidence; update or relocate canonical source when authorized; refresh lifecycle status and relationships; keep project-local starters local when evidence is weak.
- **Exit:** Explicit lifecycle decision with owner, revision context, and revisit condition.
- **Gate:** Promotion requires reuse evidence and authorization. Unauthorized promotion stops here.

### 07 / RECONCILE — Review downstream effects once

- **Purpose:** Keep related records and generated surfaces coherent after a material Template change.
- **Owner:** `$template-reconciliation`, then one `$change-impact-reconciliation` pass when required.
- **Actions:** Trace identity/source/status/relationship impacts; separate required vs optional follow-ups; escalate architecture questions to Mara.
- **Exit:** Reconciliation report with next action; no recursive reconciliation.
- **Gate:** Read-only unless a separately authorized update follows the report.

## Shared state

| Object | Owner | Purpose |
| --- | --- | --- |
| Need brief | Requester / Work Order | Task, destination, authorization, reuse claim |
| Candidate comparison | `$template-research` / Elena | Catalog matches, gaps, recommendation |
| Source evidence ledger | Elena / research Skill | Path, entrypoint, revision, verification status |
| Boundary note | Composer / specialist | Starter vs examples vs methodology vs project output |
| Lifecycle decision | Elena / authorized operator | Local, promote, update, deprecate, supersede |
| Reconciliation report | Template + universal adapters | Required updates and limitations |

Private project content stays in the project workspace. Canonical reusable starters stay in `rickvang/template-library` unless another authorized source is verified. Persona-Library stores Template metadata and relationships, not duplicated artifact trees.

## Quality gates

1. **Catalog-first:** existing Templates checked before creation.
2. **Boundary integrity:** reusable structure separated from project output and operating guidance.
3. **Source truth:** path/entrypoint/revision evidence is verified or explicitly unknown.
4. **Domain quality:** right specialist reviewed when substantive quality is required.
5. **Promotion evidence:** reuse evidence justifies canonical status; existence alone does not.
6. **Lifecycle ownership:** every source/status change has an owner and revision context.
7. **Reconciliation once:** Template adapter then one universal pass at the appropriate boundary.
8. **Availability honesty:** missing source or runtime access remains visible.

## Failure and recovery

| Failure | Stop / recovery |
| --- | --- |
| Unverified external source | Stop at DISCOVER/VALIDATE; do not claim verified |
| Missing specialist for domain Template | Stop at ROUTE/VALIDATE; do not let Elena author the discipline content |
| Insufficient reuse evidence | Keep local/candidate; do not promote |
| Unauthorized promotion or source write | Stop at LIFECYCLE; record blocker |
| Architecture / taxonomy ambiguity | Escalate to Mara; do not invent a new space or concept |
| Stale relationships after change | Return through RECONCILE; apply only authorized follow-ups |

## Representative cases

### Successful lifecycle case

Need: a reusable web-app design-system starter is requested. Elena searches the catalog, finds a planned or partial match, verifies `template-library` path/revision, routes Camille/Jordan for design-system quality, composes only missing starter structure after authorization, validates boundary and provenance, promotes or updates the canonical source with reuse evidence, then runs Template reconciliation and one universal pass.

### Boundary / failure case

Need: promote a project resume draft into the Template catalog. Discovery shows the artifact mixes private candidate facts with starter structure, source path is unverified, and no specialist boundary review exists. The Playbook stops before promotion, keeps the work project-local, and records the missing evidence rather than inventing a canonical Template.

## Runtime notes

This Playbook is runtime-neutral. Current agent surfaces may load the Template catalog, Skills, and Work Order, but no runtime is the canonical meaning of the Playbook. Do not add fetch/install/sync machinery here.

## Learning loop

After each run, record whether catalog-first search avoided duplication, whether specialist routing preserved domain quality, whether promotion evidence was sufficient, and whether reconciliation found stale relationships. Revise this Playbook only when repeated runs show a missing stage/gate, not when a one-off Skill action would have been enough.
