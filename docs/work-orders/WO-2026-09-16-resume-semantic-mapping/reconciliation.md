# Reconciliation — Resume Semantic Mapping

## Change summary

The implementation adds a presentation-neutral Resume Content Model contract and a callable semantic resume-Template mapping Skill in Persona-Library, coordinated with external Template slot metadata and Candidate Application Context guidance. This reconciliation also closes two gaps in the earlier #123 draft: the reusable application Work Order now records semantic-model/slot-manifest state, and Leah Okafor is explicitly recorded as the primary Persona application with focused quality guidance.

External implementation under review:

- `rickvang/template-library` PR #5 — Classic Single-Column Resume `slot-map.json` and repository slot-manifest contract; reviewed head `39a89b7ebf2d73dd11ca7a724907d9a255447a1e`.
- `rickvang/operating-packs` PR #4 — private normalized resume-content projection and validation guidance; reviewed head `6a69ff3fd0ef446aec3922fd7545d08ddeb0dad8`.

Neither external PR is treated as merged/canonical on `main` until its current merge state is separately verified.

## Impact review

| Surface | Impact | Reconciliation |
| --- | --- | --- |
| Candidate Application Context | extends | Adds an optional private normalized resume-content projection. Evidence remains authoritative; candidate-specific values remain private. Existing precedence and validation-layer ordering from the merged Candidate Application Context contract are preserved. |
| Evidence ledger / candidate source evidence | confirms | Remains the factual source of truth. The normalized model is an evidence-traceable projection and cannot create or override facts. |
| Candidate standing decisions | confirms | Continue to govern candidate-specific chronology, attribution, naming, omissions, and other recurring choices. Material normalized nodes may reference decisions but do not replace them. |
| Application Work Order template | extends | Now records Resume Content Model reference/revision/schema, Template `slot-map.json` path/revision, material `unmapped` / `blocked` / `omitted_with_reason` content, semantic-mapping validation result, and downstream validation separately. |
| `application-editor` / Leah Okafor | extends | The callable `resume-template-semantic-mapping` Skill explicitly names Leah as its primary Persona application and adds focused semantic-fit, evidence-fidelity, structural-fidelity, loss-visibility, role-instance-isolation, candidate-isolation, and validation-boundary checks. Her existing requirement mapping, hierarchy, writing, ATS, voice, and integrity responsibilities remain intact. |
| `job-search-orchestrator` / Priya Desai | confirms | Continues to own end-to-end application/search coordination. The mapping Skill does not take over Playbook orchestration or permission decisions. |
| `document-designer` / Sofia Calder | confirms | Continues to own document structure, accessibility, production, and output fidelity after semantic mapping. The new Skill does not claim rendering or export quality. |
| Classic Single-Column Resume Template | extends externally | PR #5 adds Template-owned semantic slot metadata while preserving the `starter/` copy boundary and existing visual/structural purpose. |
| Other resume Templates | qualifies future use | They may add their own slot manifests if/when real Templates exist. No empty taxonomy or speculative manifests are created. |
| Cover-letter and application-notes Templates | unrelated | They do not consume the Resume Content Model and remain unchanged. |
| Template lifecycle / Template Librarian | confirms | Repeated `unmapped` content is evidence for Template research, not permission for automatic Template mutation or promotion. |
| Evidence-led Job Search Playbook | confirms | Existing stages, owners, gates, and submission boundaries remain unchanged; semantic mapping is a bounded application-composition capability. |
| Candidate isolation | strengthens | Private normalized resume content is explicitly candidate-bound and included in cross-candidate isolation checks. |
| ATS / parser validation | confirms | Semantic mapping does not prove ATS compatibility. Existing final-artifact ATS checks remain required. |
| Accessibility / export validation | confirms | Semantic mapping does not prove accessible or faithful output. Existing document/output checks remain required. |
| Generated `dist/` | build-derived only | No generated files are hand-edited. Current repository deployment/build configuration remains responsible for derived Site data. |
| Decisions | no new durable architecture decision required | This applies existing ownership boundaries: Skill = reusable judgment, Template = starting artifact/slot metadata, Candidate Context = private person-specific input, Work Order/application instance = active role-specific state. A future generator/runtime or broader candidate-profile schema would require separate architecture review. |

## Placement conclusion

The capability is not a new repository, Persona, Playbook, Operating Pack, or runtime. It is:

1. a reusable semantic Doc/schema contract in Persona-Library;
2. one callable Persona-applied mapping Skill, explicitly applied by Leah Okafor;
3. optional Template-owned semantic slot metadata;
4. an extension of the existing private Candidate Application Context; and
5. explicit semantic-mapping state in the existing application Work Order template.

This is the smallest durable architecture that lets multiple people and multiple resume Templates share well-defined content without sharing private candidate data.

## Remaining review gates

Before issue #122 can truthfully be closed:

- refresh PR #123 mergeability and current checks after reconciling its branch with current `main`;
- review the actual post-reconciliation diff for unintended loss of later merged application-packet changes;
- keep external PR #5 and #4 qualified as external dependencies until they are separately merged and their final revisions are verified;
- do not create a real candidate Resume Content Model instance until the reusable contracts are accepted and the active candidate private context is explicitly selected;
- do not merge PR #123 or close #122 without separate authorization.
