# Job-search Application Packet Work Order

This Work Order extends the repository-wide [Work Order convention](../work-orders.md) for a job-search application packet. It tracks active work and decisions; it is not a transcript, a job-submission authorization, or a substitute for the candidate's source evidence.

A full application packet is a role-specific foldered artifact set, not one combined document. Keep the resume, cover letter, and application notes/answers as separate files in the authorized private application workspace.

Reusable starting artifacts come from `rickvang/template-library`. Persona-Library catalogs Template identity and applicability; `template-library` owns the canonical starter files. Do not silently treat a private Drive master or prior role-specific artifact as the reusable Template source. Separately, when the active Candidate Context designates a private master as the **Candidate Baseline Resume**, that baseline remains the candidate-specific composition starting point for the protected career spine; reusable Template ownership does not erase that candidate decision.

Person-specific facts, standing decisions, voice preferences, evidence sources, Template preferences, optional normalized Resume Content Model instances, and candidate-specific validation overlays come from one private Candidate Context governed by the [Candidate Context contract](candidate-context-contract.md). Bind exactly one Candidate Context before candidate evidence is used so multiple people can use the same process and Templates without inheriting one another's private context.

## Header

- Work Order ID:
- Title:
- Status: draft / active / blocked / ready-for-review / complete / no-go
- Created:
- Last updated:
- Requester:
- Current owner:
- Operating Persona:
- Playbook / process surface:
- Current Playbook stage:
- Current stage owner:
- Supporting Persona(s):
- Opportunity state:
- Work/process state:
- Artifact state:
- Current gate:
- Next valid action:
- Request mode:
- Proportionality tier:
- Explicit authorization and target:
- Stopping condition:
- Private application root:
- Role-specific application folder:
- Candidate Context reference or private location name:
- Candidate Context status: not checked / located / read / missing / stale / conflicted / not applicable
- Candidate Context revision or last-reviewed date:
- Candidate Baseline Resume status: not designated / located / read / stale / conflicted / blocked
- Candidate Baseline Resume reference/revision:
- Baseline-to-output integrity result: not applicable / pass / revise / blocked / unknown
- Resume Content Model status: not used / located / validated / stale / conflicted / blocked
- Resume Content Model schema version and revision:
- Template-source status: verified / missing / stale / conflicted / not applicable
- Resume Template slot-manifest status: not applicable / verified / missing / stale / conflicted

A Work Order records authorization constraints but never grants permission to submit an application, contact an employer, publish a document, or send an external message.

## 1. Target and source of truth

### Candidate Context gate

Resolve exactly one private Candidate Context before role alignment or drafting. Use the [Candidate Context contract](candidate-context-contract.md) to keep reusable system behavior separate from person-specific facts and preferences.

Record only the references and statuses needed to operate the Work Order; keep the private contents in the authorized candidate workspace.

- Candidate reference or display label:
- Private context source or location name:
- Discovery status: not checked / located / read / missing / stale / conflicted / not applicable
- Context revision or last reviewed:
- Candidate identity/contact source located? yes / no / not applicable
- Goals and constraints source located? yes / no / not applicable
- Evidence sources located? yes / no / partial
- Candidate Baseline Resume designated? yes / no / not applicable
- Candidate Baseline Resume located and read? yes / no / blocked / not applicable
- Candidate Baseline Resume reference / revision:
- Normalized Resume Content Model located? yes / no / not applicable
- Resume Content Model reference / revision / schema version:
- Standing decisions located? yes / no / not applicable
- Voice/writing preferences located? yes / no / not applicable
- Candidate-specific Template preferences located? yes / no / not applicable
- Candidate-specific validation overlays located? yes / no / not applicable
- Unresolved context conflicts or candidate questions:
- Candidate Context updated during this Work Order? yes / no

If the candidate boundary is missing or ambiguous, stop the affected composition step rather than borrowing context from a prior application or another candidate. A normalized Resume Content Model is a presentation-neutral projection for composition; it is not a replacement evidence ledger and cannot create or override facts.

### Target role

- Employer:
- Role title:
- Role URL or source:
- Research date:
- Role family and level:
- Geography and work mode:
- Timing and constraints:
- Primary target:
- Acceptable adjacent targets:

### Evidence source

Use one shared evidence inventory or claim ledger for every output.

| Evidence ID | Source passage or artifact | Action and attribution | Scope, method, outcome, or metric | Target relevance | Status | Approved wording or question |
| --- | --- | --- | --- | --- | --- | --- |
| E-001 |  |  |  |  | sourced / observed / assumption / unknown |  |

Keep candidate facts, researched claims, interpretations, generated writing, and unresolved questions distinct. Do not invent a metric, tool, responsibility, title, date, employer, or outcome.

### Candidate-specific standing decisions

Read the standing-decision portion of the active Candidate Context before role alignment or drafting when one exists.

- Private record name or location (do not copy private contents into this repository):
- Discovery status: not checked / located / read / missing / stale / conflicted / not applicable
- Scope used for this Work Order:
- Last reviewed:
- Evidence or source basis:
- Candidate decisions applied:
- Conflicts or superseded decisions:
- Candidate review required before drafting? yes / no
- Candidate record updated during this Work Order? yes / no

| Decision ID | Candidate-confirmed decision | Evidence or source | Date | Status | Applies to |
| --- | --- | --- | --- | --- | --- |
| DEC-001 |  |  |  | active / superseded / disputed / unknown |  |

A standing decision guides repeatable candidate-specific structure and attribution. It does not create evidence, upgrade a claim, resolve a conflict silently, or authorize upload, submission, employer contact, or external sharing.

### Candidate Baseline Resume gate

If the standing-decision record designates an active master/baseline resume, resolve that exact private artifact before role alignment or drafting.

- Baseline designated by:
- Baseline private reference / title:
- Baseline source system:
- Baseline revision / modified date:
- Resolution status: located / read / stale / conflicted / blocked / not applicable
- Protected career spine captured: identity/contact · employers/titles · periods/dates/locations · employer/client hierarchy · recent-employer presence · education · certifications · candidate-confirmed historical grouping
- Candidate-specific presentation carried forward:
- Known baseline/source conflicts:
- Allowed tailoring surfaces:
- Protected-field changes requiring evidence/decision:
- Material baseline omissions and reasons:
- Baseline-to-output integrity result: pass / revise / blocked / unknown / not applicable

Do not substitute a secondary profile store, older resume, portfolio summary, or application-history record for an unresolved designated baseline. If the baseline cannot be resolved, block the affected resume composition step.

Apply the Candidate Application Context Operating Pack precedence when sources disagree, unless a stricter consuming-project rule applies:

1. current task and mandatory role/application requirements;
2. verified correction to candidate source evidence;
3. current explicit candidate instruction within those task/channel bounds;
4. active candidate standing decision;
5. Operating Pack or generic job-search/application guidance;
6. Template default or placeholder behavior.

Mandatory employer or submission requirements do not lose to a candidate preference. Evidence still governs material claims; instructions, normalized content, and preferences may change structure or wording but cannot create unsupported facts.

### Requirement map

| Requirement ID | Role requirement or signal | Evidence IDs | Confidence | Gap or follow-up question | Status |
| --- | --- | --- | --- | --- | --- |
| R-001 |  |  | high / medium / low / unknown |  |  |

### Candidate-to-Template semantic mapping

Record material candidate bindings and candidate-specific structural decisions where an incorrect mapping could materially change the application. When a Resume Content Model is used, source references may point to normalized model nodes but must remain traceable to evidence/standing decisions.

| Mapping ID | Candidate evidence / decision / Resume Content Model node | Template / semantic slot | Role requirement | Validation applied | Status |
| --- | --- | --- | --- | --- | --- |
| MAP-001 |  | Template ID + semantic slot | requirement ID / not applicable | generic / candidate overlay / role-channel | mapped / blocked / unmapped / omitted_with_reason / not_applicable |

Do not create exhaustive bookkeeping for trivial prose. Use this record for material claims, standing-decision effects, candidate-specific Template preferences, semantic loss, and validation overlays.

- Material unmapped content and disposition:
- Material blocked content and required resolution:
- Material omitted-with-reason content and disposition:
- Semantic mapping validation result: pass / revise / blocked / not applicable / unknown

## 2. Output contract

Start with one canonical ATS resume. When an active Candidate Baseline Resume is designated, create the role-specific ATS resume by copying/adapting that baseline and tailoring only supported material; otherwise render from the shared evidence ledger or, when used, from a validated evidence-traceable Resume Content Model projection into the verified Template. Add a human-facing resume only when the target channel accepts it and the review context gives it a meaningful advantage. Do not create two near-identical versions by default.

### Template source gate

Before drafting or rendering an application artifact, resolve its reusable starting Template through the Persona-Library Template catalog and verify the external `rickvang/template-library` source path, `README.md` entrypoint, and Git revision.

Template verification and Candidate Baseline verification answer different questions. The reusable Template supplies portable presentation structure; an active Candidate Baseline Resume supplies the candidate-specific composed career spine. Verify both when both apply.

Expected full-packet Template identities and source paths:

| Artifact | Template identity | Canonical source path | Status |
| --- | --- | --- | --- |
| ATS resume | `template-resume-classic-single-column` | `templates/resumes/classic-single-column` | verify before use |
| Cover letter | `template-cover-letter-evidence-led` | `templates/cover-letters/evidence-led` | verify before use |
| Application Notes & Answers | `template-job-application-notes` | `templates/job-applications/application-notes` | verify before use |

For each required Template record:

- verify that the path and entrypoint resolve at the cited revision;
- inspect the documented `starter/` copy boundary;
- for a resume Template that declares semantic mapping, verify `slot-map.json`, record its path and verified Git revision, and confirm its declared Resume Content Model version is compatible;
- for resume artifacts, copy/adapt the starter into the role-specific private application folder only when no Candidate Baseline Resume is designated; when a baseline is designated, begin from that baseline and retain the verified Template as the reusable-structure contract; for non-resume artifacts, copy/adapt the starter normally;
- record the Template ID, source path, Template revision, and applicable slot-manifest revision in this Work Order or the private notes artifact;
- keep candidate facts and project-specific content in the instantiated private artifact, not in the reusable Template.

If a required Template or required slot manifest is missing, unavailable, stale, incompatible, or cannot be verified, do **not** silently substitute a private Google Drive master, previous application, or ad hoc document as the canonical reusable Template. Route to Template research/composition and create or repair the reusable Template in `rickvang/template-library`; treat the affected application artifact as blocked on Template resolution until the canonical source can be verified. A one-off private artifact may be used only when the requester explicitly chooses a non-reusable exception and the Work Order records that exception.

### Validation layering

Keep validation responsibilities separate and use the Candidate Application Context Operating Pack order:

1. **Template structural validation** checks the reusable starter boundary and generic Template structure; when semantic mapping is used, it also verifies the slot manifest and Resume Content Model compatibility.
2. **Persona-Library composition validation** checks evidence integrity, semantic mapping completeness/loss handling, chronology/attribution, ATS structure, role coverage, writing, accessibility, packaging, and other shared application rules.
3. **Candidate-specific validation overlays** come from the active Candidate Context and apply only to that candidate; each overlay must trace to a candidate-confirmed decision or source fact.
4. **Role/channel validation** applies employer- or channel-specific constraints only when current evidence supports them.
5. **Cross-candidate isolation** verifies candidate identity, evidence, decisions, normalized content, and private values did not leak across candidates.

A later layer may add a stricter constraint but must not silently weaken an earlier factual/integrity rule. If a candidate overlay conflicts with a mandatory role/application requirement, the role/application requirement governs the deliverable and the conflict is recorded. Semantic mapping success alone is not proof of ATS, parser, accessibility, visual, or export quality.

- Candidate-specific validation overlays applied:
- Overlay source decision/evidence IDs:
- Overlay result: pass / revise / blocked / not applicable
- Generic composition validation result:
- Role/channel validation result:
- Cross-candidate isolation result:
- Semantic mapping validation result:

### Role-specific application folder

For a full application-packet run, create one role-specific folder in the authorized private application workspace before the packet can be marked ready for review. Use the candidate-configured application root; do not hardcode private Drive IDs, private links, or candidate-specific storage identifiers in Persona-Library.

Default folder name:

`<Company> — <Role> — <YYYY-MM-DD>`

Keep the principal artifacts as separate files by default:

1. `<Company> — <Role> — Resume — ATS`
2. `<Company> — <Role> — Cover Letter`
3. `<Company> — <Role> — Application Notes & Answers`

The notes/answers record is the coordination artifact for role fit, constraints, portfolio planning, application questions, unresolved candidate decisions, and the submission checklist. It may link to the resume and cover letter, but it must not contain the only copy of either submission artifact.

For a **full application-packet request**, create the standalone cover letter by default. Skip it only when the employer does not accept a cover letter or the requester explicitly says not to create one; record the reason. A narrow resume-only or cover-letter-only request does not imply the full three-artifact packet.

Before `ready-for-review`, verify:

- exactly one Candidate Context is bound and its required private sources were loaded or explicitly marked not applicable;
- when standing decisions designate a Candidate Baseline Resume, that exact baseline was located/read and its reference/revision recorded before drafting;
- the final ATS artifact passed baseline-to-output career-spine integrity, or every material difference has an explicit supported disposition;
- when a Resume Content Model is used, its reference, revision, schema version, and compatibility state are recorded;
- every mapped resume Template has a verified `slot-map.json` path/revision when the Template declares semantic mapping;
- material semantic mapping outcomes are traceable and all `unmapped`, `blocked`, or `omitted_with_reason` content has an explicit disposition;
- semantic mapping validation and any candidate-specific validation overlays have passed or have an explicit blocker/disposition;
- every reusable application artifact has a verified `template-library` Template source and recorded revision, or an explicit requester-approved one-off exception;
- the role-specific application folder exists in the configured private workspace;
- each required artifact is independently openable;
- file names identify the company and role without relying on folder context alone;
- the notes/answers record links or points to the separate resume and cover letter rather than embedding the only copy;
- any skipped cover letter has an explicit reason;
- no private workspace identifier is copied into Persona-Library.

| Output ID | Artifact | Primary reader or system | Format and revision | Source ledger revision | Status | Owner | Link |
| --- | --- | --- | --- | --- | --- | --- | --- |
| OUT-ATS | ATS resume version (default) | Employer intake and screening |  |  | draft / reviewed / selected / superseded |  |  |
| OUT-HUMAN | Human-facing resume version (optional) | Human reviewer |  |  | not warranted / draft / reviewed / selected / superseded |  |  |
| OUT-LETTER | Standalone cover letter | Human reviewer and required submission channel |  |  | draft / reviewed / selected / skipped with reason |  |  |
| OUT-NOTES | Application Notes & Answers | Candidate and application operator |  |  | draft / reviewed / ready |  |  |

Both resume versions, when both exist, are renderings of one evidence source rather than independent stories. The human-facing version may improve hierarchy, density, order, voice, and contextual visual communication; neither version may change the meaning of a material claim.

If the human-facing version is not warranted, record that decision and use ATS-to-ledger integrity review. Do not create an empty ATS-versus-human parity exercise.

Do not submit both resume versions unless the employer or requester explicitly asks for both.

For the ATS version, target employer, role, location, and work-mode context remain Work Order metadata. Do not add a `Target:` line to the resume body by default; record `no` unless the requester explicitly requests it or the submission format requires it.

## 3. Version-specific requirements

### ATS resume version (default)

- Template ID, source path, and verified revision:
- Candidate Context revision used:
- Candidate Baseline Resume reference / revision used, or not applicable:
- Baseline-to-output integrity result:
- Protected-field differences and evidence/decision basis:
- Material baseline omissions marked `omitted_with_reason`:
- Resume Content Model reference / revision / schema version used, or not applicable:
- Template `slot-map.json` path and verified revision, or not applicable:
- Material unmapped / blocked / omitted-with-reason content affecting this artifact:
- Semantic mapping validation result: pass / revise / blocked / not applicable / unknown
- Candidate-specific validation overlays affecting this artifact:
- Section schema: `SUMMARY` (optional) → `SKILLS` or `TECHNICAL SKILLS` (optional) → `WORK EXPERIENCE`, `EXPERIENCE`, or `PROFESSIONAL EXPERIENCE` → `EDUCATION` and/or `CERTIFICATIONS`:
- Optional `ADDITIONAL EXPERIENCE`, `PROJECTS`, or `PORTFOLIO` section and why it is needed:
- Heading deviations and reason:
- Target context included in resume body? no by default; if yes, why:
- Duplicate material claim check across summary, highlights, skills, and experience:
- ATS/provider/channel profile used, if any:
- Provider evidence source, research date, and version:
- Provider-specific rules actually documented or tested:
- Provider-specific behavior still unknown:
- Downstream validator compatibility and limitations:
- Standard headings and deterministic text order:
- Chronology and date representation:
- Employer/client hierarchy and engagement attribution:
- Separate employer periods and return-to-employer explanation:
- Supported terminology from the requirement map:
- Extraction or parser check used:
- Known parser limitations:
- Formatting or content intentionally omitted:
- Employer submission instructions:
- ATS review result: pass / revise / blocked / unknown

Minimum gate:

- Intended sections and text are extractable, or parser suitability is explicitly unknown.
- Dates, titles, employers, role identity, attribution, scope, and outcomes are unambiguous.
- When a Candidate Baseline Resume is active, identity/contact, recent employers, chronology, employer/client hierarchy, education, certifications, and candidate-confirmed historical grouping match the baseline unless an explicit evidence-backed change or `omitted_with_reason` disposition is recorded.
- Confirmed client engagements appear under the actual employer, separate employer periods remain separate when the active Candidate Context or source evidence requires it, and client attribution survives plain-text extraction.
- Roles are reverse chronological unless an intentional alternative is documented.
- Missing dates, ties, overlaps, and source ambiguity remain visible.
- Terminology is natural and supported; no keyword stuffing.
- Important content is not hidden in graphics, columns, images, or decorative labels without a safe text equivalent.
- Every material claim traces to the shared evidence ledger, including claims rendered from a normalized Resume Content Model.
- Every material semantic source considered for the artifact has an explicit mapping result; valid content is not silently dropped because the Template lacks a destination.
- Headings use conventional labels or an intentional deviation is recorded; derived `SELECTED IMPACT`, `CORE ALIGNMENT`, `TARGET`, `FIT`, and `MATCH` sections are not created by default.
- Target employer, role, location, and work-mode context stays in Work Order metadata unless explicitly requested.
- No duplicated impact block or keyword category repeats an existing claim without a recorded reason.
- Provider-specific rules are used only when the profile or an actual test supports them; a portal name alone is insufficient.
- Generic checker results are labeled implementation-specific rather than vendor certification.
- Applicable Candidate Context overlays pass without weakening evidence integrity.

### Human-facing resume version (optional)

Complete this section only when a second rendering is warranted.

- Template ID, source path, and verified revision when a reusable Template is used:
- Candidate Context revision used:
- Resume Content Model reference / revision / schema version used, or not applicable:
- Template slot-manifest path and verified revision, or not applicable:
- Material unmapped / blocked / omitted-with-reason content affecting this artifact:
- Semantic mapping validation result:
- Candidate-specific validation overlays affecting this artifact:
- Why a human-facing version is useful for this channel:
- Reader and review context:
- First-scan decision path:
- Hierarchy and visual system:
- Density and page or viewport constraints:
- Accessibility and readable structure:
- Contextual visual choices:
- Content or order differences from ATS version:
- Human review result: pass / revise / blocked / not warranted / unknown

Minimum gate:

- A reviewer can identify role, level, relevant value, and credible contribution quickly.
- Visual emphasis follows target-role relevance and evidence, not decoration.
- Content remains readable, accessible, truthful, and reasonably parseable.
- Intentional differences from the ATS version are recorded.
- The version does not erase uncertainty or make a claim stronger through design.
- If this version is not created, record why it was not warranted; do not mark human review as passed.

### Future human-facing template (separate artifact)

- Template ID and location:
- Intended audience and use conditions:
- Non-use conditions:
- Scan path and hierarchy:
- Density, page, or responsive behavior:
- Accessibility and safe text structure:
- Illustrative content policy:
- Instantiation review required:
- Owner and revision:

A reusable human-facing template is not an application output and does not replace the evidence ledger. Keep it content-free or clearly illustrative; never embed private candidate facts or employer-specific claims.

### Cover letter

- Template ID, source path, and verified revision:
- Candidate Context revision used:
- Candidate-specific voice/writing preferences applied:
- Candidate-specific validation overlays affecting this artifact:
- Why a letter is useful for this application:
- Specific connection or motivation it adds:
- Evidence IDs used:
- What it deliberately does not repeat:
- Voice and author review:
- Channel or parser requirement:
- Standalone artifact link or private location:
- Review result: pass / revise / skipped with reason / unknown

For a full application packet, the cover letter is a standalone artifact by default. It may need a structured, readable format for its submission channel, but it must not become a new source of unsupported claims and must not exist only as embedded text inside the application notes/answers record.

### Application Notes & Answers

- Template ID, source path, and verified revision:
- Candidate Context revision used:
- Role-fit summary:
- Eligibility, location, timing, or compensation constraints:
- Portfolio or work-sample plan:
- Application-form questions and candidate-confirmed answers:
- Unresolved questions requiring candidate input:
- Submission checklist:
- Links or private references to the separate resume and cover letter:
- Review result: pass / revise / blocked / unknown

This artifact coordinates the application. It is not a substitute for the resume or cover letter and is not a submission artifact unless the employer explicitly requests its contents.

## 4. Version parity table

### ATS-only path

When OUT-HUMAN is not warranted, use this section as an ATS-to-ledger integrity record. Mark human parity as not applicable.

| Claim ID | Evidence IDs | ATS version location | Ledger wording or source location | Meaning preserved? | Integrity result |
| --- | --- | --- | --- | --- | --- |
| C-001 | E-001 |  |  | yes / no / unknown | pass / revise / blocked |

Check at least:

- employer, role, title, dates, chronology, and engagement identity;
- contribution, attribution, scope, method, metrics, and outcomes;
- high-priority evidence and known gaps;
- candidate-specific standing decisions and validation overlays affecting those claims;
- uncertainty, caveats, and intentional omissions;
- parser suitability and untested scope.

### Optional two-version path

Use this comparison only when OUT-HUMAN exists.

| Claim ID | Evidence IDs | ATS version location | Human version location | Intentional difference and reason | Meaning preserved? | Parity result |
| --- | --- | --- | --- | --- | --- | --- |
| C-001 | E-001 |  |  |  | yes / no / unknown | pass / revise / blocked |

Fail parity when either version silently adds, removes, upgrades, or changes the meaning of a material claim. If a difference is required by the channel, document it and obtain the appropriate source or candidate decision. If OUT-HUMAN is not created, do not report parity as passed or failed.

## 5. Review record

Run reviews on the actual output revision.

| Review ID | Version | Lens | Criterion | Source IDs or exact location | Finding | Reader or system consequence | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| REV-001 | OUT-ATS / OUT-HUMAN / OUT-LETTER / OUT-NOTES | ATS / human / visual / integrity / parity / artifact-packaging / template-source / candidate-context / semantic-mapping |  |  |  |  | pass / revise / blocked / unknown |  |

Record what was not checked. Do not claim a specific employer parser, human response, preference, or outcome unless that evidence exists.

## 6. Work Order progress

Update at phase transitions, decisions, failed gates, material assumptions, handoffs, version changes, and validation events.

| Phase | Operating Persona | Stage owner | Supporting Persona(s) | Status | Output or link | Evidence status | Gate result | Smallest next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Resolve and load Candidate Context |  |  |  |  |  |  |  |  |
| Load candidate standing decisions and validation overlays |  |  |  |  |  |  |  |  |
| Resolve/read Candidate Baseline Resume when designated |  |  |  |  |  |  |  |  |
| Load/reconcile Resume Content Model when used |  |  |  |  |  |  |  |  |
| Define target and constraints |  |  |  |  |  |  |  |  |
| Align role and evidence |  |  |  |  |  |  |  |  |
| Build shared evidence source |  |  |  |  |  |  |  |  |
| Resolve and verify reusable Templates and slot manifests |  |  |  |  |  |  |  |  |
| Map candidate content into Template semantic slots when needed; do not reconstruct a designated baseline |  |  |  |  |  |  |  |  |
| Resolve unmapped / blocked / omitted-with-reason material |  |  |  |  |  |  |  |  |
| Create or verify role-specific application folder |  |  |  |  |  |  |  |  |
| Render ATS version |  |  |  |  |  |  |  |  |
| Render human-facing version (optional) |  |  |  |  |  |  |  |  |
| Draft and review standalone cover letter |  |  |  |  |  |  |  |  |
| Build and review Application Notes & Answers |  |  |  |  |  |  |  |  |
| Review Candidate Context, baseline-to-output integrity, semantic mapping, Template source, validation overlays, parity, integrity, and artifact packaging |  |  |  |  |  |  |  |  |
| Select submission artifact |  |  |  |  |  |  |  |  |
| Learn after submission |  |  |  |  |  |  |  |  |

Gate values are pass, revise, skipped with reason, blocked, no-go, or unknown.

## 7. Submission selection

- Employer instructions:
- File or version selected:
- Why this version is appropriate:
- Whether both versions were requested:
- Submitted date:
- Submission channel:
- What was actually sent:
- Confirmation or source:
- Unresolved limitation:

Do not infer that a version was submitted because it was drafted or reviewed. Submission is a separate authorized action.

## 8. Close and learning

- Candidate Context result and revision used:
- Candidate Context updated during run? yes / no
- Resume Content Model result / schema version / revision used:
- Candidate-specific validation overlay result:
- Role-specific application folder:
- Template-source result and revisions used:
- Resume Template slot-manifest path/revision used:
- Candidate-to-Template semantic mapping result:
- Material unmapped / blocked / omitted-with-reason content and disposition:
- Semantic mapping validation result:
- Concrete packet or decision:
- Success criterion addressed:
- ATS result and limitations:
- Cover-letter result and limitations:
- Application-notes result and limitations:
- Artifact-packaging result:
- Human review result and limitations:
- Parity result:
- Integrity result:
- What was not tested:
- Real-user or market feedback actually available:
- Synthetic assumptions to validate later:
- Learning that changes the target, evidence map, Candidate Context, Resume Content Model, Template choice, or future versions:
- Final gate: pass / revise / no-go / blocked
- Next action or explicit completion boundary:
