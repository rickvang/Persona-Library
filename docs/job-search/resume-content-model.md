# Resume Content Model

## Purpose

Define a presentation-neutral, candidate-neutral semantic contract for resume content so one private candidate context can be rendered through materially different resume Templates without rewriting or reinterpreting the underlying facts each time.

The canonical machine-readable contract is [`resume-content-model.schema.json`](resume-content-model.schema.json). The current contract version is **1.0**.

This model is a **normalized projection for composition**. It is not the candidate's evidence ledger, not a Template, not a role-specific resume, and not a public candidate record.

## Ownership boundary

```text
private candidate evidence + standing decisions
        ↓
private Resume Content Model instance
        ↓
Persona-Library semantic mapping Skill
        +
verified template-library slot manifest
        ↓
role-specific resume instance
```

- **Private Candidate Application Context** owns the actual candidate-specific model instance and its source/decision references.
- **Persona-Library** owns this semantic contract, mapping rules, and validation semantics.
- **rickvang/template-library** owns each resume Template's semantic slot manifest and presentation structure.
- **Application instance** owns role-specific selection, emphasis, ordering exceptions, target terminology, and rendered output.

Do not store private candidate instances in Persona-Library or `template-library`.

## Core rule

The model normalizes **meaning**, not layout.

It may represent:

- identity and approved contact channels;
- professional descriptors and evidence-backed profile statements;
- employment relationships and separate employment periods;
- employer-of-record and nested client engagements;
- achievements, responsibilities, metrics, tools, methods, and role-scoped skills;
- global skill categories;
- education and certifications;
- projects and portfolio items.

It must not encode:

- font, color, spacing, page count, columns, or visual hierarchy;
- a Template's section names or slot IDs;
- target-employer keywords merely for matching;
- role-specific selection or emphasis as canonical candidate truth;
- unsupported facts or generated claims detached from evidence.

## Traceability

Every material object may carry:

- `evidence_refs` — identifiers or private references to candidate evidence supporting the node;
- `decision_refs` — identifiers or private references to standing decisions affecting representation;
- `status` — `confirmed`, `supported`, `conflicted`, or `unknown`;
- `notes` — private implementation notes when needed.

A normalized value does not become factual evidence by existing in this model. If a normalized node conflicts with current evidence or a standing decision, the node is repaired or blocked; it does not override the source.

## Model shape

The canonical JSON Schema is authoritative for field names and structural validation. The conceptual shape is:

```text
schema_version
candidate_ref
revision
identity
  name
  location
  contact
profile
  descriptors[]
  summary_statements[]
skills
  categories[]
experience[]
  employer
  periods[]
    title
    dates
    location
    achievements[]
    skills[]
    engagements[]
      client
      title
      dates
      location
      achievements[]
      skills[]
education[]
certifications[]
projects[]
portfolio_items[]
```

### Identity

Identity contains approved candidate-facing values such as display name, location, and contact channels. Contact values remain private until the candidate authorizes their use in an artifact.

### Profile

`profile.descriptors[]` contains supported professional descriptors that may be selected for a role-specific header. `profile.summary_statements[]` contains evidence-backed statements that may be composed into a summary.

The model does not require a final prewritten summary because summary selection and synthesis are role-specific application decisions.

### Skills

Global skills are grouped into semantic categories when useful. A Template may flatten, relabel, or omit category presentation, but it may not add unsupported skills.

Role- or engagement-specific skills may also live under the owning experience node so a Template can render them inline without pretending every skill applies uniformly across the career.

### Experience

`experience[]` represents an employment relationship. Keep the employer-of-record at this level.

`periods[]` preserves separate periods or roles under that employer when the evidence or candidate standing decisions require separation.

`engagements[]` represents nested client/project engagements under an employment period. A client engagement does not replace the employer-of-record.

This structure intentionally supports consulting, agency, contracting, and repeated-employer histories without forcing every candidate into that pattern.

### Achievements

Achievements are candidate-bound semantic claims or approved wording units attached to the employment period or engagement they belong to. They should preserve contribution, scope, method, metric, and outcome meaning where those are supported.

Role-specific resume work may select or reorder achievements, but the canonical model should not silently rewrite their factual meaning.

### Education, certifications, projects, and portfolio items

These remain separate semantic collections. A Template may combine education and certifications visually or omit optional project/portfolio sections with a recorded reason.

## Role-specific selection is not canonical candidate data

The application instance may record:

- which descriptors or summary statements were selected;
- which skills were emphasized;
- which achievements were selected or omitted;
- role terminology used in generated prose;
- intentional ordering or section changes;
- the requirement-to-evidence mapping for the target role.

Do not write those choices back into the canonical candidate model as though they were universal defaults unless the candidate explicitly adopts a new standing decision.

## Change rules

### Candidate source changes

When candidate evidence or a standing decision changes, reconcile the affected normalized nodes before using them in a new resume.

### Model contract changes

A field rename, semantic redefinition, required-field change, or nesting change is a Resume Content Model contract change. Increment `schema_version` and reconcile:

- the semantic mapping Skill;
- Candidate Application Context guidance;
- resume Template slot manifests;
- application Work Order fields or validation that depend on the changed semantics.

### Template changes

A Template may change its `slot-map.json` without changing this model when the underlying candidate semantics are unchanged.

## Validation minimum

Before mapping a candidate model into a Template:

1. validate the instance against the current schema when tooling is available;
2. confirm the model belongs to the active candidate context;
3. confirm material nodes remain traceable to current evidence/decisions;
4. block conflicted or unknown material nodes that would affect the artifact;
5. preserve employer/client hierarchy and separate employment periods where required;
6. keep role-specific selection outside the canonical model.

See [`resume-template-mapping.md`](resume-template-mapping.md) for the mapping contract.
