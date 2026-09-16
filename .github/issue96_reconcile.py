from pathlib import Path


def replace_bytes(path, old, new, expected=1):
    p = Path(path)
    data = p.read_bytes()
    old_b = old.encode('utf-8')
    new_b = new.encode('utf-8')
    found = data.count(old_b)
    if found != expected:
        raise SystemExit(f'{path}: expected {expected} match(es), found {found}')
    p.write_bytes(data.replace(old_b, new_b, expected))


replace_bytes(
    'content/library-data/workflows-career.js',
    "['Normalize and check the job opportunity ledger','Weekly / per search batch','Deduplication','Previously seen roles resurface as new','Private job ledger + disposition notes (representative)']",
    "['Check new results against the seen-job set','Weekly / per search batch','Deduplication','Previously presented roles resurface as new','Private seen-job set (representative)']"
)

replace_bytes(
    'content/library-data/skills-specialists.js',
    "definition:'Check stage progression and campaign-health conclusions against actual ledger state, Work Order evidence, gate findings, and recorded outcomes.'",
    "definition:'Check stage progression and campaign-health conclusions against actual search results, Work Order state, gate findings, and recorded outcomes.'"
)

replace_bytes(
    'content/library-model.js',
    "    elena.version = '1.1'; elena.updated = '2026-09-14';",
    "    elena.revisions.push({version:'1.2',date:'2026-09-16',changeType:'scope-correction',summary:'Narrowed repeated-search persistence from a full opportunity ledger to a lightweight private seen-job set that suppresses openings already presented.',affectedFields:['skills','workflows'],evidence:'Issue #96 clarified user need: find new jobs without repeating previously shown openings; JobAgent remains reference evidence only',confidenceChange:'Duplicate suppression is explicit; application lifecycle tracking is no longer implied by the deduplication contract'});\n    elena.version = '1.2'; elena.updated = '2026-09-16';"
)

replace_bytes(
    'content/orientation/docs.json',
    '"docs/job-search/job-ledger-contract.md when opportunity search or deduplication is in scope"',
    '"docs/job-search/job-ledger-contract.md when repeated job discovery or deduplication is in scope"'
)

replace_bytes(
    'docs/job-search/application-work-order-template.md',
    '- Job ledger `job_id` / status (if discovered via search; see [job ledger contract](job-ledger-contract.md)):\n',
    ''
)

replace_bytes(
    'dist/playbooks.html',
    '<article class="state-card"><h3>Job opportunity ledger</h3><p>Durable private search state for discovered roles, deduplication, disposition, and resurfacing rules. Owned by the search specialist capability, not Priya. <a href="docs/job-ledger-contract.md">Ledger contract</a>.</p></article>',
    '<article class="state-card"><h3>Seen-job set</h3><p>Lightweight private state used only to suppress openings already presented in repeated searches. The search capability checks and updates it; Priya does not own it. <a href="docs/job-ledger-contract.md">Deduplication contract</a>.</p></article>'
)

replace_bytes(
    'scripts/validation/generated.mjs',
    "  if (!playbooksPage.includes('Job opportunity ledger') || !playbooksPage.includes('operating surface') || !playbooksPage.includes('Operated by Priya Desai · Job search orchestrator')) throw new Error('Playbooks page must present Persona-operated Playbooks, Priya as job-search operator, and the ledger shared-state card');",
    "  if (!playbooksPage.includes('Seen-job set') || !playbooksPage.includes('operating surface') || !playbooksPage.includes('Operated by Priya Desai · Job search orchestrator')) throw new Error('Playbooks page must present Persona-operated Playbooks, Priya as job-search operator, and the lightweight seen-job state card');"
)

replace_bytes(
    'scripts/validation/generated.mjs',
    "  const jobLedgerContract = await context.readFile('docs/job-search/job-ledger-contract.md');\n  if (!jobLedgerContract.includes('Priya Desai · Job search orchestrator') || !jobLedgerContract.includes('does not own discovery, disposition, the ledger') || !jobLedgerContract.includes('Persona-Library must not become the storage location')) throw new Error('Job ledger contract is missing operator, ownership, or privacy boundary');",
    "  const seenJobContract = await context.readFile('docs/job-search/job-ledger-contract.md');\n  if (!seenJobContract.includes('Seen-job deduplication contract') || !seenJobContract.includes('private seen-job set') || !seenJobContract.includes('first_shown') || !seenJobContract.includes('does **not** define a full job-opportunity ledger or application tracker')) throw new Error('Seen-job deduplication contract is missing identity, privacy, or scope boundaries');"
)

replace_bytes(
    'scripts/validation/generated.mjs',
    "  if (!jobSearchImpl.includes('Riley Morgan · AI orchestrator') || !jobSearchImpl.includes('Priya Desai') || !jobSearchImpl.includes('job ledger contract')) throw new Error('docs/job-search/implementation.md must retain Riley as router, Priya as operator, and the job ledger contract');",
    "  if (!jobSearchImpl.includes('Riley Morgan · AI orchestrator') || !jobSearchImpl.includes('Priya Desai') || !jobSearchImpl.includes('seen-job deduplication contract')) throw new Error('docs/job-search/implementation.md must retain Riley as router, Priya as operator, and the seen-job deduplication contract');"
)

wo = Path('docs/work-orders/WO-2026-09-16-seen-job-dedup/work-order.md')
wo.parent.mkdir(parents=True, exist_ok=True)
wo.write_text('''# Seen-job deduplication scope correction Work Order

## Header

- Work Order ID: WO-2026-09-16-seen-job-dedup
- Issue: #96
- Status: ready-for-review
- Authorized repository: `rickvang/Persona-Library`
- Branch: `fix/issue-96-seen-job-dedup`
- Change mode: source update + reconciliation

## Outcome

Correct the overbuilt job-ledger concept to the actual requirement: repeated Creative Job Search / job-discovery checks remember openings already presented and suppress those duplicates on later “what’s new?” runs.

## Boundary

- Keep only stable identity + lightweight private seen-job state.
- No application tracker, lifecycle state machine, campaign database, scheduler, queue, sync service, or JobAgent integration.
- Keep real seen-job state outside Persona-Library in the consuming Skill/runtime.
- Preserve Riley → Priya → Playbook → specialist architecture from #112/#114.
- Preserve historical Decisions and archived Work Orders; this correction changes current guidance, not history.

## Reconciliation

Updated the current contract, job-search implementation guidance, Elena search workflow wording, Priya validation wording, Docs orientation pointer, application Work Order template, Playbooks Site shared-state card, and focused validators. Historical DEC-011 / archived proof records remain unchanged.

## Validation

Run the repository build, top-level content validator, focused validation tests, isolated Persona–Skill validation, and `git diff --check`. Merge remains separate.
''', encoding='utf-8')
