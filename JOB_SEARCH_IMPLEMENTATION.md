# Job search system implementation plan

## Purpose

Build a research-backed job-search workspace that helps a person define a target, interpret a role, turn real experience into evidence, write an ATS-compatible application, preserve human readability and aesthetics, and learn from each submission.

The system should optimize for truthful fit and useful clarity—not keyword stuffing, generic personal branding, or visual polish detached from the role.

This is a playbook, not a new persona category. It composes existing Personas, Skills, persona-owned workflows, shared evidence, artifacts, decision rights, quality gates, and a learning loop around one outcome.

## Recommended operating model

Use one primary candidate persona with a coordinated set of specialist lenses:

1. **Job seeker** — source of truth for goals, constraints, experience, preferences, voice, and evidence.
2. **Search strategist** — defines target roles, search boundaries, positioning, channels, and prioritization.
3. **Hiring manager / role calibrator** — interprets the role, separates required signals from noise, and defines what success would look like.
4. **ATS application specialist** — checks parsing, terminology alignment, structure, and truthful coverage.
5. **Human narrative editor** — improves clarity, relevance, voice, credibility, and story.
6. **Visual communication reviewer** — checks hierarchy, aesthetics, portfolio presentation, and context-appropriate polish.
7. **Research and verification analyst** — researches companies, teams, role expectations, and evidence.
8. **Outreach and interview coach** — prepares networking messages, follow-ups, interview stories, and questions.
9. **Job-search orchestrator** — coordinates the lenses, preserves decisions, and keeps the search coherent over time.

ATS and human review must remain separate gates. A document can be technically parseable but unconvincing to a person, or visually polished but semantically weak for a screening system.

## MVP scope

The first build is a responsive reference surface plus actual working-draft persona records, not a full application tracker. It includes:

- The persona and responsibilities of each supporting role
- Five new job-search persona records in Personas: Avery Brooks (job seeker), Elena Marin (career search strategist), Marcus Chen (hiring-side role calibrator), Leah Okafor (application narrative editor), and Samira Nguyen (outreach and interview coach)
- Reuse of Camille Ortiz for visual communication review and Riley Morgan for orchestration
- Full workflow inventories, activity-level priorities and representative tools, skills, evidence status, and end-of-page source trails on each new record
- The end-to-end search workflow
- Quality gates for ATS compatibility, human readability, evidence, and visual communication
- A clear boundary between current capabilities and later product work

The new records are synthetic composites. They are intentionally marked as working drafts and should be refined with the person’s actual target, industry, constraints, employer process, and source documents.

The first workflow is:

`Define target → Analyze role → Map evidence → Draft application → ATS review → Human review → Submit → Learn`

## Data model

Each future job-search record should preserve:

- Candidate goals, constraints, target roles, and acceptable adjacent roles
- Job description, source URL, company context, and research date
- Requirement-to-evidence mappings with confidence and gaps
- Resume, cover letter, portfolio, outreach, and interview artifacts
- ATS review findings and human review findings as separate records
- Version history, decisions, submitted date, outcome, and learning
- Open questions and what evidence would change the search strategy

Keep candidate facts, researched claims, interpretations, and generated writing visibly distinct.

## Phased delivery

### Phase 0 — Define the search

- Capture role family, level, industry, geography, work mode, compensation, timing, and constraints.
- Define a primary target plus acceptable adjacent targets.
- Create an evidence inventory: outcomes, scope, decisions, artifacts, metrics, and examples.

### Phase 1 — Role and evidence alignment

- Parse a job description into responsibilities, capabilities, outcomes, and signals.
- Map each requirement to evidence, confidence, and a gap or follow-up question.
- Produce a truthful positioning statement and role-specific evidence shortlist.

### Phase 2 — Application packet

- Draft a resume or application using the evidence map.
- Draft a cover letter only when it adds context, motivation, or a relevant connection that the resume cannot carry.
- Generate portfolio or case-study emphasis for design-oriented roles.

### Application preflight — before the council

Run a small deterministic structural check before persona review. This is a builder rule, not a judgment the personas should have to remember:

- Parse every role’s start and end date into a consistent month-level representation.
- Sort the employer-facing resume reverse chronologically by end date unless a deliberate functional format is documented.
- Check for missing dates, inconsistent date formats, duplicate employer records, same-month ties, and month-level overlaps.
- Preserve source ambiguity. Do not invent day-level precision to make the timeline look cleaner.
- Carry the preflight result into the ATS, human-reader, and integrity reviews so a polished draft cannot hide a basic chronology error.

Leah owns the ATS and human-readable review of the result. Riley records the flags and reconciliation decision. A failed ordering check should stop the packet before council synthesis; an overlap or same-month ambiguity should remain visible until the source is confirmed or the user explicitly accepts it.

### Phase 3 — Quality review

- Start with the preflight result rather than relying on visual inspection or persona memory.
- Run the ATS pass for parseability, terminology coverage, structure, and truthful alignment.
- Run the human pass for clarity, credibility, narrative, specificity, and role fit.
- Run the visual pass for hierarchy, scan path, density, typography, and context.
- Record unresolved tradeoffs instead of silently flattening them.

### Phase 4 — Outreach and interview

- Create targeted outreach and follow-up messages.
- Prepare evidence-led interview stories and questions.
- Practice likely role-specific scenarios and evaluate answers against the same quality model.

### Phase 5 — Search learning loop

- Track submissions, responses, interviews, and rejection signals.
- Separate market feedback from noise and small-sample assumptions.
- Update target roles, evidence gaps, positioning, and materials only when the evidence justifies it.

## Quality gates

### ATS quality

- The document parses into the intended sections.
- Role-relevant terminology appears naturally where supported by evidence.
- Dates, titles, employers, and outcomes remain unambiguous.
- Roles are reverse chronological, or the chosen alternative format is explicitly documented.
- Missing dates, month-only ambiguity, duplicate employers, and overlaps are flagged rather than silently resolved.
- Formatting does not hide important content from extraction.

### Human quality

- The first scan communicates role, level, and relevant value quickly.
- Claims are specific, credible, and supported by examples.
- The story reflects the target role without erasing the candidate’s voice.
- The cover letter adds a useful connection rather than repeating the resume.

### Visual quality

- Hierarchy supports the reader’s decision path.
- Density is appropriate to the role and reading context.
- Aesthetic choices fit the industry, seniority, and medium.
- Portfolio visuals clarify decisions and outcomes rather than acting as decoration.

### Integrity quality

- No invented metrics, tools, responsibilities, or outcomes.
- Uncertainty and gaps are visible.
- Generated language is edited against the candidate’s actual voice.
- Company research is dated and sourced.

## Deliberately out of scope for the MVP

- Automatic job scraping or mass application submission
- Unverified salary, culture, or hiring-probability claims
- Autonomous outreach or recruiter messaging
- A single universal resume template
- An aggregate score that pretends to replace judgment
- Persistent application tracking and reminders before the evidence model is stable

These are future opportunities, not implied capabilities of the current reference page.

## Validation questions

- Can a candidate explain why a role is in or out of scope?
- Can each important claim in an application be traced to evidence?
- Does the preflight catch wrong role order even when the content and visual review look good?
- Does the ATS pass improve retrieval without making the writing unnatural?
- Can a human reviewer identify fit, level, and contribution quickly?
- Does visual treatment support the context rather than merely signal taste?
- Does feedback change the search model only when it is repeated or well-supported?
