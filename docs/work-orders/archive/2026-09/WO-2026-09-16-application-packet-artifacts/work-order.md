# Application packet artifact separation Work Order

## Header

- Work Order ID: WO-2026-09-16-application-packet-artifacts
- Title: Separate, folder, source, and candidate-bind application-packet artifacts
- Status: complete
- Created: 2026-09-16
- Last updated: 2026-09-16
- Requester: repository owner
- Current owner: job-search process update
- Request mode: update
- Primary space: Docs
- Secondary spaces: Templates, Operating Packs
- Issue: #120 — closed as completed
- Implementation PR: #121 — merged as `a5c2f4cd215e6ef03804aeeb7bb02bead5f78963`
- Follow-up reconciliation: #124
- Artifact home: `docs/work-orders/archive/2026-09/WO-2026-09-16-application-packet-artifacts/`
- Explicit authorization and target: update the Persona-Library application-packet process so full packets use separate artifacts in one role-specific private folder, every reusable starter resolves through `rickvang/template-library`, and candidate-specific facts/decisions/preferences are loaded through one isolated Candidate Application Context boundary
- Completion boundary: #120 is implemented and merged; external Template and Operating Pack dependencies are merged and verified; final-state catalog/doc reconciliation is tracked in #124

## Outcome

A full application packet is a role-specific foldered set of separate artifacts rather than one combined document. The default full packet contains:

1. ATS resume
2. standalone cover letter
3. Application Notes & Answers

Reusable starters resolve through `rickvang/template-library`. Candidate-specific facts, evidence, decisions, voice/preferences, Template preferences, and validation overlays are loaded through exactly one private Candidate Application Context. Private candidate values and workspace identifiers remain outside reusable repositories.

## Placement and source ownership

Mara placement review kept each concern in its existing system boundary:

- `docs/job-search/application-work-order-template.md` owns packet output, storage, Template-source, and review requirements.
- `docs/job-search/candidate-context-contract.md` and `candidate-context-integration.md` own Persona-Library integration with private candidate context.
- `rickvang/operating-packs/packs/candidate-application-context` owns reusable candidate-context operating rules. It is merged and verified at `c216052321c683830333bda4c1928bb98e12b3f7` with `AGENTS.md` as the stable entrypoint.
- `rickvang/template-library` owns reusable starter files. The cover-letter and Application Notes & Answers Templates are merged and verified at `362710ea7a4b26f1f8f5669acba0f12483af5b41`.
- Persona-Library catalogs identity, provenance, applicability, and relationships; it does not duplicate external starter files or private candidate values.
- No new Persona, Skill, Playbook, candidate registry, application tracker, or runtime was warranted.

## Final contract

- Full packet = one role-specific private folder plus separate ATS resume, cover letter, and notes/answers artifacts by default.
- Default folder name: `<Company> — <Role> — <YYYY-MM-DD>`.
- Standalone cover letter is default for a full packet; an explicit employer/requester reason is required to skip it.
- Every reusable artifact must resolve through the Persona-Library Template catalog and a verified `rickvang/template-library` path, entrypoint, starter boundary, and revision.
- Missing/unverifiable reusable starters route to Template research/composition rather than silently promoting a private master.
- Candidate-specific application work binds exactly one active private Candidate Application Context before composition.
- Source precedence follows the Candidate Application Context Operating Pack: current task and mandatory role/application requirements → verified source correction → current candidate instruction within those bounds → active standing decision → Operating Pack/domain guidance → generic best practice/Template defaults.
- Validation follows the Operating Pack order: Template structure → reusable composition/integrity → candidate-specific overlays → role/application requirements → cross-candidate isolation.
- Candidate overlays may tighten constraints but cannot create evidence or weaken factual/integrity rules; mandatory role/application requirements govern the deliverable when they conflict with a candidate preference or overlay.
- External submission remains separately authorized.

## Completion evidence

| Phase | Status | Evidence / result |
| --- | --- | --- |
| Inspect current application process | complete | Combined-document and private-master bypass risks were identified and corrected. |
| Resolve reusable Template sources | complete | Classic resume already existed; cover-letter and notes Templates merged in `template-library` PR #3 at `362710ea7a4b26f1f8f5669acba0f12483af5b41`. |
| Define candidate boundary | complete | Candidate Context contract and integration docs bind one private candidate context without creating a registry or public candidate record. |
| Publish reusable context rules | complete | Candidate Application Context Operating Pack merged in `operating-packs` PR #2 at `c216052321c683830333bda4c1928bb98e12b3f7`. |
| Update application packet contract | complete | Foldering, separate artifacts, Template-source gate, Candidate Context gate, validation layering, and isolation checks are documented. |
| Update application route | complete | `resume-application-work` requires candidate context, application contract, and Template-source verification and rejects combined-document/private-master/cross-candidate bypasses. |
| Merge implementation | complete | Persona-Library PR #121 merged and issue #120 closed as completed. |
| Final-state reconciliation | complete for #121 historical record | #124 corrects catalog identities and duplicated precedence/validation wording against the merged dependencies. |

## Evidence and limitations

Sourced evidence includes Persona-Library PR #121/issue #120, the merged `template-library` Template entrypoints and starter files, and the merged Candidate Application Context Operating Pack. No private candidate content or private workspace identifier is stored here.

Repository-generated catalog mirrors are a separate build/validation concern for the #124 reconciliation patch. Their status is recorded in the archived `validation.md`; this historical Work Order does not claim an unrun build or test as passed.

## Completion boundary

Issue #120 is complete and PR #121 is merged. The stale pre-merge dependency language that remained in this Work Order is superseded by the verified merged revisions above. Any further changes to the resume semantic content model or Template slot mapping belong to the separate #122/#123 work and are outside this Work Order.
