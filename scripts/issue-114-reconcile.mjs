import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const mode = process.argv[2] || 'apply';
const read = (path) => readFile(path, 'utf8');
const write = (path, value) => writeFile(path, value.endsWith('\n') ? value : `${value}\n`, 'utf8');
const ours = (path) => execFileSync('git', ['show', `HEAD:${path}`], { encoding: 'utf8' });
const replaceOnce = (source, from, to, label) => {
  const first = source.indexOf(from);
  if (first < 0) throw new Error(`Missing anchor: ${label}`);
  if (source.indexOf(from, first + from.length) >= 0) throw new Error(`Ambiguous anchor: ${label}`);
  return source.slice(0, first) + to + source.slice(first + from.length);
};

async function apply() {
  // Keep current main architecture, then add the Persona-operated Playbook invariant.
  {
    const path = 'ARCHITECTURE.md';
    let s = await read(path);
    const oldLine = '- `playbook-composer/` is the reusable Playbook composition layer: it coordinates canonical Personas, Skills, Tools, workflows, artifacts, state, decision rights, quality gates, recovery, and learning without executing the Playbook.';
    const newLines = '- `playbook-composer/` is the reusable Playbook composition layer: it defines an operating surface/process contract that coordinates canonical Personas, Skills, Tools, workflows, artifacts, state, decision rights, quality gates, recovery, and learning without executing the work.\n- **Persona-operated Playbook invariant:** a Persona is the actor that exercises judgment and remains responsible for completion within its declared role. A Playbook supplies the process surface—stages, handoffs, state, gates, recovery, and learning—and must not be modeled as an autonomous owner or domain expert.';
    if (!s.includes('Persona-operated Playbook invariant')) s = replaceOnce(s, oldLine, newLines, 'architecture playbook invariant');
    await write(path, s);
  }

  // Reconcile #112 default routing with #114's dedicated job-search operator.
  {
    const path = 'content/orientation/docs.json';
    const data = JSON.parse(await read(path));
    const route = data.routes.find((r) => r.id === 'resume-application-work');
    if (!route) throw new Error('Missing resume-application-work route');
    route.target = 'Riley Morgan · AI orchestrator → Priya Desai · Job search orchestrator → Evidence-led Job Search Playbook';
    if (!route.first_reads.includes('Job Search Orchestrator Persona')) route.first_reads.unshift('Job Search Orchestrator Persona');
    if (!route.first_reads.includes('Riley Morgan default routing contract')) route.first_reads.unshift('Riley Morgan default routing contract');
    if (!route.non_triggers.includes('Treating the Playbook itself as the actor or domain owner')) route.non_triggers.push('Treating the Playbook itself as the actor or domain owner');
    route.next_handoff = 'For unqualified job-search requests, route first through Riley Morgan · AI orchestrator. For unqualified narrow work, Riley routes to the smallest relevant specialist or Skill. For unqualified full-outcome work, Riley routes to Priya Desai · Job search orchestrator, who operates the Evidence-led Job Search Playbook. The Playbook supplies the reusable stages, shared state, handoffs, quality gates, recovery, and learning loop; Priya operates the process and specialists own domain judgment. Explicit specialist or Skill requests route directly to the named target. Explicit Playbook requests route directly to the named Playbook, with Priya as the operating Persona for Evidence-led Job Search. Riley is the default front door, not an unavoidable hop for explicit direct invocation. Use provider recommendation status and candidate review requirements before selecting an export.';
    await write(path, JSON.stringify(data, null, 2));
  }

  // Start from PR #114's detailed job-search operating model, then restore #112's front-door invariant.
  {
    const path = 'docs/job-search/implementation.md';
    let s = ours(path);
    s = replaceOnce(
      s,
      'The durable process surface for the full outcome is the **Evidence-led Job Search Playbook**. **Priya Desai · Job search orchestrator** is the default operating Persona for a complete run. Use one primary candidate persona with a coordinated set of specialist lenses:',
      'Riley Morgan · AI orchestrator remains the default system entry and routing point for unqualified requests. For a full-outcome job-search request, Riley routes to **Priya Desai · Job search orchestrator**, who operates the **Evidence-led Job Search Playbook** as the durable process surface. Use one primary candidate persona with a coordinated set of specialist lenses:',
      'implementation operating model intro',
    );
    s = replaceOnce(
      s,
      '**Riley Morgan · AI orchestrator** remains the general-purpose orchestration Persona for cross-domain work, orchestration architecture, or coordination problems that do not belong cleanly to the job-search domain. Riley is not the default operator of this Playbook.',
      '**Riley Morgan · AI orchestrator** remains the default front door for unqualified requests and the general-purpose orchestration Persona across domains. Riley does not operate the job-search methodology as a domain expert: once Riley identifies a full-outcome job-search route, Priya becomes the operating Persona. Explicit requests naming Priya, a specialist, a Skill, or the Playbook may route directly without an unnecessary Riley hop.',
      'implementation Riley boundary',
    );
    s = replaceOnce(
      s,
      'Priya Desai · Job search orchestrator → operates the full outcome and remains responsible for process completion\nEvidence-led Job Search Playbook → supplies stages / state / handoffs / gates / recovery / learning\nJob-search specialists → own domain judgment and artifact-specific expertise',
      'Riley Morgan · AI orchestrator → default entry, intent interpretation, and routing for unqualified requests\nPriya Desai · Job search orchestrator → operates the full job-search outcome after routing and remains responsible for process completion\nEvidence-led Job Search Playbook → supplies stages / shared state / handoffs / quality gates / recovery / learning loop\nJob-search specialists → own domain judgment and artifact-specific expertise',
      'implementation layered model',
    );
    s = replaceOnce(
      s,
      'Priya Desai · Job Search Orchestrator\n→ uses Evidence-led Job Search Playbook',
      'Riley Morgan · AI Orchestrator\n→ routes unqualified full-outcome job-search work to Priya Desai · Job Search Orchestrator\n→ Priya uses Evidence-led Job Search Playbook',
      'implementation preferred presentation',
    );
    s = replaceOnce(
      s,
      '- Full-outcome job-search requests → Priya Desai · Job search orchestrator, who uses the Evidence-led Job Search Playbook and invokes only the specialists required by the active stage.\n- Narrow domain questions → the matching specialist directly (Elena for search strategy/targeting, Marcus for hiring calibration, Leah for application narrative/ATS, Samira for outreach/interviews, Camille for visual communication, Sofia for document production). Do not force narrow questions through Priya.\n- When a requester explicitly asks to “consult Riley Morgan” for job-search work, use Riley for the requested general orchestration perspective or cross-domain coordination. Do not silently substitute Riley for Priya as the default job-search operator, and do not make Riley the sole content, writing, hiring, search-strategy, visual, or document reviewer.',
      '- Unqualified job-search requests → Riley Morgan · AI orchestrator first. Riley routes narrow work to the matching specialist or Skill and full-outcome work to Priya Desai · Job search orchestrator.\n- Priya operates the Evidence-led Job Search Playbook for full-outcome work and invokes only the specialists required by the active stage.\n- Explicit specialist, Skill, Priya, or Playbook requests → the named target directly; explicit direct invocation does not require an extra Riley hop. An explicit Evidence-led Job Search Playbook request resolves to that Playbook with Priya as its operating Persona.\n- When a requester explicitly asks to “consult Riley Morgan” for job-search work, use Riley for the requested general orchestration perspective or cross-domain coordination. Do not silently substitute Riley for Priya as the job-search operator, and do not make Riley the sole content, writing, hiring, search-strategy, visual, or document reviewer.',
      'implementation routing convention',
    );
    s = s.replace('The end-to-end search workflow owned by the Evidence-led Job Search Playbook', 'The end-to-end search workflow defined by the Evidence-led Job Search Playbook and operated by the Job Search Orchestrator');
    await write(path, s);
  }

  // Append DEC-014 without rewriting DEC-013. DEC-013 remains the default-routing decision.
  {
    const path = 'docs/decisions/records.json';
    const data = JSON.parse(await read(path));
    if (!data.records.some((r) => r.id === 'DEC-014')) {
      const dec011 = data.records.find((r) => r.id === 'DEC-011');
      if (!dec011) throw new Error('DEC-011 missing');
      dec011.status_note = 'The front-door conclusion is qualified by DEC-013; the actor-like Playbook outcome-ownership conclusion is further qualified by DEC-014. The remaining Riley identity, specialist ownership, and privacy boundaries remain applied.';
      data.records.push({
        id: 'DEC-014',
        status: 'Applied',
        category: 'Persona / Playbook boundary',
        date: '2026-09-16',
        title: 'Personas operate Playbooks; job search gets a domain orchestrator',
        summary: 'Keep Riley Morgan as the default routing front door for unqualified requests, then use Priya Desai · Job search orchestrator as the operating Persona for full-outcome Evidence-led Job Search. Treat Playbooks as process surfaces rather than autonomous actors.',
        question: 'After Riley routes an unqualified request, who exercises judgment and remains responsible for a full Playbook run when the Playbook itself is a process surface rather than an actor?',
        decision: 'Riley remains the default system entry and routing point for unqualified requests. A Persona operates a Playbook. For full-outcome job search, Riley routes to job-search-orchestrator / Priya Desai; Priya operates playbook-evidence-led-job-search. The Playbook defines stages, shared state, handoffs, quality gates, recovery, and learning but does not independently exercise judgment or own the outcome. Explicit requests for Priya, a specialist, a Skill, or the Playbook may route directly.',
        rationale: 'DEC-013 restored Riley as the default routing front door. Issue #113 addresses a separate layer: DEC-011 also gave the Playbook actor-like outcome ownership. A dedicated domain orchestrator fills that operating role without transferring specialist expertise into Riley or into the Playbook.',
        alternatives: 'Keep the Playbook as actor/owner; make Riley the job-search domain operator; stretch Elena into end-to-end orchestration. Rejected because each option blurs an existing responsibility boundary.',
        tradeoffs: 'The architecture gains one additional Persona and routing hop for unqualified full-outcome job-search work. In return, entry/routing, process operation, process structure, and specialist judgment remain explicit and independently testable.',
        affects: 'Architecture; Playbook composition guidance; Riley/Priya job-search routing; Evidence-led Job Search docs and Site surfaces; Docs orientation; job ledger orchestration wording; application Work Order fields; generated validation; issue #113.',
        evidence: 'Issue #113, PR #114, canonical Priya Persona/workflows/Skill applications, the Riley-first routing contract from DEC-013, and focused validation.',
        qualifies: ['DEC-011'],
        revisit: 'Real job-search runs show Priya is redundant with Riley or Elena, Persona-operated Playbooks reduce clarity or completeness, or a later Decision establishes a different durable operator boundary.'
      });
    }
    await write(path, JSON.stringify(data, null, 2));
  }

  // Reconcile current validator with both #112 routing invariants and #114 operator invariants.
  {
    const path = 'scripts/validation/generated.mjs';
    let s = await read(path);
    s = replaceOnce(
      s,
      "  if (!includesAll(implementation, ['default system entry', 'unqualified requests', 'shared state', 'quality gates', 'learning loop', 'explicit requests', 'route directly']) || !/playbooks?\\b.{0,80}\\bown/i.test(implementation)) throw new Error('Job-search guidance must express orchestrator-first routing and Playbook outcome ownership');",
      "  if (!includesAll(implementation, ['default system entry', 'unqualified requests', 'priya desai', 'operates', 'shared state', 'quality gates', 'learning loop', 'explicit requests', 'route directly', 'process surface'])) throw new Error('Job-search guidance must express Riley-first routing, Priya operation, and Playbook process ownership');",
      'routing contract implementation invariant',
    );
    s = replaceOnce(s,
      "  const decision013 = decisionSource.records.find(record => record.id === 'DEC-013');\n  if (decisionSource.source !== 'docs/decisions/records.json' || !Array.isArray(decisionSource.records) || !decision010?.corrections?.length || !decision011?.status_note?.includes('DEC-013') || !decision013?.qualifies?.includes('DEC-011') || files.decisionOutput !== renderDecisionsPage(files.decisionTemplateSource, decisionSource.records)) throw new Error('Generated Decisions output is stale or its authored source/history links are invalid; run build-library.mjs');",
      "  const decision013 = decisionSource.records.find(record => record.id === 'DEC-013');\n  const decision014 = decisionSource.records.find(record => record.id === 'DEC-014');\n  if (decisionSource.source !== 'docs/decisions/records.json' || !Array.isArray(decisionSource.records) || !decision010?.corrections?.length || !decision011?.status_note?.includes('DEC-013') || !decision011?.status_note?.includes('DEC-014') || !decision013?.qualifies?.includes('DEC-011') || !decision014?.qualifies?.includes('DEC-011') || files.decisionOutput !== renderDecisionsPage(files.decisionTemplateSource, decisionSource.records)) throw new Error('Generated Decisions output is stale or its authored source/history links are invalid; run build-library.mjs');",
      'decision history validation',
    );
    s = replaceOnce(s,
      "  if (!jobSearchPage.includes('Riley Morgan · AI orchestrator') || !jobSearchPage.includes('AI orchestrator · Playbook coordinator')) throw new Error('Job search page must present Riley as AI orchestrator / Playbook coordinator');",
      "  if (!jobSearchPage.includes('Priya Desai · Job search orchestrator') || !jobSearchPage.includes('Job search orchestrator · Playbook operator') || !jobSearchPage.includes('Riley Morgan · AI orchestrator')) throw new Error('Job search page must present Riley as the entry/router and Priya as the Job Search Orchestrator / Playbook operator');",
      'job-search page operator validation',
    );
    s = replaceOnce(s,
      "  if (!playbooksPage.includes('Job opportunity ledger') || !playbooksPage.includes('not job-search domain ownership') || !playbooksPage.includes('Coordinated by Riley Morgan · AI orchestrator')) throw new Error('Playbooks page must keep outcome ownership, Riley coordination, and the job ledger shared-state card');",
      "  if (!playbooksPage.includes('Job opportunity ledger') || !playbooksPage.includes('operating surface') || !playbooksPage.includes('Operated by Priya Desai · Job search orchestrator')) throw new Error('Playbooks page must present Persona-operated Playbooks, Priya as job-search operator, and the ledger shared-state card');",
      'playbooks page operator validation',
    );
    s = replaceOnce(s,
      "  if (!decisionsPage.includes('DEC-013') || !decisionsPage.includes('Riley is the default routing front door') || !decisionsPage.includes('Explicit requests naming a specialist')) throw new Error('Generated Decisions page must present DEC-013 routing conclusion');",
      "  if (!decisionsPage.includes('DEC-013') || !decisionsPage.includes('Riley is the default routing front door') || !decisionsPage.includes('Explicit requests naming a specialist')) throw new Error('Generated Decisions page must present DEC-013 routing conclusion');\n  if (!decisionsPage.includes('DEC-014') || !decisionsPage.includes('Personas operate Playbooks; job search gets a domain orchestrator')) throw new Error('Generated Decisions page must present DEC-014 Persona-operated Playbook conclusion');",
      'DEC-014 page validation',
    );
    s = replaceOnce(s,
      "  if (!jobLedgerContract.includes('Riley Morgan · AI orchestrator') || !jobLedgerContract.includes('does not own the ledger') || !jobLedgerContract.includes('Persona-Library must not become the storage location')) throw new Error('Job ledger contract is missing ownership or privacy boundary');",
      "  if (!jobLedgerContract.includes('Priya Desai · Job search orchestrator') || !jobLedgerContract.includes('does not own discovery, disposition, the ledger') || !jobLedgerContract.includes('Persona-Library must not become the storage location')) throw new Error('Job ledger contract is missing operator, ownership, or privacy boundary');",
      'ledger validation',
    );
    s = replaceOnce(s,
      "  if (!jobSearchImpl.includes('AI orchestrator (Riley Morgan)') || !jobSearchImpl.includes('job ledger contract')) throw new Error('docs/job-search/implementation.md must retain Riley as AI orchestrator and the job ledger contract');",
      "  const jobSearchOperator = context.data.personas.find(persona => persona.id === 'job-search-orchestrator');\n  const jobSearchOperatorFlows = context.data.flowLibrary?.['job-search-orchestrator'] || [];\n  if (!jobSearchOperator || jobSearchOperator.name !== 'Priya Desai' || jobSearchOperator.roleLabel !== 'Job search orchestrator') throw new Error('Canonical Job Search Orchestrator Persona is missing or malformed');\n  if (jobSearchOperatorFlows.length < 6 || !jobSearchOperatorFlows.some(flow => flow.title === 'Review campaign health and allocate attention') || !jobSearchOperatorFlows.some(flow => flow.title === 'Recover a stalled or inconsistent search')) throw new Error('Job Search Orchestrator workflow map is incomplete');\n  if (!context.data.skillLibrary?.['job-search-orchestrator']?.some(skill => skill.name === 'Task decomposition and routing') || !context.data.skillLibrary?.['job-search-orchestrator']?.some(skill => skill.name === 'Failure recovery and operational judgment')) throw new Error('Job Search Orchestrator must reuse orchestration capabilities without requiring new portable Skills');\n  if (!jobSearchImpl.includes('AI orchestrator (Riley Morgan)') || !jobSearchImpl.includes('Priya Desai') || !jobSearchImpl.includes('job ledger contract')) throw new Error('docs/job-search/implementation.md must retain Riley as router, Priya as operator, and the job ledger contract');",
      'operator structural validation',
    );
    await write(path, s);
  }

  // Current-facing static pages: keep Priya as operator while restoring Riley as entry/router.
  {
    const path = 'dist/job-search.html';
    let s = ours(path);
    s = s.replace('Priya Desai · Job search orchestrator operates the full outcome using the Evidence-led Job Search Playbook as the process surface.', 'Riley Morgan · AI orchestrator routes unqualified requests. For a full-outcome job-search request, Priya Desai · Job search orchestrator operates the full outcome using the Evidence-led Job Search Playbook as the process surface.');
    s = s.replace('Camille and Sofia are reused for visual review and document production; Priya is the dedicated job-search operating Persona. Riley remains the general AI orchestrator outside this default domain role.', 'Camille and Sofia are reused for visual review and document production; Priya is the dedicated job-search operating Persona. Riley remains the default system entry/router for unqualified requests and the general AI orchestrator across domains.');
    await write(path, s);
  }
  {
    const path = 'dist/playbooks.html';
    let s = ours(path);
    s = s.replace('The first playbook in this space is an evidence-led job search. It is the process surface for the full job-search outcome: Priya Desai · Job search orchestrator operates the Playbook, the Playbook defines stages and handoffs, and specialists own domain judgment.', 'The first playbook in this space is an evidence-led job search. Riley Morgan · AI orchestrator routes unqualified requests; for full-outcome job-search work, Priya Desai · Job search orchestrator operates the Playbook, the Playbook defines stages and handoffs, and specialists own domain judgment.');
    await write(path, s);
  }

  // Work Order evidence: this PR now extends DEC-013 rather than replacing it.
  for (const path of [
    'docs/work-orders/WO-2026-09-16-persona-operated-playbooks/work-order.md',
    'docs/work-orders/WO-2026-09-16-persona-operated-playbooks/reconciliation.md',
    'docs/work-orders/WO-2026-09-16-persona-operated-playbooks/validation.md'
  ]) {
    let s = ours(path).replaceAll('DEC-013', 'DEC-014');
    s = s.replaceAll('Riley Morgan as the general AI orchestrator and is no longer the default job-search operator', 'Riley Morgan as the default entry/router for unqualified requests and general AI orchestrator; Priya becomes the job-search operator after routing');
    s = s.replaceAll('Canonical identity unchanged; no longer default job-search operator', 'Canonical identity unchanged; remains default entry/router for unqualified requests and routes full-outcome job-search work to Priya');
    s = s.replaceAll('remove default job-search operator routing', 'preserve default entry/routing while moving full-outcome operation to Priya');
    await write(path, s);
  }
}

async function finalize() {
  const validationPath = 'docs/work-orders/WO-2026-09-16-persona-operated-playbooks/validation.md';
  let validation = await read(validationPath);
  if (!validation.includes('Reconciled against merged #112 architecture')) {
    validation += '\n- Reconciled against merged #112 architecture: Riley remains the default routing front door; Priya operates full-outcome job-search work; DEC-014 records the operator boundary.\n- Full build, repository validation, focused routing tests, isolated Persona–Skill validation, and `git diff --check` passed on the reconciled branch.\n';
  }
  await write(validationPath, validation);

  const reconciliationPath = 'docs/work-orders/WO-2026-09-16-persona-operated-playbooks/reconciliation.md';
  let reconciliation = await read(reconciliationPath);
  if (!reconciliation.includes('DEC-013 remains current')) reconciliation += '\n## #112 compatibility\n\nDEC-013 remains current for default system entry/routing. DEC-014 adds the downstream operating-Persona boundary: Riley routes → Priya operates → Playbook structures → specialists judge.\n';
  await write(reconciliationPath, reconciliation);
}

if (mode === 'apply') await apply();
else if (mode === 'finalize') await finalize();
else throw new Error(`Unknown mode: ${mode}`);
