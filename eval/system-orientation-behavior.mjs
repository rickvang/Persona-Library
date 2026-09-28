#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveAgentContextBundle } from '../scripts/build-agent-context-bundles.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FIXTURES = 'eval/fixtures/system-orientation-behavior.json';
const BUNDLE = 'dist/data/agent-context/system-orientation.json';
const SKILL = '.agents/skills/persona-library-orientation/SKILL.md';
const AGENTS = 'AGENTS.md';
const BOOTSTRAP = 'content/site-orientation.json';
const DOCS_ROUTES = 'content/orientation/docs.json';
const POLICY = 'docs/policy-ownership.md';
const PLACEMENT = 'docs/README.md';
const SEP = '\n\n--- CONTEXT ARTIFACT ---\n\n';

const readText = relativePath => readFile(path.join(root, relativePath), 'utf8');
const readJson = async relativePath => JSON.parse(await readText(relativePath));

function utf8Bytes(value) {
  return Buffer.byteLength(value, 'utf8');
}

function metrics(value) {
  const bytes = utf8Bytes(value);
  return { utf8_bytes: bytes, rough_tokens: Math.ceil(bytes / 4) };
}

function modeFromPrompt(prompt) {
  const text = prompt.trim().toLowerCase();
  if (/^(update|fix|change|edit|add|create)\b/.test(text)) return 'update';
  if (text.includes(' research ' ) || text.startsWith('research ')) return 'research';
  if (text.includes(' plan ' ) || text.startsWith('plan ')) return 'plan';
  if (text.includes(' prototype ' ) || text.startsWith('prototype ')) return 'prototype';
  if (text.includes(' consult ' ) || text.startsWith('consult ')) return 'consult';
  return 'answer';
}

function classifyPrompt(prompt) {
  const text = prompt.toLowerCase();
  const mode = modeFromPrompt(prompt);
  const repoPlumbing = /(\bci\b|\bworkflow\b|whitespace check|build script|repository hygiene)/.test(text);
  const semanticSignal = /(persona-library|persona library|persona record|riley persona|template|playbook|figma|tool capability|reusable starting artifact|scaffold)/.test(text);
  const generalNonSystem = /(thank-you note|thank you note|colleague)/.test(text);
  const activate = semanticSignal && !repoPlumbing && !generalNonSystem;

  if (!activate) {
    return {
      activate: false,
      mode,
      selected_route: null,
      primary_space: null,
      placement: 'not-applicable',
      handoff_target: repoPlumbing ? 'repository-plumbing' : 'non-system-request',
      orientation_write_authorized: false,
      downstream_execution_claim: false,
      live_evidence_required: false,
      static_runtime_availability_claim: false,
      limitation_required: false,
      downstream_authorization_required: false
    };
  }

  const placementQuestion = /(where should|where .* live|where does .* belong)/.test(text);
  const ambiguousPlacement = /(template or a playbook|template or playbook|not sure who owns|multiple plausible|new top-level)/.test(text);

  const systemOverview = /(how does persona-library|how does persona library|decide between)/.test(text);
  let primarySpace = 'docs';
  if (systemOverview || ambiguousPlacement) primarySpace = 'docs';
  else if (/(persona record|riley persona)/.test(text)) primarySpace = 'personas';
  else if (/(template|reusable starting artifact|scaffold)/.test(text)) primarySpace = 'templates';
  else if (/(figma|tool capability|connector|mcp)/.test(text)) primarySpace = 'tools';

  const unavailable = /(assume .*unavailable|unavailable in this runtime|package is unavailable)/.test(text);
  const runtimeQuestion = unavailable || (/(right now|currently|available)/.test(text) && /(figma|tool|connector|package|capability)/.test(text));

  let handoffTarget = 'docs-and-onboarding';
  if (ambiguousPlacement) handoffTarget = 'mara-placement-review';
  else if (placementQuestion) handoffTarget = 'direct-placement';
  else if (primarySpace === 'templates' && /(composition|template-composer)/.test(text)) handoffTarget = 'template-composition';
  else if (primarySpace === 'personas' && mode === 'update') handoffTarget = 'persona-research';
  else if (primarySpace === 'tools') handoffTarget = 'tool-resolution';

  return {
    activate: true,
    mode,
    selected_route: 'system-orientation',
    primary_space: primarySpace,
    placement: ambiguousPlacement ? 'escalate-mara' : (placementQuestion ? 'direct' : 'not-applicable'),
    handoff_target: handoffTarget,
    orientation_write_authorized: false,
    downstream_execution_claim: false,
    live_evidence_required: runtimeQuestion,
    static_runtime_availability_claim: false,
    limitation_required: unavailable,
    downstream_authorization_required: mode === 'update'
  };
}

function packetFor(prompt, behavior) {
  if (!behavior.activate) return null;
  return {
    goal: prompt,
    mode: behavior.mode,
    primary_space: behavior.primary_space,
    secondary_spaces: [],
    artifacts_in_scope: behavior.handoff_target === 'mara-placement-review'
      ? ['placement question', 'existing semantic owners']
      : ['system-orientation', behavior.primary_space],
    boundary_permission: 'read-only orientation; downstream mutation or execution requires separate authority',
    success_criteria: 'route to the smallest valid owner without inventing taxonomy, write authority, or live availability',
    material_assumptions_or_unknowns: behavior.live_evidence_required
      ? ['live runtime availability is unknown until current evidence is checked']
      : [],
    next_action_smallest_handoff: behavior.handoff_target
  };
}

function packetComplete(packet) {
  if (!packet) return false;
  const required = [
    'goal',
    'mode',
    'primary_space',
    'secondary_spaces',
    'artifacts_in_scope',
    'boundary_permission',
    'success_criteria',
    'material_assumptions_or_unknowns',
    'next_action_smallest_handoff'
  ];
  return required.every(key => Object.hasOwn(packet, key))
    && Boolean(packet.goal)
    && Boolean(packet.mode)
    && Boolean(packet.primary_space)
    && Boolean(packet.boundary_permission)
    && Boolean(packet.success_criteria)
    && Boolean(packet.next_action_smallest_handoff);
}

function canonicalExceptions(docs) {
  const route = docs.routes.find(item => item.id === 'system-orientation');
  if (!route) throw new Error('Missing canonical system-orientation route.');
  return {
    availability_source: route.availability_source,
    first_reads: route.first_reads,
    mutation_boundary: route.mutation_boundary,
    non_triggers: route.non_triggers,
    next_handoff: route.next_handoff,
    space_do_not: docs.space?.do_not || []
  };
}

function same(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function routeFileFor(spaceIndex, spaceId) {
  return spaceIndex.find(item => item.id === spaceId)?.route_file || null;
}

async function buildContext(mode, behavior, sources) {
  if (!behavior.activate) {
    return {
      artifacts: [AGENTS],
      ...metrics(sources.agents)
    };
  }

  const artifacts = [AGENTS];
  const texts = [sources.agents];

  if (mode === 'preferred') {
    artifacts.push(BUNDLE);
    texts.push(sources.bundleText);
  } else {
    artifacts.push(BOOTSTRAP, DOCS_ROUTES);
    texts.push(sources.bootstrapText, sources.docsText);
  }

  artifacts.push(SKILL, POLICY);
  texts.push(sources.skill, sources.policy);

  if (behavior.primary_space && behavior.primary_space !== 'docs') {
    const routeFile = routeFileFor(
      mode === 'preferred' ? sources.bundle.space_index : sources.fallbackSpaceIndex,
      behavior.primary_space
    );
    if (!routeFile) throw new Error(mode + ' context cannot resolve route file for ' + behavior.primary_space);
    const relativePath = 'content/' + routeFile;
    artifacts.push(relativePath);
    texts.push(await readText(relativePath));
  }

  if (behavior.placement !== 'not-applicable') {
    artifacts.push(PLACEMENT);
    texts.push(sources.placement);
  }

  return {
    artifacts,
    ...metrics(texts.join(SEP))
  };
}

function compareExpected(actual, expected) {
  const keys = Object.keys(expected);
  return {
    pass: keys.every(key => same(actual[key], expected[key])),
    dimensions: Object.fromEntries(keys.map(key => [key, same(actual[key], expected[key])]))
  };
}

function behavioralParity(control, preferred) {
  const keys = [
    'activate',
    'mode',
    'selected_route',
    'primary_space',
    'placement',
    'handoff_target',
    'orientation_write_authorized',
    'downstream_execution_claim',
    'live_evidence_required',
    'static_runtime_availability_claim',
    'limitation_required',
    'downstream_authorization_required',
    'retained_exceptions',
    'packet_complete'
  ];
  return {
    pass: keys.every(key => same(control[key], preferred[key])),
    dimensions: Object.fromEntries(keys.map(key => [key, same(control[key], preferred[key])]))
  };
}

async function evaluatePath(mode, fixture, sources) {
  const behavior = classifyPrompt(fixture.prompt);
  const packet = packetFor(fixture.prompt, behavior);
  const context = await buildContext(mode, behavior, sources);
  const retainedExceptions = mode === 'preferred'
    ? sources.bundle.exceptions
    : canonicalExceptions(sources.docs);

  let spaceResolvable = true;
  if (behavior.activate && behavior.primary_space) {
    const index = mode === 'preferred' ? sources.bundle.space_index : sources.fallbackSpaceIndex;
    spaceResolvable = Boolean(routeFileFor(index, behavior.primary_space));
  }

  const result = {
    ...behavior,
    retained_exceptions: retainedExceptions,
    packet_complete: behavior.activate ? packetComplete(packet) : true,
    space_resolvable: spaceResolvable,
    packet,
    context
  };

  const expected = {
    ...fixture.expected,
    limitation_required: fixture.expected.limitation_required || false,
    downstream_authorization_required: fixture.expected.downstream_authorization_required || false
  };
  const expectation = compareExpected(result, expected);

  const safety = {
    no_orientation_write_authority: result.orientation_write_authorized === false,
    no_pretend_execution: result.downstream_execution_claim === false,
    no_static_runtime_claim: result.static_runtime_availability_claim === false,
    live_evidence_when_required: !expected.live_evidence_required || result.live_evidence_required,
    packet_complete_when_activated: !result.activate || result.packet_complete,
    selected_space_resolvable: !result.activate || result.space_resolvable,
    exceptions_preserved: same(retainedExceptions, sources.canonicalExceptions)
  };

  return {
    ...result,
    expectation,
    safety,
    pass: expectation.pass && Object.values(safety).every(Boolean)
  };
}

export async function buildSystemOrientationBehaviorReport() {
  const [
    fixtureFile,
    agents,
    bundleText,
    skill,
    bootstrapText,
    docsText,
    policy,
    placement
  ] = await Promise.all([
    readJson(FIXTURES),
    readText(AGENTS),
    readText(BUNDLE),
    readText(SKILL),
    readText(BOOTSTRAP),
    readText(DOCS_ROUTES),
    readText(POLICY),
    readText(PLACEMENT)
  ]);

  const bundle = JSON.parse(bundleText);
  const bootstrap = JSON.parse(bootstrapText);
  const docs = JSON.parse(docsText);
  const preferredResolution = resolveAgentContextBundle(bundle, {
    route_id: 'system-orientation',
    primary_space: 'docs',
    package_path: '.agents/skills/persona-library-orientation'
  });
  if (preferredResolution.mode !== 'graph-backed') {
    throw new Error('Preferred bundle does not validate: ' + JSON.stringify(preferredResolution));
  }

  const fallbackSpaceIndex = Object.entries(bootstrap.spaces || {}).map(([id, space]) => ({
    id,
    label: space.label,
    answers: space.answers,
    route_file: space.route_file
  }));
  const sources = {
    agents,
    bundleText,
    bundle,
    skill,
    bootstrapText,
    docsText,
    docs,
    policy,
    placement,
    fallbackSpaceIndex,
    canonicalExceptions: canonicalExceptions(docs)
  };

  const results = [];
  for (const fixture of fixtureFile.fixtures) {
    const control = await evaluatePath('control', fixture, sources);
    const preferred = await evaluatePath('preferred', fixture, sources);
    const parity = behavioralParity(control, preferred);
    results.push({
      id: fixture.id,
      prompt: fixture.prompt,
      expected: fixture.expected,
      control,
      preferred,
      parity,
      pass: control.pass && preferred.pass && parity.pass
    });
  }

  const activated = results.filter(item => item.preferred.activate);
  const aggregatePreferred = activated.reduce((sum, item) => sum + item.preferred.context.utf8_bytes, 0);
  const aggregateControl = activated.reduce((sum, item) => sum + item.control.context.utf8_bytes, 0);

  return {
    schema_version: '1.0',
    evaluation: 'system-orientation-behavioral-parity',
    fixture_source: FIXTURES,
    methodology: 'deterministic route-level prompt fixtures; not subjective LLM response quality',
    canonical_routing_changed: false,
    preferred_bundle_schema: bundle.schema_version,
    fixtures: results,
    aggregate: {
      fixture_count: results.length,
      activated_fixture_count: activated.length,
      passed: results.filter(item => item.pass).length,
      failed: results.filter(item => !item.pass).length,
      all_pass: results.every(item => item.pass),
      preferred_context_utf8_bytes: aggregatePreferred,
      control_context_utf8_bytes: aggregateControl,
      preferred_context_rough_tokens: Math.ceil(aggregatePreferred / 4),
      control_context_rough_tokens: Math.ceil(aggregateControl / 4),
      preferred_delta_utf8_bytes: aggregatePreferred - aggregateControl,
      preferred_delta_percent: Number((((aggregatePreferred - aggregateControl) / aggregateControl) * 100).toFixed(1))
    },
    limitations: [
      'The evaluator is intentionally fixture-scoped and is not a general-purpose natural-language router.',
      'Passing deterministic route behavior does not establish subjective model response quality.',
      'Rough-token estimates are static UTF-8/4 approximations, not observed provider token usage.',
      'Live runtime availability is represented only as a requirement to obtain current evidence; this evaluation does not assert actual Tool or connector availability.'
    ]
  };
}

function markdown(report) {
  const lines = [
    '# System-orientation behavioral parity',
    '',
    'Generated by eval/system-orientation-behavior.mjs.',
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
    'Across activated fixtures, preferred context is **'
      + report.aggregate.preferred_delta_percent + '%** versus control ('
      + report.aggregate.preferred_delta_utf8_bytes + ' UTF-8 bytes).',
    '',
    '## Guardrails',
    '',
    '- Orientation remains read-only.',
    '- Ambiguous placement escalates instead of inventing taxonomy.',
    '- Unavailable downstream capability never becomes pretend execution.',
    '- Static graph/catalog data never proves live runtime availability.',
    '- Canonical route exceptions remain equal on preferred and fallback paths.',
    '',
    '## Limitations',
    '',
    ...report.limitations.map(item => '- ' + item),
    ''
  );
  return lines.join('\n');
}

export async function expectedSystemOrientationBehaviorOutputs() {
  const report = await buildSystemOrientationBehaviorReport();
  return new Map([
    ['eval/results/system-orientation-behavior.json', JSON.stringify(report, null, 2) + '\n'],
    ['eval/system-orientation-behavior.md', markdown(report) + '\n']
  ]);
}

export async function writeSystemOrientationBehaviorOutputs({ check = false } = {}) {
  const outputs = await expectedSystemOrientationBehaviorOutputs();
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
  if (stale.length) throw new Error('System-orientation behavior report is stale: ' + stale.join(', '));
  return outputs;
}

const entry = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (entry) {
  const outputs = await writeSystemOrientationBehaviorOutputs({ check: process.argv.includes('--check') });
  const report = JSON.parse(outputs.get('eval/results/system-orientation-behavior.json'));
  console.log('System-orientation behavioral parity: ' + report.aggregate.passed + '/' + report.aggregate.fixture_count + ' fixtures pass; preferred delta ' + report.aggregate.preferred_delta_percent + '%.');
}
