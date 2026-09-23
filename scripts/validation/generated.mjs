const countFunctionDefinitions = (html, name) => (html.match(new RegExp(`function\\s+${name}\\s*\\(`, 'g')) || []).length;
import { renderDecisionsPage } from '../build-decisions.mjs';

export function playbookCatalogCard(html, playbookId) {
  const match = html.match(new RegExp(`<article\\b[^>]*\\bdata-playbook-id="${playbookId}"[^>]*>[\\s\\S]*?</article>`));
  return match ? match[0] : '';
}

const normalized = value => String(value || '').toLowerCase();
const includesAll = (value, terms) => terms.every(term => normalized(value).includes(term));

export function validateVercelToolCatalogSurface({ toolCatalog, toolUseRecipes, personaToolRequirements, toolsPage }) {
  const tool = (toolCatalog || []).find(item => item.id === 'tool-vercel');
  if (!tool || tool.name !== 'Vercel' || tool.status !== 'active' || tool.evidenceStatus !== 'validated' || tool.availability !== 'runtime-dependent') throw new Error('Canonical Vercel Tool record is missing or malformed');
  const recipe = (toolUseRecipes || []).find(item => item.id === 'recipe-riley-vercel-review-checkpoint');
  if (!recipe || recipe.toolId !== tool.id || recipe.tool !== tool.name || !tool.toolUseRecipeIds?.includes(recipe.id)) throw new Error('Canonical Vercel Tool recipe relationship is invalid');
  const requirement = (personaToolRequirements || []).find(item => item.id === 'requirement-riley-vercel-review-checkpoint');
  if (!requirement || requirement.preferredToolId !== tool.id || requirement.preferredTool !== tool.name || requirement.recipeId !== recipe.id) throw new Error('Canonical Vercel Persona Tool relationship is invalid');
  if (!includesAll(toolsPage, ['data-tool-id="tool-vercel"', '<h3>vercel</h3>', 'runtime availability', 'account permission', '#recipe-vercel-review-checkpoint'])) throw new Error('Tools page must expose the canonical Vercel Tool record and linked recipe');
}

export function validateWebArchitecturePersonaContract({ personas, flowLibrary, skillCatalog, personaHandoffs, personaToolRequirements }) {
  const frontend = (personas || []).find(persona => persona.id === 'frontend-systems-engineer');
  const appData = (personas || []).find(persona => persona.id === 'application-data-architect');
  if (!frontend || frontend.name !== 'Evan Reyes' || frontend.roleLabel !== 'Frontend systems engineer') throw new Error('Frontend Systems Engineer Persona is missing or malformed');
  if (!appData || appData.name !== 'Nadia Shah' || appData.roleLabel !== 'Application & data architect') throw new Error('Application & Data Architect Persona is missing or malformed');

  const frontendFlows = flowLibrary?.['frontend-systems-engineer'] || [];
  const appDataFlows = flowLibrary?.['application-data-architect'] || [];
  for (const title of ['Frame the frontend runtime boundary','Design the web application architecture','Implement and validate production behavior','Evaluate a framework or dependency change','Recover a frontend regression']) {
    if (!frontendFlows.some(flow => flow.title === title)) throw new Error(`Frontend Systems Engineer workflow is missing: ${title}`);
  }
  for (const title of ['Define the application source of truth','Design persistence and service boundaries','Evolve schema, authorization, and contracts','Plan migration or scaling change','Recover data integrity or reliability risk']) {
    if (!appDataFlows.some(flow => flow.title === title)) throw new Error(`Application & Data Architect workflow is missing: ${title}`);
  }

  const skillById = new Map((skillCatalog || []).map(skill => [skill.id, skill]));
  const requireApplication = (skillId, personaId) => {
    const skill = skillById.get(skillId);
    if (!skill || !skill.profiles?.some(profile => profile.personaId === personaId)) throw new Error(`${skillId} is missing ${personaId} application`);
  };
  requireApplication('skill-architecture-decision-making', 'frontend-systems-engineer');
  requireApplication('skill-architecture-decision-making', 'application-data-architect');
  requireApplication('skill-web-application-architecture', 'frontend-systems-engineer');
  requireApplication('skill-application-and-data-architecture', 'application-data-architect');
  for (const skillId of ['skill-component-and-design-system-thinking','skill-accessibility-and-inclusive-design']) requireApplication(skillId, 'frontend-systems-engineer');
  for (const personaId of ['frontend-systems-engineer','application-data-architect']) {
    for (const skillId of ['skill-problem-framing-and-systems-thinking','skill-evidence-led-validation','skill-decision-communication-and-rationale-documentation','skill-cross-functional-systems-communication']) requireApplication(skillId, personaId);
  }

  const requiredHandoffs = [
    'handoff-riley-to-frontend-systems-engineer',
    'handoff-riley-to-application-data-architect',
    'handoff-frontend-to-camille-interface-intent',
    'handoff-frontend-to-jordan-ux-structure',
    'handoff-frontend-to-application-data-architect',
    'handoff-application-data-to-frontend-systems-engineer',
    'handoff-application-data-to-jordan-content-workflow'
  ];
  for (const id of requiredHandoffs) if (!(personaHandoffs || []).some(handoff => handoff.id === id && handoff.required === true)) throw new Error(`Web architecture Persona handoff is missing: ${id}`);

  if ((personaToolRequirements || []).some(requirement => ['frontend-systems-engineer','application-data-architect'].includes(requirement.personaId))) throw new Error('Web architecture Personas must not gain a vendor-specific Tool requirement without a separately validated recipe and Tool review');
  if ((personas || []).some(persona => /full[- ]stack architect|database architect/i.test(persona.roleLabel || ''))) throw new Error('Issue #183 must preserve the two-Persona boundary instead of adding a generic Full-Stack or pure Database Architect');
  for (const skill of skillCatalog || []) if (/next\.?js|supabase|vercel|sanity|payload|prisma/i.test(skill.name || '')) throw new Error('Technology-specific implementation choices must not become core Skill identities');
}


export function validateOperationalKnowledgeContract({ operationalScenarios, operationalScenarioCatalog, operationalScenarioIndex, toolUseRecipes, skillCatalog, model, orientation, toolsRoute, skillsRoute, agents, contract, toolSkill }) {
  const expectedIds = ['scenario-github-issue-implementation','scenario-vercel-deployed-state-verification','scenario-architecture-proportionate-decision','scenario-frontend-runtime-boundary','scenario-application-data-source-of-truth'];
  const allowedEvidence = new Set(['candidate','reviewed','validated']);
  if (!Array.isArray(operationalScenarios) || !Array.isArray(operationalScenarioCatalog) || operationalScenarios.length < expectedIds.length) throw new Error('Operational Scenario source/catalog is missing');
  const sourceById = new Map(operationalScenarios.map(item => [item.id, item]));
  if (sourceById.size !== operationalScenarios.length) throw new Error('Operational Scenario IDs must be unique');

  const indexEntries = operationalScenarioIndex?.scenarios;
  if (operationalScenarioIndex?.schema_version !== '1.0' || !Array.isArray(indexEntries)) throw new Error('Operational Scenario index is missing or malformed');
  const allowedIndexKeys = new Set(['id','title','ownerType','ownerId','status','path','match']);
  const indexIds = new Set();
  const indexPaths = new Set();
  for (const entry of indexEntries) {
    if (!entry?.id || indexIds.has(entry.id)) throw new Error(`Operational Scenario index has an invalid or duplicate ID: ${entry?.id || '(missing)'}`);
    if (!entry.path || indexPaths.has(entry.path) || !/^content\/library-data\/operational-scenarios\/[a-z0-9-]+\.js$/.test(entry.path)) throw new Error(`Operational Scenario index has an invalid or duplicate path: ${entry.path || '(missing)'}`);
    const extraKeys = Object.keys(entry).filter(key => !allowedIndexKeys.has(key));
    if (extraKeys.length) throw new Error(`Operational Scenario index must stay routing-only; unexpected keys on ${entry.id}: ${extraKeys.join(', ')}`);
    const scenario = sourceById.get(entry.id);
    if (!scenario) throw new Error(`Operational Scenario index points to missing scenario: ${entry.id}`);
    if (entry.title !== scenario.title || entry.ownerType !== scenario.ownerType || entry.ownerId !== scenario.ownerId || entry.status !== scenario.status || JSON.stringify(entry.match) !== JSON.stringify(scenario.match)) {
      throw new Error(`Operational Scenario index metadata is stale: ${entry.id}`);
    }
    indexIds.add(entry.id);
    indexPaths.add(entry.path);
  }
  if (indexEntries.length !== operationalScenarios.length || operationalScenarios.some(scenario => !indexIds.has(scenario.id))) throw new Error('Operational Scenario index must map one-to-one to authored scenarios');
  for (const id of expectedIds) if (!operationalScenarioCatalog.some(item => item.id === id)) throw new Error(`Required seed Operational Scenario is missing: ${id}`);
  for (const scenario of operationalScenarioCatalog) {
    if (!scenario.id || !scenario.ownerKnown || scenario.unresolvedRouteIds?.length) throw new Error(`Operational Scenario is missing or has unresolved ownership/route: ${scenario.id || '(missing)'}`);
    if (!allowedEvidence.has(scenario.evidenceStatus)) throw new Error(`Operational Scenario has invalid evidence status: ${scenario.id}`);
    if (scenario.status === 'active') {
      for (const field of ['do','dont','recommendedSequence','stopConditions','successSignals','goodTrace','badTrace','recoveryPath','evidence']) if (!Array.isArray(scenario[field]) || scenario[field].length === 0) throw new Error(`Operational Scenario ${scenario.id} is missing concrete ${field}`);
    }
  }
  const recipeById = new Map((toolUseRecipes || []).map(recipe => [recipe.id, recipe]));
  const skillById = new Map((skillCatalog || []).map(skill => [skill.id, skill]));
  if (!recipeById.get('recipe-riley-github-efficient-change')?.operationalScenarios?.some(item => item.id === 'scenario-github-issue-implementation')) throw new Error('GitHub operational scenario must attach to the GitHub Tool-use recipe');
  if (!recipeById.get('recipe-riley-vercel-review-checkpoint')?.operationalScenarios?.some(item => item.id === 'scenario-vercel-deployed-state-verification')) throw new Error('Vercel operational scenario must attach to the Vercel Tool-use recipe');
  if (!skillById.get('skill-architecture-decision-making')?.operationalScenarios?.some(item => item.id === 'scenario-architecture-proportionate-decision')) throw new Error('Architecture scenario must attach to its Skill');
  if (!skillById.get('skill-web-application-architecture')?.operationalScenarios?.some(item => item.id === 'scenario-frontend-runtime-boundary')) throw new Error('Frontend scenario must attach to its Skill');
  if (!skillById.get('skill-application-and-data-architecture')?.operationalScenarios?.some(item => item.id === 'scenario-application-data-source-of-truth')) throw new Error('Application/data scenario must attach to its Skill');
  const all = id => JSON.stringify(operationalScenarioCatalog.find(item=>item.id===id));
  if (!includesAll(all('scenario-github-issue-implementation'), ['reuse still-valid evidence','freshness','cheapest sufficient','immediately before merge','stop'])) throw new Error('GitHub scenario must encode reuse/freshness/stop');
  if (!includesAll(all('scenario-vercel-deployed-state-verification'), ['repository ci','do not deploy','preview','deployed-state question','stop'])) throw new Error('Vercel scenario must encode CI-first/no-unnecessary-preview behavior');
  if (!includesAll(all('scenario-architecture-proportionate-decision'), ['keep-current','do nothing yet','revisit trigger','technology-first'])) throw new Error('Architecture scenario must encode proportionate choice');
  if (!includesAll(all('scenario-frontend-runtime-boundary'), ['camille','jordan','nadia','accessibility','performance'])) throw new Error('Frontend scenario must preserve handoffs');
  if (!includesAll(all('scenario-application-data-source-of-truth'), ['structured files','cms','database','authentication','authorization','rollback'])) throw new Error('Application/data scenario must cover persistence/auth/migration');
  if (model.findOperationalScenarios('implement GitHub issue',{limit:1})[0]?.id !== 'scenario-github-issue-implementation') throw new Error('GitHub matcher failed');
  if (model.findOperationalScenarios('verify deployed preview in Vercel',{limit:1})[0]?.id !== 'scenario-vercel-deployed-state-verification') throw new Error('Vercel matcher failed');
  if (!model.findOperationalScenarios('do we need a database or CMS for this content',{limit:2}).some(item=>item.id==='scenario-application-data-source-of-truth')) throw new Error('Application/data matcher failed');
  if (orientation.spaces['operational-knowledge'] || orientation.spaces['knowledge-base']) throw new Error('Issue #185 must not create a top-level operational knowledge space');
  if (!includesAll(agents,['active operational scenario','operational-scenarios/index.json','load only the selected scenario body','do not fetch every scenario body','never overrides authorization'])) throw new Error('AGENTS targeted Operational Scenario retrieval rule missing');
  if (!includesAll(JSON.stringify(toolsRoute),['matching active operational scenario','stop when evidence is sufficient'])) throw new Error('Tools route operational scenario rule missing');
  if (!includesAll(JSON.stringify(skillsRoute),['matching active operational scenarios owned by the selected skill'])) throw new Error('Skills route operational scenario rule missing');
  if (!includesAll(contract,['relationships owned by an existing skill or tool-use recipe','operational-scenarios/index.json','do not fetch every scenario body','generated bundle is not the agent retrieval surface','evidence lifecycle','.golden.md','never grants permission'])) throw new Error('Operational knowledge targeted-retrieval contract incomplete');
  if (!includesAll(toolSkill,['active operational scenario','smallest matching scenario','never grants permission'])) throw new Error('Tool discovery Skill scenario rule missing');
}

export function validateRileyContinuityContract({ agents, workOrders, riley, rileyFlows }) {
  if (!riley || riley.id !== 'ai-orchestrator') throw new Error('Riley AI orchestrator record is missing');
  const personaText = [riley.behaviors, riley.needs, riley.implication].flat(Infinity).join(' ');
  if (!includesAll(personaText, ['current work', 'work order', 'live systems', 'broad rediscovery', 'every substantial current work workstream', 'operating route', 'parent work id', 'execute directly'])) throw new Error('Riley must declare universal durable Current Work orchestration while preserving direct execution');
  const operate = (rileyFlows || []).find(flow => flow.title === 'Operate and improve the system');
  if (!operate || !includesAll(JSON.stringify(operate), ['resume and checkpoint substantial work', 'reconcile durable orchestration state', 'operating route', 'parent work id'])) throw new Error('Riley operating workflow must include durable cross-agent checkpoint/resume and orchestration reconciliation behavior');
  if (!includesAll(agents, ['every substantial workstream', 'default durable orchestration owner', 'operate directly', 'operating route', 'parent work id', 'do not mirror volatile', 'refresh live systems'])) throw new Error('Root AGENTS must make Riley the default durable orchestration owner without forcing an extra execution hop');
  if (!includesAll(workOrders, ['every substantial workstream', 'default durable orchestration owner', 'operate directly', 'operating route', 'parent work id', 'resume order', 'do not mirror volatile live state'])) throw new Error('Work Order guidance must define universal Riley orchestration plus the Current Work → recovery artifact → live-system hierarchy');
}

export function validateRepositoryWorkingCopyContract({ agents, workOrders, architecture, uxPractice, uxContextTemplate, uxWorkOrderTemplate, uxRouting, docsReadme }) {
  if (!includesAll(agents, ['clean working copy', 'origin/main', 'required github checks', 'small-change lane', 'durable execution/recovery state', 'domain-specific artifacts'])) throw new Error('Root AGENTS must define the clean working-copy path, keep required GitHub checks, and make Work Orders conditional on unique recovery-state need');
  if (normalized(agents).includes('do not use a local checkout')) throw new Error('Root AGENTS must not restore the local-checkout ban');
  if (!includesAll(workOrders, ['small-change lane', 'existing authoritative surfaces', 'tracking/recovery footprint', 'verification queue', 'checkpoint-only commit', 'worknode', 'authoritative dispatch', 'gates', 'evidence', 'disposition'])) throw new Error('Work Order guidance must define the recovery-state-based lane, Verification Queue independence, batched progress commits, and preserve active Work Graph supervision');
  if (!includesAll(architecture, ['optional repository-wide execution/recovery packets', 'active work order packages stay', 'dedicated execution/recovery packet is warranted'])) throw new Error('Architecture guidance must make Work Orders conditional on unique recovery-state need rather than non-triviality');
  if (!includesAll(uxPractice, ['small-change lane', 'pull request', 'active work record', 'worknode', 'dispatch', 'gate', 'evidence', 'disposition'])) throw new Error('UX practice must use the small-change pull request as the active work record without dropping Work Graph obligations');
  if (!includesAll(uxContextTemplate, ['small-change-lane', 'do not create this packet', 'pull request', 'worknode'])) throw new Error('UX Project Context template must defer qualifying small changes to the pull-request record');
  if (!includesAll(uxWorkOrderTemplate, ['small-change-lane', 'do not create this template', 'pull request', 'worknode', 'needs a dedicated work order execution/recovery packet', 'when this template is warranted for repository work'])) throw new Error('UX Work Order template must make Work Order creation conditional on unique recovery-state need');
  if (!includesAll(uxRouting, ['small-change lane', 'pull request', 'active work record', 'worknode', 'work graph'])) throw new Error('UX routing guidance must align with the small-change lane and preserve Work Graph membership');
  if (!includesAll(docsReadme, ['qualifying small repository change', 'pull request', 'current work', 'verification queue', 'work graph'])) throw new Error('Documentation placement guidance must include the small-change authoritative-record boundary, Verification Queue continuity, and Work Graph preservation');
  const retiredSmallChangeRules = [
    [workOrders, 'is expected to finish in one session', 'Work Order guidance must not restore the one-session small-change gate'],
    [architecture, 'work orders are the repository-wide active-work packet and progress record for non-trivial work', 'Architecture must not restore automatic Work Orders for non-trivial work'],
    [architecture, 'active non-trivial work stays in docs/work-orders', 'Architecture placement guidance must not route all non-trivial work into Work Orders'],
    [uxPractice, 'short work-order status', 'UX practice must not restore the Work Order status requirement for focused small changes'],
    [uxContextTemplate, 'for a trivial change, record a short skip reason', 'UX Project Context template must not restore the Work Order skip note for small changes'],
    [uxWorkOrderTemplate, 'full work order was not warranted', 'UX Work Order template must not restore the trivial-change Work Order note'],
    [uxWorkOrderTemplate, 'use this template as the active work packet for a non-trivial ux practice run', 'UX Work Order template must not restore automatic Work Orders for non-trivial UX work'],
    [uxWorkOrderTemplate, 'for non-trivial work in this repository, keep the active work order', 'UX Work Order template must not route all non-trivial repository work into a Work Order']
  ];
  for (const [text, phrase, message] of retiredSmallChangeRules) if (normalized(text).includes(phrase)) throw new Error(message);
}

export function validateRileyWorkGraphContract({ riley, rileyFlows, skillCatalog, operationalScenarioCatalog, skillsRoute, skillPackage }) {
  if (!riley || riley.id !== 'ai-orchestrator') throw new Error('Riley work-graph validation requires the AI orchestrator Persona');
  const personaText = normalized([riley.behaviors, riley.needs, riley.skills, riley.implication].flat(Infinity).join(' '));
  if (!includesAll(personaText, ['work graph', 'authoritative dispatch', 'supervised delegation', 'read-before-retry'])) throw new Error('Riley Persona must expose work-graph supervision, dispatch authority, delegation, and recovery semantics');

  const skill = (skillCatalog || []).find(item => item.id === 'skill-work-graph-orchestration');
  if (!skill) throw new Error('Work graph orchestration Skill is missing');
  const skillText = normalized(JSON.stringify(skill));
  if (!includesAll(skillText, ['worknode', 'dispatch', 'gate', 'evidence', 'collision'])) throw new Error('Work graph Skill catalog projection must expose the minimum supervisory model');

  const operate = (rileyFlows || []).find(flow => flow.title === 'Operate and improve the system');
  if (!operate || !includesAll(JSON.stringify(operate), ['supervise the active work graph', 'workgraph packet', 'live runtime/github references'])) throw new Error('Riley operating workflow must include active work-graph supervision');

  const scenario = (operationalScenarioCatalog || []).find(item => item.id === 'scenario-riley-work-graph-supervision');
  if (!scenario || scenario.ownerId !== 'skill-work-graph-orchestration' || scenario.status !== 'active') throw new Error('Work graph orchestration Operational Scenario is missing or inactive');
  const scenarioText = normalized(JSON.stringify(scenario));
  if (!includesAll(scenarioText, ['one authoritative dispatch', 'read current state before retrying', 'do not infer completion', 'do not create a second authoritative task database'])) throw new Error('Work graph Operational Scenario must preserve authority, recovery, evidence, and state-boundary rules');

  const route = (skillsRoute?.routes || []).find(item => item.id === 'work-graph-orchestration');
  if (!route || route.target !== 'work-graph-orchestration' || route.package_path !== '.agents/skills/work-graph-orchestration') throw new Error('Skills orientation must route work-graph orchestration to the callable package');
  const recoveryRead = (route.first_reads || []).find(item => normalized(item).includes('work order'));
  if (!recoveryRead || !includesAll(recoveryRead, ['when one exists', 'otherwise', 'verification queue', 'domain artifact'])) throw new Error('Work-graph orientation must make the Work Order recovery read conditional and name the authoritative domain-artifact fallback');

  if (!includesAll(skillPackage, ['one authoritative active dispatch per worknode', 'handoff', 'supervised delegation', 'parallelize only', 'read-before-retry', 'execution-adapter contract', 'does not persist a second canonical task database', 'bounded correction', 'not new dispatches', 'new dispatch identity', 'abandoned', 'superseded', 'reassigned', 'small-change lane', 'tracking artifacts', 'orchestration membership', 'recovery state', 'linked work order when one exists', 'authoritative issue/pr/verification queue/domain artifact'])) throw new Error('Callable work-graph Skill is missing required orchestration invariants, repository dispatch identity, recovery-state boundary, or adapter boundary');
}

export function validateGitHubGovernanceContract({ agents, workOrders, boundedPlaybook, boundedRoute, toolsPage }) {
  const pin = String(agents || '').match(/rickvang\/tool-repo\/blob\/([0-9a-f]{40})\/tools\/github\/AGENTS\.md/i);
  if (!pin) throw new Error('Persona-Library must pin an exact GitHub Tool contract revision');
  if (pin[1].toLowerCase() === '94acc6082e941439d2ee532f1b1b091cd42eb923') throw new Error('Persona-Library must pin the post-split GitHub Tool contract');
  if (!includesAll(agents, ['github mutation classes', 'linked-issue completion semantics'])) throw new Error('Root AGENTS must defer GitHub mutation and linked-issue completion semantics to the pinned Tool contract');
  if (!includesAll(agents, ['standing completion authorization', 'implement', 'fix', 'build', 'complete', 'do not merge', 'pr only', 'leave for review'])) throw new Error('Root AGENTS must define scoped standing completion authorization and explicit requester overrides');
  if (!includesAll(workOrders, ['pinned github tool contract', 'merge authorization', 'linked-issue completion semantics'])) throw new Error('Work Order guidance must defer GitHub mutation semantics to the pinned Tool contract');
  if (!includesAll(workOrders, ['standing completion authorization', 'second confirmation gate', 'do not merge', 'pr only', 'leave for review'])) throw new Error('Work Order guidance must record repository standing authorization and task-level overrides without inventing a second confirmation gate');
  if (!includesAll(boundedPlaybook, ['pinned github tool contract', 'merge authorization', 'linked-issue completion semantics'])) throw new Error('Bounded Parallel must defer GitHub mutation semantics to the pinned Tool contract');
  if (!includesAll(boundedPlaybook, ['standing completion authorization', 'current requester instruction or target-repository contract', 'does not create authorization by itself'])) throw new Error('Bounded Parallel merge gate must recognize repository standing authorization without deriving it from green status');
  if (normalized(boundedPlaybook).includes('separately authorized merge')) throw new Error('Bounded Parallel must not maintain a duplicate reusable merge-authorization rule');
  if (normalized(boundedPlaybook).includes('pass only with explicit authorization and fresh preflight')) throw new Error('Bounded Parallel merge gate must not require a redundant second confirmation when repository standing authorization already applies');
  if (!includesAll(boundedRoute?.next_handoff, ['pinned github tool contract', 'merge authorization', 'linked-issue completion semantics'])) throw new Error('Bounded Parallel routing must defer GitHub mutation semantics to the pinned Tool contract');
  if (!includesAll(boundedRoute?.next_handoff, ['standing completion authorization', 'valid authorizer source', 'fresh preflight', 'does not create authorization'])) throw new Error('Bounded Parallel routing must recognize repository standing authorization while preserving the authorization boundary');
  if (normalized(boundedRoute?.next_handoff).includes('separately authorized mutation')) throw new Error('Bounded Parallel routing must not maintain a duplicate reusable merge-authorization rule');
  if (!includesAll(toolsPage, ['github', 'verified contract', 'runtime access', 'explicit authorization', 'fresh preflight'])) throw new Error('Tools page must present GitHub as a verified contract with runtime and authorization boundaries');
  if (!String(toolsPage || '').includes(`rickvang/tool-repo/blob/${pin[1]}/tools/github/AGENTS.md`)) throw new Error('Tools page GitHub contract link must match the root AGENTS pin');
  return pin[1].toLowerCase();
}

const routingCaseRequirements = {
  unqualifiedNarrow: {
    terms: ['unqualified', 'riley morgan', 'narrow', 'specialist', 'skill'],
    message: 'Unqualified narrow requests must route from Riley to a specialist or Skill'
  },
  unqualifiedFullOutcome: {
    terms: ['unqualified', 'riley morgan', 'full-outcome', 'playbook'],
    message: 'Unqualified full-outcome requests must route from Riley to a Playbook'
  },
  explicitSpecialist: {
    terms: ['explicit', 'specialist', 'directly'],
    message: 'Explicit specialist requests must support direct invocation'
  },
  explicitPlaybook: {
    terms: ['explicit', 'playbook', 'directly'],
    message: 'Explicit Playbook requests must support direct invocation'
  }
};

export function validateJobSearchRoutingCase(route, caseId) {
  const requirement = routingCaseRequirements[caseId];
  if (!requirement) throw new Error(`Unknown job-search routing case: ${caseId}`);
  if (!includesAll(route?.next_handoff, requirement.terms)) throw new Error(requirement.message);
}

export function validateJobSearchRoutingContract({ route, implementation, riley, rileyFlows, playbook, specialistIds }) {
  if (!riley || riley.roleLabel !== 'AI orchestrator') throw new Error('Riley must retain the canonical AI orchestrator identity');
  if (!rileyFlows?.some(flow => includesAll(`${flow.summary || ''} ${flow.title || ''}`, ['unqualified', 'bounded']))) throw new Error('Riley workflow must describe default handling of unqualified requests');
  if (!playbook || playbook.id !== 'playbook-evidence-led-job-search') throw new Error('Evidence-led Job Search must remain the canonical job-search Playbook');
  for (const caseId of Object.keys(routingCaseRequirements)) validateJobSearchRoutingCase(route, caseId);
  if (!includesAll(route?.next_handoff, ['stages', 'shared state', 'quality gates', 'recovery', 'learning loop'])) throw new Error('Docs job-search route must describe Playbook procedure ownership');
  if (!includesAll(route?.next_handoff, ['candidate baseline', 'standing decisions', 'career spine', 'secondary profile'])) throw new Error('Docs job-search route must enforce designated Candidate Baseline resolution before composition');
  if (!includesAll(implementation, ['default system entry', 'unqualified requests', 'priya desai', 'operates', 'shared state', 'quality gates', 'learning loop', 'explicit requests', 'route directly', 'process surface'])) throw new Error('Job-search guidance must express Riley-first routing, Priya operation, and Playbook process ownership');
  if (!includesAll(implementation, ['candidate baseline resume', 'private-source resolution gate', 'career spine', 'secondary profile stores', 'baseline-to-output'])) throw new Error('Job-search guidance must preserve a designated candidate baseline and baseline-integrity gate');
  const requiredSpecialists = ['career-strategist', 'role-calibrator', 'application-editor', 'outreach-interview-coach', 'ui-expert', 'document-designer'];
  for (const id of requiredSpecialists) if (!specialistIds?.has(id)) throw new Error(`Job-search specialist boundary is missing: ${id}`);
  if (specialistIds?.has('job-search')) throw new Error('No generic Job Search Persona may be introduced');
}

export function validateApplicationWorkflowTrackerGuidance({ route, implementation }) {
  const firstReads = Array.isArray(route?.first_reads) ? route.first_reads.join(' ') : '';
  if (!includesAll(firstReads, ['application-tracker-contract.md', 'opportunity/application tracking'])) throw new Error('Resume/application routing must read the Applications tracker contract when tracking is in scope');
  if (!includesAll(route?.next_handoff, ['existing tracker record', 'duplicate', 'sourceurl', 'postingdate', 'packeturl', 'packet ready', 'applieddate', 'confirmed submission', 'confirmed events'])) throw new Error('Resume/application routing must preserve tracker identity and milestone rules');
  if (!includesAll(implementation, ['primary persistence layer', 'browser-local', 'explicit fallback', 'migration', 'recovery', 'existing record', 'sourceurl', 'postingdate', 'never infer', 'packeturl', 'packet ready', 'applieddate', 'confirmed submission', 'confirmed events'])) throw new Error('Job-search implementation must describe current tracker persistence and source-backed updates');
  if (implementation.includes('Real records stay in browser-local private state')) throw new Error('Job-search implementation must not describe browser-local-only tracker persistence as current');
}


export function validateJobApplicationTrackerContract({ page, runtime, importRuntime = '', storeRuntime = '', configRuntime = '', contract }) {
  if (!page.includes('id="storage-mode-title"') || !page.includes('persona-library.job-applications.v1') || !page.includes('<script src="js/job-tracker-config.js"></script>') || !page.includes('<script src="js/job-tracker-import.js"></script>') || !page.includes('<script src="js/job-tracker-store.js"></script>') || !page.includes('<script src="js/job-tracker.js"></script>') || !page.includes('Keep every opportunity in one place.') || !page.includes('id="auth-form"') || !page.includes('id="auth-email"') || !page.includes('id="auth-password"') || !page.includes('autocomplete="current-password"') || !page.includes('id="posting-date"') || !page.includes('<th>Posting date</th>') || !page.includes('id="migrate-local-button"') || !page.includes('id="merge-import-button"') || !page.includes('id="replace-all-button"')) throw new Error('Applications tracker page is missing its privacy, password authentication, migration, import review, or storage runtime boundary');
  if (!page.includes('@supabase/supabase-js@2.116.0')) throw new Error('Applications tracker must pin the reviewed Supabase browser client version');
  for (const status of ['Found', 'Reviewing', 'Packet Ready', 'Applied', 'Interviewing', 'Offer', 'Closed']) if (!runtime.includes(status) && !importRuntime.includes(status)) throw new Error('Applications tracker runtime is missing lifecycle state: ' + status);
  if (!runtime.includes("FORMAT, version: FORMAT_VERSION") || !runtime.includes("const postingDate = document.createElement('td')") || !runtime.includes('postingDate') || !importRuntime.includes('postingDate') || !runtime.includes('importFile.addEventListener') || !importRuntime.includes('Unsupported tracker format') || !importRuntime.includes('unsupported version')) throw new Error('Applications tracker runtime is missing versioned import/export portability behavior');
  if (!importRuntime.includes('canonicalizeSourceUrl') || !importRuntime.includes('previewMerge') || !importRuntime.includes('replaceAll') || !page.includes('Merge safe changes')) throw new Error('Applications tracker is missing non-destructive merge or explicit Replace all behavior');
  if (!runtime.includes('safeUrl') && !importRuntime.includes("['http:', 'https:']")) throw new Error('Applications tracker must restrict imported links to HTTP/HTTPS');
  if (!storeRuntime.includes('createLocalStorageOpportunityStore') || !storeRuntime.includes('createSupabaseOpportunityStore') || !storeRuntime.includes("client.schema(schema).from('opportunities')") || !storeRuntime.includes('posted_at') || !storeRuntime.includes('signInWithPassword({ email, password })') || !storeRuntime.includes('persistSession: true') || !storeRuntime.includes('localStorage.getItem(storageKey)')) throw new Error('Applications tracker storage adapter is missing local migration or password-authenticated Supabase behavior');
  if (!runtime.includes('Local writes are not used as a silent fallback') || !contract.includes('never a silent fallback')) throw new Error('Applications tracker must not silently fall back to local writes after remote failure');
  if (!configRuntime.includes('PersonaLibraryJobTrackerConfig') || !/["']mode["']\s*:\s*["'](?:local|supabase)["']/.test(configRuntime)) throw new Error('Applications tracker generated config is missing an explicit storage mode');
  if (!contract.includes('Authenticated private opportunity store') || !contract.includes('postingDate') || !contract.includes('never infer or fabricate') || !contract.includes('LocalStorageOpportunityStore') || !contract.includes('SupabaseOpportunityStore') || !contract.includes('signInWithPassword') || !contract.includes('never written to local storage') || !contract.includes('versioned JSON') || !contract.includes('standalone application') || !contract.includes('seen-job deduplication contract') || !contract.includes('non-destructive merge')) throw new Error('Application tracker contract is missing authenticated privacy, password handling, portability, extraction, merge, adapter, or seen-job separation');
  if (/Rick Vang|rickvang\.com|612\.366\.3550/i.test(page + runtime + importRuntime + storeRuntime + configRuntime)) throw new Error('Applications tracker source must not seed candidate-specific private values');
  if (/service_role|sb_secret_/i.test(page + runtime + importRuntime + storeRuntime + configRuntime)) throw new Error('Applications tracker client source must not expose a secret/service-role key');
  if (/signInWithOtp|Send sign-in link|shouldCreateUser:\s*false/.test(page + runtime + storeRuntime)) throw new Error('Applications tracker must not depend on magic-link email auth');
}

export async function validateGeneratedOutputs(context) {
  const { files, routeSources, canvasModules, root } = context;
  const freshnessPairs = [
    ['librarySource', 'libraryOutput', 'Generated dist/data/library-data.js is stale; run build-library.mjs'],
    ['orientationSource', 'orientationOutput', 'Generated dist/data/site-orientation.json is stale; run build-library.mjs'],
    ['modelSource', 'modelOutput', 'Generated dist/data/library-model.js is stale; run build-library.mjs'],
    ['uiSource', 'uiOutput', 'Generated dist/js/library-ui.js is stale; run build-library.mjs'],
    ['stateSource', 'stateOutput', 'Generated dist/js/library-state.js is stale; run build-library.mjs'],
    ['templatePreviewSource', 'templatePreviewOutput', 'Generated dist/js/template-preview.js is stale; run build-library.mjs'],
    ['jobTrackerSource', 'jobTrackerPage', 'Generated dist/job-tracker.html is stale; run build-library.mjs'],
    ['jobTrackerImportSource', 'jobTrackerImportOutput', 'Generated dist/js/job-tracker-import.js is stale; run build-library.mjs'],
    ['jobTrackerStoreSource', 'jobTrackerStoreOutput', 'Generated dist/js/job-tracker-store.js is stale; run build-library.mjs'],
    ['jobTrackerRuntimeSource', 'jobTrackerRuntimeOutput', 'Generated dist/js/job-tracker.js is stale; run build-library.mjs']
  ];
  for (const [sourceKey, outputKey, message] of freshnessPairs) if (files[sourceKey] !== files[outputKey]) throw new Error(message);
  for (const [sourcePath, outputPath] of canvasModules) {
    const [moduleSource, moduleOutput] = await Promise.all([context.readFile(sourcePath), context.readFile(outputPath)]);
    if (moduleSource !== moduleOutput) throw new Error(`Generated ${outputPath} is stale; run build-library.mjs`);
  }
  for (const { outputPath, source, output } of routeSources.values()) if (source !== output) throw new Error(`Generated ${outputPath} is stale; run build-library.mjs`);
  const [rootAgents, workOrderContract, architecture, boundedParallelPlaybook, operationalKnowledgeContract, toolDiscoverySkill, workGraphSkill, uxPractice, uxContextTemplate, uxWorkOrderTemplate, uxRouting, docsReadme] = await Promise.all([
    context.readFile('AGENTS.md'),
    context.readFile('docs/work-orders.md'),
    context.readFile('ARCHITECTURE.md'),
    context.readFile('docs/playbooks/bounded-parallel-implementation.md'),
    context.readFile('docs/operational-knowledge.md'),
    context.readFile('.agents/skills/tool-discovery-and-safe-execution/SKILL.md'),
    context.readFile('.agents/skills/work-graph-orchestration/SKILL.md'),
    context.readFile('docs/ux/expert-ux-design-practice.md'),
    context.readFile('docs/ux/project-context-template.md'),
    context.readFile('docs/ux/ux-work-order-template.md'),
    context.readFile('docs/ux/project-context-and-reference-routing.md'),
    context.readFile('docs/README.md')
  ]);
  validateRileyContinuityContract({
    agents: rootAgents,
    workOrders: workOrderContract,
    riley: context.data.personas.find(persona => persona.id === 'ai-orchestrator'),
    rileyFlows: context.data.flowLibrary?.['ai-orchestrator'] || []
  });
  validateRileyWorkGraphContract({
    riley: context.data.personas.find(persona => persona.id === 'ai-orchestrator'),
    rileyFlows: context.data.flowLibrary?.['ai-orchestrator'] || [],
    skillCatalog: context.data.skillCatalog,
    operationalScenarioCatalog: context.data.operationalScenarioCatalog,
    skillsRoute: context.routeGroups.get('skills'),
    skillPackage: workGraphSkill
  });
  validateGitHubGovernanceContract({
    agents: rootAgents,
    workOrders: workOrderContract,
    boundedPlaybook: boundedParallelPlaybook,
    boundedRoute: context.routeGroups.get('playbooks').routes.find(route => route.id === 'bounded-parallel-implementation'),
    toolsPage: files.toolsPage
  });
  validateRepositoryWorkingCopyContract({
    agents: rootAgents,
    workOrders: workOrderContract,
    architecture,
    uxPractice,
    uxContextTemplate,
    uxWorkOrderTemplate,
    uxRouting,
    docsReadme
  });
  validateOperationalKnowledgeContract({
    operationalScenarios: context.data.operationalScenarios,
    operationalScenarioCatalog: context.data.operationalScenarioCatalog,
    operationalScenarioIndex: context.operationalScenarioIndex,
    toolUseRecipes: context.data.toolUseRecipes,
    skillCatalog: context.data.skillCatalog,
    model: context.model,
    orientation: context.orientation,
    toolsRoute: context.routeGroups.get('tools'),
    skillsRoute: context.routeGroups.get('skills'),
    agents: rootAgents,
    contract: operationalKnowledgeContract,
    toolSkill: toolDiscoverySkill
  });
  validateVercelToolCatalogSurface({
    toolCatalog: context.data.toolCatalog,
    toolUseRecipes: context.data.toolUseRecipes,
    personaToolRequirements: context.data.personaToolRequirements,
    toolsPage: files.toolsPage
  });
  validateWebArchitecturePersonaContract({
    personas: context.data.personas,
    flowLibrary: context.data.flowLibrary,
    skillCatalog: context.data.skillCatalog,
    personaHandoffs: context.data.personaHandoffs,
    personaToolRequirements: context.data.personaToolRequirements
  });
  const decisionSource = JSON.parse(await context.readFile('docs/decisions/records.json'));
  const decision010 = decisionSource.records.find(record => record.id === 'DEC-010');
  const decision011 = decisionSource.records.find(record => record.id === 'DEC-011');
  const decision013 = decisionSource.records.find(record => record.id === 'DEC-013');
  const decision014 = decisionSource.records.find(record => record.id === 'DEC-014');
  const decision015 = decisionSource.records.find(record => record.id === 'DEC-015');
  const decision016 = decisionSource.records.find(record => record.id === 'DEC-016');
  const decision017 = decisionSource.records.find(record => record.id === 'DEC-017');
  const decision023 = decisionSource.records.find(record => record.id === 'DEC-023');
  if (decisionSource.source !== 'docs/decisions/records.json' || !Array.isArray(decisionSource.records) || !decision010?.corrections?.length || !decision011?.status_note?.includes('DEC-013') || !decision011?.status_note?.includes('DEC-014') || !decision013?.qualifies?.includes('DEC-011') || !decision014?.qualifies?.includes('DEC-011') || !decision015?.qualifies?.includes('DEC-008') || !normalized(decision015?.decision).includes('candidate baseline resume') || decision016?.status !== 'Superseded' || !decision017?.qualifies?.includes('DEC-016') || !normalized(decision017?.decision).includes('authenticated supabase storage') || !normalized(decision017?.decision).includes('canonical in git') || !decision023?.qualifies?.includes('DEC-018') || !normalized(decision023?.decision).includes('operational / golden scenario') || files.decisionOutput !== renderDecisionsPage(files.decisionTemplateSource, decisionSource.records)) throw new Error('Generated Decisions output is stale or its authored source/history links are invalid; run build-library.mjs');

  const { page, skillsPage, templatesPage, templateViewerPage, jobSearchPage, jobTrackerPage, jobTrackerRuntimeOutput, jobTrackerImportOutput, jobTrackerStoreOutput, jobTrackerConfigOutput, playbooksPage, operatingPacksPage, prototypingPage, canvasPage, guidePage, toolsPage } = files;
  for (const [name, html] of [['library', page], ['skills', skillsPage]]) for (const script of ['data/library-data.js', 'data/library-model.js', 'js/library-ui.js', 'js/library-state.js']) if (!html.includes(`<script src="${script}"></script>`)) throw new Error(`${name} page is missing ${script}`);
  for (const [name, html] of [['templates', templatesPage], ['template-viewer', templateViewerPage]]) if (!html.includes('<script src="js/template-preview.js"></script>')) throw new Error(`${name} page is missing js/template-preview.js`);
  for (const html of [page, skillsPage, jobSearchPage, playbooksPage, operatingPacksPage, templatesPage]) if (!html.includes('playbooks.html')) throw new Error('Primary pages must link to the Playbooks space');
  for (const html of [page, skillsPage, jobSearchPage, playbooksPage, operatingPacksPage, templatesPage]) if (!html.includes('operating-packs.html')) throw new Error('Primary pages must link to the Operating Packs space');
  for (const html of [page, skillsPage, jobSearchPage, playbooksPage, operatingPacksPage, templatesPage]) if (!html.includes('templates.html')) throw new Error('Primary pages must link to the Templates space');
  for (const html of [page, skillsPage, jobSearchPage, jobTrackerPage, playbooksPage, operatingPacksPage, templatesPage, toolsPage, guidePage, prototypingPage, files.decisionOutput]) if (!html.includes('job-tracker.html')) throw new Error('Primary pages must link to the Applications tracker surface');

  if (!jobSearchPage.includes('An evidence-led job search system.') || !jobSearchPage.includes('Define target') || !jobSearchPage.includes('ATS quality') || !jobSearchPage.includes('Integrity quality') || !jobSearchPage.includes('Preflight before the council') || !jobSearchPage.includes('reverse chronological') || !jobSearchPage.includes('date consistency')) throw new Error('Job search page is missing its system summary or quality gates');
  if (/>\s*Job-search orchestrator\s*</.test(jobSearchPage) || /Riley Morgan[^<]{0,120}Job-search orchestration/i.test(jobSearchPage) || /Riley Morgan[^<]{0,80}Job Search Persona/i.test(jobSearchPage)) throw new Error('Job search page must not present Riley as a Job-search domain identity');
  if (!jobSearchPage.includes('Priya Desai · Job search orchestrator') || !jobSearchPage.includes('Job search orchestrator · Playbook operator') || !jobSearchPage.includes('Riley Morgan · AI orchestrator')) throw new Error('Job search page must present Riley as the entry/router and Priya as the Job Search Orchestrator / Playbook operator');
  if (!playbooksPage.includes('Playbooks compose the system.') || !playbooksPage.includes('Evidence-led job search') || !playbooksPage.includes('Bounded parallel implementation') || !playbooksPage.includes('compact handoff') || !playbooksPage.includes('Shared state keeps the playbook coherent') || !playbooksPage.includes('Change control') || !playbooksPage.includes('conditional reconciliation gate')) throw new Error('Playbooks page is missing its mental model or current playbook');
  if (!playbooksPage.includes('Seen-job set') || !playbooksPage.includes('operating surface') || !playbooksPage.includes('Operated by Priya Desai · Job search orchestrator')) throw new Error('Playbooks page must present Persona-operated Playbooks, Priya as job-search operator, and the lightweight seen-job state card');
  if (!guidePage.includes('Evidence-led job search')) throw new Error('Docs page must keep Evidence-led job search as a Playbook example');
  const decisionsPage = files.decisionOutput;
  if (!decisionsPage.includes('DEC-011') || !decisionsPage.includes('Riley orchestrates job search; the Playbook owns the outcome')) throw new Error('Decisions page must record DEC-011 Riley/job-search ownership boundary');
  if (!decisionsPage.includes('DEC-013') || !decisionsPage.includes('Riley is the default routing front door') || !decisionsPage.includes('Explicit requests naming a specialist')) throw new Error('Generated Decisions page must present DEC-013 routing conclusion');
  if (!decisionsPage.includes('DEC-014') || !decisionsPage.includes('Personas operate Playbooks; job search gets a domain orchestrator')) throw new Error('Generated Decisions page must present DEC-014 Persona-operated Playbook conclusion');
  if (!decisionsPage.includes('DEC-015') || !decisionsPage.includes('A designated candidate baseline preserves the career spine')) throw new Error('Generated Decisions page must present DEC-015 Candidate Baseline conclusion');
  if (!decisionsPage.includes('DEC-016') || !decisionsPage.includes('Application tracking stays private and extractable')) throw new Error('Generated Decisions page must retain superseded DEC-016 application tracking history');
  if (!decisionsPage.includes('DEC-017') || !decisionsPage.includes('Authenticated storage becomes primary for private application tracking')) throw new Error('Generated Decisions page must present DEC-017 authenticated storage boundary');
  const seenJobContract = await context.readFile('docs/job-search/job-ledger-contract.md');
  if (!seenJobContract.includes('Seen-job deduplication contract') || !seenJobContract.includes('private seen-job set') || !seenJobContract.includes('first_shown') || !seenJobContract.includes('does **not** define a full job-opportunity ledger or application tracker')) throw new Error('Seen-job deduplication contract is missing identity, privacy, or scope boundaries');
  const trackerContract = await context.readFile('docs/job-search/application-tracker-contract.md');
  validateJobApplicationTrackerContract({ page: jobTrackerPage, runtime: jobTrackerRuntimeOutput, importRuntime: jobTrackerImportOutput, storeRuntime: jobTrackerStoreOutput, configRuntime: jobTrackerConfigOutput, contract: trackerContract });
  const jobSearchImpl = await context.readFile('docs/job-search/implementation.md');
  if (jobSearchImpl.includes('Riley is the job-search orchestrator') || jobSearchImpl.includes('**Job-search orchestrator**')) throw new Error('docs/job-search/implementation.md must not frame Riley as the Job-search orchestrator identity');
  const riley = context.data.personas.find(persona => persona.id === 'ai-orchestrator');
  const rileyFlows = context.data.flowLibrary?.['ai-orchestrator'] || [];
  const jobSearchPlaybook = context.data.playbookCatalog.find(playbook => playbook.id === 'playbook-evidence-led-job-search');
  const jobSearchRoute = context.routeGroups.get('docs').routes.find(route => route.id === 'resume-application-work');
  validateJobSearchRoutingContract({ route: jobSearchRoute, implementation: jobSearchImpl, riley, rileyFlows, playbook: jobSearchPlaybook, specialistIds: new Set(context.data.personas.map(persona => persona.id)) });
  validateApplicationWorkflowTrackerGuidance({ route: jobSearchRoute, implementation: jobSearchImpl });
  const jobSearchOperator = context.data.personas.find(persona => persona.id === 'job-search-orchestrator');
  const jobSearchOperatorFlows = context.data.flowLibrary?.['job-search-orchestrator'] || [];
  if (!jobSearchOperator || jobSearchOperator.name !== 'Priya Desai' || jobSearchOperator.roleLabel !== 'Job search orchestrator') throw new Error('Canonical Job Search Orchestrator Persona is missing or malformed');
  if (jobSearchOperatorFlows.length < 6 || !jobSearchOperatorFlows.some(flow => flow.title === 'Review campaign health and allocate attention') || !jobSearchOperatorFlows.some(flow => flow.title === 'Recover a stalled or inconsistent search')) throw new Error('Job Search Orchestrator workflow map is incomplete');
  if (!context.data.skillLibrary?.['job-search-orchestrator']?.some(skill => skill.name === 'Task decomposition and routing') || !context.data.skillLibrary?.['job-search-orchestrator']?.some(skill => skill.name === 'Failure recovery and operational judgment')) throw new Error('Job Search Orchestrator must reuse orchestration capabilities without requiring new portable Skills');
  if (!jobSearchImpl.includes('Riley Morgan · AI orchestrator') || !jobSearchImpl.includes('Priya Desai') || !jobSearchImpl.includes('seen-job deduplication contract')) throw new Error('docs/job-search/implementation.md must retain Riley as router, Priya as operator, and the seen-job deduplication contract');
  const templateLifecycleCard = playbookCatalogCard(playbooksPage, 'playbook-template-lifecycle');
  if (!templateLifecycleCard || !templateLifecycleCard.includes('<span>7 stages</span>') || !templateLifecycleCard.includes('Elena Park · Template Librarian')) throw new Error('Template lifecycle catalog card must show 7 stages and Elena Park as coordinator');
  if (!playbooksPage.includes('id="template-lifecycle"') || !playbooksPage.includes('Research, promote, and maintain a reusable Template') || !playbooksPage.includes('Promote only with reuse evidence')) throw new Error('Playbooks page must present the Template lifecycle overview');
  if (!guidePage.includes('Template lifecycle example') || !guidePage.includes('playbooks.html#template-lifecycle')) throw new Error('Docs page must link the Template lifecycle Playbook example');
  if (!decisionsPage.includes('DEC-012') || !decisionsPage.includes('Template lifecycle is a distinct Playbook') || !decisionsPage.includes('playbook-template-lifecycle')) throw new Error('Decisions page must record DEC-012 Template lifecycle Playbook boundary');
  const templateLifecyclePlaybook = await context.readFile('docs/playbooks/template-lifecycle.md');
  if (!templateLifecyclePlaybook.includes('playbook-template-lifecycle') || !templateLifecyclePlaybook.includes('$template-research') || !templateLifecyclePlaybook.includes('Promotion requires reuse evidence') || !templateLifecyclePlaybook.includes('Do not use this Playbook when')) throw new Error('Template lifecycle Playbook contract is missing required ownership or non-trigger boundaries');
  if (context.orientation.spaces.playbooks.route_count !== 4) throw new Error('Playbooks bootstrap route_count must include template-lifecycle');
  if (!context.routeGroups.get('playbooks').routes.some((route) => route.id === 'template-lifecycle')) throw new Error('Playbooks route group must include template-lifecycle');
  if (!context.routeGroups.get('templates').routes.find((route) => route.id === 'template-library-stewardship')?.next_handoff.includes('playbook-template-lifecycle')) throw new Error('Templates stewardship handoff must point full lifecycle runs to the Playbook');
  const boundedParallelCard = playbookCatalogCard(playbooksPage, 'playbook-bounded-parallel-implementation');
  if (!boundedParallelCard || !boundedParallelCard.includes('<span>4 roles</span>')) throw new Error('Bounded parallel catalog card must show 4 roles');
  if (!boundedParallelCard.includes('<span>8 stages</span>')) throw new Error('Bounded parallel catalog card must show 8 stages');
  if (!playbooksPage.includes('01 / ORIENT') || !playbooksPage.includes('02 / GROUND') || !playbooksPage.includes('source-ground')) throw new Error('Playbooks page must present orientation and source-grounding before dispatch');
  if (!operatingPacksPage.includes('Operating Packs keep the domain in view.') || !operatingPacksPage.includes('operatingPackCatalog') || !operatingPacksPage.includes('planned') || !operatingPacksPage.includes('AGENTS.md') || !operatingPacksPage.includes("grid.addEventListener('toggle'") || !operatingPacksPage.includes('}, true);') || !operatingPacksPage.includes("state.set({ selected: '' })")) throw new Error('Operating Packs page is missing its catalog, source boundary, or planned example');
  if (!templatesPage.includes('Find the right starting shape.') || !templatesPage.includes('templateCatalog') || !templatesPage.includes('category-filter') || !templatesPage.includes('status-filter') || !templatesPage.includes('source-filter') || !templatesPage.includes('preview-filter') || !templatesPage.includes('catalog-summary') || !templatesPage.includes('template-research') || !templatesPage.includes('relatedToolRecipes') || !templatesPage.includes("grid.addEventListener('toggle'")) throw new Error('Templates page is missing its normalized catalog, filters, relationships, or lifecycle boundary');
  if (!templatesPage.includes("id=\"' + escapeHtml(template.id)") || !templatesPage.includes('window.location.hash.slice(1)') || !templatesPage.includes("scrollIntoView({ block: 'start' })") || templatesPage.includes('<span id="template-design-system-web-app" aria-hidden="true"></span>') || !templatesPage.includes('Entrypoint unknown') || !templatesPage.includes('sourceState') || !templatesPage.includes('previewState') || !templatesPage.includes('data-source-state') || !templatesPage.includes('data-preview-state') || !templatesPage.includes('Inspect Template →') || !templatesPage.includes('pinned ')) throw new Error('Templates page is missing rendered fragment selection or planned entrypoint handling');
  if (!templateViewerPage.includes('decision-panel') || !templateViewerPage.includes('decision-state-grid') || !templateViewerPage.includes('evidenceState') || !templateViewerPage.includes('sourceState') || !templateViewerPage.includes('runtimeAccessState') || !templateViewerPage.includes('previewState') || !templateViewerPage.includes('previewRenderers') || !templateViewerPage.includes('No local view') || !templateViewerPage.includes('pinned ')) throw new Error('Template viewer is missing its explicit evidence states or preview registry');
  if (templateViewerPage.includes('</header><hr class="resume-classic-rule">')) throw new Error('Classic resume mockup duplicates the header separator');
  if (countFunctionDefinitions(templatesPage, 'card') !== 1 || countFunctionDefinitions(templatesPage, 'render') !== 1 || countFunctionDefinitions(templateViewerPage, 'renderTemplate') !== 1) throw new Error('Template catalog or viewer contains superseded duplicate rendering implementations');
  if (guidePage.includes('rickvang/TemplateRepo') || playbooksPage.includes('rickvang/TemplateRepo')) throw new Error('Current Site docs still present TemplateRepo as the Design System Operating Pack source');
  if (!prototypingPage.includes('Persona prototypes') || !prototypingPage.includes('proto-persona-surface-aware-partner') || !prototypingPage.includes('proto-persona-library-guide') || !prototypingPage.includes('Persona Library Guide') || !prototypingPage.includes('Selected output with missing prerequisites') || !prototypingPage.includes('Nothing is added to Personas by testing this') || !prototypingPage.includes('Promotion gate') || !prototypingPage.includes('change-reconciliation-prototype') || !prototypingPage.includes('proto-skill-change-impact-reconciliation') || !prototypingPage.includes('Generated artifact update') || !prototypingPage.includes('reconciliation report') || !prototypingPage.includes('skill-contract-prototype') || !prototypingPage.includes('proto-skill-contract-routing') || !prototypingPage.includes('Missing metadata')) throw new Error('Prototyping page is missing the isolated persona prototype workspace');
  for (const script of ['js/canvas-graph.js', 'js/canvas-intent.js', 'data/prototypes/workflow-canvas.js']) if (!canvasPage.includes(`<script src="${script}"></script>`)) throw new Error(`Workflow canvas page is missing ${script}`);
  if (!canvasPage.includes('proto-workflow-canvas-reasoning') || !canvasPage.includes('isolated prototype') || !canvasPage.includes('What this change reads as') || !canvasPage.includes('Change log') || !canvasPage.includes('Intent packet') || !canvasPage.includes('The canvas cannot answer')) throw new Error('Workflow canvas page is missing its prototype boundary or reasoning panels');
  if (!canvasPage.includes('drop-line') || !canvasPage.includes('showDropLine') || !canvasPage.includes('renderChains') || !canvasPage.includes('chain-label')) throw new Error('Workflow canvas page is missing the drop indicator or the sequence grouping');
  if (!canvasPage.includes('tabindex="0"') || !canvasPage.includes('grabCard') || !canvasPage.includes('cancelGrab') || !canvasPage.includes('id="move-status"') || !canvasPage.includes('aria-live="polite"')) throw new Error('Workflow canvas page is missing keyboard operation of the drag gesture');
  if (!canvasPage.includes('isInSequence') || !canvasPage.includes('node-links in-sequence') || !canvasPage.includes('focus-within .node-links.in-sequence') || !canvasPage.includes('Connect to')) throw new Error('Workflow canvas page is missing the connection-chip rules or the connect affordance');
  if (!canvasPage.includes('node-desc') || !canvasPage.includes('-webkit-line-clamp:2') || !canvasPage.includes('node.failureMode')) throw new Error('Workflow canvas card is missing its clamped description line');
  if (!prototypingPage.includes('workflow-canvas-prototype') || !prototypingPage.includes('proto-workflow-canvas-reasoning') || !prototypingPage.includes('workflow-canvas.html') || !prototypingPage.includes('Layout-only move') || !prototypingPage.includes('Displacement')) throw new Error('Prototyping page is missing the workflow canvas prototype');
  if (!guidePage.includes('persona-library-guide') || !guidePage.includes('Consult the Persona Library Guide') || !guidePage.includes('Prerequisite gate') || !guidePage.includes('change-reconciliation') || !guidePage.includes('$change-impact-reconciliation') || !guidePage.includes('skill-contract') || !guidePage.includes('Conditional skill contract') || !guidePage.includes('Copy prompt')) throw new Error('Docs page is missing the Persona Library Guide handoff');
  if (!guidePage.includes('agent-orientation') || !context.orientation.default_entry.includes('guide.html#agent-orientation')) throw new Error('Agent orientation must be linked from the Docs page and manifest');
  if (!guidePage.includes('routing-map') || !guidePage.includes('Persona-applied') || !guidePage.includes('$persona-panel-orchestration') || !guidePage.includes('skillLibrary') || !guidePage.includes('skill-authoring') || !guidePage.includes('$pl-skill-creator') || !guidePage.includes('PL Skill Creator') || !guidePage.includes('Bounded Parallel Implementation Playbook')) throw new Error('Docs page is missing the unified system routing map');
}
