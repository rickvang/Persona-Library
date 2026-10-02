# Application context and review contract

Use the [Evidence-led Job Search Playbook's routine application path](../playbooks/evidence-led-job-search.md#routine-application-preparation--default) first. These instructions define context and review criteria; they do not require a full Work Order, notes document or council for each application.

## Local packet operation

Routine packets use [scripts/application-packet.py](https://github.com/rickvang/Persona-Library/blob/main/scripts/application-packet.py). Load one private source-bound candidate profile, read the current employer posting, and write one role-specific JSON draft containing the job and both documents. Run the command once, inspect the final files, correct only observed failures, and deliver. The builder has no network, model API, Drive, Notion, Supabase, or application-tracker dependency.

```sh
python scripts/application-packet.py --profile /private/candidate-profile.json --draft /private/role-draft.json --output /private/new-packet
```

Use the Python runtime from `load_workspace_dependencies` in Codex. Its `reportlab`, `python-docx`, `pypdf`, and `pypdfium2` packages are already bundled. Other environments install `scripts/application-packet-requirements.txt` once. The default outputs are `resume.pdf`, `resume.docx`, and separate `cover-letter.pdf` / `cover-letter.docx` when the draft includes a letter. `--formats pdf` generates only PDFs. The output folder must be new or empty, preserving existing packets.

### Prepare once and reuse

The private profile is a compact projection of verified candidate sources, not new career authority. Build it once from the designated baseline, applicable standing decisions, and candidate-confirmed additions. Preserve source references and revisions; increment its version when facts or applicable decisions change. Keep the complete history there and select relevant content for each resume. A selected employer/title/date/location and its client context always come from the profile. Omitted roles need an explicit reason and must respect candidate instructions. A prior role-specific packet cannot establish new facts.

The built-in layout is renderer implementation, not a new reusable Template identity. Template catalog/research is needed only when the requester chooses a reusable external Template or needs a different layout. Do not add a library routing or placement ceremony to each private packet. A new layout still needs actual page review.

Profile fields:

- `candidate_id`, `version`, `identity` (`name`, `location`, `email`, optional `phone`, `links` with `label` and HTTPS `url`).
- `sources`: records with `id`, `reference`, and `revision`.
- `facts`: ID-keyed records with `text`, `source`, and `role` for role-specific accomplishments. Retain an original passage locator when available.
- `roles`: records with `id`, `employer`, `title`, `start` and `end` in `YYYY-MM` (null end means current), optional `location` and explicit employer/client `context`.
- Approved `skills`, `education`, and `certifications` as text arrays; applicable standing decisions and voice preferences may travel in the same private file.

The role draft binds `candidate_id` and `profile_version`. Its `job` records `id`, `company`, `role`, `source_url`, `checked_on`, selected `requirements` with IDs, and optional `cover_letter_required` / `resume_page_limit` (default two pages). `matches` gives each selected requirement its evidence IDs or an explicit `gap`. `unanswered` holds remaining application answers; these do not prevent file production.

```json
{
  "candidate_id": "active-private-candidate",
  "profile_version": "1",
  "job": {"id": "role-id", "company": "Employer", "role": "Designer", "source_url": "https://example.com/job", "checked_on": "2026-10-02", "requirements": [{"id": "systems", "text": "Design systems"}]},
  "resume": {
    "headline": "Product Designer",
    "summary": {"text": "Source-supported positioning.", "evidence": ["fact-id"]},
    "roles": [{"id": "source-role-id", "bullets": [{"text": "Source-supported accomplishment.", "evidence": ["fact-id"]}]}],
    "skills": ["Figma"],
    "omitted_roles": []
  },
  "cover_letter": {"date": "2026-10-02", "opening": "Why this product interests me.", "paragraphs": [{"text": "Relevant source-supported experience.", "evidence": ["fact-id"]}], "closing": "The conversation I would welcome."},
  "matches": [{"requirement": "systems", "evidence": ["fact-id"]}],
  "unanswered": ["Work authorization confirmation"]
}
```

### Review and deliver

The builder preserves source career identity, sorts source dates, rejects missing/cross-role evidence, unconfirmed skills, unsupported numeric claims, undisclosed role omissions, incomplete requirement dispositions, placeholders, missing exported text/links, and exceeded page budgets. Each role is kept together; it never shrinks text to force a page count. These are mechanical integrity checks, not proof that wording preserves meaning or that an employer's ATS accepted it.

`preview/` contains every PDF page for one visual review. `build-report.json` contains source revisions, output hashes, mechanical timing, omissions, unknown answers, and explicitly pending editorial/layout review. Review source meaning, role fit, voice, and every actual final PDF page. DOCX has structural/text/link checks; its layout remains unverified until a Word-compatible renderer is inspected when that format will be submitted. Correct only affected content/checks and build a new output revision.

Measure job reading/drafting, command execution, and final review separately, with the full user-request interval when benchmarking. A fast render is not a fast end-to-end application. Deliver reviewed files before bookkeeping. Resolve/update the existing Applications record separately when tracking is in scope; preserve later confirmed states and keep unresolved answers visible. Production does not submit, upload, or set `Applied`.

## Native packet operation — compatibility

Use this path only when native Google Docs baseline fidelity or private Drive/Applications recording is explicitly needed. It is not the default full-packet builder and does not produce the cover letter or DOCX exports.

[scripts/application-packet.mjs](https://github.com/rickvang/Persona-Library/blob/main/scripts/application-packet.mjs) is the executable routine for an approved Google Docs baseline and the existing private Drive/Applications store. It has no model calls, credentials or new service dependencies. The executor supplies tailoring judgment and final-file review; the runner supplies copy, indexed edit, export/save, recovery and owner-scoped recording.

Load the runner once per batch in the native tool runtime. In a runtime with `tools`, `store` and `load`, read the complete trusted repository file into `source` (check command success and output truncation), then:

```javascript
const runPacket = Function(source.replace(/^export /m, '') + '; return runApplicationPacket;')();
const result = await runPacket(privateInput, tools, privateCheckpoint);
store('privatePacketCheckpoint', result.checkpoint);
// Display only stage, relevant artifact links and an actionable failure, not the private checkpoint.
```

In a JavaScript module runtime, import `runApplicationPacket` directly and supply the exposed native tools. The runner accepts `google_drive_*` / `supabase_execute_sql` tool names or their `mcp__codex_apps__` prefixes; it does not install or prove connector availability.

Inputs are one active `candidateId`, the approved native `baseline` document snapshot, a verified private `folderId`, `title`, the canonical `job` (`id`, `company`, `role`, `sourceUrl`), exact `edits` (`before`, `after`, optional base `style` and relative styled `spans`), protected career-spine strings in `protectedText`, and the configured `tracker` (`projectId`, verified `userId`). Optional `pending`, `note`, `nextAction` and `fileName` carry only the requested role's state. Keep all inputs and checkpoints private and outside Git. Do not infer candidate approval or ownership from a document title.

The first call returns `review_required` with a stable native document revision and a saved private PDF. Review that actual PDF's text, links and every rendered page, plus claims, chronology and employer requirements. Call again with the same inputs/checkpoint and `review: { documentId, revisionId, pdfId, checks: { claims, chronology, requirements, text, links, pages } }`; each finding is a boolean. Failed/pending findings or unresolved answers keep the record Reviewing. Later application states and confirmed submission dates are preserved. A missing tracker permits an explicit artifact-only smoke run, never a claim that Applications was updated.

If export adds an unexpected tab-title page, remove only the verified extra page, review the resulting complete submission PDF, and supply its native file reference or absolute local path as `review.fileUri` and its SHA-256 as `review.fileHash`. The runner uploads that reviewed PDF before recording its link. Do not mark a native three-page export reviewed because an earlier two-page file passed.

`needs_attention` retains completed work. A failed read/export can resume from that checkpoint. A lost edit response is reconciled against actual original/planned content before another write. A lost copy/upload response requires inspecting the private destination and adopting the confirmed artifact ID before clearing `pendingMutation`; never blindly repeat a creation. Changed candidate/job/baseline inputs need a fresh checkpoint. Resolving an answer or adding a review finding updates only the recording milestone, preserving the existing files. A changed document invalidates its export/review evidence; a changed transformed-PDF reference/hash uploads only that new reviewed file. Keep tool-required trusted-read and permission checks; a runner receipt does not substitute for them.

## Ownership

- The Evidence-led Job Search Playbook owns the full-outcome stages and handoffs.
- Riley Morgan · AI orchestrator coordinates contributors when multiple specialists are needed; Riley is not the Job Search Persona or sole domain expert.
- Route narrow strategy, hiring, writing, outreach, visual, or document questions to Elena, Marcus, Leah, Samira, Camille, or Sofia directly.
- Opportunity discovery uses the [job ledger contract](job-ledger-contract.md) in private workspace state. Do not store private job-search history in Persona-Library.

## Load only the relevant context

- Read the requester’s context brief, original career sources, target description, and the actual artifact being reviewed.
- For a batch, resolve the designated candidate baseline and standing decisions once, record source references/revisions, and reuse unchanged evidence. Refresh only at a relevant source/instruction change, uncertain revision, or tool-required freshness boundary. Keep brief answers, source references and unknowns in the existing private tracker; keep canonical candidate evidence in Candidate Context.
- Load the playbook’s relevant personas and skills. Use the requested council; do not add participants automatically.
- Distinguish source-supported claims, editorial synthesis, hypotheses, and missing information. A generated draft cannot establish career facts.
- Keep source URLs/headings and modification dates, target completeness, audience, deliverables, constraints, proposed positioning, and unresolved questions visible.
- Check access to required tools and scoped workspaces before depending on them. Record an affected check as Blocked if its prerequisite is unavailable; continue unrelated useful work.
- When opportunity search is in scope, check the durable job ledger before presenting roles as new.

## Preserve a claim ledger

Reuse the candidate's approved claim ledger. New or materially changed claims need a recoverable original source/passage, contribution, scope, outcome, metric meaning, dates/attribution, uncertainty and accepted wording. A routine role-specific copy does not require recreating the ledger or assigning new IDs to unchanged claims.

Compare the edit with the original. Do not turn designed into built, member into founder, an outcome into an opportunity, or tool savings into an unrelated research outcome. Two resume versions are not independent corroboration. Ask the real author only when an unresolved interpretation materially changes the claim; a persona cannot approve on the author’s behalf.

## Run a small trial before a full rebuild

Use a summary and two relevant role entries as a trial when proposing a new content direction or full rebuild. Tailoring an approved baseline does not require a trial or intermediate approval. Identify missing problem/decision context rather than inventing it. Keep the experience sequence reverse chronological unless a different format is explicitly chosen. Preserve month precision and legitimate repeat engagements.

After content is accepted, compare layouts using identical claims. Judge typography, hierarchy, density, page balance, links, and print readability from actual rendered pages. Page count, whitespace, clean extraction, and absence of tables do not establish overall quality.

## Review once; escalate unresolved findings

For routine packets, the selected executor reviews the actual final submission revision once against the applicable ATS, narrative, visual/production and integrity criteria. Export and inspect only required submission formats; check text, links and every rendered submission page. Do not export internal notes for QA by default. Keep findings and untested scope concise in the tracker, and rerun only checks affected by a later correction.

Use independent specialist passes when requested, when introducing a second rendering/new layout, or when a finding needs unresolved specialist judgment. Those detailed reviews use the following record; the record itself is not required for each successful routine check:

| Field | Required content |
| --- | --- |
| Artifact | Exact version reviewed |
| Lens | Specific review responsibility; named specialist when independently invoked |
| Criterion | What quality is being assessed |
| Evidence | Original source IDs and exact passage or rendered page |
| Finding | What was observed, including reader consequence |
| Action | Smallest correction or evidence needed |
| Verdict | Pass, Revise, Blocked, or Not reviewed |
| Limits | Assumptions, confidence, and unavailable checks |

Pass requires an actual inspection that supports the criterion. Revise identifies an observed weakness. Blocked names a missing prerequisite. Not reviewed means the check did not run. A checklist, a builder’s static PASS string, or an earlier artifact’s approval is not a review result.

Preserve disagreements and name what evidence or decision would resolve them. Distinguish real reader feedback from simulated feedback. Do not claim an employer’s ATS was tested unless it actually was.

After editing, reopen affected checks and perform one bounded change-impact reconciliation over the affected claims, chronology, links, assumptions and status labels. Do not replay unchanged reviews or expand an ordinary private packet into library-wide reconciliation. A current target description and recoverable requirement-to-evidence matches are needed before claiming complete tailoring. Draft preparation does not authorize submission.

## Site relationships

Skills hold reusable methods and quality signals; personas apply them in context; playbooks coordinate handoffs; Docs explain current use; Prototyping holds isolated trials; Decisions preserve chosen rationale. The individual context brief travels with the request. Do not turn candidate-specific career facts into generic persona knowledge.

Revision 1.1 · 2026-10-01. Routine preparation reuses approved context and combines final review; independent reviews and content trials remain available for exceptions. Reader-trial outcomes remain untested.
