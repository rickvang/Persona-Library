# Resume Template semantic mapping

## Purpose

Define how a private candidate-bound Resume Content Model instance is mapped into a verified resume Template without losing material content, flattening candidate-specific structure, or changing factual meaning.

This contract is operated by the reusable `resume-template-semantic-mapping` Skill. Template-specific destinations remain owned by the Template's `slot-map.json` in `rickvang/template-library`.

## Inputs

A mapping run requires:

1. one active private Candidate Application Context;
2. one Resume Content Model instance conforming to the expected model version;
3. one verified resume Template with path, entrypoint, Git revision, and semantic slot manifest;
4. the target role/application requirements when the mapping is role-specific;
5. applicable candidate standing decisions and validation overlays.

If candidate identity, model version, Template source, or slot manifest cannot be resolved, block only the affected mapping work rather than guessing.

## Mapping boundary

```text
candidate evidence + decisions
        ↓
normalized Resume Content Model
        ↓
role-specific selection / emphasis
        ↓
Template semantic slot manifest
        ↓
instantiated resume
        ↓
validation
```

The mapper may:

- select supported semantic nodes relevant to the target role;
- group or flatten content where the Template explicitly permits it;
- compose supported profile statements into a concise summary;
- order selected achievements within the owning role or engagement;
- omit optional material with an explicit reason;
- flag a recurring semantic mismatch as a potential Template improvement.

The mapper may not:

- invent candidate facts, titles, employers, dates, metrics, tools, responsibilities, or outcomes;
- replace the employer-of-record with a client engagement;
- merge separate employment periods when candidate evidence/decisions require separation;
- silently drop material content because a Template lacks a destination;
- promote role-specific emphasis into canonical candidate data;
- rewrite a candidate-specific exception into a reusable Template rule;
- treat a slot manifest as permission to bypass ATS, accessibility, integrity, or role/channel validation.

## Mapping result states

Every material semantic source considered for the artifact should end in one of these states:

- `mapped` — placed in a legitimate Template slot with meaning preserved;
- `omitted_with_reason` — deliberately excluded from this application and the reason is recorded;
- `blocked` — source, decision, conflict, or required destination must be resolved before use;
- `unmapped` — the semantic content is valid but the Template has no legitimate destination yet;
- `not_applicable` — the semantic source does not apply to this candidate or artifact.

Do not use `mapped` when a node was merely copied somewhere convenient without satisfying the slot's semantic purpose.

## Mapping procedure

### 1. Verify candidate and content-model state

- Confirm the Resume Content Model belongs to the active candidate.
- Confirm expected `schema_version`.
- Inspect conflicted/unknown nodes that could affect the output.
- Confirm material nodes remain traceable to current evidence and applicable standing decisions.

### 2. Verify Template state

- Resolve the Template through the Persona-Library catalog/source contract.
- Verify `rickvang/template-library` path, `README.md`, `starter/`, `slot-map.json`, and Git revision.
- Confirm the slot manifest targets a compatible Resume Content Model version.

### 3. Establish role-specific selection

Use the role requirement-to-evidence map to select only supported content whose inclusion improves the target artifact. Selection and emphasis belong to the application instance; do not mutate the canonical candidate model merely because a role needs a different subset.

### 4. Map semantic nodes to slots

For each material source node:

- identify the Template slot by semantic purpose;
- preserve the node's owning employment, period, engagement, or section context;
- apply only the grouping/flattening behavior the Template documents;
- record any material transformation that could affect interpretation;
- mark the mapping result state.

### 5. Detect semantic loss

Before rendering, inspect for:

- employer/client flattening;
- merged or lost employment periods;
- dates or locations detached from the owning role;
- achievements moved to the wrong employer/client;
- metrics or scope changed during compression;
- skills promoted beyond their supported context;
- education/certification conflation that changes meaning;
- valid candidate content with no Template destination;
- another candidate's content or decisions.

A Template limitation is not permission to discard material candidate meaning.

### 6. Compose the instantiated artifact

Copy/adapt the Template starter into the private role-specific application folder and fill it from the mapping. Prose synthesis may improve clarity and concision, but material factual claims must remain traceable to selected semantic nodes and evidence.

### 7. Validate after mapping

Run the existing layered validation:

1. candidate context / model conformance;
2. Template structure and slot-manifest conformance;
3. reusable composition and evidence integrity;
4. role/channel requirements;
5. candidate-specific validation overlays;
6. cross-candidate isolation;
7. ATS/document/accessibility/export checks applicable to the actual rendered artifact.

## Material mapping record

Use the application Work Order or private application notes for inspectable material mappings:

| Mapping ID | Resume Content Model node | Template slot | Role requirement | Result | Reason / validation |
| --- | --- | --- | --- | --- | --- |
| MAP-001 | `experience[...].periods[...].achievements[...]` | `experience.achievement` | R-001 | mapped | evidence/integrity pass |
| MAP-002 | `portfolio_items[...]` | `portfolio.selected-work` | R-004 | omitted_with_reason | target channel does not warrant section |

Do not create exhaustive bookkeeping for every word. Record mappings where a wrong destination, omission, transformation, or candidate-specific rule could materially change the artifact.

## Template evolution signal

When valid semantic content repeatedly becomes `unmapped` across more than one candidate/application context, treat that as evidence for Template research—not automatic Template mutation.

Possible outcomes:

- adapt the application instance;
- revise the existing Template if the need fits its purpose;
- create a materially different resume Template;
- keep the content unsupported by that Template and choose another Template.

## No generator requirement

This contract does not require a rendering engine, schema registry, synchronization service, or executable mapping DSL. A person or agent can apply the semantic contract directly. Future automation may consume the same files without changing their ownership boundaries.
