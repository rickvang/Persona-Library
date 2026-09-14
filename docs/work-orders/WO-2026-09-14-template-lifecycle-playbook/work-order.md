# Template lifecycle Playbook Work Order

- Work Order ID: WO-2026-09-14-template-lifecycle-playbook
- Title: Compose a reusable Template lifecycle Playbook
- Status: ready for review
- Created: 2026-09-14
- Last updated: 2026-09-14
- Requester: Rick Vang
- Current owner: Cursor cloud agent
- Request mode: update
- GitHub issue: [#72 — Compose a reusable Template lifecycle Playbook](https://github.com/rickvang/Persona-Library/issues/72)
- Artifact home: `docs/work-orders/WO-2026-09-14-template-lifecycle-playbook/`
- Concrete deliverable: `docs/template-lifecycle-playbook.md` plus catalog, route, Site, and DEC-012 surfaces
- Specialized evidence: [`validation.md`](validation.md) and [`reconciliation.md`](reconciliation.md)

## Goal

Add one canonical Playbook that coordinates Template research, composition, promotion/maintenance, and reconciliation across Elena Park, Template Skills, domain specialists, and Mara—without replacing those components or moving external Template artifacts into Persona-Library.

## Scope

- Reinspect Template Librarian workflows, Template route group, lifecycle Skills, catalog/model, and external source boundary.
- Confirm no existing Playbook already owns this outcome.
- Compose `playbook-template-lifecycle` with `$playbook-composer` contract expectations.
- Add Playbooks orientation route, catalog identity, Site Playbooks/Docs/Decisions surfaces, and Templates stewardship handoff pointer.
- Validate one successful and one failure/boundary case on paper.
- Run repository validation and bounded reconciliation.

## Non-goals and constraints

- No new Persona, Skill, registry, package manager, sync service, or runtime.
- No copy of Template Skill or domain methods into the Playbook beyond references.
- No automatic promotion of project-local starters.
- No change to `rickvang/template-library` contents in this Work Order.
- Do not make every Template Skill action require a full Playbook run.
- Merge is not assumed authorized beyond push/PR.

## Authorization and boundary

Rick Vang authorized building issue #72 and pushing to GitHub. Authorized mutation targets are Persona-Library Playbook/Docs/Templates orientation surfaces, catalog identity, Site pages, Decisions, focused validators, the durable Playbook contract, and this Work Order.

## Mara placement and boundary review

Performed from Mara’s knowledge-systems placement gate, Templates architecture boundary, DEC-008/009, and Playbooks space write rule.

- Finding: this is a justified new Playbook identity for a repeated cross-owner Template lifecycle outcome, not a new space, Persona, Skill, or external repository.
- Selected placement: durable contract at `docs/template-lifecycle-playbook.md`; catalog id `playbook-template-lifecycle`; activation on Playbooks route group; stewardship pointer from Templates route `template-library-stewardship`.
- Rejected alternative: leave only Skill sequence documentation. Rejected because promotion, specialist routing, and reconciliation already cross owners.
- Rejected alternative: fold into Skill formation Playbook. Rejected because Template ownership and external artifact boundaries are distinct.
- Rejected alternative: create a Template runtime/registry. Rejected by #60/#70 boundary rules.
- Boundary result: placement is clear; Template Librarian and Template Skills remain the procedural owners inside stages.

## Existing Playbook check

Checked current `playbookCatalog`:

- Evidence-led job search — outcome Playbook for candidate search
- Create and integrate a reusable skill — skill formation
- Bounded parallel implementation — repository implementation dispatch

None owns Template catalog stewardship, external starter provenance, promotion evidence, or Template reconciliation. Distinct Playbook is justified.

## Current phase and gate

Phase: reviewable implementation. Gate: independent review, then separately authorized merge.

## Success criteria and stopping condition

- Canonical Playbook identity exists and is discoverable.
- Stages reference Elena, Template Skills, specialists, Mara, and reconciliation without duplication.
- Successful and failure cases are reasoned in validation evidence.
- Content validation passes.
- No new Persona/Skill/runtime introduced.

Stopping condition: reviewable PR for #72, or a bounded blocker.

## Next action

Independent review of the PR for #72. Merge only after separate authorization if required.
