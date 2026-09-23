#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { lstat, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadUsageTaxonomy, validateCalibrationPair, validateUsage } from './contract.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ESTIMATOR = 'utf8-byte-count-divided-by-four';
const ROUTING_BASELINES = [
  { id: 'docs-system-orientation', task_class: 'docs/system orientation', primary_space: 'docs', route_id: 'system-orientation', skill_id: 'persona-library-orientation', route_file: 'content/orientation/docs.json' },
  { id: 'persona-research', task_class: 'persona research', primary_space: 'personas', route_id: 'persona-research', skill_id: 'persona-research', route_file: 'content/orientation/personas.json' },
  { id: 'skill-package-maintenance', task_class: 'Skill maintenance', primary_space: 'skills', route_id: 'skill-package-maintenance', skill_id: 'pl-skill-creator', route_file: 'content/orientation/skills.json' },
  { id: 'tool-discovery-execution', task_class: 'Tool discovery/execution', primary_space: 'tools', route_id: 'tool-resolution', skill_id: 'tool-discovery-and-safe-execution', route_file: 'content/orientation/tools.json' },
  { id: 'playbook-composition', task_class: 'Playbook work', primary_space: 'playbooks', route_id: 'playbook-composition', skill_id: 'playbook-composer', route_file: 'content/orientation/playbooks.json' },
  { id: 'template-research', task_class: 'Template work', primary_space: 'templates', route_id: 'template-research', skill_id: 'template-research', route_file: 'content/orientation/templates.json' },
  { id: 'prototype-comparison', task_class: 'prototype/layout work', primary_space: 'prototyping', route_id: 'prototype-comparison', skill_id: 'layout-lab', route_file: 'content/orientation/prototyping.json' }
];

function parseOptions(args) {
  const parsed = { paths: [], ref: null, primary_space: null, route_id: null, skill_id: null };
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value === '--ref' || value === '--space' || value === '--route' || value === '--skill') {
      const next = args[index + 1];
      if (!next) throw new Error('Missing value for ' + value);
      if (value === '--ref') parsed.ref = next;
      if (value === '--space') parsed.primary_space = next;
      if (value === '--route') parsed.route_id = next;
      if (value === '--skill') parsed.skill_id = next;
      index += 1;
    } else if (value === '--json') {
      continue;
    } else if (value.startsWith('--')) {
      throw new Error('Unknown option: ' + value);
    } else {
      parsed.paths.push(value);
    }
  }
  return parsed;
}

function resolveRepositoryRef(explicitRef) {
  let value = explicitRef;
  if (!value) {
    try {
      value = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
    } catch {
      throw new Error('Could not resolve Git HEAD. Supply a full commit SHA with --ref.');
    }
  }
  if (!/^[0-9a-f]{40}$/i.test(value)) throw new Error('Repository revision must be a full 40-character commit SHA.');
  return value;
}

function toRepoPath(absolutePath) {
  return path.relative(root, absolutePath).split(path.sep).join('/');
}

async function expandFilePath(input) {
  const absolutePath = path.resolve(root, input);
  const relative = path.relative(root, absolutePath);
  if (!relative || relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) {
    throw new Error('Input path must resolve to a file or directory inside the repository: ' + input);
  }
  const metadata = await lstat(absolutePath);
  if (metadata.isSymbolicLink()) throw new Error('Symbolic links are not measured: ' + input);
  if (metadata.isFile()) return [absolutePath];
  if (!metadata.isDirectory()) throw new Error('Input is not a regular file or directory: ' + input);
  const children = await readdir(absolutePath, { withFileTypes: true });
  const files = [];
  for (const child of children.sort((left, right) => left.name.localeCompare(right.name))) {
    if (child.name === '.git' || child.name === 'node_modules') continue;
    const childPath = path.join(absolutePath, child.name);
    if (child.isSymbolicLink()) continue;
    if (child.isFile()) files.push(childPath);
    else if (child.isDirectory()) files.push(...await expandFilePath(childPath));
  }
  return files;
}

async function expandPaths(inputs) {
  if (!inputs.length) throw new Error('Provide at least one file or directory path.');
  const all = [];
  for (const input of inputs) all.push(...await expandFilePath(input));
  return [...new Set(all)].sort().map(absolutePath => ({ absolutePath, path: toRepoPath(absolutePath) }));
}

function expandRepositoryPaths(inputs, repositoryRef) {
  if (!inputs.length) throw new Error('Provide at least one file or directory path.');
  const files = new Map();
  for (const input of inputs) {
    const absolutePath = path.resolve(root, input);
    const relative = path.relative(root, absolutePath);
    if (!relative || relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) {
      throw new Error('Input path must resolve inside the repository: ' + input);
    }
    const repoPath = relative.split(path.sep).join('/');
    let listing;
    try {
      listing = execFileSync('git', [
        'ls-tree', '-r', '-z', '--full-tree', repositoryRef, '--', ':(literal)' + repoPath
      ], { cwd: root, encoding: 'buffer', maxBuffer: 32 * 1024 * 1024 });
    } catch {
      throw new Error('Could not resolve committed context path at ' + repositoryRef + ': ' + repoPath);
    }
    const entries = listing.toString('utf8').split('\0').filter(Boolean);
    if (!entries.length) throw new Error('No committed files matched at ' + repositoryRef + ': ' + repoPath);
    for (const entry of entries) {
      const separator = entry.indexOf('\t');
      if (separator < 0) throw new Error('Could not parse Git tree entry for ' + repoPath);
      const [mode, type, blobSha] = entry.slice(0, separator).split(/\s+/);
      const filePath = entry.slice(separator + 1);
      if (type !== 'blob' || !['100644', '100755'].includes(mode)) {
        throw new Error('Context inputs must be regular committed files; unsupported entry: ' + filePath);
      }
      files.set(filePath, { path: filePath, blob_sha: blobSha });
    }
  }
  return [...files.values()].sort((left, right) => left.path.localeCompare(right.path));
}

async function estimatePaths(paths, repositoryRef, contextAttribution = {}) {
  let byteCount = 0;
  for (const entry of paths) {
    let source;
    try {
      source = execFileSync('git', ['cat-file', 'blob', entry.blob_sha], {
        cwd: root,
        encoding: 'buffer',
        maxBuffer: 32 * 1024 * 1024
      });
    } catch {
      throw new Error('Could not read committed context blob for ' + entry.path + ' at ' + repositoryRef);
    }
    byteCount += source.byteLength;
  }
  const usage = {
    measurement: 'estimated',
    scope: 'context',
    input_tokens: Math.ceil(byteCount / 4),
    cached_input_tokens: null,
    output_tokens: null,
    reasoning_tokens: null,
    total_tokens: null,
    estimator: ESTIMATOR,
    source: 'Static estimate of the listed repository file text; approximate, not runtime telemetry.',
    repository_ref: repositoryRef,
    estimated_at: new Date().toISOString(),
    artifacts: paths.map(entry => entry.path)
  };
  if (Object.keys(contextAttribution).length) {
    usage.context_attribution = {
      ...contextAttribution,
      loaded_artifacts: paths.map(entry => ({
        path: entry.path,
        role: entry.path === 'AGENTS.md'
          ? 'universal'
          : entry.path === 'content/site-orientation.json'
            ? 'bootstrap'
            : entry.path.startsWith('content/orientation/')
              ? 'route-group'
              : entry.path.startsWith('.agents/skills/')
                ? 'selected-skill'
                : 'task-evidence'
      }))
    };
  }
  return { usage, included_utf8_bytes: byteCount };
}

function validateOrThrow(usage, taxonomy) {
  const result = validateUsage(usage, { taxonomy });
  if (!result.valid) throw new Error(result.errors.join('; '));
}

async function buildRoutingBaseline(repositoryRef, taxonomy) {
  const records = [];
  for (const route of ROUTING_BASELINES) {
    const artifacts = [
      'AGENTS.md',
      'content/site-orientation.json',
      route.route_file,
      '.agents/skills/' + route.skill_id + '/SKILL.md'
    ];
    const paths = expandRepositoryPaths(artifacts, repositoryRef);
    const measurement = await estimatePaths(paths, repositoryRef, {
      primary_space: route.primary_space,
      route_id: route.route_id,
      skill_id: route.skill_id
    });
    validateOrThrow(measurement.usage, taxonomy);
    records.push({
      record_id: 'route-' + route.id,
      task_class: route.task_class,
      model: 'not-applicable',
      model_version: 'not-applicable',
      surface: 'repository-context-estimate',
      usage: measurement.usage,
      included_utf8_bytes: measurement.included_utf8_bytes
    });
  }
  return {
    schema_version: '1.0',
    record_type: 'usage-baseline',
    baseline_id: 'routing-baseline-' + repositoryRef.slice(0, 7),
    repository_ref: repositoryRef,
    estimator: ESTIMATOR,
    estimator_formula: 'ceil(sum(UTF-8 bytes of listed text files) / 4)',
    generated_at: new Date().toISOString(),
    notes: [
      'These are static estimates for named repository-owned context files, not observed prompts or runtime token counts.',
      'Task evidence, conversation history, system/developer instructions, Tool definitions/results, compaction, and delegated work are not represented.'
    ],
    base_artifacts: ['AGENTS.md', 'content/site-orientation.json'],
    records
  };
}

function contextAttribution(record, usage) {
  return usage.context_attribution || record.context_attribution || {};
}

function addUsageSample(samples, usage, record, location, taxonomy) {
  const validation = validateUsage(usage, { taxonomy });
  if (!validation.valid) {
    throw new Error('Invalid usage in ' + location + ': ' + validation.errors.join('; '));
  }
  samples.push({
    record_id: record.record_id || record.run_id || record.pair_id || location,
    location,
    usage,
    surface: record.surface || 'unknown',
    model: record.model || 'unknown',
    request_mode: record.request_mode || record.mode || 'unknown',
    task_class: record.task_class || 'unknown',
    context_attribution: contextAttribution(record, usage)
  });
}

async function collectJsonFiles(input) {
  const paths = await expandPaths([input]);
  return paths.filter(entry => entry.path.toLowerCase().endsWith('.json'));
}

async function loadUsageData(inputs, taxonomy) {
  if (!inputs.length) throw new Error('Provide a JSON file or directory to report.');
  const samples = [];
  const calibrationPairs = [];
  const sourceFiles = [];
  const visited = new Set();

  function visitCalibrationPair(pair, file, location = 'calibration-pair') {
    const validation = validateCalibrationPair(pair, { taxonomy });
    if (!validation.valid) throw new Error('Invalid calibration pair in ' + file + ': ' + validation.errors.join('; '));
    calibrationPairs.push(pair);
    addUsageSample(samples, pair.estimated, pair, file + ':' + location + ':estimated', taxonomy);
    addUsageSample(samples, pair.measured, pair, file + ':' + location + ':measured', taxonomy);
  }

  function visitPayload(payload, file, location = 'root') {
    if (payload?.record_type === 'usage-calibration-pair') {
      visitCalibrationPair(payload, file, location);
      return;
    }
    if (Array.isArray(payload?.calibration_pairs)) {
      for (const pair of payload.calibration_pairs) visitCalibrationPair(pair, file, location + ':pair');
    }
    if (payload?.usage) addUsageSample(samples, payload.usage, payload, file + ':' + location + ':usage', taxonomy);
    if (Array.isArray(payload?.records)) {
      for (const [index, record] of payload.records.entries()) {
        if (record?.record_type === 'usage-calibration-pair') {
          visitCalibrationPair(record, file, location + ':record-' + index);
        } else if (record?.usage) {
          addUsageSample(samples, record.usage, record, file + ':' + location + ':record-' + index, taxonomy);
        }
      }
    }
    if (Array.isArray(payload?.results)) {
      for (const [index, result] of payload.results.entries()) {
        if (result?.usage) addUsageSample(samples, result.usage, { ...payload, ...result }, file + ':' + location + ':result-' + index, taxonomy);
      }
    }
    if (Array.isArray(payload?.strategies)) {
      for (const [index, strategy] of payload.strategies.entries()) {
        const usage = strategy?.observation?.usage;
        if (usage) addUsageSample(samples, usage, {
          ...payload,
          record_id: payload.comparison_id || payload.record_id,
          model: payload.environment?.model || payload.model,
          surface: payload.environment?.surface || payload.surface,
          task_class: payload.stable_unit?.task_class || payload.task_class,
          context_attribution: usage.context_attribution || payload.context_attribution
        }, file + ':' + location + ':strategy-' + index, taxonomy);
      }
    }
  }

  for (const input of inputs) {
    const files = await collectJsonFiles(input);
    for (const entry of files) {
      if (visited.has(entry.path)) continue;
      visited.add(entry.path);
      const payload = JSON.parse(await readFile(entry.absolutePath, 'utf8'));
      sourceFiles.push(entry.path);
      visitPayload(payload, entry.path);
    }
  }
  return { samples, calibrationPairs, sourceFiles };
}

function percentile(sortedValues, fraction) {
  if (!sortedValues.length) return null;
  return sortedValues[Math.max(0, Math.ceil(fraction * sortedValues.length) - 1)];
}

function metricSummary(samples, field) {
  const values = samples.map(sample => sample.usage[field]).filter(value => Number.isSafeInteger(value) && value >= 0).sort((a, b) => a - b);
  if (!values.length) return { count: 0, mean: null, median: null, p90: null };
  const middle = Math.floor(values.length / 2);
  const median = values.length % 2 ? values[middle] : (values[middle - 1] + values[middle]) / 2;
  return {
    count: values.length,
    mean: values.reduce((sum, value) => sum + value, 0) / values.length,
    median,
    p90: percentile(values, 0.9)
  };
}

function summarizeSamples(samples) {
  return {
    sample_count: samples.length,
    input_tokens: metricSummary(samples, 'input_tokens'),
    output_tokens: metricSummary(samples, 'output_tokens'),
    total_tokens: metricSummary(samples, 'total_tokens')
  };
}

function groupSummaries(samples, keyFunction) {
  const groups = new Map();
  for (const sample of samples) {
    const key = keyFunction(sample);
    if (!key || key === 'unknown') continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(sample);
  }
  return Object.fromEntries([...groups.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, items]) => [key, summarizeSamples(items)]));
}

function summarizeMeasurements(samples) {
  const result = {};
  for (const measurement of ['measured', 'estimated', 'unavailable']) {
    const measuredSamples = samples.filter(sample => sample.usage.measurement === measurement);
    const scopes = {};
    for (const scope of [...new Set(measuredSamples.map(sample => sample.usage.scope))].sort()) {
      const scoped = measuredSamples.filter(sample => sample.usage.scope === scope);
      scopes[scope] = {
        ...summarizeSamples(scoped),
        by_surface_model: groupSummaries(scoped, sample => sample.surface + ' / ' + sample.model),
        by_request_mode: groupSummaries(scoped, sample => sample.request_mode),
        by_primary_space: groupSummaries(scoped, sample => sample.context_attribution.primary_space),
        by_route: groupSummaries(scoped, sample => {
          const attribution = sample.context_attribution;
          return attribution.primary_space && attribution.route_id ? attribution.primary_space + '/' + attribution.route_id : null;
        }),
        by_skill: groupSummaries(scoped, sample => sample.context_attribution.skill_id)
      };
    }
    result[measurement] = { count: measuredSamples.length, scopes };
  }
  return result;
}

function contextSizeBand(tokens) {
  if (tokens < 1000) return 'under-1k';
  if (tokens < 5000) return '1k-to-under-5k';
  if (tokens < 10000) return '5k-to-under-10k';
  if (tokens < 25000) return '10k-to-under-25k';
  return '25k-plus';
}

function calibrationSummary(pairs) {
  const rows = pairs.map(pair => {
    const estimated = pair.estimated.input_tokens;
    const measured = pair.measured.input_tokens;
    const error = estimated - measured;
    return {
      pair,
      signed_error_tokens: error,
      absolute_percentage_error: measured > 0 ? Math.abs(error) / measured * 100 : null,
      context_size_band: contextSizeBand(estimated)
    };
  });
  const classes = new Map();
  for (const row of rows) {
    const taskClass = row.pair.task_class;
    classes.set(taskClass, (classes.get(taskClass) || 0) + 1);
  }
  const reasons = [];
  if (rows.length < 20) reasons.push('Fewer than 20 paired runs');
  if (classes.size < 3) reasons.push('Fewer than 3 materially different task classes');
  if (rows.length && Math.max(...classes.values()) > rows.length / 2) reasons.push('One task class contributes more than half the samples');
  if (rows.some(row => !/^[0-9a-f]{40}$/i.test(row.pair.repository_ref) || !row.pair.surface || !row.pair.model)) {
    reasons.push('A sample lacks a pinned revision, surface, or model');
  }

  const summarizeRows = selected => {
    const signedErrors = selected.map(row => row.signed_error_tokens).sort((a, b) => a - b);
    const percentages = selected.map(row => row.absolute_percentage_error).filter(value => typeof value === 'number').sort((a, b) => a - b);
    const medianSigned = signedErrors.length % 2
      ? signedErrors[Math.floor(signedErrors.length / 2)]
      : signedErrors.length ? (signedErrors[signedErrors.length / 2 - 1] + signedErrors[signedErrors.length / 2]) / 2 : null;
    const medianApe = percentages.length % 2
      ? percentages[Math.floor(percentages.length / 2)]
      : percentages.length ? (percentages[percentages.length / 2 - 1] + percentages[percentages.length / 2]) / 2 : null;
    return {
      paired_samples: selected.length,
      median_signed_error_tokens: medianSigned,
      median_absolute_percentage_error: medianApe,
      p90_absolute_percentage_error: percentile(percentages, 0.9),
      percentage_error_samples: percentages.length,
      zero_measured_input_samples: selected.filter(row => row.pair.measured.input_tokens === 0).length
    };
  };
  const byGroup = (keyFunction, selectedRows = rows) => {
    const groups = new Map();
    for (const row of selectedRows) {
      const key = keyFunction(row);
      if (!key) continue;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(row);
    }
    return Object.fromEntries([...groups.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, selected]) => [key, summarizeRows(selected)]));
  };
  return {
    paired_sample_count: rows.length,
    operational_follow_up_review: { eligible: reasons.length === 0, reasons },
    overall: summarizeRows(rows),
    by_surface_model: byGroup(row => row.pair.surface + ' / ' + row.pair.model),
    by_primary_space_route: byGroup(row => {
      const attribution = row.pair.estimated.context_attribution || {};
      return attribution.primary_space && attribution.route_id ? attribution.primary_space + '/' + attribution.route_id : null;
    }),
    by_context_size_band: byGroup(row => row.context_size_band),
    by_task_class: Object.fromEntries([...classes.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, count]) => [key, { paired_samples: count }]))
  };
}

function buildReport(data) {
  const counts = { measured: 0, estimated: 0, unavailable: 0 };
  for (const sample of data.samples) counts[sample.usage.measurement] += 1;
  return {
    schema_version: '1.0',
    report_type: 'usage-aggregation',
    generated_at: new Date().toISOString(),
    source_files: data.sourceFiles,
    counts,
    by_measurement: summarizeMeasurements(data.samples),
    calibration: calibrationSummary(data.calibrationPairs)
  };
}

function printHumanSummary(report) {
  console.error('Token-usage report: ' + report.counts.measured + ' measured, ' + report.counts.estimated + ' estimated, ' + report.counts.unavailable + ' unavailable.');
  for (const measurement of ['measured', 'estimated']) {
    const scopes = report.by_measurement[measurement].scopes;
    for (const [scope, summary] of Object.entries(scopes)) {
      const input = summary.input_tokens;
      console.error('  ' + measurement + ' ' + scope + ': n=' + input.count + ', mean=' + input.mean + ', median=' + input.median + ', p90=' + input.p90 + ' input tokens');
    }
  }
  console.error('  calibration pairs: ' + report.calibration.paired_sample_count + '; follow-up review eligible=' + report.calibration.operational_follow_up_review.eligible);
}

function printJson(payload, summary) {
  if (summary) console.error(summary);
  process.stdout.write(JSON.stringify(payload, null, 2) + '\n');
}

async function main() {
  const command = process.argv[2];
  const args = process.argv.slice(3);
  if (!command || command === 'help' || command === '--help') {
    console.error('Usage: node eval/context-usage.mjs measure <paths...> [--ref <full-sha>] [--space <id>] [--route <id>] [--skill <id>]');
    console.error('       node eval/context-usage.mjs routing-baseline [--ref <full-sha>]');
    console.error('       node eval/context-usage.mjs report <json-file-or-directory...>');
    process.exitCode = 0;
    return;
  }

  if (command === 'measure') {
    const options = parseOptions(args);
    const repositoryRef = resolveRepositoryRef(options.ref);
    const paths = expandRepositoryPaths(options.paths, repositoryRef);
    const taxonomy = await loadUsageTaxonomy();
    const attribution = {};
    if (options.primary_space) attribution.primary_space = options.primary_space;
    if (options.route_id) attribution.route_id = options.route_id;
    if (options.skill_id) attribution.skill_id = options.skill_id;
    const measurement = await estimatePaths(paths, repositoryRef, attribution);
    validateOrThrow(measurement.usage, taxonomy);
    const recordId = 'context-' + repositoryRef.slice(0, 7) + '-' + Date.now();
    const payload = {
      schema_version: '1.0',
      record_type: 'usage-context-measurement',
      record_id: recordId,
      repository_ref: repositoryRef,
      estimator: ESTIMATOR,
      estimator_formula: 'ceil(sum(UTF-8 bytes of listed text files) / 4)',
      generated_at: new Date().toISOString(),
      model: 'not-applicable',
      model_version: 'not-applicable',
      surface: 'repository-context-estimate',
      records: [{ record_id: recordId, usage: measurement.usage, included_utf8_bytes: measurement.included_utf8_bytes }]
    };
    printJson(payload, 'Estimated ' + measurement.usage.input_tokens + ' approximate context tokens across ' + paths.length + ' file(s).');
    return;
  }

  if (command === 'routing-baseline') {
    const options = parseOptions(args);
    const repositoryRef = resolveRepositoryRef(options.ref);
    const taxonomy = await loadUsageTaxonomy();
    const payload = await buildRoutingBaseline(repositoryRef, taxonomy);
    printJson(payload, 'Estimated routing context for ' + payload.records.length + ' representative route classes at ' + repositoryRef + '.');
    return;
  }

  if (command === 'report') {
    const options = parseOptions(args);
    const taxonomy = await loadUsageTaxonomy();
    const data = await loadUsageData(options.paths, taxonomy);
    const payload = buildReport(data);
    printJson(payload, 'Aggregated ' + data.samples.length + ' usage observations from ' + data.sourceFiles.length + ' file(s).');
    return;
  }

  throw new Error('Unknown command: ' + command);
}

export { buildReport, buildRoutingBaseline, calibrationSummary, metricSummary, summarizeMeasurements };

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
