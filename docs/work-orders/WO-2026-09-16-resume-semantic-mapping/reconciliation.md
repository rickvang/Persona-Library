# Reconciliation — Resume Semantic Mapping

## Change summary

The implementation adds a presentation-neutral Resume Content Model contract and a callable semantic resume-Template mapping Skill in Persona-Library, plus coordinated external changes for Template slot metadata and Candidate Application Context guidance.

External implementation under review:

- `rickvang/template-library` PR #5 — Classic Single-Column Resume `slot-map.json` and repository slot-manifest contract; head at PR creation: `39a89b7ebf2d73dd11ca7a724907d9a255447a1e`.
- `rickvang/operating-packs` PR #4 — private normalized resume-content projection and validation guidance; head at PR creation: `6a69ff3fd0ef446aec3922fd7545d08ddeb0dad8`.

Neither external PR is treated as merged/canonical on `main` until its current merge state is verified.

## Impact review

| Surface | Impact | Reconciliation |
| --- | --- | --- |
| Candidate Application Context | extends | Adds an optional private normalized resume-content projection. Evidence remains authoritative; candidate-specific values remain private. |
| Evidence ledger / candidate source evidence | confirms | Remains the factual source of truth. The normalized model is an evidence-traceable projection and cannot create or override facts. |
| Candidate standing decisions | confirms | Continue to govern candidate-specific chronology, attribution, naming, omissions, and other recurring choices. Material normalized nodes may reference decisions but do not replace them. |
| Application instance / Work Order | extends | Role-specific selection/emphasis remains application state. Material mapping outcomes now distinguish mapped, blocked, unmapped, and omitted-with-reason content. The existing application Work Order already contains a candidate-to-Template mapping table and Template-source gate; the Candidate Context contract now defines the additional Resume Content Model/slot-manifest fields required when semantic mapping is used. |
| `application-editor` / Leah Okafor | extends without duplicating profile data | Existing capabilities already own requirement-to-evidence mapping, information architecture/document hierarchy, ATS-aware formatting, persuasive writing, and integrity. The new callable Skill packages the cross-Template semantic mapping procedure rather than rewriting those existing Persona-applied profiles. |
| `document-designer` / Sofia Calder | confirms | Continues to own document structure, accessibility, production, and output fidelity after semantic mapping. The new Skill does not claim rendering or export quality. |
| Classic Single-Column Resume Template | extends externally | PR #5 adds Template-owned semantic slot metadata while preserving the `starter/` copy boundary and existing visual/structural purpose. |
| Other resume Templates | qualifies future use | They may add their own slot manifests if/when real Templates exist. No empty taxonomy or speculative manifests are created. |
| Cover-letter and application-notes Templates | unrelated | They do not consume the Resume Content Model and remain unchanged. |
| Template lifecycle / Template Librarian | confirms | Repeated `unmapped` content is evidence for Template research, not permission for automatic Template mutation or promotion. |
| Evidence-led Job Search Playbook | confirms | Existing stages, owners, gates, and submission boundaries remain unchanged; semantic mapping is a bounded application-composition capability. |
| Candidate isolation | strengthens | Private normalized resume content is explicitly candidate-bound and included in cross-candidate isolation checks. |
| ATS / parser validation | confirms | Semantic mapping does not prove ATS compatibility. Existing final-artifact ATS checks remain required. |
| Accessibility / export validation | confirms | Semantic mapping does not prove accessible or faithful output. Existing document/output checks remain required. |
| Generated `dist/` | unchanged by hand | No generated files are hand-edited. Source/build surfaces should only change if repository validation/build tooling produces a derived update. |
| Decisions | no new durable architecture decision required | This implementation applies existing ownership boundaries: Skill = reusable judgment, Template = starting artifact/slot metadata, Candidate Context = private person-specific input, Work Order/application instance = active role-specific state. If later evidence requires a generator/runtime or a broader candidate-profile schema, that would warrant a separate decision. |

## Placement conclusion

The new capability is not a new repository, Persona, Playbook, Operating Pack, or runtime. It is:

1. a reusable semantic Doc/schema contract in Persona-Library;
2. one callable Persona-applied mapping Skill;
3. optional Template-owned semantic slot metadata;
4. an extension of the existing private Candidate Application Context.

This is the smallest durable architecture that lets multiple people and multiple resume Templates share well-defined content without sharing private candidate data.

## Remaining review gates

Before this Work Order can be marked complete:

- inspect current PR diffs for all three repositories;
- verify external PR mergeability/check state and review threads;
- validate JSON syntax for the Resume Content Model schema and Template slot manifest through available repository checks or direct parse inspection;
- record any reviewer findings and revise before merge;
- do not create a real candidate Resume Content Model instance until the reusable contracts are accepted and the active candidate private context is explicitly selected.
