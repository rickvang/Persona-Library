
# Job-search Application Packet Work Order

This Work Order extends the repository-wide [Work Order convention](../work-orders.md) for a job-search application packet. It tracks active work and decisions; it is not a transcript, a job-submission authorization, or a substitute for the candidate's source evidence.

## Header

- Work Order ID:
- Title:
- Status: draft / active / blocked / ready-for-review / complete / no-go
- Created:
- Last updated:
- Requester:
- Current owner:
- Request mode:
- Proportionality tier:
- Explicit authorization and target:
- Stopping condition:

A Work Order records authorization constraints but never grants permission to submit an application, contact an employer, publish a document, or send an external message.

## 1. Target and source of truth

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

### Requirement map

| Requirement ID | Role requirement or signal | Evidence IDs | Confidence | Gap or follow-up question | Status |
| --- | --- | --- | --- | --- | --- |
| R-001 |  |  | high / medium / low / unknown |  |  |

## 2. Output contract

Create two linked resume versions when the target channel or review context justifies it. If one semantically structured version is sufficient, record why the second rendering is not warranted.

| Output ID | Artifact | Primary reader or system | Format and revision | Source ledger revision | Status | Owner | Link |
| --- | --- | --- | --- | --- | --- | --- | --- |
| OUT-ATS | ATS resume version | Employer intake and screening |  |  | draft / reviewed / selected / superseded |  |  |
| OUT-HUMAN | Human-facing resume version | Human reviewer |  |  | draft / reviewed / selected / superseded |  |  |
| OUT-LETTER | Cover letter | Human reviewer and required submission channel |  |  | not requested / draft / reviewed / selected |  |  |

The ATS and human-facing resume are renderings of one evidence source, not independent stories. A human-facing variant may improve hierarchy, density, order, and contextual visual communication; neither variant may change the meaning of a material claim.

Do not submit both resume versions unless the employer or requester explicitly asks for both.

## 3. Version-specific requirements

### ATS resume version

- Standard headings and deterministic text order:
- Chronology and date representation:
- Supported terminology from the requirement map:
- Extraction or parser check used:
- Known parser limitations:
- Formatting or content intentionally omitted:
- Employer submission instructions:
- ATS review result: pass / revise / blocked / unknown

Minimum gate:

- Intended sections and text are extractable.
- Dates, titles, employers, role identity, and outcomes are unambiguous.
- Roles are reverse chronological unless an intentional alternative is documented.
- Missing dates, ties, overlaps, and source ambiguity remain visible.
- Terminology is natural and supported; no keyword stuffing.
- Important content is not hidden in graphics, columns, images, or decorative labels without a safe text equivalent.

### Human-facing resume version

- Reader and review context:
- First-scan decision path:
- Hierarchy and visual system:
- Density and page or viewport constraints:
- Accessibility and readable structure:
- Contextual visual choices:
- Content or order differences from ATS version:
- Human review result: pass / revise / blocked / unknown

Minimum gate:

- A reviewer can identify role, level, relevant value, and credible contribution quickly.
- Visual emphasis follows target-role relevance and evidence, not decoration.
- Content remains readable, accessible, truthful, and reasonably parseable.
- Intentional differences from the ATS version are recorded.
- The version does not erase uncertainty or make a claim stronger through design.

### Cover letter

- Why a letter is useful for this application:
- Specific connection or motivation it adds:
- Evidence IDs used:
- What it deliberately does not repeat:
- Voice and author review:
- Channel or parser requirement:
- Review result: pass / revise / not requested / unknown

A cover letter is separate from both resume versions. It may need a structured, readable format for its submission channel, but it must not become a new source of unsupported claims.

## 4. Version parity table

Compare the actual ATS and human-facing artifacts after meaningful edits.

| Claim ID | Evidence IDs | ATS version location | Human version location | Intentional difference and reason | Meaning preserved? | Parity result |
| --- | --- | --- | --- | --- | --- | --- |
| C-001 | E-001 |  |  |  | yes / no / unknown | pass / revise / blocked |

Check at least:

- employer, role, title, dates, chronology, and engagement identity;
- contribution, attribution, scope, method, metrics, and outcomes;
- high-priority evidence and known gaps;
- uncertainty, caveats, and intentional omissions;
- cover-letter claims against the same evidence ledger.

Fail parity when either version silently adds, removes, upgrades, or changes the meaning of a material claim. If a difference is required by the channel, document it and obtain the appropriate source or candidate decision.

## 5. Review record

Run reviews on the actual output revision.

| Review ID | Version | Lens | Criterion | Source IDs or exact location | Finding | Reader or system consequence | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| REV-001 | OUT-ATS / OUT-HUMAN / OUT-LETTER | ATS / human / visual / integrity / parity |  |  |  |  | pass / revise / blocked / unknown |  |

Record what was not checked. Do not claim a specific employer parser, human response, preference, or outcome unless that evidence exists.

## 6. Work Order progress

Update at phase transitions, decisions, failed gates, material assumptions, handoffs, version changes, and validation events.

| Phase | Owner | Status | Output or link | Evidence status | Gate result | Smallest next action |
| --- | --- | --- | --- | --- | --- | --- |
| Define target and constraints |  |  |  |  |  |  |
| Align role and evidence |  |  |  |  |  |  |
| Build shared evidence source |  |  |  |  |  |  |
| Render ATS version |  |  |  |  |  |  |
| Render human-facing version |  |  |  |  |  |  |
| Draft and review cover letter |  |  |  |  |  |  |
| Review parity and integrity |  |  |  |  |  |  |
| Select submission artifact |  |  |  |  |  |  |
| Learn after submission |  |  |  |  |  |  |

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

- Concrete packet or decision:
- Success criterion addressed:
- ATS result and limitations:
- Human review result and limitations:
- Parity result:
- Integrity result:
- What was not tested:
- Real-user or market feedback actually available:
- Synthetic assumptions to validate later:
- Learning that changes the target, evidence map, or future versions:
- Final gate: pass / revise / no-go / blocked
- Next action or explicit completion boundary:
