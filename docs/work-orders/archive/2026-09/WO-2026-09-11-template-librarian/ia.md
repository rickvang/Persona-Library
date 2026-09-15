# Template Librarian placement review

## Review owner

Mara Okoye · Knowledge systems architect

## Placement decision

Add one live Persona with ID `template-librarian` to the existing Persona collection. Store its workflow map under `flowLibrary['template-librarian']`, reuse existing portable Skill identities through `skillLibrary['template-librarian']`, and express specialist and architecture boundaries through the existing `personaHandoffs` model.

Keep Template identity, applicability, source metadata, evidence, lifecycle, and artifact ownership in the existing Templates architecture. The Librarian is a stewardship lens over that collection, not a new Template schema or ownership entity.

## Why this is a Persona

The request concerns a stable way of operating across multiple Template records and workflows: inventory, verification, duplication review, routing, promotion, deprecation, relocation, and reconciliation. That work needs a role context, priorities, activities, handoffs, and escalation boundary, which fit the current Persona model.

The request does not require a new Skill package. Existing `Task decomposition and routing`, `Decision communication and rationale documentation`, and `Cross-functional systems communication` profiles express the portable capabilities; the new Persona applies them to Template stewardship workflows. The callable `$template-research`, `$template-composer`, and `$template-reconciliation` packages remain routed lifecycle capabilities, with composition owned by the relevant domain specialist.

## Closest alternatives checked

- Extend Mara Okoye: rejected because Mara owns overall concept placement, taxonomy, dependency architecture, and boundary escalation rather than routine Template catalog work.
- Make the librarian a universal Template author: rejected because substantive Template quality is domain-specific and belongs with the relevant specialist Persona.
- Add a new Template stewardship Skill: deferred because the current workflow plus reused portable Skill applications express the behavior without introducing another canonical capability.
- Add a Template Owner or Template Team entity: rejected because the existing Persona and handoff models already express stewardship and routing.
- Add a field to every Template record: rejected because the librarian’s collection responsibility does not require global applicability on each Template record.

## Boundary and escalation

The Template Librarian may determine what is cataloged, what source evidence is recorded, whether a candidate is reusable enough to promote, and which specialist should evaluate its content. Camille, Jordan, Sofia, or another relevant specialist determines what a discipline-specific Template should contain. Mara is consulted when the question changes first-class spaces, taxonomy, concept boundaries, dependency architecture, or cross-library ownership.
