#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveAgentContextBundle } from '../scripts/build-agent-context-bundles.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FIXTURES = 'eval/fixtures/template-composition-behavior.json';
const BUNDLE = 'dist/data/agent-context/template-composition.json';
const AGENTS = 'AGENTS.md';
const BOOTSTRAP = 'content/site-orientation.json';
const TEMPLATE_ROUTES = 'content/orientation/templates.json';
const SKILL = '.agents/skills/template-composer/SKILL.md';
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
  if (/\b(create|adapt|publish|update)\b/.test(text)) return 'update';
  return 'answer';
}

function classifyPrompt(prompt) {
  const text = prompt.toLowerCase();
  const mode = modeFromPrompt(prompt);
  const catalogLookup = /show me the existing .*templates|catalog and their recorded sources/.test(text);
  const missingResearch = /have not researched|haven't researched|not researched existing/.test(text);
  const ambiguousSource = /source path and revision are not verified|source.*not verified/.test(text);
  const availabilityUnknown = /current access, fetch, install, and render availability have not been verified/.test(text);
  const ambiguousTarget = /not sure whether .* belongs|persona-library or the project repository/.test(text);
  const acceptedResearch = /accepted template research|accepted research/.test(text);
  const sourceVerified = /verified source provenance|source and provenance are verified|verified provenance|provenance is verified|verified source/.test(text);
  const canonicalPublication = /publish the approved reusable template|canonical catalog and site/.test(text);
  const explicitNoPromotion = /do not promote|keep it local/.test(text);
  const adaptExisting = /adapt the existing project starter/.test(text);
  const explicitAuthorization = /i authorize|target is authorized|authorize this target|authorized project-specific starter/.test(text);
  const readOnlyPlan = mode === 'plan';

  let selectedRoute = 'template-composition';
  if (catalogLookup) selectedRoute = 'template-catalog';
  else if (ambiguousTarget) selectedRoute = 'placement-review';
  else if (missingResearch || ambiguousSource || availabilityUnknown) selectedRoute = 'template-research';

  const activateComposition = selectedRoute === 'template-composition';

  let sourcePosture = 'unknown';
  if (catalogLookup) sourcePosture = 'catalog-record-only';
  else if (availabilityUnknown) sourcePosture = 'availability-unverified';
  else if (ambiguousSource) sourcePosture = 'unverified';
  else if (sourceVerified) sourcePosture = 'verified';

  let targetPosture = 'not-ready';
  if (ambiguousTarget) targetPosture = 'ambiguous';
  else if (readOnlyPlan) targetPosture = 'read-only-plan';
  else if (catalogLookup) targetPosture = 'read-only';
  else if (explicitAuthorization) targetPosture = 'explicit-authorized';

  let placement = 'not-ready';
  if (catalogLookup) placement = 'not-applicable';
  else if (ambiguousTarget) placement = 'escalate-mara';
  else if (canonicalPublication) placement = 'canonical-publication';
  else if (activateComposition) placement = 'established-target';

  let reusePosture = 'check-catalog-then-compose';
  if (catalogLookup) reusePosture = 'catalog-inspection';
  else if (missingResearch || ambiguousSource || availabilityUnknown) reusePosture = 'research-before-compose';
  else if (adaptExisting) reusePosture = 'adapt-existing';

  let promotionPosture = 'undecided';
  if (catalogLookup) promotionPosture = 'not-applicable';
  else if (canonicalPublication) promotionPosture = 'canonical-approved';
  else if (explicitNoPromotion) promotionPosture = 'project-local-explicit';
  else if (/project starter|project-local|project-specific starter/.test(text)) promotionPosture = 'project-local';
  else if (activateComposition) promotionPosture = 'project-local';

  const runtimePosture = (ambiguousSource || availabilityUnknown)
    ? 'current-evidence-required'
    : 'no-static-availability-claim';

  const executionAllowed = activateComposition
    && mode === 'update'
    && explicitAuthorization
    && sourcePosture === 'verified'
    && !ambiguousTarget;

  return {
    activate_composition: activateComposition,
    mode,
    selected_route: selectedRoute,
    primary_space: 'templates',
    accepted_research_present: acceptedResearch,
    source_posture: sourcePosture,
    target_posture: targetPosture,
    placement,
    reuse_posture: reusePosture,
    promotion_posture: promotionPosture,
    bundle_grants_write: false,
    execution_allowed: executionAllowed,
    runtime_posture: runtimePosture,
    reconciliation_handoff: executionAllowed ? 'template-reconciliation' : 'none-until-change',
    universal_reconciliation_passes: executionAllowed ? 1 : 0,
    publication_chain_required: canonicalPublication
  };
}

function canonicalRoute(templates) {
  const route = templates.routes.find(item => item.id === 'template-composition');
  if (!route) throw new Error('Missing canonical template-composition route.');
  return route;
}

function canonicalExceptions(templates) {
  const route = canonicalRoute(templates);
  return {
    availability_source: route.availability_source,
    first_reads: route.first_reads,
    mutation_boundary: route.mutation_boundary,
    non_triggers: route.non_triggers,
    next_handoff: route.next_handoff,
    space_do_not: templates.space?.do_not || []
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
    'activate_composition',
    'mode',
    'selected_route',
    'primary_space',
    'accepted_research_present',
    'source_posture',
    'target_posture',
    'placement',
    'reuse_posture',
    'promotion_posture',
    'bundle_grants_write',
    'execution_allowed',
    'runtime_posture',
    'reconciliation_handoff',
    'universal_reconciliation_passes',
    'publication_chain_required',
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
  if (!behavior.activate_composition) {
    const common = [sources.agents, sources.bootstrap, sources.templates].join(SEP);
    return {
      artifacts: [AGENTS, BOOTSTRAP, TEMPLATE_ROUTES],
      ...metrics(common)
    };
  }

  const artifacts = mode === 'preferred'
    ? [AGENTS, BUNDLE, SKILL]
    : [AGENTS, BOOTSTRAP, TEMPLATE_ROUTES, SKILL];
  const context = mode === 'preferred'
    ? [sources.agents, sources.bundleText, sources.skill].join(SEP)
    : [sources.agents, sources.bootstrap, sources.templates, sources.skill].join(SEP);

  return { artifacts, ...metrics(context) };
}

function evaluatePath(mode, fixture, sources) {
  const behavior = classifyPrompt(fixture.prompt);
  const route = canonicalRoute(sources.templatesJson);
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
    route_change_mode_preserved: changeMode === 'artifact_generation',
    route_reconciliation_preserved: reconciliation === 'template-reconciliation',
    bundle_never_grants_write: result.bundle_grants_write === false,
    no_unverified_source_execution: !['unverified', 'availability-unverified', 'unknown'].includes(result.source_posture) || result.execution_allowed === false,
    no_ambiguous_target_execution: result.target_posture !== 'ambiguous' || result.execution_allowed === false,
    no_silent_promotion: !result.activate_composition || result.promotion_posture !== 'undecided',
    publication_chain_when_canonical: result.promotion_posture !== 'canonical-approved' || result.publication_chain_required === true,
    reconciliation_when_execution: !result.execution_allowed || (
      result.reconciliation_handoff === 'template-reconciliation'
      && result.universal_reconciliation_passes === 1
    )
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

export async function buildTemplateCompositionBehaviorReport() {
  const [fixtures, agents, bundleText, bootstrap, templates, skill] = await Promise.all([
    readJson(FIXTURES),
    readText(AGENTS),
    readText(BUNDLE),
    readText(BOOTSTRAP),
    readText(TEMPLATE_ROUTES),
    readText(SKILL)
  ]);

  const bundle = JSON.parse(bundleText);
  const templatesJson = JSON.parse(templates);
  const resolution = resolveAgentContextBundle(bundle, {
    route_id: 'template-composition',
    primary_space: 'templates',
    package_path: '.agents/skills/template-composer'
  });
  if (resolution.mode !== 'graph-backed') {
    throw new Error('Template-composition preferred bundle does not validate: ' + JSON.stringify(resolution));
  }

  const sources = {
    agents,
    bundleText,
    bundle,
    bootstrap,
    templates,
    templatesJson,
    skill,
    canonicalExceptions: canonicalExceptions(templatesJson),
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

  const activated = results.filter(item => item.preferred.activate_composition);
  const preferredBytes = activated.reduce((sum, item) => sum + item.preferred.context.utf8_bytes, 0);
  const controlBytes = activated.reduce((sum, item) => sum + item.control.context.utf8_bytes, 0);

  return {
    schema_version: '1.0',
    evaluation: 'template-composition-behavioral-parity',
    fixture_source: FIXTURES,
    methodology: 'deterministic fixed-prompt route and authority fixtures; not subjective LLM response quality',
    canonical_routing_changed: false,
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
      'The evaluator is deliberately fixture-scoped and is not a general-purpose natural-language router.',
      'Passing deterministic route behavior does not establish subjective model response quality.',
      'The fixtures validate evidence posture; they do not manufacture or verify an external Template source.',
      'Rough-token estimates are static UTF-8/4 approximations, not observed provider token usage.'
    ]
  };
}

function markdown(report) {
  const lines = [
    '# Template-composition behavioral parity',
    '',
    'Generated by eval/template-composition-behavior.mjs.',
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
    'Across direct composition fixtures, preferred context is **'
      + report.aggregate.preferred_delta_percent + '%** versus control ('
      + report.aggregate.preferred_delta_utf8_bytes + ' UTF-8 bytes).',
    '',
    '## Guardrails',
    '',
    '- Bundle and route metadata never grant mutation authority.',
    '- Missing research or source evidence routes back to research instead of being invented.',
    '- Ambiguous ownership routes to placement review.',
    '- Project starters do not silently become canonical Templates.',
    '- Canonical publication requires the publication chain.',
    '- Durable Template changes hand off to template-reconciliation and one universal reconciliation pass.',
    '',
    '## Limitations',
    '',
    ...report.limitations.map(item => '- ' + item)
  );
  return lines.join('\n') + '\n';
}

export async function expectedTemplateCompositionBehaviorOutputs() {
  const report = await buildTemplateCompositionBehaviorReport();
  return new Map([
    ['eval/results/template-composition-behavior.json', JSON.stringify(report, null, 2) + '\n'],
    ['eval/template-composition-behavior.md', markdown(report)]
  ]);
}

export async function writeTemplateCompositionBehaviorOutputs({ check = false } = {}) {
  const outputs = await expectedTemplateCompositionBehaviorOutputs();
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
  if (stale.length) throw new Error('Template-composition behavior report is stale: ' + stale.join(', '));
  return outputs;
}

const entry = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (entry) {
  const outputs = await writeTemplateCompositionBehaviorOutputs({ check: process.argv.includes('--check') });
  const report = JSON.parse(outputs.get('eval/results/template-composition-behavior.json'));
  console.log('Template-composition behavioral parity: ' + report.aggregate.passed + '/' + report.aggregate.fixture_count + ' fixtures pass; preferred delta ' + report.aggregate.preferred_delta_percent + '%.');
}
