import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ALLOWANCE_OUTCOMES = ['measured', 'measured_with_caveat', 'below_resolution', 'reset_crossed', 'unavailable'];
export const WINDOW_MODES = ['used', 'remaining'];

const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const finiteNonnegative = value => typeof value === 'number' && Number.isFinite(value) && value >= 0;
const validTime = value => nonempty(value) && !Number.isNaN(Date.parse(value));
const FORBIDDEN_EVIDENCE_KEYS = new Set(['prompt', 'raw_prompt', 'account_id', 'project_id', 'api_key', 'credentials', 'conversation', 'conversation_text', 'raw_status', 'raw_trace']);

function findForbiddenKeys(value, pathPrefix = '') {
  if (!value || typeof value !== 'object') return [];
  const errors = [];
  for (const [key, child] of Object.entries(value)) {
    const path = pathPrefix ? `${pathPrefix}.${key}` : key;
    if (FORBIDDEN_EVIDENCE_KEYS.has(key)) errors.push(`Allowance evidence must not contain sensitive/raw field ${path}`);
    errors.push(...findForbiddenKeys(child, path));
  }
  return errors;
}

function percentile(values, fraction) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.max(0, Math.ceil(sorted.length * fraction) - 1)];
}

function metricSummary(values) {
  const sorted = values.filter(value => typeof value === 'number' && Number.isFinite(value) && value >= 0).sort((a, b) => a - b);
  if (!sorted.length) return { count: 0, mean: null, median: null, p90: null };
  const middle = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  return {
    count: sorted.length,
    mean: sorted.reduce((sum, value) => sum + value, 0) / sorted.length,
    median,
    p90: percentile(sorted, 0.9)
  };
}

export function validateAllowanceWindow(window) {
  const errors = [];
  if (!window || typeof window !== 'object' || Array.isArray(window)) return { valid: false, errors: ['Allowance window must be an object'] };
  if (!nonempty(window.window_id)) errors.push('Allowance window requires window_id');
  if (!nonempty(window.unit)) errors.push('Allowance window requires unit');
  if (!WINDOW_MODES.includes(window.mode)) errors.push('Allowance window mode must be used or remaining');
  if (!finiteNonnegative(window.value)) errors.push('Allowance window value must be a non-negative finite number');
  if (window.resolution !== undefined && window.resolution !== null && (!finiteNonnegative(window.resolution) || window.resolution === 0)) errors.push('Allowance window resolution must be a positive finite number when present');
  if (window.reset_at !== undefined && window.reset_at !== null && !validTime(window.reset_at)) errors.push('Allowance window reset_at must be an ISO-compatible timestamp when present');
  return { valid: errors.length === 0, errors };
}

export function validateAllowanceSnapshot(snapshot) {
  const errors = [];
  if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) return { valid: false, errors: ['Allowance snapshot must be an object'] };
  if (!nonempty(snapshot.source)) errors.push('Allowance snapshot requires source');
  if (!validTime(snapshot.observed_at)) errors.push('Allowance snapshot requires observed_at');
  if (!Array.isArray(snapshot.windows) || snapshot.windows.length === 0) errors.push('Allowance snapshot requires at least one window');
  const keys = new Set();
  for (const [index, window] of (snapshot.windows || []).entries()) {
    const check = validateAllowanceWindow(window);
    for (const error of check.errors) errors.push(`windows[${index}]: ${error}`);
    if (check.valid) {
      const key = `${window.window_id}::${window.unit}`;
      if (keys.has(key)) errors.push(`Allowance snapshot has duplicate window/unit ${key}`);
      keys.add(key);
    }
  }
  return { valid: errors.length === 0, errors };
}

export function validateAllowanceObservation(observation) {
  const errors = [];
  if (!observation || typeof observation !== 'object' || Array.isArray(observation)) return { valid: false, errors: ['Allowance observation must be an object'] };
  if (observation.record_type !== 'allowance-task-observation') errors.push('Allowance observation record_type must be allowance-task-observation');
  const task = observation.task;
  if (!task || typeof task !== 'object' || Array.isArray(task)) errors.push('Allowance observation requires task metadata');
  else {
    for (const field of ['task_id', 'task_class', 'surface', 'started_at', 'completed_at']) if (!nonempty(task[field])) errors.push(`Task requires ${field}`);
    if (task.started_at && !validTime(task.started_at)) errors.push('Task started_at must be an ISO-compatible timestamp');
    if (task.completed_at && !validTime(task.completed_at)) errors.push('Task completed_at must be an ISO-compatible timestamp');
    if (validTime(task.started_at) && validTime(task.completed_at) && Date.parse(task.completed_at) < Date.parse(task.started_at)) errors.push('Task completed_at cannot precede started_at');
  }
  for (const [name, snapshot] of [['before', observation.before], ['after', observation.after]]) {
    const check = validateAllowanceSnapshot(snapshot);
    for (const error of check.errors) errors.push(`${name}: ${error}`);
  }
  errors.push(...findForbiddenKeys(observation));
  const flags = observation.flags || {};
  for (const field of ['concurrent_usage_possible', 'update_lag_possible']) {
    if (flags[field] !== undefined && typeof flags[field] !== 'boolean') errors.push(`flags.${field} must be boolean when present`);
  }
  return { valid: errors.length === 0, errors };
}

function resetCrossed(beforeWindow, afterWindow, beforeObservedAt, afterObservedAt) {
  if (!beforeWindow.reset_at) return false;
  const reset = Date.parse(beforeWindow.reset_at);
  const before = Date.parse(beforeObservedAt);
  const after = Date.parse(afterObservedAt);
  if (reset > before && reset <= after) return true;
  return Boolean(afterWindow.reset_at && beforeWindow.reset_at !== afterWindow.reset_at && after >= reset);
}

function compareWindow(beforeWindow, afterWindow, observation) {
  const base = {
    window_id: beforeWindow.window_id,
    unit: beforeWindow.unit,
    before: beforeWindow,
    after: afterWindow
  };
  if (beforeWindow.mode !== afterWindow.mode) return { ...base, outcome: 'unavailable', delta: null, reason: 'Before and after snapshots use different used/remaining semantics.' };
  if (resetCrossed(beforeWindow, afterWindow, observation.before.observed_at, observation.after.observed_at)) return { ...base, outcome: 'reset_crossed', delta: null, reason: 'The allowance window reset between snapshots.' };

  const delta = beforeWindow.mode === 'used'
    ? afterWindow.value - beforeWindow.value
    : beforeWindow.value - afterWindow.value;
  if (delta < 0) return { ...base, outcome: 'unavailable', delta: null, reason: 'The allowance meter moved opposite the expected consumption direction without a recorded reset.' };

  const resolution = afterWindow.resolution ?? beforeWindow.resolution ?? null;
  if (delta === 0 && resolution) return { ...base, outcome: 'below_resolution', delta: null, resolution, reason: 'No visible change was resolved by the meter.' };

  const caveats = [];
  if (observation.flags?.concurrent_usage_possible) caveats.push('concurrent_usage_possible');
  if (observation.flags?.update_lag_possible) caveats.push('update_lag_possible');
  return {
    ...base,
    outcome: caveats.length ? 'measured_with_caveat' : 'measured',
    delta,
    resolution,
    caveats
  };
}

export function computeAllowanceMeasurement(observation) {
  const validation = validateAllowanceObservation(observation);
  if (!validation.valid) return { valid: false, errors: validation.errors, task: observation?.task || null, windows: [] };

  const afterByKey = new Map(observation.after.windows.map(window => [`${window.window_id}::${window.unit}`, window]));
  const windows = [];
  for (const beforeWindow of observation.before.windows) {
    const key = `${beforeWindow.window_id}::${beforeWindow.unit}`;
    const afterWindow = afterByKey.get(key);
    if (!afterWindow) {
      windows.push({ window_id: beforeWindow.window_id, unit: beforeWindow.unit, outcome: 'unavailable', delta: null, reason: 'No comparable after snapshot exists for this window and unit.' });
      continue;
    }
    windows.push(compareWindow(beforeWindow, afterWindow, observation));
  }
  for (const afterWindow of observation.after.windows) {
    const key = `${afterWindow.window_id}::${afterWindow.unit}`;
    if (!observation.before.windows.some(window => `${window.window_id}::${window.unit}` === key)) {
      windows.push({ window_id: afterWindow.window_id, unit: afterWindow.unit, outcome: 'unavailable', delta: null, reason: 'No comparable before snapshot exists for this window and unit.' });
    }
  }
  return { valid: true, errors: [], task: observation.task, before: observation.before, after: observation.after, flags: observation.flags || {}, windows };
}

function outcomeCounts(rows) {
  const counts = Object.fromEntries(ALLOWANCE_OUTCOMES.map(outcome => [outcome, 0]));
  for (const row of rows) counts[row.outcome] = (counts[row.outcome] || 0) + 1;
  return counts;
}

function groupStats(rows, selector) {
  const groups = new Map();
  for (const row of rows) {
    const key = selector(row) || '(unknown)';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  return Object.fromEntries([...groups.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, group]) => [key, {
    sample_count: group.length,
    measured_delta: metricSummary(group.filter(row => row.outcome === 'measured').map(row => row.delta)),
    outcome_counts: outcomeCounts(group)
  }]));
}

export function buildAllowanceReport(observations) {
  const computed = observations.map(computeAllowanceMeasurement);
  const invalid = computed.filter(result => !result.valid);
  const rows = [];
  for (const result of computed.filter(result => result.valid)) {
    for (const window of result.windows) rows.push({ ...window, task: result.task, flags: result.flags });
  }
  const windows = {};
  const byWindow = new Map();
  for (const row of rows) {
    const key = `${row.window_id}::${row.unit}`;
    if (!byWindow.has(key)) byWindow.set(key, []);
    byWindow.get(key).push(row);
  }
  for (const [key, group] of [...byWindow.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    windows[key] = {
      sample_count: group.length,
      outcome_counts: outcomeCounts(group),
      measured_delta: metricSummary(group.filter(row => row.outcome === 'measured').map(row => row.delta)),
      caveated_delta: metricSummary(group.filter(row => row.outcome === 'measured_with_caveat').map(row => row.delta)),
      by_task_class: groupStats(group, row => row.task.task_class),
      by_surface_model: groupStats(group, row => `${row.task.surface}/${row.task.model || '(unknown)'}`),
      by_reasoning: groupStats(group, row => row.task.reasoning_level || '(unknown)'),
      by_orchestration: groupStats(group, row => row.task.orchestration || '(unknown)'),
      by_route: groupStats(group, row => row.task.route_id || '(unknown)'),
      by_skill: groupStats(group, row => row.task.skill_id || '(unknown)')
    };
  }
  return {
    observation_count: observations.length,
    valid_observations: computed.length - invalid.length,
    invalid_observations: invalid.length,
    invalid_errors: invalid.flatMap(result => result.errors),
    window_outcome_counts: outcomeCounts(rows),
    windows
  };
}

export function createAllowanceSession(taskInput, before, { startedAt } = {}) {
  const beforeCheck = validateAllowanceSnapshot(before);
  if (!beforeCheck.valid) throw new Error(beforeCheck.errors.join('; '));
  if (!taskInput || typeof taskInput !== 'object') throw new Error('Task metadata must be an object.');
  for (const field of ['task_id', 'task_class', 'surface']) if (!nonempty(taskInput[field])) throw new Error(`Task metadata requires ${field}`);
  const task = { ...taskInput, started_at: taskInput.started_at || startedAt || new Date().toISOString() };
  if (!validTime(task.started_at)) throw new Error('Task started_at must be an ISO-compatible timestamp.');
  const session = {
    schema_version: '1.0',
    record_type: 'allowance-task-session',
    task,
    before,
    flags: taskInput.flags || {}
  };
  delete session.task.flags;
  const sensitive = findForbiddenKeys(session);
  if (sensitive.length) throw new Error(sensitive.join('; '));
  return session;
}

export function completeAllowanceSession(session, after, { completedAt } = {}) {
  if (!session || session.record_type !== 'allowance-task-session') throw new Error('Allowance session must have record_type allowance-task-session.');
  const afterCheck = validateAllowanceSnapshot(after);
  if (!afterCheck.valid) throw new Error(afterCheck.errors.join('; '));
  const observation = {
    schema_version: '1.0',
    record_type: 'allowance-task-observation',
    task: { ...session.task, completed_at: session.task.completed_at || completedAt || new Date().toISOString() },
    before: session.before,
    after,
    flags: session.flags || {}
  };
  const validation = validateAllowanceObservation(observation);
  if (!validation.valid) throw new Error(validation.errors.join('; '));
  return observation;
}

async function collectJsonFiles(target) {
  const resolved = path.resolve(target);
  const info = await stat(resolved);
  if (info.isFile()) return [resolved];
  if (!info.isDirectory()) return [];
  const entries = await readdir(resolved, { withFileTypes: true });
  return entries.filter(entry => entry.isFile() && entry.name.endsWith('.json')).map(entry => path.join(resolved, entry.name));
}

export async function loadAllowanceObservations(targets) {
  const files = [];
  for (const target of targets) files.push(...await collectJsonFiles(target));
  const observations = [];
  for (const file of files) {
    const payload = JSON.parse(await readFile(file, 'utf8'));
    if (Array.isArray(payload)) observations.push(...payload);
    else if (Array.isArray(payload.observations)) observations.push(...payload.observations);
    else observations.push(payload);
  }
  return { files, observations };
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  const command = process.argv[2];
  if (command === 'start') {
    const [taskFile, beforeFile, sessionFile] = process.argv.slice(3);
    if (!taskFile || !beforeFile || !sessionFile) throw new Error('Usage: node eval/allowance-usage.mjs start <task.json> <before-snapshot.json> <session.json>');
    const taskInput = JSON.parse(await readFile(path.resolve(taskFile), 'utf8'));
    const before = JSON.parse(await readFile(path.resolve(beforeFile), 'utf8'));
    const session = createAllowanceSession(taskInput, before);
    await writeFile(path.resolve(sessionFile), `${JSON.stringify(session, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify(session, null, 2));
    process.exit(0);
  }
  if (command === 'finish') {
    const [sessionFile, afterFile, observationFile] = process.argv.slice(3);
    if (!sessionFile || !afterFile || !observationFile) throw new Error('Usage: node eval/allowance-usage.mjs finish <session.json> <after-snapshot.json> <observation.json>');
    const session = JSON.parse(await readFile(path.resolve(sessionFile), 'utf8'));
    const after = JSON.parse(await readFile(path.resolve(afterFile), 'utf8'));
    const observation = completeAllowanceSession(session, after);
    await writeFile(path.resolve(observationFile), `${JSON.stringify(observation, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify(computeAllowanceMeasurement(observation), null, 2));
    process.exit(0);
  }
  if (command === 'check') {
    const file = process.argv[3];
    if (!file) throw new Error('Usage: node eval/allowance-usage.mjs check <observation.json>');
    const observation = JSON.parse(await readFile(path.resolve(file), 'utf8'));
    const result = computeAllowanceMeasurement(observation);
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.valid ? 0 : 1);
  }
  if (command === 'report') {
    const targets = process.argv.slice(3);
    if (!targets.length) throw new Error('Usage: node eval/allowance-usage.mjs report <file-or-directory...>');
    const loaded = await loadAllowanceObservations(targets);
    console.log(JSON.stringify({ source_files: loaded.files, ...buildAllowanceReport(loaded.observations) }, null, 2));
    process.exit(0);
  }
  throw new Error('Usage: node eval/allowance-usage.mjs <start|finish|check|report> ...');
}
