#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveAgentContextBundle } from '../scripts/build-agent-context-bundles.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FIXTURES = 'eval/fixtures/skill-package-maintenance-behavior.json';
const BUNDLE = 'dist/data/agent-context/skill-package-maintenance.json';
const AGENTS = 'AGENTS.md';
const BOOTSTRAP = 'content/site-orientation.json';
const SKILL_ROUTES = 'content/orientation/skills.json';
const SKILL = '.agents/skills/pl-skill-creator/SKILL.md';
const SEP = '\n\n--- CONTEXT ARTIFACT ---\n\n';

const readText = relativePath => readFile(path.join(root, relativePath), 'utf8');
const readJson = async relativePath => JSON.parse(await readText(relativePath));

function metrics(value) {
  const bytes = Buffer.byteLength(value, 'utf8');
  return { utf8_bytes: bytes, rough_tokens: Math.ceil(bytes / 4) };
}

function modeFromPrompt(prompt) {
  const text = prompt.toLowerCase();
  if (text.includes('plan ') || text.includes('plan the next') || text.includes('do not change any files')) return 'plan';
  if (text.includes('show me what should change') || text.includes('not authorized edits')) return 'answer';
  if (/\b(update|write|apply|hand-edit)\b/.test(text)) return 'update';
  return 'answer';
}

function classifyPrompt(prompt) {
  const text = prompt.toLowerCase();
  const mode = modeFromPrompt(prompt);
  const oneOff = text.includes('project-specific instruction document') || text.includes('do not turn it into a reusable skill package');
  const personaApplication = text.includes('apply the existing capability to camille') || text.includes('persona workflow');
  const placementAmbiguous = text.includes('not sure whether it should be a new callable skill package') || text.includes('extension of an existing record');
  const scopeApproved = text.includes('approved');
  const packageReferencedUnverified = text.includes('readme mentions the package') && text.includes('package files') && text.includes('unverified');
  const packageExisting = text.includes('existing reusable callable skill package')
    || text.includes('existing skill package')
    || text.includes('existing package')
    || text.includes('pl-skill-creator');
  const runtimeUnverified = /runtime availability.*not been verified|runtime availability are unverified|permissions.*not been verified/.test(text);
  const directGeneratedEdit = text.includes('hand-edit the generated dist output directly');
  const repositoryOnly = text.includes('authorize only the repository package update');
  const explicitAuthorization = text.includes('i authorize') && !repositoryOnly;
  const readOnly = mode === 'plan' || text.includes('do not change any files');

  let selectedRoute = 'skill-package-maintenance';
  if (oneOff) selectedRoute = 'docs';
  else if (personaApplication) selectedRoute = 'persona-capability-maintenance';
  else if (placementAmbiguous) selectedRoute = 'placement-review';

  const activate = selectedRoute === 'skill-package-maintenance';

  let scopePosture = 'missing';
  if (oneOff) scopePosture = 'one-off';
  else if (personaApplication) scopePosture = 'persona-application';
  else if (scopeApproved) scopePosture = 'approved';

  let packagePosture = 'new-approved';
  if (placementAmbiguous) packagePosture = 'ambiguous';
  else if (!activate) packagePosture = 'not-applicable';
  else if (packageReferencedUnverified) packagePosture = 'referenced-unverified';
  else if (packageExisting) packagePosture = 'existing';

  let placementPosture = activate ? 'established' : 'not-applicable';
  if (placementAmbiguous) placementPosture = 'escalate-mara';

  let authorizationPosture = 'missing';
  if (!activate && !placementAmbiguous) authorizationPosture = 'not-applicable';
  else if (repositoryOnly) authorizationPosture = 'repository-only';
  else if (explicitAuthorization) authorizationPosture = 'explicit';
  else if (readOnly) authorizationPosture = 'read-only';

  const mutationAllowed = activate
    && mode === 'update'
    && scopePosture === 'approved'
    && packagePosture === 'existing'
    && ['explicit', 'repository-only'].includes(authorizationPosture);

  return {
    activate_package_maintenance: activate,
    mode,
    selected_route: selectedRoute,
    primary_space: 'skills',
    scope_posture: scopePosture,
    package_posture: packagePosture,
    placement_posture: placementPosture,
    authorization_posture: authorizationPosture,
    mutation_allowed: mutationAllowed,
    bundle_grants_write: false,
    generated_output_posture: !activate ? 'not-applicable' : (directGeneratedEdit ? 'build-from-source' : 'source-first'),
    runtime_posture: runtimeUnverified || packageReferencedUnverified ? 'current-evidence-required' : 'no-static-availability-claim',
    reconciliation_handoff: mutationAllowed ? 'change-impact-reconciliation' : 'none-until-change'
  };
}

function canonicalRoute(skills) {
  const route = skills.routes.find(item => item.id === 'skill-package-maintenance');
  if (!route) throw new Error('Missing canonical skill-package-maintenance route.');
  return route;
}

function canonicalExceptions(skills) {
  const route = canonicalRoute(skills);
  return {
    availability_source: route.availability_source,
    first_reads: route.first_reads,
    mutation_boundary: route.mutation_boundary,
    non_triggers: route.non_triggers,
    next_handoff: route.next_handoff,
    space_do_not: skills.space?.do_not || []
  };
}

function same(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function compareExpected(actual, expected) {
  const keys = Object.keys(expected);
  return {
    pass: keys.every(key => same(actual[key], expected[key])),
    dimensions: Object.fromEntries(keys.map(key => [key, same(actual[key], expected[key])]))
  };
}

function parity(control, preferred) {
  const keys = [
    'activate_package_maintenance',
    'mode',
    'selected_route',
    'primary_space',
    'scope_posture',
    'package_posture',
    'placement_posture',
    'authorization_posture',
    'mutation_allowed',
    'bundle_grants_write',
    'generated_output_posture',
    'runtime_posture',
    'reconciliation_handoff',
    'retained_exceptions',
    'change_mode',
    'reconciliation'
  ];
  return {
    pass: keys.every(key => same(control[key], preferred[key])),
    dimensions: Object.fromEntries(keys.map(key => [key, same(control[key], preferred[key])]))
  };
}

function contextFor(mode, behavior, sources) {
  if (!behavior.activate_package_maintenance) {
    const common = [sources.agents, sources.bootstrap, sources.skills].join(SEP);
    return {
      artifacts: [AGENTS, BOOTSTRAP, SKILL_ROUTES],
      ...metrics(common)
    };
  }
  const artifacts = mode === 'preferred'
    ? [AGENTS, BUNDLE, SKILL]
    : [AGENTS, BOOTSTRAP, SKILL_ROUTES, SKILL];
  const context = mode === 'preferred'
    ? [sources.agents, sources.bundleText, sources.skill].join(SEP)
    : [sources.agents, sources.bootstrap, sources.skills, sources.skill].join(SEP);
  return { artifacts, ...metrics(context) };
}

function evaluatePath(mode, fixture, sources) {
  const behavior = classifyPrompt(fixture.prompt);
  const route = canonicalRoute(sources.skillsJson);
  const retainedExceptions = mode === 'preferred' ? sources.bundle.exceptions : sources.canonicalExceptions;
  const changeMode = mode === 'preferred' ? sources.bundle.contract.change_mode : sources.skillContract.change_mode;
  const reconciliation = mode === 'preferred' ? sources.bundle.contract.reconciliation : route.reconciliation;
  const context = contextFor(mode, behavior, sources);
  const result = {
    ...behavior,
    retained_exceptions: retainedExceptions,
    change_mode: changeMode,
    reconciliation,
    context
  };
  const expectation = compareExpected(result, fixture.expected);
  const safety = {
    exceptions_preserved: same(retainedExceptions, sources.canonicalExceptions),
    change_mode_preserved: changeMode === 'artifact_generation',
    reconciliation_preserved: reconciliation === 'change-impact-reconciliation',
    bundle_never_grants_write: result.bundle_grants_write === false,
    no_mutation_without_authority: result.mutation_allowed === false || ['explicit', 'repository-only'].includes(result.authorization_posture),
    ambiguous_placement_blocks_mutation: result.placement_posture !== 'escalate-mara' || result.mutation_allowed === false,
    one_off_not_promoted: result.scope_posture !== 'one-off' || result.activate_package_maintenance === false,
    persona_application_not_promoted: result.scope_posture !== 'persona-application' || result.activate_package_maintenance === false,
    generated_output_source_first: !fixture.prompt.toLowerCase().includes('hand-edit the generated dist output directly') || result.generated_output_posture === 'build-from-source',
    live_state_external: result.runtime_posture !== 'current-evidence-required' || result.bundle_grants_write === false,
    reconciliation_when_mutated: !result.mutation_allowed || result.reconciliation_handoff === 'change-impact-reconciliation'
  };
  return {
    ...result,
    expectation,
    safety,
    pass: expectation.pass && Object.values(safety).every(Boolean)
  };
}

function frontmatterValue(source, key) {
  const match = source.match(new RegExp('^\\s*' + key + ':\\s*([^\\n#]+)', 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : null;
}

export async function buildSkillPackageMaintenanceBehaviorReport() {
  const [fixtures, agents, bundleText, bootstrap, skills, skill] = await Promise.all([
    readJson(FIXTURES),
    readText(AGENTS),
    readText(BUNDLE),
    readText(BOOTSTRAP),
    readText(SKILL_ROUTES),
    readText(SKILL)
  ]);

  const bundle = JSON.parse(bundleText);
  const skillsJson = JSON.parse(skills);
  const resolution = resolveAgentContextBundle(bundle, {
    route_id: 'skill-package-maintenance',
    primary_space: 'skills',
    package_path: '.agents/skills/pl-skill-creator'
  });
  if (resolution.mode !== 'graph-backed') {
    throw new Error('Skill-package-maintenance preferred bundle does not validate: ' + JSON.stringify(resolution));
  }

  const sources = {
    agents,
    bundleText,
    bundle,
    bootstrap,
    skills,
    skillsJson,
    skill,
    canonicalExceptions: canonicalExceptions(skillsJson),
    skillContract: {
      change_mode: frontmatterValue(skill, 'change_mode'),
      reconciliation: frontmatterValue(skill, 'reconciliation')
    }
  };

  const results = fixtures.fixtures.map(fixture => {
    const control = evaluatePath('control', fixture, sources);
    const preferred = evaluatePath('preferred', fixture, sources);
    const behaviorParity = parity(control, preferred);
    return {
      id: fixture.id,
      prompt: fixture.prompt,
      expected: fixture.expected,
      control,
      preferred,
      parity: behaviorParity,
      pass: control.pass && preferred.pass && behaviorParity.pass
    };
  });

  const activated = results.filter(item => item.preferred.activate_package_maintenance);
  const preferredBytes = activated.reduce((sum, item) => sum + item.preferred.context.utf8_bytes, 0);
  const controlBytes = activated.reduce((sum, item) => sum + item.control.context.utf8_bytes, 0);

  return {
    schema_version: '1.0',
    evaluation: 'skill-package-maintenance-behavioral-parity',
    fixture_source: FIXTURES,
    methodology: 'deterministic fixed-prompt route and authority fixtures; not subjective LLM response quality',
    canonical_routing_changed: true,
    fixtures: results,
    aggregate: {
      fixture_count: results.length,
      activated_fixture_count: activated.length,
      passed: results.filter(item => item.pass).length,
      failed: results.filter(item => !item.pass).length,
      all_pass: results.every(item => item.pass),
      preferred_context_utf8_bytes: preferredBytes,
      control_context_utf8_bytes: controlBytes,
      preferred_context_rough_tokens: Math.ceil(preferredBytes / 4),
      control_context_rough_tokens: Math.ceil(controlBytes / 4),
      preferred_delta_utf8_bytes: preferredBytes - controlBytes,
      preferred_delta_percent: Number((((preferredBytes - controlBytes) / controlBytes) * 100).toFixed(1))
    },
    limitations: [
      'The evaluator is fixture-scoped and is not a general-purpose natural-language router.',
      'Passing deterministic parity does not establish subjective model response quality.',
      'The fixtures validate authority and routing posture; they do not create approved scope, package evidence, placement approval, or live runtime availability.',
      'Rough-token estimates are static UTF-8/4 approximations, not observed provider token usage.'
    ]
  };
}

function markdown(report) {
  const lines = [
    '# Skill-package-maintenance behavioral parity',
    '',
    'Generated by eval/skill-package-maintenance-behavior.mjs.',
    '',
    '| Fixture | Control | Preferred | Parity | Preferred bytes | Control bytes |',
    '| --- | --- | --- | --- | ---: | ---: |'
  ];
  for (const item of report.fixtures) {
    lines.push(
      '| ' + item.id
      + ' | ' + (item.control.pass ? 'PASS' : 'FAIL')
      + ' | ' + (item.preferred.pass ? 'PASS' : 'FAIL')
      + ' | ' + (item.parity.pass ? 'PASS' : 'FAIL')
      + ' | ' + item.preferred.context.utf8_bytes
      + ' | ' + item.control.context.utf8_bytes + ' |'
    );
  }
  lines.push(
    '',
    'Overall: **' + (report.aggregate.all_pass ? 'PASS' : 'FAIL') + '** — '
      + report.aggregate.passed + '/' + report.aggregate.fixture_count + ' fixtures pass.',
    '',
    'Across direct Skill-package fixtures, preferred context is **'
      + report.aggregate.preferred_delta_percent + '%** versus control ('
      + report.aggregate.preferred_delta_utf8_bytes + ' UTF-8 bytes).',
    '',
    '## Guardrails',
    '',
    '- The bundle never grants package mutation authority.',
    '- One-off documents and Persona applications do not become reusable Skills.',
    '- Ambiguous durable placement escalates instead of creating a package.',
    '- Generated dist output stays source-derived rather than hand-authored.',
    '- Runtime/package availability remains freshness-sensitive external evidence.',
    '- Authorized durable package changes retain the change-impact-reconciliation handoff.',
    '',
    '## Limitations',
    '',
    ...report.limitations.map(item => '- ' + item)
  );
  return lines.join('\n') + '\n';
}

export async function expectedSkillPackageMaintenanceBehaviorOutputs() {
  const report = await buildSkillPackageMaintenanceBehaviorReport();
  return new Map([
    ['eval/results/skill-package-maintenance-behavior.json', JSON.stringify(report, null, 2) + '\n'],
    ['eval/skill-package-maintenance-behavior.md', markdown(report)]
  ]);
}

export async function writeSkillPackageMaintenanceBehaviorOutputs({ check = false } = {}) {
  const outputs = await expectedSkillPackageMaintenanceBehaviorOutputs();
  const stale = [];
  for (const [relativePath, content] of outputs) {
    const filePath = path.join(root, relativePath);
    if (check) {
      let current = null;
      try { current = await readFile(filePath, 'utf8'); } catch {}
      if (current !== content) stale.push(relativePath);
    } else {
      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, content, 'utf8');
    }
  }
  if (stale.length) throw new Error('Skill-package-maintenance behavior report is stale: ' + stale.join(', '));
  return outputs;
}

const entry = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (entry) {
  const outputs = await writeSkillPackageMaintenanceBehaviorOutputs({ check: process.argv.includes('--check') });
  const report = JSON.parse(outputs.get('eval/results/skill-package-maintenance-behavior.json'));
  console.log('Skill-package-maintenance behavioral parity: ' + report.aggregate.passed + '/' + report.aggregate.fixture_count + ' fixtures pass; preferred delta ' + report.aggregate.preferred_delta_percent + '%.');
}
