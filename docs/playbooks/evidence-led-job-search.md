# Evidence-led Job Search Playbook

## Purpose

Help a person find suitable work, prepare truthful applications, and learn from confirmed outcomes. Routine application preparation uses the short path below; the later sections supply campaign guidance and exception detail.

The system should optimize for truthful fit and useful clarity—not keyword stuffing, generic personal branding, or visual polish detached from the role.

This is a Persona-operated Playbook surface. The Playbook composes Personas, Skills, persona-owned workflows, shared evidence, artifacts, decision rights, quality gates, recovery, and a learning loop around one outcome; Priya Desai · Job search orchestrator operates that surface for full-outcome job-search work.

## Choose the requested operation

| Request | Direct path | Context needed |
| --- | --- | --- |
| Find new jobs | Search and shortlist; use the [seen-job ledger](../job-search/job-ledger-contract.md) for repeated discovery | Approved target/preferences, saved queries, seen identities; verify shortlisted employer postings |
| Prepare an application packet | Routine path below and the [production route](../job-search/application-context-and-review.md#local-packet-operation) | Designated master/evidence, current standing decisions, employer posting and private working copy |
| Update application status | [Application tracker](../job-search/application-tracker-contract.md) | Owner-scoped existing record and confirmed event; do not rebuild the packet or rerun discovery |

The selected executor can operate directly. Persona ownership and review lenses do not require a runtime handoff or independent agent for each operation. The routine path owns the sequence; supporting contracts supply facts, boundaries and review criteria only when needed.

## Routine application preparation — default

Use one regular editable résumé and its PDF, plus a separate cover letter when requested or required. An extra ATS/DOCX variant needs an actual format requirement, demonstrated parsing need or explicit request. A normal packet serves both people and screening systems; do not create competing versions or research every ATS by default.

1. **Load current sources and posting.** Resolve the designated factual master, applicable standing decisions and current employer requirements. Reuse unchanged evidence and record source revisions in the existing private context. Missing authority blocks the affected claim, not unrelated writing. A prior packet may supply approved formatting, never new career facts.
2. **Tailor one editable source.** Work in a private copy. Preserve official roles, chronology, employer/client attribution and confirmed historical grouping. Map important requirements to supported, adjacent or missing evidence; explicitly tailor Skills as well as relevant summary/experience content. Write a requested letter in the candidate's natural voice, connecting selected evidence to a plausible contribution.
3. **Export from that source.** Prefer the candidate-designated native source and formatting preset; use the [production route](../job-search/application-context-and-review.md#local-packet-operation). Make wording and layout corrections in the source, then regenerate. A second renderer is conditional and cannot establish source/PDF layout parity merely by sharing text.
4. **Review the final packet once.** Compare claims/wording with evidence, then inspect every actual final PDF page together for hierarchy, employer/date/detail grouping, wrapping, density and page flow. Check extracted text/order, links and unwanted attachments/actions; preserve supplied tags/language. Review any submitted DOCX in a compatible renderer. Correct observed failures and recheck affected evidence; an earlier file's review does not cover a later export.
5. **Deliver and stop.** Link the editable source and reviewed PDF, identify the exact revision/file, and state unresolved answers and actual limits. Keep brief evidence/readiness notes in the existing private task/tracker. Preserve later confirmed tracking states. Application Entry separately handles authorized uploads, parsed-field repair and confirmed declarations; packet preparation never submits or sets Applied.

One executor can apply the relevant review criteria. No new ledger, notes document, Work Order or independent specialist pass is required for an ordinary successful packet. Use the repository's existing recovery-state rule only when current records cannot preserve necessary continuation state.

### Live ATS form preparation

Use [Application Entry](https://github.com/rickvang/SkillRepo/blob/main/codex/methods/application-entry/SKILL.md) (`$application-entry`) for authorized live form entry, attachment verification, parsing repair and the candidate's review handoff. The Playbook owns packet preparation and tracking; the Skill owns form procedure and submission authorization.

### When more detail is needed

Add only the steps needed by an observed exception: substantial application-form narratives; a material source conflict that supported wording cannot resolve; a new Template or layout; a second resume rendering requiring parity review; an interrupted handoff whose existing records cannot preserve recovery state; or an explicit request for detailed notes or independent specialist review. Use the relevant sections below and the [detailed application Work Order template](../job-search/application-work-order-template.md) only as needed. A single unresolved answer does not expand every role in the batch into the full workflow.

Tool failure calls for bounded recovery, not a new application infrastructure project. Make one focused repair attempt, then use an available supported fallback or report the affected output's limitation. Additional retries are justified by new evidence. Building a new transfer helper, generator, cache or automation requires its own scoped request.

## Recommended operating model

The default system entry interprets unqualified requests and routes directly to the applicable Skill or specialist. For a full-outcome job-search request, route to **Priya Desai · Job search orchestrator**, who operates the **Evidence-led Job Search Playbook** as the durable process surface. Use one primary candidate persona with a coordinated set of specialist lenses:

1. **Job seeker** — source of truth for goals, constraints, experience, preferences, voice, and evidence.
2. **Search strategist (Elena Marin)** — defines target roles, search boundaries, positioning, channels, prioritization, and opportunity evaluation, with lightweight seen-job deduplication for repeated discovery checks.
3. **Hiring manager / role calibrator (Marcus Chen)** — interprets the role, separates required signals from noise, and defines what success would look like.
4. **ATS application specialist / application narrative editor (Leah Okafor)** — checks parsing, terminology alignment, structure, and truthful coverage.
5. **Human narrative editor (conditional)** — improves clarity, relevance, voice, credibility, and story when a human-facing output is warranted.
6. **Visual communication reviewer (conditional, using the interface hierarchy and contextual visual judgment Skills)** — checks hierarchy, aesthetics, portfolio presentation, and context-appropriate polish only when that output is requested.
7. **Research and verification analyst** — researches companies, teams, role expectations, and evidence.
8. **Outreach and interview coach (Samira Nguyen)** — prepares networking messages, follow-ups, interview stories, and questions.
9. **Document designer (conditional, Sofia Calder)** — document structure, production, accessibility, and fidelity when a rendered packet is in scope.
10. **Job search orchestrator (Priya Desai)** — operates the Playbook run: maintains stage and gate state, selects the smallest relevant specialist set, coordinates concurrent opportunities, preserves decisions and boundaries, handles recovery, and synthesizes the next handoff. Priya does not absorb specialist domain expertise.

The selected coordinator interprets intent without requiring a Persona. Priya operates the full-outcome job-search route. Explicit requests naming Priya, a specialist, a Skill, or the Playbook may route directly.

Three-layer ownership:

```text
Task decomposition and routing → intent interpretation and direct routing for unqualified requests
Priya Desai · Job search orchestrator → operates the full job-search outcome after routing and remains responsible for process completion
Evidence-led Job Search Playbook → supplies stages / shared state / handoffs / quality gates / recovery / learning loop
Job-search specialists → own domain judgment and artifact-specific expertise
```

Preferred presentation:

```text
Task decomposition and routing
→ routes unqualified full-outcome job-search work to Priya Desai · Job Search Orchestrator
→ Priya uses Evidence-led Job Search Playbook
```

Avoid presenting Riley as the Job Search Persona, as the sole job-search expert, or as the owner of search strategy, hiring judgment, narrative, outreach, visuals, documents, or private seen-job state.

The default packet combines truthful role fit, human readability, extractable structure and visual review. The evidence informs the letter without dictating every sentence. A second rendering and independent specialist review are conditional; neither is required for ordinary packet production.

### Consultation and routing convention

- Unqualified job-search requests → route narrow work directly to the matching specialist or Skill and full-outcome work to Priya Desai · Job search orchestrator.
- Priya operates the Evidence-led Job Search Playbook for full-outcome work and invokes only the specialists required by the active stage.
- Explicit specialist, Skill, Priya, or Playbook requests → the named target directly. An explicit Evidence-led Job Search Playbook request resolves to that Playbook with Priya as its operating Persona.
- General orchestration or cross-domain coordination requests → apply the existing Task decomposition and routing or Work graph orchestration Skill as appropriate. Preserve Priya's job-search operating boundary and obtain the required content, writing, hiring, search-strategy, visual, or document judgment from the relevant Skill or specialist.

For routine packets, the selected executor may apply the relevant candidate, application and hiring lenses in one pass. Invoke Avery Brooks, Leah Okafor, Marcus Chen or another specialist only when their judgment is needed or requested; Priya remains responsible for full-outcome orchestration. Add Sofia Calder for unresolved document production/accessibility questions and Samira Nguyen for outreach or interview work. If the requester asks for a fresh design, exclude prior drafts from the evidence set unless the requester explicitly includes them.

## MVP scope

The first build is a responsive reference surface plus actual working-draft persona records, not a full application tracker. It includes:

- The persona and responsibilities of each supporting role
- Six new job-search persona records in Personas: Avery Brooks (job seeker), Elena Marin (career search strategist), Marcus Chen (hiring-side role calibrator), Leah Okafor (application narrative editor), Samira Nguyen (outreach and interview coach), and Priya Desai (job search orchestrator)
- Reuse existing UI Skills for visual communication review and Sofia Calder for document production when needed; the selected coordinator preserves cross-domain continuity
- Full workflow inventories, activity-level priorities and representative tools, skills, evidence status, and end-of-page source trails on each new record
- The end-to-end search workflow defined by the Evidence-led Job Search Playbook and operated by the Job Search Orchestrator
- A reusable [seen-job deduplication contract](../job-search/job-ledger-contract.md) so repeated job searches can suppress openings already presented
- Combined checks for evidence integrity, extractable structure, human readability and final-page layout
- A clear boundary between current capabilities and later product work

The new records are synthetic composites. They are intentionally marked as working drafts and should be refined with the person’s actual target, industry, constraints, employer process, and source documents.

The first workflow is:

`Define target → Analyze role → Tailor editable source → Export → Combined review → Authorized application entry → Learn`

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
- Seen-job deduplication remains separate from Applications: repeated discovery uses the authenticated private `app.seen_jobs` store to suppress already-presented results, while Applications stores only intentionally tracked opportunities and their lifecycle.

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
- Applicable review findings and untested scope; separate records only for independent reviews actually performed
- Version history, decisions, submitted date, outcome, and learning
- Open questions and what evidence would change the search strategy

These are application-run/evidence records, not the row schema for the Applications tracker. Keep candidate facts, researched claims, interpretations, and generated writing visibly distinct. Real seen-job rows live only in the authenticated private `app.seen_jobs` Supabase store; Persona-Library owns the reusable deduplication behavior, client/storage integration contract, and database schema/migration, not the user-specific rows.

### Repeated-search deduplication

Repeated searches must not present previously shown jobs as new by default. After discovery, derive the strongest stable identity available—source + stable job ID first, then canonical URL, then a conservative `company + title + location` fingerprint. Read the authenticated private `app.seen_jobs` store before display, suppress matches, present genuinely new jobs, then record only the jobs actually shown afterward. Tracking-only URL parameters must not create a new identity. No rejected/applied/expired lifecycle state, `last_seen` history, repost state machine, or application tracker is required for this behavior.

### Opportunity-discovery queries and coverage

For web-based discovery of current openings, Elena Marin uses the external [Creative Job Discovery package](https://github.com/rickvang/SkillRepo/tree/main/codex/primitives/creative-job-discovery) and its [ATS/company-career query bank](https://github.com/rickvang/SkillRepo/blob/main/codex/primitives/creative-job-discovery/references/search-query-bank.md). SkillRepo owns the reusable query instructions; Persona-Library owns this workflow integration. A source reference does not prove that the Skill or Google is installed, callable, permitted, or available in the current runtime.

Adapt the queries to the active candidate's target titles, supported adjacent roles, work outcomes, geography, seniority, engagement types, and search window. Include relevant ATS-domain and company-career families; the bank covers Greenhouse, Lever, Ashby, Workday, iCIMS, and Taleo, with optional URL refinements and simpler-query fallbacks. An employer-only, company-only, or source-limited brief may omit broader families with a recorded reason. Do not run every provider mechanically or silently replace the broader discovery lanes with exact-title searches.

Each search run returns compact coverage alongside its ranked leads: search engine/source, family and provider/employer scope, exact executed query or checked URL, actual recency filter, observation time, outcome, and employer/ATS verification follow-up. Distinguish `searched`, `no_results`, `unavailable`, and `skipped`, explain unavailable/skipped coverage, and preserve actual fallback queries and material blind spots. A planned query is not an executed search; a combined-domain query is not exhaustive provider coverage.

Search-engine date filters and ATS update timestamps do not establish original posting dates. Verify publication-window claims against employer-provided publication evidence, keep unknown dates unknown, and separately check open status and the application path. Canonicalize duplicate employer/ATS/board copies and apply seen-job suppression before displaying the results. Keep actual queries, findings, candidate facts, and job history in private run state rather than committed library records. The Applications tracker schema and seen-job persistence contract remain unchanged.

## ATS-primary application packet

The default application path is ATS-first: identify the active Candidate Context, read its standing decisions, resolve any standing-decision-designated **Candidate Baseline Resume**, maintain one shared evidence source, map the target requirements, render one semantically structured ATS resume, and run both evidence-integrity and baseline-integrity review. This is the smallest useful path for most applications.

A Candidate Baseline Resume is a private, candidate-owned composed artifact such as an explicitly promoted master resume. It is not factual evidence and it is not the canonical reusable Template. When the active standing decisions designate one, it is the default composition baseline for the candidate's career spine. Role tailoring may change emphasis, summary language, supported skills, and selected achievements, but it must not silently reconstruct or replace the protected career spine from secondary profile stores or stale summaries.

Create a human-facing resume only when the target channel accepts it and the review context gives it a meaningful advantage. Do not create two near-identical versions by habit. When no human-facing version is warranted, record that decision and use ATS-to-ledger integrity rather than an empty ATS-versus-human parity exercise.

### Reusable Template source contract

`rickvang/template-library` is the canonical owner of reusable starting artifacts. Persona-Library may catalog Template identity, applicability, relationships, and verified source evidence, but it does not own the starter files.

Resolve the catalog identity, external path/entrypoint and revision only when selecting a reusable Template from `rickvang/template-library`. Its starter remains independently owned after a private role-specific copy is made. If that selected source cannot be verified, stop the affected template use; do not silently promote a private packet into a public Template.

A candidate-designated native baseline or approved formatting reference can be used directly for private packet work. It does not require fresh Template research or a new catalog record. It never replaces original career evidence. Existing reusable choices include `template-resume-classic-single-column`, `template-cover-letter-evidence-led` and `template-job-application-notes`; load only a choice actually needed.

### Shared evidence source

Before drafting, maintain one evidence inventory or claim ledger containing:

- source ID and exact source passage or artifact;
- action, attribution, scope, method, outcome, metric, and uncertainty;
- target-role relevance and confidence;
- approved wording or unresolved question;
- destination in the regular résumé, conditional format variant, cover letter or portfolio.

The ledger is authoritative. Candidate facts, researched claims, interpretations, generated wording, assumptions, and unknowns remain visibly distinct.

Reuse the existing approved inventory. For a routine packet, add or confirm only new or materially changed claims; do not rebuild the candidate's ledger or make a second per-role copy.

### Positioning layer and artifact-specific evidence rigor

Do not send the evidence ledger directly into prose. Identify the role-relevant themes, candidate-approved abstractions, voice cues, useful omissions and uncertain areas before writing. For routine work this short positioning brief may be held in the batch context or tracker notes; it need not be a separate document. It is an interpretive bridge, not a second evidence source.

Apply evidence rigor according to the artifact:

- Résumé and any format variant: use high exactness for dates, titles, employers, metrics, tools, credentials, ownership, scope, and outcomes. Plain-text extraction and material-claim integrity remain strict.
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

The regular résumé must be readable, extractable and clear about titles, dates, employers, clients, scope and outcomes. Use supported role terminology naturally. Do not hide claims in graphics, stuff keywords, silently resolve ambiguous facts or claim untested parser behavior.

### Accessible document production and export verification

Use semantic headings, clear linear text and native contact links. Follow candidate-confirmed list/formatting conventions; use native list semantics where the selected format supports them. Preserve supplied tags and document language through export or necessary cleanup. Check extraction/order, destinations and every final page as part of the combined review. Tagged output does not establish live screen-reader behavior; local extraction does not establish employer parsing. Record those limits without adding a separate report.

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

Check accepted formats and limits when available in the actual application instructions. Use provider-specific rules only for a documented constraint, observed parsing issue or explicit request; a portal name or generic checker proves neither compatibility nor a vendor preference. Record only the relevant observed requirement and untested scope in existing private context. GPT Work/Application Entry can repair parsed fields separately without generating extra documents by default.

Keep target employer/role context in application metadata and the letter; add a target line to the résumé only when requested or required. Keep metrics in their evidence-backed role and repeat only when it helps the reader.

### Optional human-facing resume

The regular résumé already receives human and visual review. Create a second rendering only for a channel constraint, demonstrated need or explicit request. Preserve material meaning and compare the variants' wording, chronology and attribution; inspect every final page in each submitted format. Do not imply that a second rendering is inherently more accessible or parser-safe.

### Future human-facing templates

Reusable human-facing templates are separate design assets, not application outputs and not automatic application outputs. Keep them content-free or use clearly marked sample content; do not copy private candidate facts or employer-specific claims into a reusable template.

A template should define its intended audience, scan path, hierarchy, density, accessibility, responsive or page behavior, safe text structure, and the conditions under which it should not be used. Build or maintain a template only when repeated human-facing work justifies it. Instantiating a template for a specific application remains an explicit, separately reviewed step.

### Review and integrity gate

Use the routine path's combined final review; its criteria apply to the actual source revision and final files. Check role fit/voice, evidence and chronology, supported Skills, employer/client grouping, extraction/order, links, full-page layout and unwanted attachments/actions. A selected external Template needs source verification; a second rendering needs content parity. Neither is mandatory for a candidate-designated native source.

Requested cover letters use the same factual evidence and add interpretation and useful contribution rather than reciting the résumé. Prefer the designated approved letter source/formatting when provided; otherwise use a verified starter only when one is needed. Do not copy another employer's wording. Preserve unknowns and distinguish local checks from live ATS or screen-reader testing. Application Entry owns later form checks and submission authorization.

### Work Order tracking

Applications owns the role's lifecycle, packet link, brief answers/unknowns and next action. Current Work is the concise index for a substantial workstream. A Work Order is optional under [the repository recovery-state rule](../work-orders.md); when needed, it records only unique execution/recovery detail and links to the existing tracker, candidate evidence and artifacts. Do not duplicate those contents or create a Work Order for every packet.

## Phased delivery

These phases describe wider search and exception cases. Routine packet production uses the short path above and does not wait for tracker access or require a new reusable Template.

### Phase 0 — Define the search

- Capture role family, level, industry, geography, work mode, compensation, timing, and constraints.
- Define a primary target plus acceptable adjacent targets.
- Create an evidence inventory: outcomes, scope, decisions, artifacts, metrics, and examples.

### Phase 1 — Role and evidence alignment

- Parse a job description into responsibilities, capabilities, outcomes, and signals.
- Map each requirement to evidence, confidence, and a gap or follow-up question.
- Produce a candidate-approved positioning brief and role-specific evidence shortlist.

### Phase 2 — Application packet

Follow the routine path above. Reuse current evidence and approved formatting; create only the requested private documents. Portfolio selection or substantial form narratives are additional work only when requested or required.

### Application preflight — before final review

Within the combined review, check reverse chronology, month precision, missing/inconsistent dates, repeat engagements, overlaps and grouped-history attribution. Preserve legitimate ambiguity; do not invent precision or merge distinct employment periods. Resolve unsupported changes before readiness. Keep findings in existing private context.

### Phase 3 — Quality review

Apply the combined review and integrity gate above. Use independent review only for a request or unresolved judgment; keep its actual evidence and limits. A failed check keeps the affected file unready. Correct in the source and re-export, then recheck affected evidence.

### Phase 4 — Outreach and interview

- Create targeted outreach and follow-up messages.
- Prepare evidence-led interview stories and questions.
- Practice likely role-specific scenarios and evaluate answers against the same quality model.

### Phase 5 — Search learning loop

- Use the authenticated private `app.seen_jobs` store so repeated discovery checks do not resurface openings already presented as new; read before display and record only presented results afterward.
- Use the Applications tracker as the lifecycle store for tracked opportunities while the Work Order references only the minimum operational state needed. Set `Applied` and `appliedDate` only after a confirmed submission, and advance interview, offer, or closure states only from confirmed events; never infer those transitions. Keep this lifecycle state separate from the seen-job deduplication contract.
- Separate market feedback from noise and small-sample assumptions.
- Update target roles, evidence gaps, positioning, and materials only when the evidence justifies it.

## Quality gates

### Template-source quality

- Every reusable application artifact has a Template ID and a verified `rickvang/template-library` path, `README.md` entrypoint, and Git revision before use.
- The documented `starter/` copy boundary exists and is non-empty.
- A missing selected external Template stops its use; a candidate-designated native source needs no new Template record.
- Candidate facts and role-specific content live only in the instantiated private artifact, not the reusable Template source.
- Persona-Library does not claim a proposed external Template is canonical on `main` until the source path and entrypoint actually resolve there.

### Candidate-baseline quality

- Any standing-decision-designated baseline/master was resolved and read before resume drafting.
- The regular résumé and any format variant passed **baseline-to-output** integrity by comparing the protected baseline career spine against the role-specific output.
- Name/contact, employer/title/date/location chronology, employer/client hierarchy, recent employers, education, certifications, and candidate-confirmed historical grouping are unchanged unless a supported correction or explicit candidate decision authorizes the difference.
- Every material baseline omission is recorded as `omitted_with_reason`; every protected-field change identifies its evidence or decision basis.
- Secondary profile stores and stale summaries did not replace unresolved authoritative private sources.
- Reusable Template verification remains separate from candidate-baseline verification.

### ATS default quality

These extraction and integrity criteria apply to the regular résumé, without implying a separate ATS document or live parser test.

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
- Claims are specific, credible, and supported by the same evidence as the regular résumé.
- Visual emphasis follows target-role relevance and evidence, not decoration.
- Content remains readable, accessible, truthful, and reasonably parseable.
- Material differences from the regular résumé are recorded and meaning is preserved.

### Optional human-template quality

- The template is a separate, reusable artifact rather than a candidate-specific application output.
- Audience, scan path, hierarchy, density, accessibility, page or responsive behavior, and safe text structure are explicit.
- Sample content is clearly illustrative; private facts and employer-specific claims are not embedded.
- Use conditions, non-use conditions, and instantiation review are documented.
- The template does not bypass shared evidence or the routine combined review.

## Deliberately out of scope for the MVP

- Automatic job scraping or mass application submission
- Unverified salary, culture, or hiring-probability claims
- Autonomous outreach or recruiter messaging
- A single universal human-facing resume template or automatic human rendering for every application
- An aggregate score that pretends to replace judgment
- Hosting private candidate job history inside Persona-Library
- Full CRM-style application reminders or campaign automation

The [seen-job deduplication contract](../job-search/job-ledger-contract.md) is in scope for suppressing openings already presented in repeated searches using the existing private Supabase data layer. A separate job database, second Supabase project, or Applications-lifecycle expansion is not.

These other items remain future opportunities, not implied capabilities of the current reference page.

## Validation questions

- Do unqualified requests route directly to the applicable Skill or specialist, with Priya operating full-outcome job-search work and the Playbook remaining the process surface rather than an actor?
- Can a narrow strategy, hiring, writing, outreach, visual, or document question route directly to Elena, Marcus, Leah, Samira, the applicable UI Skill, or Sofia?
- Do repeated searches avoid presenting previously shown jobs as new by default, using the seen-job deduplication contract?
- When opportunity/application tracking is in scope, does the workflow resolve an existing Applications tracker record before creating a duplicate?
- Does authenticated Supabase remain primary persistence when configured, with browser-local state limited to explicit fallback, migration, and recovery?
- Are `postingDate` values source-backed only, and are `Applied`, `appliedDate`, interview, offer, and closure transitions recorded only from confirmed events?
- Does each selected external Template resolve to its verified source, while a candidate-designated native source remains usable directly?
- When a selected external Template is missing, does the workflow stop that use without silently promoting a private packet into the catalog?
- When standing decisions designate an active Candidate Baseline Resume, is that exact private artifact resolved before drafting?
- Does the role-specific resume preserve the baseline career spine or record every material difference with evidence and an explicit disposition?
- Are secondary profile stores prevented from substituting for an unresolved designated baseline or authoritative evidence source?
- Can a candidate explain why a role is in or out of scope?
- Can each important claim in an application be traced to evidence?
- Does the preflight catch wrong role order even when the content and visual review look good?
- Does the ATS pass improve retrieval without making the writing unnatural?
- Does the positioning layer preserve candidate voice while keeping material facts and role coverage stable?
- Are candidate edits routed by consequence instead of receiving the same sentence-level evidence scrutiny?
- Can a reviewer identify fit, level and contribution quickly in the regular résumé?
- Does visual treatment support the context rather than merely signal taste?
- Does feedback change the search model only when it is repeated or well-supported?
- Does the heading structure make section boundaries obvious to a parser?
- Does the resume preserve employer-of-record and client attribution without relying on visual indentation?
- Does the resume keep target context in the Work Order while keeping the resume reusable?
- Do any highlights or alignment sections add distinct value instead of repeating experience or skills?
- Do links, headings, dates and categorized skills survive export/extraction, with supplied tags/language preserved and untested assistive-technology behavior stated?
- Does the rendered file preserve page flow without clipping, orphaned content, or a stray list item?
- Are exact candidate-specific typography, color, and spacing settings kept in the private artifact or document spec rather than treated as universal rules?
