#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const readText = relativePath => readFile(path.join(root, relativePath), 'utf8');
const readJson = async relativePath => JSON.parse(await readText(relativePath));

const ROUTES = [
  {
    id: 'system-orientation',
    migration: 'eval/results/system-orientation-migration.json',
    behavior: 'eval/results/system-orientation-behavior.json'
  },
  {
    id: 'template-composition',
    migration: 'eval/results/template-composition-migration.json',
    behavior: 'eval/results/template-composition-behavior.json'
  },
  {
    id: 'tool-resolution',
    migration: 'eval/results/tool-resolution-migration.json',
    behavior: 'eval/results/tool-resolution-behavior.json'
  }
];

const GENERIC_INFRASTRUCTURE = [
  'scripts/build-agent-context-bundles.mjs',
  'scripts/validation/agent-context-bundle.test.mjs',
  'eval/agent-context-timing-benchmark.mjs',
  'scripts/validation/agent-context-timing-benchmark.test.mjs'
];

const ROUTE_SPECIFIC_SURFACES = {
  'system-orientation': [
    'eval/system-orientation-migration.mjs',
    'eval/results/system-orientation-migration.json',
    'eval/system-orientation-migration.md',
    'eval/fixtures/system-orientation-behavior.json',
    'eval/system-orientation-behavior.mjs',
    'eval/results/system-orientation-behavior.json',
    'eval/system-orientation-behavior.md',
    'scripts/validation/system-orientation-behavior.test.mjs'
  ],
  'template-composition': [
    'eval/template-composition-migration.mjs',
    'eval/results/template-composition-migration.json',
    'eval/template-composition-migration.md',
    'eval/fixtures/template-composition-behavior.json',
    'eval/template-composition-behavior.mjs',
    'eval/results/template-composition-behavior.json',
    'eval/template-composition-behavior.md',
    'scripts/validation/template-composition-bundle.test.mjs',
    'scripts/validation/template-composition-migration.test.mjs'
  ],
  'tool-resolution': [
    'eval/tool-resolution-migration.mjs',
    'eval/results/tool-resolution-migration.json',
    'eval/tool-resolution-migration.md',
    'eval/fixtures/tool-resolution-behavior.json',
    'eval/tool-resolution-behavior.mjs',
    'eval/results/tool-resolution-behavior.json',
    'eval/tool-resolution-behavior.md',
    'scripts/validation/tool-resolution-bundle.test.mjs',
    'scripts/validation/tool-resolution-migration.test.mjs'
  ]
};

function pctDelta(preferred, control) {
  return Number((((preferred - control) / control) * 100).toFixed(1));
}

function average(values) {
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1));
}

async function assertFilesExist(paths) {
  await Promise.all(paths.map(relativePath => readFile(path.join(root, relativePath))));
}

export async function buildAgentContextConsolidation() {
  const timingObserved = await readJson('eval/results/agent-context-timing-observed.json');
  const timingByRoute = Object.fromEntries(
    timingObserved.benchmark.routes.map(item => [item.route_id, item])
  );

  const routes = [];
  for (const config of ROUTES) {
    const [migration, behavior] = await Promise.all([
      readJson(config.migration),
      readJson(config.behavior)
    ]);
    const timing = timingByRoute[config.id];
    if (!timing) throw new Error('Missing timing evidence for ' + config.id);
    if (migration.bundle.route_id !== config.id) throw new Error('Migration route mismatch for ' + config.id);
    if (!behavior.aggregate.all_pass) throw new Error('Behavioral parity failed for ' + config.id);

    routes.push({
      route_id: config.id,
      context: {
        control_utf8_bytes: migration.canonical_fallback.utf8_bytes,
        preferred_utf8_bytes: migration.preferred_path.utf8_bytes,
        delta_utf8_bytes: migration.deltas.preferred_vs_current_fallback.utf8_bytes,
        delta_percent: migration.deltas.preferred_vs_current_fallback.percent,
        control_rough_tokens: migration.canonical_fallback.rough_tokens,
        preferred_rough_tokens: migration.preferred_path.rough_tokens
      },
      behavior: {
        fixtures: behavior.aggregate.fixture_count,
        passed: behavior.aggregate.passed,
        failed: behavior.aggregate.failed,
        activated_fixtures: behavior.aggregate.activated_fixture_count,
        context_delta_percent: behavior.aggregate.preferred_delta_percent
      },
      timing: {
        control: timing.control,
        preferred: timing.preferred,
        deltas: timing.deltas
      }
    });
  }

  const controlBytes = routes.reduce((sum, route) => sum + route.context.control_utf8_bytes, 0);
  const preferredBytes = routes.reduce((sum, route) => sum + route.context.preferred_utf8_bytes, 0);
  const behaviorControlBytes = routes.reduce((sum, route, index) => {
    const behaviorPath = ROUTES[index].behavior;
    return sum;
  }, 0);

  const behaviorReports = await Promise.all(ROUTES.map(route => readJson(route.behavior)));
  const activatedControlBytes = behaviorReports.reduce((sum, report) => sum + report.aggregate.control_context_utf8_bytes, 0);
  const activatedPreferredBytes = behaviorReports.reduce((sum, report) => sum + report.aggregate.preferred_context_utf8_bytes, 0);
  const fixtureCount = behaviorReports.reduce((sum, report) => sum + report.aggregate.fixture_count, 0);
  const fixturePassed = behaviorReports.reduce((sum, report) => sum + report.aggregate.passed, 0);

  await assertFilesExist([
    ...GENERIC_INFRASTRUCTURE,
    ...Object.values(ROUTE_SPECIFIC_SURFACES).flat()
  ]);

  const routeSpecificCounts = Object.fromEntries(
    Object.entries(ROUTE_SPECIFIC_SURFACES).map(([route, paths]) => [route, paths.length])
  );

  const routeSelectionDeltas = routes.map(route => route.timing.deltas.route_selection_p50_percent);
  const firstActionDeltas = routes.map(route => route.timing.deltas.first_useful_action_p50_percent);
  const completionDeltas = routes.map(route => route.timing.deltas.deterministic_completion_p50_percent);

  return {
    schema_version: '1.0',
    program: 'controlled-graph-backed-agent-context-migration',
    decision: 'selective-rollout',
    architecture: {
      contract: 'persona-library.agent-context/v0.1',
      status: 'supported-selective-routing-primitive',
      v0_2_required_now: false,
      bulk_migration_authorized: false
    },
    summary: {
      migrated_routes: routes.length,
      behavioral_fixtures: fixtureCount,
      behavioral_passed: fixturePassed,
      behavioral_failed: fixtureCount - fixturePassed,
      base_context: {
        control_utf8_bytes: controlBytes,
        preferred_utf8_bytes: preferredBytes,
        delta_utf8_bytes: preferredBytes - controlBytes,
        delta_percent: pctDelta(preferredBytes, controlBytes)
      },
      activated_behavior_context: {
        control_utf8_bytes: activatedControlBytes,
        preferred_utf8_bytes: activatedPreferredBytes,
        delta_utf8_bytes: activatedPreferredBytes - activatedControlBytes,
        delta_percent: pctDelta(activatedPreferredBytes, activatedControlBytes)
      },
      deterministic_work: {
        control_completion_file_reads_per_route: 3,
        preferred_completion_file_reads_per_route: 2,
        completion_file_read_reduction_percent: -33.3,
        control_static_artifacts_per_route: 4,
        preferred_static_artifacts_per_route: 3,
        static_artifact_reduction_percent: -25
      },
      observed_timing_p50_average_delta_percent: {
        route_selection: average(routeSelectionDeltas),
        first_useful_action: average(firstActionDeltas),
        deterministic_completion: average(completionDeltas)
      }
    },
    timing_evidence: {
      source: timingObserved.source,
      benchmark: timingObserved.benchmark.benchmark,
      measured_scope: timingObserved.benchmark.measured_scope,
      environment: timingObserved.benchmark.environment,
      warmup_iterations: timingObserved.benchmark.warmup_iterations,
      measured_iterations_per_path: timingObserved.benchmark.measured_iterations_per_path,
      interpretation: [
        'All three preferred paths were faster at p50 for route selection, first useful action, and deterministic activation completion in the observed CI run.',
        'All three preferred paths also had lower p95 timing, but the magnitude varied and remains subject to runner/filesystem noise.',
        'The deterministic one-file-read and one-artifact reductions are stronger evidence than sub-millisecond wall-clock differences.',
        'These timings do not measure model generation or end-user response latency.'
      ]
    },
    routes,
    maintenance: {
      generic_infrastructure: GENERIC_INFRASTRUCTURE,
      generic_infrastructure_count: GENERIC_INFRASTRUCTURE.length,
      route_specific_surfaces: ROUTE_SPECIFIC_SURFACES,
      route_specific_surface_counts: routeSpecificCounts,
      route_specific_surface_total: Object.values(routeSpecificCounts).reduce((sum, value) => sum + value, 0),
      recurring_costs: [
        'Each migrated route needs route-specific behavioral fixtures and safety assertions; those cannot be inferred safely from the generic bundle contract.',
        'Root dispatcher growth mechanically changes every migrated route context metric and requires report refreshes.',
        'Different route classes still require bounded generator policy: system-orientation carries the full compact space index, ordinary routes carry one space, and Tool resolution removes redundant semantic traversal.',
        'Generated metric/report files increase validation surface even though canonical route records remain unchanged.'
      ],
      scaling_observation: 'Bundle generation, checksum validation, fallback resolution, provenance validation, and timing methodology scale generically; route readiness, safety behavior, and policy-specific evaluation remain per-route work.'
    },
    eligibility_for_future_routes: [
      'The route resolves to one callable Skill with a stable canonical route record.',
      'Canonical fallback remains route-local, cheap, and independently testable.',
      'All required exceptions and Skill change-contract fields can be derived exactly from canonical sources.',
      'The bounded graph path is sufficient without copying policy prose or live state into the bundle.',
      'Preferred activation removes at least one route-side file read and does not increase static artifact count.',
      'Preferred base static context is at least 10% smaller than fallback for a new migration candidate; 5–10% requires separate high-frequency/latency evidence before approval.',
      'Fixed positive, negative, ambiguity, mutation-authority, and live-state fixtures achieve 100% preferred/fallback parity.',
      'Live availability, permission, workspace, approval, deployment, or execution state remains external and refreshed from current authority.',
      'No new generator special case is introduced solely for convenience; any special case must remove demonstrably redundant context and be regression-tested.',
      'The migration does not require duplicated human-authored policy or a new schema field that exists only for one route.'
    ],
    rollout_guidance: {
      recommendation: 'Use graph-backed activation selectively for routes that meet the eligibility criteria; do not bulk-migrate all routes.',
      existing_tool_resolution_exception: 'tool-resolution remains accepted at 6.1% because it served the live-state proof, reduces one read/artifact, and has positive observed timing; future routes below 10% need additional real usage evidence.',
      next_route_policy: 'Any fourth route requires a new separately approved issue with pre-migration context/read baseline and eligibility review.',
      schema_policy: 'Keep persona-library.agent-context/v0.1. Do not create v0.2 until a future eligible route proves a required field cannot be derived within v0.1.'
    },
    limitations: [
      'Observed timing is a single GitHub Actions environment sample and should be replicated before making fine-grained latency claims.',
      'The benchmark measures repository-side deterministic activation only, not end-user ChatGPT response time.',
      'Model inference/generation, connector/network/service latency, human approval, and deployment propagation are excluded.',
      'Rough token counts remain UTF-8/4 estimates rather than provider usage.',
      'No production route-frequency data was available in this phase, so eligibility thresholds intentionally favor larger deterministic context/read savings.'
    ]
  };
}

function markdown(report) {
  const lines = [
    '# Graph-backed agent-context consolidation',
    '',
    'Generated by eval/agent-context-consolidation.mjs.',
    '',
    '## Decision',
    '',
    '**Selective rollout.** Keep persona-library.agent-context/v0.1 as a supported selective routing primitive. Do not bulk-migrate routes.',
    '',
    '## Three-route evidence',
    '',
    '| Route | Base context delta | Fixtures | Route selection p50 | First useful action p50 | Completion p50 | Reads | Artifacts |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |'
  ];

  for (const route of report.routes) {
    lines.push(
      '| ' + route.route_id
      + ' | ' + route.context.delta_percent + '%'
      + ' | ' + route.behavior.passed + '/' + route.behavior.fixtures
      + ' | ' + route.timing.deltas.route_selection_p50_percent + '%'
      + ' | ' + route.timing.deltas.first_useful_action_p50_percent + '%'
      + ' | ' + route.timing.deltas.deterministic_completion_p50_percent + '%'
      + ' | ' + route.timing.control.completion_file_reads + '→' + route.timing.preferred.completion_file_reads
      + ' | ' + route.timing.control.static_artifacts_loaded + '→' + route.timing.preferred.static_artifacts_loaded
      + ' |'
    );
  }

  lines.push(
    '',
    '### Aggregate',
    '',
    '- Base context: ' + report.summary.base_context.control_utf8_bytes + ' → ' + report.summary.base_context.preferred_utf8_bytes + ' bytes (' + report.summary.base_context.delta_percent + '%).',
    '- Activated behavioral context: ' + report.summary.activated_behavior_context.control_utf8_bytes + ' → ' + report.summary.activated_behavior_context.preferred_utf8_bytes + ' bytes (' + report.summary.activated_behavior_context.delta_percent + '%).',
    '- Behavioral parity: ' + report.summary.behavioral_passed + '/' + report.summary.behavioral_fixtures + ' fixtures pass.',
    '- Route-side completion reads: 3→2 per migrated route (-33.3%).',
    '- Static artifacts: 4→3 per migrated route (-25%).',
    '- Observed p50 averages: route selection ' + report.summary.observed_timing_p50_average_delta_percent.route_selection + '%, first useful action ' + report.summary.observed_timing_p50_average_delta_percent.first_useful_action + '%, deterministic activation completion ' + report.summary.observed_timing_p50_average_delta_percent.deterministic_completion + '%.',
    '',
    'Timing source: GitHub Actions run ' + report.timing_evidence.source.workflow_run_id + ', Node ' + report.timing_evidence.environment.node + ', ' + report.timing_evidence.measured_iterations_per_path + ' measured iterations/path after ' + report.timing_evidence.warmup_iterations + ' warmups.',
    '',
    'These are sub-millisecond repository-side activation timings, not end-user ChatGPT latency. The deterministic read/artifact reductions are stronger evidence.',
    '',
    '## Maintenance cost',
    '',
    '- Generic shared infrastructure surfaces: ' + report.maintenance.generic_infrastructure_count + '.',
    '- Route-specific evaluation/report/test surfaces: ' + report.maintenance.route_specific_surface_total + ' (' + Object.entries(report.maintenance.route_specific_surface_counts).map(([route, count]) => route + ': ' + count).join(', ') + ').',
    '',
    ...report.maintenance.recurring_costs.map(item => '- ' + item),
    '',
    '## Future-route eligibility',
    '',
    ...report.eligibility_for_future_routes.map(item => '- ' + item),
    '',
    '## Architecture decision',
    '',
    '- Keep persona-library.agent-context/v0.1; no v0.2 is justified yet.',
    '- Any fourth route requires a separate issue and eligibility audit.',
    '- New candidates should normally save at least 10% base static context and one route-side read. Routes in the 5–10% range need separate high-frequency/latency evidence.',
    '- No bulk migration is authorized.',
    '',
    '## Limitations',
    '',
    ...report.limitations.map(item => '- ' + item)
  );

  return lines.join('\n') + '\n';
}

export async function expectedAgentContextConsolidationOutputs() {
  const report = await buildAgentContextConsolidation();
  return new Map([
    ['eval/results/agent-context-consolidation.json', JSON.stringify(report, null, 2) + '\n'],
    ['eval/agent-context-consolidation.md', markdown(report)]
  ]);
}

export async function writeAgentContextConsolidationOutputs({ check = false } = {}) {
  const outputs = await expectedAgentContextConsolidationOutputs();
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
  if (stale.length) throw new Error('Agent-context consolidation report is stale: ' + stale.join(', '));
  return outputs;
}

const entry = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (entry) {
  const outputs = await writeAgentContextConsolidationOutputs({ check: process.argv.includes('--check') });
  const report = JSON.parse(outputs.get('eval/results/agent-context-consolidation.json'));
  console.log('Agent-context consolidation: ' + report.decision + '; ' + report.summary.behavioral_passed + '/' + report.summary.behavioral_fixtures + ' fixtures pass; base context ' + report.summary.base_context.delta_percent + '%.');
}
