# Job search system implementation plan

## Purpose

Build a research-backed job-search workspace that helps a person define a target, interpret a role, turn real experience into evidence, write an ATS-compatible application, preserve human readability and aesthetics, and learn from each submission.

The system should optimize for truthful fit and useful clarity—not keyword stuffing, generic personal branding, or visual polish detached from the role.

This is a Persona-operated Playbook surface. The Playbook composes Personas, Skills, persona-owned workflows, shared evidence, artifacts, decision rights, quality gates, recovery, and a learning loop around one outcome; Priya Desai · Job search orchestrator operates that surface for full-outcome job-search work.

## Recommended operating model

Riley Morgan · AI orchestrator remains the default system entry and routing point for unqualified requests. For a full-outcome job-search request, Riley routes to **Priya Desai · Job search orchestrator**, who operates the **Evidence-led Job Search Playbook** as the durable process surface. Use one primary candidate persona with a coordinated set of specialist lenses:

1. **Job seeker** — source of truth for goals, constraints, experience, preferences, voice, and evidence.
2. **Search strategist (Elena Marin)** — defines target roles, search boundaries, positioning, channels, prioritization, and opportunity evaluation, with lightweight seen-job deduplication for repeated discovery checks.
3. **Hiring manager / role calibrator (Marcus Chen)** — interprets the role, separates required signals from noise, and defines what success would look like.
4. **ATS application specialist / application narrative editor (Leah Okafor)** — checks parsing, terminology alignment, structure, and truthful coverage.
5. **Human narrative editor (conditional)** — improves clarity, relevance, voice, credibility, and story when a human-facing output is warranted.
6. **Visual communication reviewer (conditional, Camille Ortiz)** — checks hierarchy, aesthetics, portfolio presentation, and context-appropriate polish only when that output is requested.
7. **Research and verification analyst** — researches companies, teams, role expectations, and evidence.
8. **Outreach and interview coach (Samira Nguyen)** — prepares networking messages, follow-ups, interview stories, and questions.
9. **Document designer (conditional, Sofia Calder)** — document structure, production, accessibility, and fidelity when a rendered packet is in scope.
10. **Job search orchestrator (Priya Desai)** — operates the Playbook run: maintains stage and gate state, selects the smallest relevant specialist set, coordinates concurrent opportunities, preserves decisions and boundaries, handles recovery, and synthesizes the next handoff. Priya does not absorb specialist domain expertise.

**Riley Morgan · AI orchestrator** remains the default front door for unqualified requests and the general-purpose orchestration Persona across domains. Riley does not operate the job-search methodology as a domain expert: once Riley identifies a full-outcome job-search route, Priya becomes the operating Persona. Explicit requests naming Priya, a specialist, a Skill, or the Playbook may route directly without an unnecessary Riley hop.

Three-layer ownership:

```text
Riley Morgan · AI orchestrator → default entry, intent interpretation, and routing for unqualified requests
Priya Desai · Job search orchestrator → operates the full job-search outcome after routing and remains responsible for process completion
Evidence-led Job Search Playbook → supplies stages / shared state / handoffs / quality gates / recovery / learning loop
Job-search specialists → own domain judgment and artifact-specific expertise
```

Preferred presentation:

```text
Riley Morgan · AI Orchestrator
→ routes unqualified full-outcome job-search work to Priya Desai · Job Search Orchestrator
→ Priya uses Evidence-led Job Search Playbook
```

Avoid presenting Riley as the Job Search Persona, as the sole job-search expert, or as the owner of search strategy, hiring judgment, narrative, outreach, visuals, documents, or private seen-job state.

The default path is ATS-first with a material-claim integrity gate. Cover letters pass through a positioning layer before review so the evidence ledger informs the writing without dictating every sentence. Human and visual review remain separate conditional gates: a document can be technically parseable but unconvincing to a person, or visually polished but semantically weak for a screening system. Do not create the second rendering unless the channel or review context justifies it.

### Consultation and routing convention

- Unqualified job-search requests → Riley Morgan · AI orchestrator first. Riley routes narrow work to the matching specialist or Skill and full-outcome work to Priya Desai · Job search orchestrator.
- Priya operates the Evidence-led Job Search Playbook for full-outcome work and invokes only the specialists required by the active stage.
- Explicit specialist, Skill, Priya, or Playbook requests → the named target directly; explicit direct invocation does not require an extra Riley hop. An explicit Evidence-led Job Search Playbook request resolves to that Playbook with Priya as its operating Persona.
- When a requester explicitly asks to “consult Riley Morgan” for job-search work, use Riley for the requested general orchestration perspective or cross-domain coordination. Do not silently substitute Riley for Priya as the job-search operator, and do not make Riley the sole content, writing, hiring, search-strategy, visual, or document reviewer.

For a full application-packet run, use Avery Brooks for candidate goals, evidence, and authentic voice; Leah Okafor for application narrative and structure; Marcus Chen for hiring-side relevance and credibility; and Priya Desai for orchestration and stage/gate synthesis. Add Sofia Calder only when document production or accessibility is in scope, and add Samira Nguyen only when outreach or interview carryover is in scope. A narrow cover-letter request may route directly to Avery, Leah, and Marcus without invoking Priya. If the requester asks for a fresh design, exclude prior drafts from the evidence set unless the requester explicitly includes them.

## MVP scope

The first build is a responsive reference surface plus actual working-draft persona records, not a full application tracker. It includes:

- The persona and responsibilities of each supporting role
- Six new job-search persona records in Personas: Avery Brooks (job seeker), Elena Marin (career search strategist), Marcus Chen (hiring-side role calibrator), Leah Okafor (application narrative editor), Samira Nguyen (outreach and interview coach), and Priya Desai (job search orchestrator)
- Reuse of Camille Ortiz for visual communication review and Sofia Calder for document production when needed; Riley Morgan remains the general AI orchestrator outside the default job-search operator role
- Full workflow inventories, activity-level priorities and representative tools, skills, evidence status, and end-of-page source trails on each new record
- The end-to-end search workflow defined by the Evidence-led Job Search Playbook and operated by the Job Search Orchestrator
- A reusable [seen-job deduplication contract](job-ledger-contract.md) so repeated job searches can suppress openings already presented
- Quality gates for ATS compatibility and evidence integrity by default, with human readability and visual communication when those outputs are warranted
- A clear boundary between current capabilities and later product work

The new records are synthetic composites. They are intentionally marked as working drafts and should be refined with the person’s actual target, industry, constraints, employer process, and source documents.

The first workflow is:

`Define target → Analyze role → Map evidence → Build shared evidence source → Render ATS → Review integrity → Optionally render human version and review parity → Submit → Learn`

## Application tracker companion surface

The original responsive job-search page remains a Playbook/reference surface. A separate top-level **Applications** companion surface owns opportunity/application lifecycle tracking and serves as shared persistent opportunity state for authorized job-search and application runs.

- The tracker is governed by `application-tracker-contract.md`.
- When Supabase deployment configuration is present and the user is authenticated, the authenticated Supabase private opportunity store is the primary persistence layer for real opportunity/application rows.
- Browser-local private state is an explicit fallback when remote configuration is absent, plus a migration source and rollback/recovery copy. A remote failure must never silently become a local write.
- Real opportunity/application rows remain outside Git and outside canonical Persona, Skill, Tool, Template, Operating Pack, Playbook, Doc, Decision, and Work Order data.
- The tracker lifecycle is `Found → Reviewing → Packet Ready → Applied → Interviewing → Offer / Closed`.
- Job posting and application-packet URLs are integration links, not canonical relationships to Persona or Skill records.
- Versioned JSON export/import remains the portability boundary for backup and future extraction into a standalone app.
- The tracker does not submit applications, send outreach, scrape jobs, or infer lifecycle transitions.
- The seen-job deduplication contract remains separate: it suppresses already-presented search results and does not become the application tracker.

### Tracker workflow checkpoints

- Before creating a tracker row, resolve an existing record by stable `id` and then canonical `sourceUrl`; do not create a duplicate for the same opportunity.
- When an opportunity is selected for tracking, create or update the record with `Found` and preserve the canonical `sourceUrl`.
- Capture optional `postingDate` only when the source actually provides it. Never infer or fabricate a posting date.
- When the application packet is complete, set `packetUrl` and advance to `Packet Ready` when appropriate; never downgrade a later confirmed lifecycle state.
- Only after an actual confirmed submission, advance to `Applied` and record `appliedDate`.
- Advance to `Interviewing`, `Offer`, or `Closed` only from confirmed events. Do not infer lifecycle transitions from drafting, packet completion, elapsed time, or assumptions.
- Tracker state changes record lifecycle facts; they do not authorize application submission, employer contact, outreach, or external sharing.

## Data model

Each future job-search record should preserve:

- Candidate goals, constraints, target roles, and acceptable adjacent roles
- Job description, source URL, company context, and research date
- Requirement-to-evidence mappings with confidence and gaps
- Resume, cover letter, portfolio, outreach, and interview artifacts
- Template identity, canonical `rickvang/template-library` source path, entrypoint, and verified revision for every reusable starting artifact
- Role-specific copies kept separate from their reusable Template sources
- ATS review findings and human review findings as separate records
- Version history, decisions, submitted date, outcome, and learning
- Open questions and what evidence would change the search strategy

These are application-run/evidence records, not the row schema for the Applications tracker. Keep candidate facts, researched claims, interpretations, and generated writing visibly distinct. Keep the private seen-job set in the consuming Skill/runtime; Persona-Library owns only the reusable deduplication contract.

### Repeated-search deduplication

Repeated searches must not present previously shown jobs as new by default. After discovery, derive the strongest stable identity available—source + stable job ID first, then canonical URL, then a conservative `company + title + location` fingerprint—compare it with the private seen-job set, suppress matches, and record newly presented jobs after they are shown. No rejected/applied/expired lifecycle state, `last_seen` history, repost state machine, or application tracker is required for this behavior.

## ATS-primary application packet

The default application path is ATS-first: identify the active Candidate Context, read its standing decisions, resolve any standing-decision-designated **Candidate Baseline Resume**, maintain one shared evidence source, map the target requirements, render one semantically structured ATS resume, and run both evidence-integrity and baseline-integrity review. This is the smallest useful path for most applications.

A Candidate Baseline Resume is a private, candidate-owned composed artifact such as an explicitly promoted master resume. It is not factual evidence and it is not the canonical reusable Template. When the active standing decisions designate one, it is the default composition baseline for the candidate's career spine. Role tailoring may change emphasis, summary language, supported skills, and selected achievements, but it must not silently reconstruct or replace the protected career spine from secondary profile stores or stale summaries.

Create a human-facing resume only when the target channel accepts it and the review context gives it a meaningful advantage. Do not create two near-identical versions by habit. When no human-facing version is warranted, record that decision and use ATS-to-ledger integrity rather than an empty ATS-versus-human parity exercise.

### Reusable Template source contract

`rickvang/template-library` is the canonical owner of reusable starting artifacts. Persona-Library may catalog Template identity, applicability, relationships, and verified source evidence, but it does not own the starter files.

Before drafting or rendering a reusable application artifact:

1. resolve the Template through the Persona-Library Template catalog;
2. verify the external `template-library` path, `README.md` entrypoint, and Git revision;
3. inspect the documented `starter/` boundary; copy/adapt it into the candidate's private role-specific application folder only when no standing-decision-designated Candidate Baseline Resume is active, otherwise use the baseline as the composition starting artifact while retaining the verified Template as the reusable-structure contract;
4. record the Template ID and revision used;
5. keep the resulting role-specific artifact independently owned after instantiation.

For the current full application packet, the expected reusable starters are:

- ATS resume → `template-resume-classic-single-column` / `templates/resumes/classic-single-column`;
- cover letter → `template-cover-letter-evidence-led` / `templates/cover-letters/evidence-led`;
- Application Notes & Answers → `template-job-application-notes` / `templates/job-applications/application-notes`.

A repository or catalog entry is not proof that a Template exists. If a required Template path or entrypoint is missing, stale, or unverifiable, route to Template research/composition and create or repair the reusable Template in `rickvang/template-library` before treating it as the application starter. Do not silently promote a private Google Drive master, prior application, or ad hoc document into the canonical Template source. This reusable-Template boundary does **not** demote a candidate-designated baseline resume: the Template owns reusable presentation structure, while the Candidate Baseline Resume owns the candidate-specific composed career spine when standing decisions designate one. A requester may explicitly authorize a one-off non-reusable artifact, but that exception must be recorded and must not be cataloged as a Template without the normal Template lifecycle review.

### Shared evidence source

Before drafting, maintain one evidence inventory or claim ledger containing:

- source ID and exact source passage or artifact;
- action, attribution, scope, method, outcome, metric, and uncertainty;
- target-role relevance and confidence;
- approved wording or unresolved question;
- destination in the ATS resume, optional human-facing resume, cover letter, or portfolio.

The ledger is authoritative. Candidate facts, researched claims, interpretations, generated wording, assumptions, and unknowns remain visibly distinct.

### Positioning layer and artifact-specific evidence rigor

Do not send the evidence ledger directly into prose. Create a short positioning brief between the ledger and the application artifact. It names the role-relevant themes, candidate-approved abstractions, voice cues, useful omissions, and uncertain areas that need careful handling. The positioning brief is an interpretive bridge, not a second evidence source.

Apply evidence rigor according to the artifact:

- ATS resume: use high exactness for dates, titles, employers, metrics, tools, credentials, ownership, scope, and outcomes. Plain-text extraction and material-claim integrity remain strict.
- Cover letter: keep material facts, scope, ownership, metrics, tools, credentials, and known gaps truthful, while allowing sentence-level synthesis, broader descriptors, and candidate-owned voice when they faithfully summarize related evidence.
- Portfolio, outreach, and interview materials: keep material facts stable and choose the lightest review that fits the format and consequence of the claim.

Classify candidate revisions before routing them back through evidence review:

- Voice-only change: accept when it improves clarity or recognizability without changing meaning.
- Positioning abstraction: accept when the candidate recognizes it as accurate and it does not materially upgrade scope, ownership, or expertise. Keep it in the positioning brief when it is useful across applications.
- New material fact: confirm or add it to the evidence ledger when it introduces a new metric, tool, credential, employer, date, responsibility, outcome, or scope claim.
- Omission: check role coverage and reader flow, but do not force a sentence back into the artifact solely to preserve one-to-one traceability.

The cover-letter quality gate is candidate-recognizable voice, clear role relevance, useful flow, and no material misrepresentation. A cover-letter sentence does not need a one-to-one source citation when it is a truthful synthesis of supported evidence. The source path must remain recoverable in the private positioning brief or Work Order when a reviewer needs to inspect the underlying claim.

### Candidate-specific standing decisions

Before role alignment or drafting, read the private candidate-specific standing-decision record when one exists. It carries explicit, candidate-confirmed choices about employer attribution, chronology, section placement, voice, omissions, and other repeatable resume decisions.

The standing record is a private input, not a public Persona Library record. Store only its existence, read status, scope, and unresolved conflicts in a public Work Order. Keep the actual resume facts and private Drive links in the authorized private candidate workspace.

Apply decision precedence in this order:

1. A later explicit candidate instruction.
2. A verified correction to the candidate’s source record.
3. The current candidate standing decision.
4. Generic job-search guidance.

The evidence ledger remains authoritative for material claims. A standing decision can guide structure or reuse a confirmed attribution; it cannot create evidence, upgrade a claim, or resolve a conflict silently. If the record is missing, stale, or conflicts with current source material, record that status and pause the affected decision for candidate review.

Reading or updating the standing record never authorizes upload, submission, employer contact, or external sharing. The Work Order must end with a recommendation or review handoff unless separate submission authorization is explicitly provided.

### Private-source resolution gate

Before role alignment or resume drafting, resolve private candidate sources in this order when they exist:

1. Locate and read the active candidate standing-decision record.
2. If it designates an active master or baseline resume, resolve that exact private artifact and record its source/revision before drafting.
3. Resolve the shared evidence ledger and any normalized Resume Content Model referenced by the candidate context.
4. Use secondary profile stores, old resumes, portfolio summaries, or application-history records only as supporting sources unless the active candidate context explicitly promotes them.
5. If the designated baseline or authoritative evidence source cannot be resolved, mark the affected composition step `blocked`; do not silently substitute a stale or secondary source.

When the runtime exposes a connected private-document source such as Google Drive, use its search/fetch capability to resolve the standing record and named baseline directly. Tool availability does not change source precedence.

### Candidate Baseline Resume boundary

A designated Candidate Baseline Resume protects the candidate's approved **career spine**: identity/contact values, employers, titles, employment periods, dates, locations, employer/client hierarchy, recent-employer presence, education, certifications, and candidate-confirmed grouped historical structure.

It may also carry approved presentation choices such as heading hierarchy and categorized skills. Those presentation choices remain candidate-specific; they do not become reusable Template rules.

The baseline does not override contradictory evidence. A verified evidence correction or later explicit candidate instruction may change it. When a role-specific output intentionally differs from the baseline on a protected field, record the difference and its evidence/decision basis. Material omissions must be `omitted_with_reason`, not silently dropped.

### ATS resume contract

The default ATS resume must be semantically structured, extraction-safe, readable, naturally aligned to supported role terminology, and clear about dates, titles, employers, engagement identity, attribution, scope, and outcomes.

It must not hide content in graphics, rely on decorative layout, stuff keywords, silently normalize ambiguous facts, or claim a parser result that was not actually tested. If no employer parser is available, record parser suitability as unknown rather than implying validation.

### Accessible document production and export verification

ATS-safe and human-readable are compatible when visual treatment preserves semantic structure. Use native hyperlinks for email, portfolio, and LinkedIn; native list structures for bullets; semantic heading levels for the title, sections, and employers; and styled normal paragraphs for dates so heading navigation stops at meaningful content boundaries. Break long skills content into short categorized lines with visible labels. Use restrained color, typography, indentation, and spacing only when contrast, extraction, and reading order remain intact. Do not replace list structures with bullet-looking special characters.

When a document is exported, record separate checks for:

- tagged output and document language metadata;
- heading, paragraph, list/list-item, and link structures;
- reading order and link destinations;
- page count, page breaks, clipped content, and orphaned headings or bullets; and
- live screen-reader behavior when it is actually tested.

A successful tagged-PDF export is evidence about the exported structure, not proof of NVDA, JAWS, or other assistive-technology behavior. If live testing is not available, record that limitation explicitly.

### Default ATS section structure

Use a conventional, linear section structure unless the employer instructions require something else:

1. Contact information
2. `SUMMARY` (optional when the evidence is stronger without it)
3. `SKILLS` or `TECHNICAL SKILLS` (when supported role terms need a scannable home)
4. `WORK EXPERIENCE`, `EXPERIENCE`, or `PROFESSIONAL EXPERIENCE`
5. `EDUCATION` and/or `CERTIFICATIONS`

`PROJECTS`, `PORTFOLIO`, and `ADDITIONAL EXPERIENCE` are optional when they answer a real requirement or preserve relevant chronology. Prefer one clear work-experience section with a conventional heading when the source supports it.

`SELECTED IMPACT`, `CORE ALIGNMENT`, `TARGET`, `FIT`, and `MATCH` are not default ATS headings. Put accomplishments under the relevant role and supported capabilities under `SKILLS`. Do not create a section only to mirror the job description.

There is no universal ATS heading certification. Conventional labels reduce ambiguity but do not prove a particular vendor's parser behavior. If the employer parser is not tested, record parser suitability as unknown.

### Employer and client engagement hierarchy

When source material identifies a consulting, staffing, or agency employer with client work beneath it, preserve both levels in the resume:

- Identify the actual employer of record and the client engagements from the source or an explicit candidate confirmation.
- Keep separate employer periods separate when the candidate left and later returned.
- Use an explicit plain-text `Client engagements:` line or bullet under the employer, and prefix each client accomplishment with the client name when multiple clients share that employer.
- Do not rely on visual indentation alone; the relationship must survive plain-text extraction.
- Keep direct employers as separate entries.
- If the employer/client relationship or employment period is uncertain, record the uncertainty and ask before regrouping.

When several short historical roles need a grouped presentation, use an explicit umbrella label only as a presentation device. Preserve every underlying employer, title, date range, location, and accomplishment in extractable text; mark any aggregate date or location as a summary; and do not let the label imply an employer, title, or period that the source does not support.

### ATS provider and channel profiles

A provider profile is an evidence record, not a guess based on a portal name. Use one when the employer, application channel, or a tested downstream validator supplies actual constraints.

Record:

- provider or channel name and the exact application URL;
- evidence source, research date, and any version or submission instructions;
- accepted upload formats and document limits;
- heading aliases, extraction behavior, or field-mapping rules that were actually documented or tested;
- the fixture or export used for a test, the observed result, and the untested scope;
- rules that remain unknown.

Apply a provider profile only where its evidence supports it. A generic internal checker, a portal label, or advice from one vendor does not establish a universal Workday, Greenhouse, ZipRecruiter, or other ATS rule. When no provider evidence exists, use the default structure and report provider behavior as unknown.

The current JobAgent implementation contains a generic text check rather than a provider matrix. Its required headings and parser warnings are useful as a tool-compatibility profile only; they are not evidence that a named ATS prefers those labels. Keep that distinction in the Work Order.
Keep target employer, role, location, and work-mode context in the Work Order and requirement map. Do not add a target line to the resume body by default unless the requester explicitly wants a role-labeled version or the submission format requires it. A file name or Work Order can carry target context without adding it to the resume.

Before review, compare the heading list against this structure, record intentional deviations, and check for duplicated material claims across summary, highlights, skills, and experience. A metric should have one canonical evidence-backed home; repeat it only when repetition materially improves the intended reading path.
### Optional human-facing resume

A human-facing version is a second rendering of the same approved evidence source. It may improve scan path, hierarchy, density, order, voice, and context-appropriate visual communication. It must preserve the meaning of every material claim and remain reasonably parseable when the employer still uses screening software.

Run a separate human and visual review only when this version is created. Record every material content or order difference and why it helps the intended reader. If the difference changes meaning, return to source review.

### Future human-facing templates

Reusable human-facing templates are separate design assets, not application outputs and not automatic application outputs. Keep them content-free or use clearly marked sample content; do not copy private candidate facts or employer-specific claims into a reusable template.

A template should define its intended audience, scan path, hierarchy, density, accessibility, responsive or page behavior, safe text structure, and the conditions under which it should not be used. Build or maintain a template only when repeated human-facing work justifies it. Instantiating a template for a specific application remains an explicit, separately reviewed step.

### Review and integrity gate

Every application packet runs:

- role-to-evidence mapping;
- Template-source verification for every reusable starter;
- ATS structure and terminology review;
- claim-to-ledger integrity review;
- chronology and ambiguity preflight;
- explicit unknown and untested-scope review;
- conventional-heading and target-context review;
- duplicate-claim review across summary, highlights, skills, and experience.
- semantic document and export review when a file is rendered;
- page-flow review for clipped content, orphaned headings or bullets, and unintended whitespace;
- explicit separation between verified exported structure and untested live screen-reader behavior.

When a human-facing version exists, also run the human/visual review and a parity comparison against the ATS version. When it does not exist, do not report human parity as passed or failed; report it as not applicable and preserve the reason.

The selected submission artifact follows employer instructions. Do not submit both resume versions unless the employer or requester explicitly asks for both. Cover-letter claims, when requested, trace to the same ledger and add useful context rather than becoming a second evidence source.

The reusable cover-letter starting artifact lives in `rickvang/template-library`, not in a private Drive master. Each application copies/adapts the verified Template starter into the role-specific private folder, then combines it with the positioning brief and shared evidence ledger. Prior role-specific drafts remain project artifacts and are not reusable Template sources unless the requester explicitly includes them as evidence for a later Template revision.

For cover letters, the internal tailoring brief is the positioning layer. It may translate several related evidence items into a candidate-approved theme or descriptor so the sendable letter can read naturally. The final review protects material truth and role coverage without turning the letter into a line-by-line evidence audit.

### Work Order tracking

The Work Order records the target, shared ledger, verified Template identities/revisions, canonical ATS version, optional human-facing version, standalone cover letter, Application Notes & Answers, review findings, integrity result, optional parity result, selected submission file, tracker record reference and sync status when opportunity/application tracking is in scope, and learning after submission. It is the active progress record; specialized artifacts and private tracker rows remain separate and linked rather than duplicated.

## Phased delivery

### Phase 0 — Define the search

- Capture role family, level, industry, geography, work mode, compensation, timing, and constraints.
- Define a primary target plus acceptable adjacent targets.
- Create an evidence inventory: outcomes, scope, decisions, artifacts, metrics, and examples.

### Phase 1 — Role and evidence alignment

- Parse a job description into responsibilities, capabilities, outcomes, and signals.
- Map each requirement to evidence, confidence, and a gap or follow-up question.
- Produce a candidate-approved positioning brief and role-specific evidence shortlist.

### Phase 2 — Application packet

- Resolve every reusable application starter through the Persona-Library Template catalog and a verified `rickvang/template-library` path/entrypoint/revision. If a required Template is missing, route to Template research/composition before drafting from it.
- Create one role-specific folder in the configured private application workspace and keep the ATS resume, cover letter, and Application Notes & Answers as separate artifacts by default.
- Build one shared evidence source. When the active Candidate Context designates a Candidate Baseline Resume, copy/adapt that baseline into the role-specific artifact and tailor it conservatively; otherwise compose from the validated evidence/model into the verified Template. Add a human-facing resume only when the target channel or review context justifies a second output.
- Draft a separate cover letter for a full packet unless the employer does not accept one or the requester explicitly skips it; draft from the positioning brief, then review material claims and voice as separate questions.
- Build the Application Notes & Answers artifact for role fit, constraints, application questions, portfolio planning, blockers, and submission checks.
- At packet completion, resolve the Applications tracker record, set `packetUrl`, and advance to `Packet Ready` when appropriate without downgrading a later confirmed state.
- Generate portfolio or case-study emphasis for design-oriented roles.

### Application preflight — before the council

Run a small deterministic structural check before persona review. This is a builder rule, not a judgment the personas should have to remember:

- Parse every role’s start and end date into a consistent month-level representation.
- Sort the employer-facing resume reverse chronologically by end date unless a deliberate functional format is documented.
- Check for missing dates, inconsistent date formats, duplicate employer records, same-month ties, and month-level overlaps.
- Preserve source ambiguity. Do not invent day-level precision to make the timeline look cleaner.
- Carry the preflight result into the ATS, human-reader, and integrity reviews so a polished draft cannot hide a basic chronology error.

Leah owns the ATS review and claim-to-ledger integrity result. Human-readable and visual review are conditional on a human-facing output. Riley records the flags and reconciliation decision. A failed ordering check should stop the packet before council synthesis; an overlap or same-month ambiguity should remain visible until the source is confirmed or the user explicitly accepts it.

### Phase 3 — Quality review

- Start with the preflight result rather than relying on visual inspection or persona memory.
- Verify each reusable artifact's Template ID, canonical source path, entrypoint, and revision.
- Run the ATS pass for parseability, terminology coverage, structure, and truthful alignment.
- Run the claim-to-ledger integrity pass and chronology preflight.
- For a cover letter, run the positioning and voice pass before the material-claim pass. Accept candidate-owned abstractions that preserve meaning; escalate only new material facts or changes to scope, ownership, metrics, tools, credentials, dates, or gaps.
- Run human/narrative and visual passes only when a human-facing version exists or a human-facing template is being evaluated.
- Record unresolved tradeoffs instead of silently flattening them.

### Phase 4 — Outreach and interview

- Create targeted outreach and follow-up messages.
- Prepare evidence-led interview stories and questions.
- Practice likely role-specific scenarios and evaluate answers against the same quality model.

### Phase 5 — Search learning loop

- Use the private seen-job set so repeated discovery checks do not resurface openings already presented as new.
- Use the Applications tracker as the lifecycle store for tracked opportunities while the Work Order references only the minimum operational state needed. Set `Applied` and `appliedDate` only after a confirmed submission, and advance interview, offer, or closure states only from confirmed events; never infer those transitions. Keep this lifecycle state separate from the seen-job deduplication contract.
- Separate market feedback from noise and small-sample assumptions.
- Update target roles, evidence gaps, positioning, and materials only when the evidence justifies it.

## Quality gates

### Template-source quality

- Every reusable application artifact has a Template ID and a verified `rickvang/template-library` path, `README.md` entrypoint, and Git revision before use.
- The documented `starter/` copy boundary exists and is non-empty.
- A missing or stale Template routes to Template research/composition rather than a silent private-master fallback.
- Candidate facts and role-specific content live only in the instantiated private artifact, not the reusable Template source.
- Persona-Library does not claim a proposed external Template is canonical on `main` until the source path and entrypoint actually resolve there.

### Candidate-baseline quality

- Any standing-decision-designated baseline/master was resolved and read before resume drafting.
- The final ATS artifact passed **baseline-to-output** integrity by comparing the protected baseline career spine against the role-specific output.
- Name/contact, employer/title/date/location chronology, employer/client hierarchy, recent employers, education, certifications, and candidate-confirmed historical grouping are unchanged unless a supported correction or explicit candidate decision authorizes the difference.
- Every material baseline omission is recorded as `omitted_with_reason`; every protected-field change identifies its evidence or decision basis.
- Secondary profile stores and stale summaries did not replace unresolved authoritative private sources.
- Reusable Template verification remains separate from candidate-baseline verification.

### ATS default quality

- The document parses into the intended sections or parser suitability is explicitly unknown.
- Role-relevant terminology appears naturally where supported by evidence.
- Dates, titles, employers, engagement identity, attribution, scope, and outcomes remain unambiguous.
- Employer/client attribution is explicit: confirmed client engagements appear under the actual employer, separate employment periods remain separate, and the relationship survives plain-text extraction.
- Roles are reverse chronological, or the chosen alternative format is explicitly documented.
- Missing dates, month-only ambiguity, duplicate employers, and overlaps are flagged rather than silently resolved.
- Formatting does not hide important content from extraction.
- Headings use the default structure or an intentional deviation is recorded.
- Target employer, role, location, and work-mode context are absent from the resume body unless explicitly requested.
- Accomplishments live under roles and capabilities live under `SKILLS` or an approved synonym; derived alignment sections are not created by default.
- Repeated material claims are removed or documented as intentional.
- Provider-specific formatting rules are applied only when a documented profile or actual test supports them.
- Generic validator results are labeled as implementation-specific compatibility evidence.

### Evidence-integrity quality

- Every material claim traces to the shared evidence ledger, while synthesized wording may summarize multiple ledger items without a one-to-one sentence mapping.
- Metrics, tools, responsibilities, titles, dates, employers, and outcomes are not invented or upgraded.
- Candidate facts, researched claims, interpretations, generated wording, assumptions, and unknowns remain distinct.
- Intentional omissions and synthesized wording are recorded.
- No parser, recruiter, human, or user response is claimed without that evidence.
- The packet stops or returns to source review when a material claim cannot be supported.

### Cover-letter quality

- A positioning brief precedes the draft and identifies the reader decision path, role-relevant themes, candidate-approved abstractions, and material gaps.
- The letter sounds recognizable to the candidate and uses flow, specificity, and emphasis appropriate to a human reader.
- Candidate edits are classified as voice, positioning abstraction, new material fact, or omission before any evidence escalation.
- New material facts and material changes to scope, ownership, metrics, tools, credentials, dates, or gaps return to the evidence ledger.
- Truthful bridge language may acknowledge a gap without repeating internal audit language in the sendable letter.
- The final letter adds context or motivation rather than copying the resume.

### Optional human-facing quality

- Use only when the channel or review context warrants a second rendering.
- The first scan communicates role, level, relevant value, and credible contribution quickly.
- Claims are specific, credible, and supported by the same ledger as the ATS version.
- Visual emphasis follows target-role relevance and evidence, not decoration.
- Content remains readable, accessible, truthful, and reasonably parseable.
- Material differences from the ATS version are recorded and meaning is preserved.

### Optional human-template quality

- The template is a separate, reusable artifact rather than a candidate-specific application output.
- Audience, scan path, hierarchy, density, accessibility, page or responsive behavior, and safe text structure are explicit.
- Sample content is clearly illustrative; private facts and employer-specific claims are not embedded.
- Use conditions, non-use conditions, and instantiation review are documented.
- The template does not bypass the shared evidence ledger or the ATS default path.

## Deliberately out of scope for the MVP

- Automatic job scraping or mass application submission
- Unverified salary, culture, or hiring-probability claims
- Autonomous outreach or recruiter messaging
- A single universal human-facing resume template or automatic human rendering for every application
- An aggregate score that pretends to replace judgment
- Hosting private candidate job history inside Persona-Library
- Full CRM-style application reminders or campaign automation

The [seen-job deduplication contract](job-ledger-contract.md) is in scope as reusable guidance for suppressing openings already presented in repeated searches. A hosted Persona-Library job database is not.

These other items remain future opportunities, not implied capabilities of the current reference page.

## Validation questions

- Is Riley presented as the default routing front door for unqualified requests, with Priya operating full-outcome job-search work and the Playbook remaining the process surface rather than an actor?
- Can a narrow strategy, hiring, writing, outreach, visual, or document question route to Elena, Marcus, Leah, Samira, Camille, or Sofia without defaulting to Riley?
- Do repeated searches avoid presenting previously shown jobs as new by default, using the seen-job deduplication contract?
- When opportunity/application tracking is in scope, does the workflow resolve an existing Applications tracker record before creating a duplicate?
- Does authenticated Supabase remain primary persistence when configured, with browser-local state limited to explicit fallback, migration, and recovery?
- Are `postingDate` values source-backed only, and are `Applied`, `appliedDate`, interview, offer, and closure transitions recorded only from confirmed events?
- Does every reusable application artifact resolve to a verified `rickvang/template-library` Template before it is instantiated?
- When a needed reusable Template is missing, does the workflow create/repair it in `template-library` instead of silently falling back to a private Drive master?
- When standing decisions designate an active Candidate Baseline Resume, is that exact private artifact resolved before drafting?
- Does the role-specific resume preserve the baseline career spine or record every material difference with evidence and an explicit disposition?
- Are secondary profile stores prevented from substituting for an unresolved designated baseline or authoritative evidence source?
- Can a candidate explain why a role is in or out of scope?
- Can each important claim in an application be traced to evidence?
- Does the preflight catch wrong role order even when the content and visual review look good?
- Does the ATS pass improve retrieval without making the writing unnatural?
- Does the positioning layer preserve candidate voice while keeping material facts and role coverage stable?
- Are candidate edits routed by consequence instead of receiving the same sentence-level evidence scrutiny?
- When a human-facing output is warranted, can a reviewer identify fit, level, and contribution quickly?
- Does visual treatment support the context rather than merely signal taste?
- Does feedback change the search model only when it is repeated or well-supported?
- Does the heading structure make section boundaries obvious to a parser?
- Does the resume preserve employer-of-record and client attribution without relying on visual indentation?
- Does the resume keep target context in the Work Order while keeping the resume reusable?
- Do any highlights or alignment sections add distinct value instead of repeating experience or skills?
- Do native links, lists, headings, dates, and categorized skills survive extraction and assistive-technology review?
- Does the rendered file preserve page flow without clipping, orphaned content, or a stray list item?
- Are exact candidate-specific typography, color, and spacing settings kept in the private artifact or document spec rather than treated as universal rules?
