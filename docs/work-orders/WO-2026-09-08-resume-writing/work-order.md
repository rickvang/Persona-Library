# Resume Writing Work Order

A project-scoped work packet for evidence-grounded resume writing. This file tracks the work; it is not a resume, a source-of-truth career record, or permission to submit an application.

## Header

- Work Order ID: WO-2026-09-08-resume-writing
- Title: ATS-first resume application packet with optional human-facing rendering
- Status: ready-for-review
- Created: 2026-09-08
- Last updated: 2026-09-09
- Requester: user
- Current owner: Codex
- Request mode: artifact-generation
- Proportionality tier: feature
- Change mode: artifact-generation
- Change domain: project-scoped job-search documents
- Artifact home: docs/work-orders/WO-2026-09-08-resume-writing/
- Authorized repository target: Persona Library Work Order documentation
- Authorized private artifact target: Google Drive job applications / Codex / WO-2026-09-08-resume-writing
- Stopping condition: pause before any submission or private-draft edits that depend on unresolved user-owned facts

This is a non-trivial project, so the package directory is warranted. Only this Work Order is stored in the public repository. Resume content and private Drive identifiers are intentionally kept out of it.

## Scope and outcome

For this Work Order, the canonical application output is one ATS-oriented resume rendered from a shared evidence ledger. A human-facing resume is optional and is created only when the target channel or review context justifies it. Reusable human-facing templates are separate future design assets, not automatic application outputs.

1. One shared evidence inventory or claim ledger.
2. One ATS-oriented resume rendering as the default application artifact.
3. An optional human-facing resume rendering only when its benefit and channel fit are recorded.
4. A separate cover letter only when it adds useful, role-specific context or is required.
5. A claim-to-ledger integrity review; add an ATS-to-human parity comparison only if an optional human version exists.

The ATS version is the canonical submission candidate. The optional human version is a linked rendering, not an independent story. External submission, outreach, publication, and employer contact remain separate authorized actions.
Target employer, role, location, and work-mode context remain in this Work Order and the requirement map; the resume body does not receive a target line by default.

## Existing process and routing
### Candidate-specific standing decisions

Before role alignment and drafting, read the private candidate standing-decision record when available. For this run, the record was created in the private job applications folder and the current ATS and evidence artifacts reflect its confirmed structure decisions. The record is private; no link or identifier is stored here. A missing or conflicting record is reported in the Work Order and held for Rick’s review.


Use the repository's existing job-search contract:

- [Job search implementation plan](../../../JOB_SEARCH_IMPLEMENTATION.md)
- [Application Packet Work Order template](../../../docs/job-search/application-work-order-template.md)
- [Repository Work Order convention](../../work-orders.md)
- [Project-context and reference routing](../../ux/project-context-and-reference-routing.md)

Suggested review routing uses existing records only:

- Avery Brooks / job-seeker: candidate goals, constraints, voice, and evidence framing. Avery is a synthetic composite and cannot stand in for the requester.
- Leah Okafor / application-editor: requirement mapping, writing, ATS structure, human readability, and integrity.
- Sofia Calder / document-designer: ATS document structure, production, accessibility, and export fidelity; human-facing work is conditional.
- Camille Ortiz / ui-expert: visual communication review when a human-facing version needs it.
- Riley Morgan / ai-orchestrator: coordination, decisions, and claim integrity; optional version parity when a human-facing output exists.

These are review perspectives, not user evidence. Do not create or merge Personas for this Work Order.

Routing convention for future application chats: “Consult Riley Morgan” means Riley coordinates the smallest relevant Persona panel and synthesizes the independent perspectives; it does not mean Riley is the sole reviewer. For cover-letter work, use Avery, Leah, Marcus, and Riley by default, adding Sofia for production or accessibility and Samira for outreach or interview carryover. Exclude prior drafts when the requester asks for a fresh design unless they explicitly opt them in.

## Project profile and destination

| Field | Current value | Evidence status |
| --- | --- | --- |
| Project type | Document or application output | Inferred from the request; provisional |
| Primary outcome | Centstone Senior UX Designer ATS-first application packet | User request; public posting read |
| Audiences | ATS or employer intake and human reviewer | Existing job-search contract |
| Primary lens | Document constraints, evidence mapping, ATS and human parity | Existing project-routing guidance |
| Proportionality | Feature: ATS version plus integrity review; human version optional | Based on the revised process decision |
| Candidate source of truth | The requester and their authorized career evidence | A 07/26 baseline was selected for the initial master copy |
| Working destination | Private Google Drive job applications / Codex / this Work Order ID | Folder created and verified |

A private Drive structure was located with separate Codex and Claude areas. The requester selected the 07/26 resume as the basis for a new master template. A per-run folder was created under the Codex area, and a native Google Docs copy named Rick Vang Resume — Master Template (Draft) was created there. The original source was not changed.

The refined ATS resume was subsequently promoted to the active master-template baseline and renamed Rick Vang Resume — Master Template. The earlier draft remains intact as a superseded reference; it is not the active template.

The exact Drive URLs, IDs, and personal content are intentionally not copied into this public repository. The copy link and folder link are returned in the task handoff.

## Source discovery and copy verification

Source discovery is complete for initialization.

- Source treatment: the 07/26 resume is the approved starting source for the draft master copy.
- Copy mode: native document copy; source structure retained.
- Source topology: one tab.
- Destination topology: one tab with matching order and structure.
- Content check: normalized copied text matches the source; 102 paragraphs on each side.
- Mutation check: source remained unchanged; the destination is private and isolated to this run.
- Content status: the copied document is a starting master draft, not yet reconciled as the final evidence ledger.

The copied document preserves historical resume content so it can be reviewed and reconciled. It must not be treated as current truth for a target application until the requester approves the source and material claims.

## Source evidence and current gaps

The shared private evidence ledger now maps the public Centstone posting to source-backed claims and explicit gaps. It is the source of truth for the ATS resume and any later optional human-facing rendering.

Known unknowns:

- Direct usability-testing evidence is not present in the selected source.
- WCAG 2.1 specificity is unconfirmed; the source supports only accessibility standards and compliance guidelines.
- Agile wording, enterprise-application wording, on-site/contract availability, work authorization, and current Quva status require confirmation.
- The source contains two STG Consulting employment periods because Rick left and later returned; client dates and any month-level overlaps were preserved rather than silently normalized.
- No employer ATS parser, recruiter review, real-user test, or historical comparison was run.
- No cover letter was requested.

Keep facts, researched claims, interpretations, generated writing, assumptions, recommendations, and unknowns distinct. Never fill an evidence gap with plausible detail.

## Planned output contract

| ID | Planned artifact | Status | Required relationship |
| --- | --- | --- | --- |
| MASTER | Native resume master template copy in the private run folder | Promoted — active ATS baseline | Canonical formatting and content baseline for future renderings; claims remain governed by the shared evidence ledger |
| OUT-ATS | ATS resume version (canonical) | Promoted into MASTER | The active master is the ATS-safe, role-ready rendering; tailor from it for future applications |
| OUT-HUMAN | Human-facing resume version (optional) | Retained as reference; not canonical | Create only when channel/review context warrants it; render from the same ledger |
| OUT-LETTER | Tailored cover letter | Not requested / unknown | Separate artifact; uses the same ledger and adds context |
| ART-EVIDENCE | Evidence inventory or claim ledger | Created in private run folder | Source of truth for all material claims |
| ART-PARITY | Claim integrity and optional version parity review | Created in private run folder | Compares ATS to ledger; includes ATS/human parity only when OUT-HUMAN exists |
| ART-VALIDATION | Concise review and limitations | Recorded in ART-PARITY | Records checks actually performed; human review is conditional |

Future project artifacts should be created in the authorized private Drive run folder unless the requester names another target. The public Persona Library stores the process and Work Order index, not private resume content by default.

For this ATS-first run, the resume uses conventional section labels: `SUMMARY`, `WORK EXPERIENCE`, `EDUCATION`, `CERTIFICATIONS`, and `SKILLS`. `Additional Employers / Various Roles` remains a grouped H2 entry under `WORK EXPERIENCE`; it is not a separate top-level section. The target line is omitted. Accomplishments remain under the relevant roles, and supported capabilities remain in `SKILLS`; `SELECTED IMPACT` and `CORE ALIGNMENT` are not used as default sections.
Provider profile: none was available for this run. Employer or portal-specific parser behavior remains unknown; any generic downstream validator must be recorded as tool compatibility evidence rather than vendor evidence.

The packet must not:

- invent metrics, tools, responsibilities, employers, titles, dates, outcomes, or motivation;
- stuff keywords or hide meaning in graphics;
- silently normalize ambiguous chronology;
- claim a specific ATS parser or human response was tested when it was not;
- overwrite a prior Drive document without identifying the target and preserving its current content;
- submit both resume versions unless explicitly requested by the employer or requester.

Synthetic Personas may surface questions or design risks, but their responses remain synthetic assumptions and never become user research or candidate facts.

## Progress and gates

| Phase | Status | Gate or blocker | Smallest next action |
| --- | --- | --- | --- |
| Load candidate standing decisions | Complete | Private record located and read; confirmed candidate structure decisions applied | Continue source and evidence review |

| Initialize Work Order and route request | Complete | Classification is provisional | Confirm target role and output |
| Select 07/26 source and initialize master copy | Complete | Native copy verified; source unchanged | Review or approve the copied master |
| Build shared evidence ledger | Complete | Shared ledger created; unsupported claims are marked partial or unknown | Review open questions before submission |
| Analyze target role | Complete with open questions | Public Centstone posting read and mapped to source evidence | Resolve user-owned unknowns before submission |
| Render ATS version | Complete — human reference styling, grouped Additional Employers / Various Roles, final section order, and accessibility refinements applied; promoted to MASTER | Active master rendered from the shared ledger; native readback confirms the updated color, typography, heading treatment, links, and section order | Create role-specific renderings from the master when needed |
| Render human-facing version | Complete — reference only / optional | Draft retained as a reference; not canonical | Use only if channel/review context warrants it |
| Review integrity and optional parity | Complete with open questions | ATS-to-ledger integrity passed; ATS/human differences documented for the retained reference | Resolve chronology and requirement gaps |
| Cover letter | Not requested / unknown | No request or role context | Decide after target role is known |
| Select or submit | Not authorized | No submission permission or channel | Keep submission separate from drafting |

A failed gate returns to the smallest responsible phase. A missing source or target is blocked, not guessed. A Work Order can close as no-go if the required evidence or authorized destination cannot be obtained.

## Next inputs requested

1. Confirm the ATS resume content and resolve the open evidence questions before any submission.
2. Confirm whether the human-facing reference should remain archived or be used for a specific channel.
3. If repeated human-facing work justifies it, authorize a separate, content-free human template design effort.
4. Request a cover letter separately if the application requires one.

No submission is implied by any draft, review, or Work Order status.

## Authorization and reconciliation boundary

This run read the connected Drive, located the authorized private source, created the private run folder and native master copy, and created the evidence ledger and resume review artifacts inside that run folder. It did not edit the original, share files, submit applications, contact employers, or publish resume content.

It changes only this project-scoped Work Order in the Persona Library repository and does not change canonical Personas, Skills, Tools, Playbooks, or Site output. Future human-facing templates, if authorized, should remain separate reusable design assets. If a later run changes shared repository guidance or records, it must inspect affected files, document the change, and run the repository's applicable reconciliation and validation process before completion.

## Current run result — Centstone Senior UX Designer

The requested target context is now supplied: [Centstone Senior UX Designer](https://www.ziprecruiter.com/c/Centstone/Job/Senior-UX-Designer/-in-South-Saint-Paul%2CMN?jid=21b5bb41545ea05f), South Saint Paul, Minnesota, on-site contractor role. The public posting was read for role alignment; it is not candidate evidence.

- Routing: Riley Morgan coordinated Leah Okafor for role alignment/copy, Sofia Calder for document production, and Camille Ortiz for human-facing hierarchy review. These remain synthetic review lenses, not user evidence.
- Source: the private native master copy based on Rick Vang Resume 07/26. The original source was not edited.
- Created privately in the authorized run folder: one shared evidence ledger, one ATS resume, one human-facing resume, and one parity/integrity review. No cover letter was requested or created.
- Checks completed: source-to-master equality, single-column document structure, conventional semantic headings, list structure, placeholder scan, shared claim coverage, parity of material facts, and privacy/mutation boundaries.
- Result: the packet is ready for requester review. The refined ATS version is now the active master-template baseline and canonical ATS structure. The human version is retained as a reference rendering from the same evidence source and is not selected by default.
- Master promotion after requester review: renamed the refined ATS document to `Rick Vang Resume — Master Template` and designated it as the active baseline for future resume work. The earlier `Rick Vang Resume — Master Template (Draft)` remains intact as a superseded reference.
- Styling revision after requester review: applied the human reference's color and typography treatment to the canonical ATS version while preserving its text, section order, semantic headings, single-column structure, and claim set. Native Docs readback confirmed the section-heading, employer-heading, date-line, contact, and body-text styles.
- Grouping revision after requester review: treated `Additional Employers / Various Roles` as one grouped work entry under `WORK EXPERIENCE`, analogous to STG Consulting's employer-with-engagement structure, with `July 2007 – March 2015 | Various Locations` beneath the title. Each underlying employer, title, date range, location, and bullet remains intact; the aggregate line summarizes the preserved entries and does not invent an employer. The superseding decision was recorded in the private standing-decision record and evidence ledger.
- Structural revision after requester review: removed the target line, removed the duplicated impact and alignment sections, consolidated the supported capability list under `SKILLS`, initially moved `SKILLS` before `WORK EXPERIENCE`, and then moved `SKILLS` to the bottom beneath `EDUCATION` and `CERTIFICATIONS` at the requester's direction. Confirmed STG client engagements remain grouped beneath their employer period.
- Post-move formatting repair: removed inherited list metadata from the moved `SKILLS` heading, skill text, and trailing paragraph. Native Docs readback confirms the block is unbulleted and unindented like the original Skills section, with no extra bullet at the end.
- ATS heading revision after requester review: split `EDUCATION & CERTIFICATIONS` into separate `EDUCATION` and `CERTIFICATIONS` headings, keeping the degree under Education and the three credentials under Certifications.
- Accessibility revision after requester review: converted the email, website, and LinkedIn text into native hyperlinks while preserving the visible contact line, split the inline `SKILLS` string into four unbulleted categorized paragraphs while preserving every skill term, and bolded the four category labels for visual scanning. Employment date lines are now normal italic slate paragraphs rather than semantic headings, so screen-reader heading navigation stops at the actual section and employer headings.
- Typography refinement after requester review: set all seven employment date lines to 9.5 pt while preserving their italic slate styling and normal paragraph semantics.
- Layout refinement after requester review: confirmed the requested type scale across the ATS document—body 10 pt, employer headings 10.5 pt, section headings 11 pt, dates 9.5 pt, name 20 pt, and subtitle 12 pt—and added 2 pt before employer headings plus 2 pt after date lines without adding spacing between bullets. The refreshed PDF remains two pages, with the page break beginning with the final two related STG bullets rather than a single isolated bullet.
- List refinement after requester review: compacted all 37 native bullet paragraphs from 36/18 pt indentation to 24/12 pt indentation, preserving their native list IDs, standard bullet glyphs, and tagged-PDF list structure. The compacted master remains a tagged two-page PDF.
- Tagged-PDF and screen-reader audit: the current export succeeds as a 2-page, letter-size, tagged PDF with `Lang=en`; its structure tree contains the expected H1/H2 headings, paragraph date lines, list/list-item groups, and three `Link` nodes, and the PDF annotations resolve to the email, website, and LinkedIn URLs. Rendered page review found no clipping or orphaned headings; the final STG bullet continues intact at the top of page 2.
- Audit limitation: no live NVDA/JAWS session was run, so assistive-technology behavior beyond the exported PDF's tag tree, link annotations, extracted reading order, and rendered pages remains unverified.
- Employment attribution revision: STG Consulting is the employer for the confirmed indented C.R. England, EnerBankUSA, FamilySearch, ProDataKey, and JustServe engagements; the two STG periods remain separate because Rick left and later returned; Adobe and Idaho National Lab remain separate employers.
- Open findings: direct usability-testing evidence is not present; WCAG 2.1 specificity is unconfirmed; Agile wording is not asserted; on-site/contract availability and work authorization are unknown; current Quva status/end date needs confirmation; and month-level client overlaps remain visible rather than silently normalized.
- No submission, employer contact, publication, external sharing, or user-level skill installation was performed. Private Drive links and resume content remain out of the public repository.

## Completion boundary

This Work Order is complete only when a concrete packet or explicit no-go outcome is linked, the shared evidence source and version relationships are inspectable, integrity and parity limitations are recorded, and the requester knows what was actually tested. The packet is now ready for requester review; submission and any final factual correction remain separate authorized actions.
