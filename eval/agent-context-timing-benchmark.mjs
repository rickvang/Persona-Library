#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';
import { resolveAgentContextBundle } from '../scripts/build-agent-context-bundles.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SEP = '\n\n--- CONTEXT ARTIFACT ---\n\n';

const ROUTES = [
  {
    route_id: 'system-orientation',
    primary_space: 'docs',
    route_group: 'content/orientation/docs.json',
    skill: '.agents/skills/persona-library-orientation/SKILL.md',
    bundle: 'dist/data/agent-context/system-orientation.json'
  },
  {
    route_id: 'template-composition',
    primary_space: 'templates',
    route_group: 'content/orientation/templates.json',
    skill: '.agents/skills/template-composer/SKILL.md',
    bundle: 'dist/data/agent-context/template-composition.json'
  },
  {
    route_id: 'tool-resolution',
    primary_space: 'tools',
    route_group: 'content/orientation/tools.json',
    skill: '.agents/skills/tool-discovery-and-safe-execution/SKILL.md',
    bundle: 'dist/data/agent-context/tool-resolution.json'
  }
];

const readText = relativePath => readFile(path.join(root, relativePath), 'utf8');

function frontmatterValue(source, key) {
  const match = source.match(new RegExp('^\\s*' + key + ':\\s*([^\\n#]+)', 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : null;
}

function contractFromSkill(skill) {
  return {
    skill_layer: frontmatterValue(skill, 'skill_layer'),
    change_mode: frontmatterValue(skill, 'change_mode'),
    change_domain: frontmatterValue(skill, 'change_domain'),
    reconciliation: frontmatterValue(skill, 'reconciliation')
  };
}

function quantile(values, q) {
  const sorted = [...values].sort((a, b) => a - b);
  if (!sorted.length) return 0;
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(q * sorted.length) - 1));
  return sorted[index];
}

function summarize(values) {
  return {
    p50_ms: Number(quantile(values, 0.5).toFixed(4)),
    p95_ms: Number(quantile(values, 0.95).toFixed(4)),
    mean_ms: Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(4))
  };
}

function percentDelta(preferred, control) {
  if (!control) return null;
  return Number((((preferred - control) / control) * 100).toFixed(1));
}

async function fallbackActivation(config, agentsText) {
  const started = performance.now();

  const bootstrapText = await readText('content/site-orientation.json');
  const bootstrap = JSON.parse(bootstrapText);
  const space = bootstrap.spaces?.[config.primary_space];
  if (!space) throw new Error(config.route_id + ': fallback space missing');
  if ('content/' + space.route_file !== config.route_group) {
    throw new Error(config.route_id + ': route-group mismatch');
  }

  const groupText = await readText(config.route_group);
  const group = JSON.parse(groupText);
  const route = group.routes.find(item => item.id === config.route_id);
  if (!route) throw new Error(config.route_id + ': fallback route missing');
  const routeSelection = performance.now();

  const skillText = await readText(config.skill);
  const skillContract = contractFromSkill(skillText);
  if (route.package_path !== config.skill.replace(/\/SKILL\.md$/, '')) {
    throw new Error(config.route_id + ': fallback Skill package mismatch');
  }
  const firstUsefulAction = performance.now();

  const context = [agentsText, bootstrapText, groupText, skillText].join(SEP);
  const activation = {
    route_id: route.id,
    primary_space: route.primary_space,
    package_path: route.package_path,
    first_reads: route.first_reads,
    mutation_boundary: route.mutation_boundary,
    next_handoff: route.next_handoff,
    contract: {
      ...skillContract,
      reconciliation: route.reconciliation
    },
    context_bytes: Buffer.byteLength(context, 'utf8')
  };
  JSON.stringify(activation);
  const completed = performance.now();

  return {
    route_selection_ms: routeSelection - started,
    first_useful_action_ms: firstUsefulAction - started,
    deterministic_completion_ms: completed - started,
    route_selection_file_reads: 2,
    first_useful_action_file_reads: 3,
    completion_file_reads: 3,
    static_artifacts_loaded: 4,
    context_bytes: activation.context_bytes,
    activation
  };
}

async function preferredActivation(config, agentsText) {
  const started = performance.now();

  const bundleText = await readText(config.bundle);
  const bundle = JSON.parse(bundleText);
  const resolution = resolveAgentContextBundle(bundle, {
    route_id: config.route_id,
    primary_space: config.primary_space,
    package_path: config.skill.replace(/\/SKILL\.md$/, '')
  });
  if (resolution.mode !== 'graph-backed') {
    throw new Error(config.route_id + ': preferred bundle failed validation');
  }
  const routeSelection = performance.now();

  const skillText = await readText(config.skill);
  const skillContract = contractFromSkill(skillText);
  const firstUsefulAction = performance.now();

  const context = [agentsText, bundleText, skillText].join(SEP);
  const activation = {
    route_id: bundle.route_id,
    primary_space: bundle.primary_space,
    package_path: bundle.package_path,
    first_reads: bundle.exceptions.first_reads,
    mutation_boundary: bundle.exceptions.mutation_boundary,
    next_handoff: bundle.exceptions.next_handoff,
    contract: {
      ...skillContract,
      reconciliation: bundle.contract.reconciliation
    },
    context_bytes: Buffer.byteLength(context, 'utf8')
  };
  JSON.stringify(activation);
  const completed = performance.now();

  return {
    route_selection_ms: routeSelection - started,
    first_useful_action_ms: firstUsefulAction - started,
    deterministic_completion_ms: completed - started,
    route_selection_file_reads: 1,
    first_useful_action_file_reads: 2,
    completion_file_reads: 2,
    static_artifacts_loaded: 3,
    context_bytes: activation.context_bytes,
    activation
  };
}

function assertActivationParity(routeId, control, preferred) {
  const comparable = value => ({
    route_id: value.activation.route_id,
    primary_space: value.activation.primary_space,
    package_path: value.activation.package_path,
    first_reads: value.activation.first_reads,
    mutation_boundary: value.activation.mutation_boundary,
    next_handoff: value.activation.next_handoff,
    reconciliation: value.activation.contract.reconciliation
  });
  if (JSON.stringify(comparable(control)) !== JSON.stringify(comparable(preferred))) {
    throw new Error(routeId + ': activation parity failed');
  }
}

export async function runTimingBenchmark({
  warmup = 25,
  iterations = 200
} = {}) {
  const agentsText = await readText('AGENTS.md');
  const routes = [];

  for (const config of ROUTES) {
    for (let index = 0; index < warmup; index += 1) {
      if (index % 2 === 0) {
        await fallbackActivation(config, agentsText);
        await preferredActivation(config, agentsText);
      } else {
        await preferredActivation(config, agentsText);
        await fallbackActivation(config, agentsText);
      }
    }

    const samples = {
      control: {
        route_selection_ms: [],
        first_useful_action_ms: [],
        deterministic_completion_ms: []
      },
      preferred: {
        route_selection_ms: [],
        first_useful_action_ms: [],
        deterministic_completion_ms: []
      }
    };

    let exemplarControl = null;
    let exemplarPreferred = null;

    for (let index = 0; index < iterations; index += 1) {
      const order = index % 2 === 0 ? ['control', 'preferred'] : ['preferred', 'control'];
      for (const mode of order) {
        const result = mode === 'control'
          ? await fallbackActivation(config, agentsText)
          : await preferredActivation(config, agentsText);
        if (mode === 'control') exemplarControl = result;
        else exemplarPreferred = result;
        samples[mode].route_selection_ms.push(result.route_selection_ms);
        samples[mode].first_useful_action_ms.push(result.first_useful_action_ms);
        samples[mode].deterministic_completion_ms.push(result.deterministic_completion_ms);
      }
    }

    assertActivationParity(config.route_id, exemplarControl, exemplarPreferred);

    const control = {
      route_selection: summarize(samples.control.route_selection_ms),
      first_useful_action: summarize(samples.control.first_useful_action_ms),
      deterministic_completion: summarize(samples.control.deterministic_completion_ms),
      route_selection_file_reads: exemplarControl.route_selection_file_reads,
      first_useful_action_file_reads: exemplarControl.first_useful_action_file_reads,
      completion_file_reads: exemplarControl.completion_file_reads,
      static_artifacts_loaded: exemplarControl.static_artifacts_loaded,
      context_bytes: exemplarControl.context_bytes
    };
    const preferred = {
      route_selection: summarize(samples.preferred.route_selection_ms),
      first_useful_action: summarize(samples.preferred.first_useful_action_ms),
      deterministic_completion: summarize(samples.preferred.deterministic_completion_ms),
      route_selection_file_reads: exemplarPreferred.route_selection_file_reads,
      first_useful_action_file_reads: exemplarPreferred.first_useful_action_file_reads,
      completion_file_reads: exemplarPreferred.completion_file_reads,
      static_artifacts_loaded: exemplarPreferred.static_artifacts_loaded,
      context_bytes: exemplarPreferred.context_bytes
    };

    routes.push({
      route_id: config.route_id,
      control,
      preferred,
      deltas: {
        route_selection_p50_percent: percentDelta(preferred.route_selection.p50_ms, control.route_selection.p50_ms),
        first_useful_action_p50_percent: percentDelta(preferred.first_useful_action.p50_ms, control.first_useful_action.p50_ms),
        deterministic_completion_p50_percent: percentDelta(preferred.deterministic_completion.p50_ms, control.deterministic_completion.p50_ms),
        completion_file_reads: preferred.completion_file_reads - control.completion_file_reads,
        static_artifacts_loaded: preferred.static_artifacts_loaded - control.static_artifacts_loaded,
        context_bytes: preferred.context_bytes - control.context_bytes,
        context_percent: percentDelta(preferred.context_bytes, control.context_bytes)
      }
    });
  }

  return {
    schema_version: '1.0',
    benchmark: 'agent-context-deterministic-activation-timing',
    measured_scope: 'repository-side activation only',
    root_agents_assumption: 'AGENTS.md is already active and is preloaded outside measured time',
    warmup_iterations: warmup,
    measured_iterations_per_path: iterations,
    environment: {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      cpus: os.cpus().length
    },
    routes,
    limitations: [
      'This is not end-user ChatGPT response latency.',
      'Model inference and generation time are excluded.',
      'External connector, Tool, network, deployment, and service latency are excluded.',
      'Human approval or clarification time is excluded.',
      'Filesystem and runner noise can affect wall-clock timing; timing is observational, not a hard CI performance threshold.',
      'File-read and artifact-count reductions are deterministic and are stronger evidence than sub-millisecond timing differences.'
    ]
  };
}

function compact(report) {
  return {
    benchmark: report.benchmark,
    measured_scope: report.measured_scope,
    root_agents_assumption: report.root_agents_assumption,
    warmup_iterations: report.warmup_iterations,
    measured_iterations_per_path: report.measured_iterations_per_path,
    environment: report.environment,
    routes: report.routes,
    limitations: report.limitations
  };
}

const entry = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (entry) {
  const warmupArg = process.argv.find(arg => arg.startsWith('--warmup='));
  const iterationsArg = process.argv.find(arg => arg.startsWith('--iterations='));
  const warmup = warmupArg ? Number(warmupArg.split('=')[1]) : 25;
  const iterations = iterationsArg ? Number(iterationsArg.split('=')[1]) : 200;
  const report = await runTimingBenchmark({ warmup, iterations });
  if (process.argv.includes('--json')) {
    console.log('BENCHMARK_JSON=' + JSON.stringify(compact(report)));
  } else {
    for (const route of report.routes) {
      console.log(
        route.route_id
        + ': route selection ' + route.deltas.route_selection_p50_percent + '%; '
        + 'first useful action ' + route.deltas.first_useful_action_p50_percent + '%; '
        + 'completion ' + route.deltas.deterministic_completion_p50_percent + '%; '
        + 'reads ' + route.control.completion_file_reads + '→' + route.preferred.completion_file_reads
      );
    }
  }
}
