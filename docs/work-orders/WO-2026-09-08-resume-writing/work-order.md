# Resume Writing Work Order

A project-scoped work packet for evidence-grounded resume writing. This file tracks the work; it is not a resume, a source-of-truth career record, or permission to submit an application.

## Header

- Work Order ID: WO-2026-09-08-resume-writing
- Title: Resume writing and dual-version application packet
- Status: ready-for-review
- Created: 2026-09-08
- Last updated: 2026-09-08
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

When the required inputs are confirmed, produce an evidence-grounded application packet:

1. One shared evidence inventory or claim ledger.
2. An ATS-oriented resume rendering.
3. A human-facing resume rendering when the target channel or review context warrants it.
4. A separate cover letter only when it adds useful, role-specific context or is required.
5. A parity and integrity review showing that the linked resume versions preserve the same material facts.

The ATS and human versions are linked renderings, not independent stories. The selected submission version must follow the employer's instructions. External submission, outreach, publication, and employer contact remain separate authorized actions.

## Existing process and routing

Use the repository's existing job-search contract:

- [Job search implementation plan](../../../JOB_SEARCH_IMPLEMENTATION.md)
- [Application Packet Work Order template](../../../docs/job-search/application-work-order-template.md)
- [Repository Work Order convention](../../work-orders.md)
- [Project-context and reference routing](../../ux/project-context-and-reference-routing.md)

Suggested review routing uses existing records only:

- Avery Brooks / job-seeker: candidate goals, constraints, voice, and evidence framing. Avery is a synthetic composite and cannot stand in for the requester.
- Leah Okafor / application-editor: requirement mapping, writing, ATS structure, human readability, and integrity.
- Sofia Calder / document-designer: document hierarchy, production, accessibility, and export fidelity.
- Camille Ortiz / ui-expert: visual communication review when a human-facing version needs it.
- Riley Morgan / ai-orchestrator: coordination, decisions, and version parity.

These are review perspectives, not user evidence. Do not create or merge Personas for this Work Order.

## Project profile and destination

| Field | Current value | Evidence status |
| --- | --- | --- |
| Project type | Document or application output | Inferred from the request; provisional |
| Primary outcome | Centstone Senior UX Designer application packet (ATS + human-facing) | User request; public posting read |
| Audiences | ATS or employer intake and human reviewer | Existing job-search contract |
| Primary lens | Document constraints, evidence mapping, ATS and human parity | Existing project-routing guidance |
| Proportionality | Feature: two linked versions plus integrity review | Based on the requested workflow |
| Candidate source of truth | The requester and their authorized career evidence | A 07/26 baseline was selected for the initial master copy |
| Working destination | Private Google Drive job applications / Codex / this Work Order ID | Folder created and verified |

A private Drive structure was located with separate Codex and Claude areas. The requester selected the 07/26 resume as the basis for a new master template. A per-run folder was created under the Codex area, and a native Google Docs copy named Rick Vang Resume — Master Template (Draft) was created there. The original source was not changed.

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

The master copy is not itself a structured evidence ledger. Before drafting target-specific outputs, create a separate private evidence artifact that records exact source passages or artifacts.

Known unknowns:

- Target role, employer, job posting, source URL, and research date.
- Role family, level, geography, work mode, timing, and constraints.
- Which resume claims, dates, titles, employers, contributions, tools, metrics, and attribution remain current.
- Desired output format and whether the private run folder is the final destination.
- Whether a cover letter is wanted or required.
- Employer-specific parser or submission instructions.
- Candidate voice, preferences, and acceptable omissions.
- Whether any previous ATS or human draft should be compared, preserved, or superseded.
- Whether the selected source contains claims that need correction before reuse.
- Whether the requester wants a general master resume first, a target-specific packet, or both.

Keep facts, researched claims, interpretations, generated wording, assumptions, and unknowns distinct. Never fill an evidence gap with a plausible detail.

## Planned output contract

| ID | Planned artifact | Status | Required relationship |
| --- | --- | --- | --- |
| MASTER | Native resume master template copy in the private run folder | Created as draft | Starting source for later reconciliation; not yet a final evidence ledger |
| OUT-ATS | ATS resume version | Created in private run folder | Rendered from the shared evidence ledger |
| OUT-HUMAN | Human-facing resume version | Created in private run folder | Rendered from the same ledger; differences are intentional and recorded |
| OUT-LETTER | Tailored cover letter | Not requested / unknown | Separate artifact; uses the same ledger and adds context |
| ART-EVIDENCE | Evidence inventory or claim ledger | Created in private run folder | Source of truth for all material claims |
| ART-PARITY | Version parity and integrity review | Created in private run folder | Compares the actual final artifacts |
| ART-VALIDATION | Concise review and limitations | Recorded in ART-PARITY | Records checks actually performed |

Future project artifacts should be created in the authorized private Drive run folder unless the requester names another target. The public Persona Library stores the process and Work Order index, not private resume content by default.

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
| Initialize Work Order and route request | Complete | Classification is provisional | Confirm target role and output |
| Select 07/26 source and initialize master copy | Complete | Native copy verified; source unchanged | Review or approve the copied master |
| Build shared evidence ledger | Complete | Shared ledger created; unsupported claims are marked partial or unknown | Review open questions before submission |
| Analyze target role | Complete with open questions | Public Centstone posting read and mapped to source evidence | Resolve user-owned unknowns before submission |
| Render ATS version | Complete | Draft rendered from the shared ledger | Review content and parser suitability before submission |
| Render human-facing version | Complete | Draft rendered from the same ledger with a separate reading hierarchy | Review content and visual fit before submission |
| Review parity and integrity | Complete with open questions | Actual ATS and human drafts compared; findings recorded | Resolve chronology and requirement gaps |
| Cover letter | Not requested / unknown | No request or role context | Decide after target role is known |
| Select or submit | Not authorized | No submission permission or channel | Keep submission separate from drafting |

A failed gate returns to the smallest responsible phase. A missing source or target is blocked, not guessed. A Work Order can close as no-go if the required evidence or authorized destination cannot be obtained.

## Next inputs requested

Provide, in any convenient form:

1. The target role or job posting.
2. Confirmation that the copied 07/26 document is the approved master source, or permission to reconcile it against another private resume.
3. Whether the first deliverable should be a general master resume, a target-specific packet, or both.
4. Desired output format and whether the private run folder is the intended destination.
5. Optional: deadline, preferred voice, cover-letter requirement, and employer submission rules.

No re-upload is required if the connected Drive document is the intended source.

## Authorization and reconciliation boundary

This initialization reads the connected Drive to locate source material and creates one private run folder plus one native copy because the requester authorized a new master template. It does not edit the original, share files, move files, submit applications, contact employers, or publish resume content.

It changes only this project-scoped Work Order in the Persona Library repository and does not change canonical Personas, Skills, Tools, Playbooks, or Site output. If a later run changes shared repository guidance or records, it must inspect affected files, document the change, and run the repository's applicable reconciliation and validation process before completion.

## Current run result — Centstone Senior UX Designer

The requested target context is now supplied: [Centstone Senior UX Designer](https://www.ziprecruiter.com/c/Centstone/Job/Senior-UX-Designer/-in-South-Saint-Paul%2CMN?jid=21b5bb41545ea05f), South Saint Paul, Minnesota, on-site contractor role. The public posting was read for role alignment; it is not candidate evidence.

- Routing: Riley Morgan coordinated Leah Okafor for role alignment/copy, Sofia Calder for document production, and Camille Ortiz for human-facing hierarchy review. These remain synthetic review lenses, not user evidence.
- Source: the private native master copy based on Rick Vang Resume 07/26. The original source was not edited.
- Created privately in the authorized run folder: one shared evidence ledger, one ATS resume, one human-facing resume, and one parity/integrity review. No cover letter was requested or created.
- Checks completed: source-to-master equality, single-column document structure, semantic headings, list structure, placeholder scan, shared claim coverage, parity of material facts, and privacy/mutation boundaries.
- Result: the packet is ready for requester review. The ATS and human versions are linked renderings from one evidence source; the human version changes hierarchy and emphasis, not the facts.
- Open findings: direct usability-testing evidence is not present; WCAG 2.1 specificity is unconfirmed; Agile wording is not asserted; on-site/contract availability and work authorization are unknown; current Quva status/end date needs confirmation; and the source has two STG Consulting entries plus month-level overlaps that were not silently normalized.
- No submission, employer contact, publication, external sharing, or user-level skill installation was performed. Private Drive links and resume content remain out of the public repository.

## Completion boundary

This Work Order is complete only when a concrete packet or explicit no-go outcome is linked, the shared evidence source and version relationships are inspectable, integrity and parity limitations are recorded, and the requester knows what was actually tested. The packet is now ready for requester review; submission and any final factual correction remain separate authorized actions.
