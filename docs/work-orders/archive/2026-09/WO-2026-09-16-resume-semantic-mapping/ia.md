# Placement review — Resume semantic mapping

## Review owner

Mara Okoye · Knowledge systems architect

This is a repository-defined placement review based on the current architecture, orientation contract, Candidate Context boundary, Template ownership contract, and existing Skill packaging rules. It is not a claim of a live human consultation.

## Proposal

Introduce a presentation-neutral Resume Content Model, a reusable semantic Template mapping Skill, and per-resume-Template semantic slot manifests so multiple candidates and multiple resume layouts can reuse the same normalized meaning without sharing private candidate data.

## Classification

| Proposed piece | Classification | Canonical owner / placement |
| --- | --- | --- |
| Resume Content Model semantics | new reusable Doc/contract | `Persona-Library/docs/job-search/` |
| Machine-readable Resume Content Model schema | new durable contract artifact | `Persona-Library/docs/job-search/resume-content-model.schema.json` |
| Resume semantic Template mapping behavior | new reusable callable Skill | `Persona-Library/.agents/skills/resume-template-semantic-mapping/` |
| Candidate-specific normalized resume content | private candidate-context data | authorized private Candidate Application Context; never public library data |
| Resume Template semantic slot manifest | Template metadata | `rickvang/template-library/templates/resumes/<template>/slot-map.json` |
| Candidate-context operating guidance | existing Operating Pack extension | `rickvang/operating-packs/packs/candidate-application-context/` |
| Role-specific selection/emphasis | application-instance state | private role/application Work Order or notes |

## Boundary decision

Use the existing three-repository/application boundary. Do **not** create a fourth repository, candidate registry, generator runtime, or Template-specific candidate data model.

The normalized candidate instance belongs with private candidate context because it contains person-specific facts. The schema and mapping judgment belong in Persona-Library because they define reusable semantics and Skill behavior. Slot destinations belong with each Template because they describe that Template's structure.

## Closest alternatives considered

### Put normalized resume data in `template-library`

Rejected. Templates own reusable starting structure, not candidate facts or candidate semantic truth. Doing this would either publish private data or force every Template to carry a competing candidate model.

### Treat the evidence ledger as the rendering model

Rejected as the only interface. Evidence remains authoritative, but a ledger is optimized for provenance and claim support rather than stable presentation-neutral resume composition. The normalized model must retain traceability back to the ledger rather than replace it.

### Store one canonical formatted resume and transform from it

Rejected. A formatted resume already contains Template-specific hierarchy and omission choices. Using it as the data model would make future Templates inherit accidental presentation decisions.

### Build a generator/runtime now

Rejected. The current need is a semantic contract and mapping Skill. The architecture should remain file-based and directly usable by a person or agent without requiring execution infrastructure.

## Placement result

Approved placement:

```text
private candidate evidence + decisions
        ↓
private Resume Content Model instance
        ↓
Persona-Library mapping Skill + semantic contract
        ↓
template-library slot manifest + starter
        ↓
private role-specific resume
```

This placement preserves current Candidate Context, Template, Skill, evidence-integrity, and submission-authorization boundaries.
