#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GRAPH = 'dist/data/system-map/agent-runtime.agent.json';
const VALIDATION = '.github/workflows/repository-validation.yml';
const ESTIMATOR = 'utf8-byte-count-divided-by-four';

export const FIXTURES = [
  { id:'docs-system-orientation', space:'docs', route:'system-orientation', routeFile:'content/orientation/docs.json', skill:'.agents/skills/persona-library-orientation', rationale:'Read-oriented route with policy-owner selection and a read-only boundary.' },
  { id:'tools-tool-resolution', space:'tools', route:'tool-resolution', routeFile:'content/orientation/tools.json', skill:'.agents/skills/tool-discovery-and-safe-execution', rationale:'External-execution route that must preserve availability, permission, and live-runtime boundaries.' },
  { id:'templates-template-composition', space:'templates', route:'template-composition', routeFile:'content/orientation/templates.json', skill:'.agents/skills/template-composer', rationale:'Artifact-generation route with source/provenance checks and Template-specific reconciliation.' }
];

const readText = file => readFile(path.join(root, file), 'utf8');
const readJson = async file => JSON.parse(await readText(file));
const fm = (source, key) => {
  const m = source.match(new RegExp('^\\s*' + key + ':\\s*([^\\n#]+)', 'm'));
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : null;
};
const metrics = value => {
  const bytes = Buffer.byteLength(value, 'utf8');
  return { utf8_bytes:bytes, rough_tokens:Math.ceil(bytes / 4) };
};
const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);

function minimumDispatcher(agents) {
  const needles = [
    'default mode as read-only',
    'Metadata and routing never grant write authority.',
    'GitHub, CI, review, deployment, permissions, and runtime state remain freshness-sensitive live authority'
  ];
  const lines = needles.map(needle => agents.split('\n').find(line => line.includes(needle)));
  if (lines.some(line => !line)) throw new Error('Could not derive minimum dispatcher boundary.');
  return lines.join('\n');
}

function routeFrom(group, id) {
  const route = group.routes.find(item => item.id === id);
  if (!route) throw new Error('Missing route ' + id);
  return route;
}

function fragment(graph, fixture) {
  const outgoing = new Map(graph.nodes.map(node => [node.id, []]));
  for (const edge of graph.edges) outgoing.get(edge.from)?.push(edge);
  const routeId = 'route:' + fixture.route;
  const packageId = 'skill-package:' + fixture.skill;
  const ids = new Set([
    'view:agent-runtime',
    'agent:repository-dispatcher',
    'routing:orientation-bootstrap',
    'space:' + fixture.space,
    'route-group:' + fixture.space,
    routeId,
    packageId,
    'validation:repository-validation',
    'boundary:live-runtime-state'
  ]);
  for (const edge of outgoing.get(packageId) || []) {
    if (edge.relationship.startsWith('declares-')) ids.add(edge.to);
  }
  for (const id of ids) {
    if (!graph.nodes.some(node => node.id === id)) throw new Error('Graph is missing ' + id);
  }
  const nodes = graph.nodes.filter(node => ids.has(node.id));
  const edges = graph.edges.filter(edge => ids.has(edge.from) && ids.has(edge.to));
  const provenance = {};
  for (const node of nodes) provenance[node.id] = graph.provenance[node.id];
  for (const edge of edges) provenance[edge.id] = graph.provenance[edge.id];
  return { version:graph.version, view:graph.view, scope:graph.scope, coverage:graph.coverage, nodes, edges, provenance };
}

function exceptions(group, route) {
  return {
    availability_source:route.availability_source,
    first_reads:route.first_reads,
    mutation_boundary:route.mutation_boundary,
    non_triggers:route.non_triggers,
    next_handoff:route.next_handoff,
    space_do_not:group.space?.do_not || []
  };
}

function contractValue(part, packageId, relationship) {
  const edge = part.edges.find(item => item.from === packageId && item.relationship === relationship);
  if (!edge) return null;
  const prefix = 'contract:' + relationship.replace(/^declares-/, '') + ':';
  return edge.to.startsWith(prefix) ? edge.to.slice(prefix.length) : null;
}

function oracle(route, skillSource) {
  return {
    primary_space:route.primary_space,
    route_id:route.id,
    package_path:route.package_path,
    change_mode:fm(skillSource, 'change_mode'),
    change_domain:fm(skillSource, 'change_domain'),
    route_reconciliation:route.reconciliation,
    skill_reconciliation:fm(skillSource, 'reconciliation'),
    mutation_boundary:route.mutation_boundary,
    availability_source:route.availability_source,
    first_reads:route.first_reads,
    non_triggers:route.non_triggers,
    next_handoff:route.next_handoff,
    validation_source:VALIDATION,
    live_state_external:true
  };
}

function graphFacts(fixture, part, kept) {
  const routeId = 'route:' + fixture.route;
  const routeEdge = part.edges.find(edge => edge.from === routeId && edge.relationship === 'routes-to');
  if (!routeEdge) throw new Error('Fragment lost route-to-Skill edge for ' + fixture.id);
  const packageId = routeEdge.to;
  const reconciliation = contractValue(part, packageId, 'declares-reconciliation');
  return {
    primary_space:fixture.space,
    route_id:fixture.route,
    package_path:packageId.replace(/^skill-package:/, ''),
    change_mode:contractValue(part, packageId, 'declares-change-mode'),
    change_domain:contractValue(part, packageId, 'declares-change-domain'),
    route_reconciliation:reconciliation,
    skill_reconciliation:reconciliation,
    mutation_boundary:kept.mutation_boundary,
    availability_source:kept.availability_source,
    first_reads:kept.first_reads,
    non_triggers:kept.non_triggers,
    next_handoff:kept.next_handoff,
    validation_source:part.edges.some(edge => edge.from === 'agent:repository-dispatcher' && edge.to === 'validation:repository-validation' && edge.relationship === 'uses-validation-contract') ? VALIDATION : null,
    live_state_external:part.edges.some(edge => edge.from === 'view:agent-runtime' && edge.to === 'boundary:live-runtime-state' && edge.relationship === 'excludes-live-state')
  };
}

function dimensions(expected, actual) {
  return {
    routing_target:same([actual.primary_space,actual.route_id,actual.package_path],[expected.primary_space,expected.route_id,expected.package_path]),
    change_contract:same([actual.change_mode,actual.change_domain],[expected.change_mode,expected.change_domain]),
    reconciliation:same([actual.route_reconciliation,actual.skill_reconciliation],[expected.route_reconciliation,expected.skill_reconciliation]),
    mutation_execution_boundary:same(actual.mutation_boundary,expected.mutation_boundary),
    source_tool_selection:same([actual.availability_source,actual.first_reads],[expected.availability_source,expected.first_reads]),
    missed_exceptions:same(actual.non_triggers,expected.non_triggers),
    validation_completion:same([actual.validation_source,actual.next_handoff],[expected.validation_source,expected.next_handoff]),
    recovery_live_state_boundary:same(actual.live_state_external,expected.live_state_external)
  };
}
const allPass = result => Object.values(result).every(Boolean);

function renderMarkdown(report) {
  const lines = [
    '# Phase 9 - Agent context integration experiment',
    '',
    'Generated by eval/system-map-context-experiment.mjs. Canonical routing is unchanged.',
    '',
    'Estimator: ceil(UTF-8 bytes / 4). These are rough static estimates, not observed model or subscription usage.',
    '',
    '| Route | Control bytes | Experimental bytes | Delta | Control rough tokens | Experimental rough tokens | Correct | Candidate |',
    '| --- | ---: | ---: | ---: | ---: | ---: | --- | --- |'
  ];
  for (const item of report.fixtures) {
    lines.push('| ' + item.route_id + ' | ' + item.control.utf8_bytes + ' | ' + item.experimental.utf8_bytes + ' | ' + item.delta.utf8_bytes + ' (' + item.delta.percent + '%) | ' + item.control.rough_tokens + ' | ' + item.experimental.rough_tokens + ' | ' + (item.experimental.correct ? 'PASS' : 'FAIL') + ' | ' + (item.adoption_candidate ? 'YES' : 'NO') + ' |');
  }
  lines.push(
    '',
    '## Aggregate',
    '',
    '- Control: ' + report.aggregate.control.utf8_bytes + ' bytes / ~' + report.aggregate.control.rough_tokens + ' rough tokens.',
    '- Experimental: ' + report.aggregate.experimental.utf8_bytes + ' bytes / ~' + report.aggregate.experimental.rough_tokens + ' rough tokens.',
    '- Change: ' + report.aggregate.delta.utf8_bytes + ' bytes (' + report.aggregate.delta.percent + '%) / ' + report.aggregate.delta.rough_tokens + ' rough tokens.',
    '- Deterministic correctness: ' + (report.aggregate.experimental_correct ? 'PASS' : 'FAIL') + '.',
    '- Adoption candidates: ' + report.aggregate.adoption_candidates + '/' + report.fixtures.length + '.',
    '',
    '## Per-route evidence',
    ''
  );
  for (const item of report.fixtures) {
    lines.push(
      '### ' + item.route_id,
      '',
      item.rationale,
      '',
      'Control artifacts: ' + item.control.artifacts.join(', ') + '.',
      '',
      'Experimental artifacts: ' + item.experimental.artifacts.join(', ') + '.',
      '',
      'Retained canonical exception fields: ' + item.experimental.retained_exception_fields.join(', ') + '.',
      '',
      'Correctness: ' + Object.entries(item.experimental.dimensions).map(([key,value]) => key + '=' + (value ? 'PASS' : 'FAIL')).join(', ') + '.',
      '',
      'Result: ' + (item.adoption_candidate ? 'candidate for a separately authorized migration' : 'retain current activation') + '.',
      ''
    );
  }
  lines.push(
    '## Limitations',
    '',
    '- No live model behavior, latency, cache effects, exact tokens, reasoning tokens, or subscription allowance were measured.',
    '- Correctness is deterministic contract preservation, not a subjective model-quality score.',
    '- Only three representative callable-Skill routes were sampled.',
    '- The graph remains derived output; canonical sources remain authoritative.',
    '',
    '## Gate',
    '',
    'A route qualifies only when every correctness dimension matches and experimental context is smaller. Phase 9 does not switch routing.'
  );
  return lines.join('\n') + '\n';
}

export async function buildExperiment() {
  const [agents, bootstrap, graph] = await Promise.all([readText('AGENTS.md'), readText('content/site-orientation.json'), readJson(GRAPH)]);
  const minimum = minimumDispatcher(agents);
  const results = [];

  for (const fixture of FIXTURES) {
    const [groupText, skillSource] = await Promise.all([readText(fixture.routeFile), readText(fixture.skill + '/SKILL.md')]);
    const group = JSON.parse(groupText);
    const route = routeFrom(group, fixture.route);
    if (route.primary_space !== fixture.space || route.package_path !== fixture.skill || route.artifact_kind !== 'callable_skill') throw new Error('Fixture drift: ' + fixture.id);
    const part = fragment(graph, fixture);
    const kept = exceptions(group, route);
    const expected = oracle(route, skillSource);
    const actual = graphFacts(fixture, part, kept);
    const controlDimensions = dimensions(expected, expected);
    const experimentalDimensions = dimensions(expected, actual);
    const controlContext = [agents, bootstrap, groupText, skillSource].join('\n\n--- CONTEXT ARTIFACT ---\n\n');
    const experimentalContext = [minimum, JSON.stringify(part), JSON.stringify(kept), skillSource].join('\n\n--- CONTEXT ARTIFACT ---\n\n');
    const control = metrics(controlContext);
    const experimental = metrics(experimentalContext);
    const deltaBytes = experimental.utf8_bytes - control.utf8_bytes;
    const deltaTokens = experimental.rough_tokens - control.rough_tokens;
    const percent = Number(((deltaBytes / control.utf8_bytes) * 100).toFixed(1));
    const correct = allPass(experimentalDimensions);

    results.push({
      id:fixture.id,
      route_id:fixture.route,
      primary_space:fixture.space,
      rationale:fixture.rationale,
      control:{ ...control, correct:allPass(controlDimensions), dimensions:controlDimensions, artifacts:['AGENTS.md','content/site-orientation.json',fixture.routeFile,fixture.skill + '/SKILL.md'] },
      experimental:{ ...experimental, correct, dimensions:experimentalDimensions, artifacts:['AGENTS.md#minimum-boundary',GRAPH + '#bounded:' + fixture.route,fixture.routeFile + '#canonical-exceptions:' + fixture.route,fixture.skill + '/SKILL.md'], graph_fragment:{ nodes:part.nodes.length, edges:part.edges.length, provenance_entries:Object.keys(part.provenance).length }, retained_exception_fields:Object.keys(kept) },
      delta:{ utf8_bytes:deltaBytes, rough_tokens:deltaTokens, percent },
      adoption_candidate:correct && experimental.utf8_bytes < control.utf8_bytes
    });
  }

  const sum = (side, field) => results.reduce((n,item) => n + item[side][field], 0);
  const cb = sum('control','utf8_bytes');
  const eb = sum('experimental','utf8_bytes');
  const ct = sum('control','rough_tokens');
  const et = sum('experimental','rough_tokens');

  return {
    schema_version:'1.0',
    experiment:'phase-9-agent-context-integration',
    estimator:ESTIMATOR,
    estimator_formula:'ceil(UTF-8 bytes / 4) per route condition',
    graph_source:GRAPH,
    canonical_routing_changed:false,
    fixtures:results,
    aggregate:{
      control:{utf8_bytes:cb,rough_tokens:ct},
      experimental:{utf8_bytes:eb,rough_tokens:et},
      delta:{utf8_bytes:eb-cb,rough_tokens:et-ct,percent:Number((((eb-cb)/cb)*100).toFixed(1))},
      experimental_correct:results.every(item => item.experimental.correct),
      adoption_candidates:results.filter(item => item.adoption_candidate).length
    },
    limitations:[
      'Static UTF-8/4 estimates are not observed provider token usage.',
      'Correctness measures deterministic contract preservation, not subjective model response quality.',
      'Only three representative callable-Skill routes are sampled.',
      'The experiment does not change canonical routing or authority.'
    ]
  };
}

export async function expectedOutputs() {
  const report = await buildExperiment();
  return new Map([
    ['eval/results/system-map-context-experiment.json', JSON.stringify(report, null, 2) + '\n'],
    ['eval/system-map-context-experiment.md', renderMarkdown(report)]
  ]);
}

export async function writeOutputs({check=false}={}) {
  const outputs = await expectedOutputs();
  const stale = [];
  for (const [relativePath, content] of outputs) {
    const filePath = path.join(root, relativePath);
    if (check) {
      let current = null;
      try { current = await readFile(filePath, 'utf8'); } catch {}
      if (current !== content) stale.push(relativePath);
    } else {
      await mkdir(path.dirname(filePath), {recursive:true});
      await writeFile(filePath, content, 'utf8');
    }
  }
  if (stale.length) throw new Error('Phase 9 experiment output is stale: ' + stale.join(', '));
  return outputs;
}

const entry = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (entry) {
  const outputs = await writeOutputs({check:process.argv.includes('--check')});
  const report = JSON.parse(outputs.get('eval/results/system-map-context-experiment.json'));
  console.log('Phase 9: ' + report.aggregate.adoption_candidates + '/' + report.fixtures.length + ' sampled routes qualify.');
}
