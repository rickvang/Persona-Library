# Resume Semantic Mapping Work Order

## Header

- Work Order ID: `WO-2026-09-16-resume-semantic-mapping`
- Status: active
- Created: 2026-09-16
- Last updated: 2026-09-16
- Requester: repository user
- Current owner: ChatGPT
- Request mode: update
- GitHub issue: [#122 — Add presentation-neutral resume content model and semantic Template mapping Skill](https://github.com/rickvang/Persona-Library/issues/122)
- Persona-Library PR: [#123](https://github.com/rickvang/Persona-Library/pull/123)
- External Template issue: [rickvang/template-library#4](https://github.com/rickvang/template-library/issues/4)
- External Template PR: [rickvang/template-library#5](https://github.com/rickvang/template-library/pull/5), reviewed head `39a89b7ebf2d73dd11ca7a724907d9a255447a1e`
- External Operating Pack issue: [rickvang/operating-packs#3](https://github.com/rickvang/operating-packs/issues/3)
- External Operating Pack PR: [rickvang/operating-packs#4](https://github.com/rickvang/operating-packs/pull/4), reviewed head `6a69ff3fd0ef446aec3922fd7545d08ddeb0dad8`
- Explicit authorization: implement issue #122 on its existing branch/PR; no merge, external-PR merge, or issue closure authorization is implied
- Stopping condition: leave PR #123 reviewable against current `main`, with #122 acceptance scope represented and current checks truthfully reported

## Outcome

Create a reusable, presentation-neutral resume semantic layer so one candidate's approved content can be mapped into multiple verified resume Templates without rewriting the candidate's factual history or embedding candidate data in reusable repositories.

## Architecture contract

```text
candidate evidence + standing decisions
        ↓
private normalized Resume Content Model instance
        ↓
resume-template-semantic-mapping Skill
        +
verified resume Template slot-map.json
        ↓
role-specific selection + composition
        ↓
rendered resume + layered validation
```

## Placement

See [`ia.md`](ia.md).

The implementation preserves these owners:

- Persona-Library: semantic model contract, mapping Skill, reusable validation semantics, and application Work Order fields;
- template-library: Template-specific semantic slots and starter structure;
- private Candidate Application Context: candidate-specific normalized model instance and provenance references;
- private application instance: target-role selection/emphasis and rendered artifact;
- evidence sources: factual authority for material claims.

## Scope

### Persona-Library

- [x] Add `docs/job-search/resume-content-model.md`.
- [x] Add `docs/job-search/resume-content-model.schema.json`.
- [x] Add `docs/job-search/resume-template-mapping.md`.
- [x] Add `.agents/skills/resume-template-semantic-mapping/SKILL.md`.
- [x] Make Leah Okafor / `application-editor` the explicit primary Persona application for the mapping Skill and add focused semantic-mapping quality guidance.
- [x] Extend `docs/job-search/candidate-context-contract.md` for private normalized resume content, slot manifests, material loss states, and Work Order binding.
- [x] Extend `docs/job-search/candidate-context-integration.md` so the normalized-content route and Leah application are discoverable while preserving existing specialist ownership.
- [x] Update `docs/job-search/application-work-order-template.md` to record Resume Content Model revision/schema, Template slot-map path/revision, material `unmapped` / `blocked` / `omitted_with_reason` content, and semantic-mapping validation result.
- [x] Preserve the finalized Candidate Application Context precedence and validation layering while adding semantic-model checks inside those existing layers.
- [x] Run bounded change-impact reconciliation in [`reconciliation.md`](reconciliation.md).
- [ ] Re-check PR #123 mergeability and current CI after the branch is reconciled with current `main`.

### `rickvang/template-library`

- [x] Issue #4 and PR #5 exist for the Classic Single-Column Resume `slot-map.json` and optional Template slot-manifest architecture.
- [ ] PR #5 remains external review work; do not treat it as canonical on `main` until it is separately merged and re-verified.

### `rickvang/operating-packs`

- [x] Issue #3 and PR #4 exist for optional private normalized resume content in the Candidate Application Context Operating Pack.
- [ ] PR #4 remains external review work; do not treat it as canonical on `main` until it is separately merged and re-verified.

## Boundary corrections from the earlier #123 draft

The earlier branch implementation covered the core model/mapping architecture but missed two explicit #122 acceptance items. This update corrects them:

1. the reusable application Work Order now carries the semantic-model and slot-manifest revision/loss/validation fields; and
2. the callable Skill now explicitly records Leah Okafor / `application-editor` as its primary Persona application with focused mapping-quality checks.

The branch also predates later merged application-packet reconciliation work. This update preserves the current Candidate Application Context precedence and validation order rather than overwriting it with the older branch wording.

## Non-goals

- No candidate registry.
- No public candidate content.
- No generator/runtime or synchronization service.
- No executable mapping DSL.
- No new Persona or Playbook.
- No submission or employer-contact capability.
- No merge or issue closure without separate authorization.

## Success criteria

- The normalized model is presentation-neutral and candidate-neutral at the contract level.
- Private candidate instances remain outside reusable repositories.
- Material normalized nodes can retain evidence and standing-decision references.
- Employer-of-record, repeated employment periods, and nested client engagements can be represented without flattening.
- A resume Template can describe semantic destinations without owning the mapping algorithm.
- Leah Okafor has an explicit Persona-applied semantic-mapping procedure and focused quality checks without transferring other specialist ownership.
- The application Work Order records model/slot-map revisions, explicit material loss states, and semantic-mapping validation.
- The mapping Skill reports `mapped`, `omitted_with_reason`, `blocked`, `unmapped`, or `not_applicable` for material content rather than silently dropping it.
- Role-specific selection/emphasis remains application-instance state.
- Existing evidence-integrity, ATS, document/accessibility, candidate-isolation, and submission-authorization boundaries remain intact.

## Current state

The reusable architecture and the missing #122 acceptance items are implemented on the existing PR #123 branch. Current remote mergeability/check state must be re-read after the branch reconciliation commit; this Work Order deliberately does not pre-claim that result.
