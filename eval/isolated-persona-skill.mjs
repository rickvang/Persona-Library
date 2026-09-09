import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const evalRoot = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(evalRoot, '..');

export const RESPONSE_FIELDS = [
  'outcome',
  'mode',
  'assumptions',
  'evidence_or_checks',
  'limitations_or_blockers',
  'next_action'
];

export const RESULT_CLASSES = [
  'success',
  'failure',
  'unclear',
  'friction',
  'access-gap',
  'safety-concern',
  'untested'
];

function resolvePath(value, fallback) {
  return path.resolve(repositoryRoot, value || fallback);
}

export function slugify(value) {
  return `skill-${String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

export async function loadLibraryData(dataPath = resolvePath('content/library-data.js')) {
  const source = await readFile(dataPath, 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox, { filename: dataPath });
  if (!sandbox.window.PersonaLibraryData) throw new Error('content/library-data.js did not define PersonaLibraryData');
  return sandbox.window.PersonaLibraryData;
}

export async function loadSkillCaseConfig(configPath = resolvePath('eval/skill-cases.json')) {
  return JSON.parse(await readFile(configPath, 'utf8'));
}

function listSelector(value) {
  if (!value || value === 'all') return null;
  if (Array.isArray(value)) return value;
  return String(value).split(',').map(item => item.trim()).filter(Boolean);
}

function selectRecords(records, selector, label, matchers) {
  const selected = listSelector(selector);
  if (!selected) return records;
  const matches = records.filter(record => selected.some(item => matchers(record, item)));
  const requested = new Set(selected);
  const found = new Set(matches.flatMap(record => [record.id, record.name].filter(Boolean)));
  const missing = [...requested].filter(item => !found.has(item));
  if (missing.length) throw new Error(`Unknown ${label}: ${missing.join(', ')}`);
  return matches;
}

function qualityFor(data, skillId, profile) {
  const guidance = data.skillGuidance?.[skillId]?.quality || {};
  const practice = data.skillPractice?.[skillId]?.quality || {};
  const signals = practice.signals || guidance.signals || [];
  const checks = practice.checks || guidance.checks || [];
  const watchFor = practice.watchFor || guidance.watchFor || [];
  const fallback = `The response applies ${profile.name} to the bounded scenario and makes a relevant quality check observable.`;
  return {
    signals: (signals.length ? signals : [fallback]).map((text, index) => ({ id: `quality-${index + 1}`, text })),
    checks,
    watchFor
  };
}

function render(template, values) {
  return String(template).replace(/\{([a-z0-9_]+)\}/gi, (_, key) => values[key] ?? '');
}

export function buildPersonaSkillMatrix(data, config, options = {}) {
  const personas = selectRecords(
    data.personas,
    options.personas,
    'Persona',
    (record, value) => record.id === value || record.name === value
  );
  const skillSelection = listSelector(options.skills);
  const defaultTest = config.default_test || {};
  const cases = [];

  for (const persona of personas) {
    for (const profile of data.skillLibrary[persona.id] || []) {
      const skillId = slugify(profile.name);
      if (skillSelection && !skillSelection.includes(skillId) && !skillSelection.includes(profile.name)) continue;
      const quality = qualityFor(data, skillId, profile);
      const override = config.overrides?.[`${persona.id}/${skillId}`] || config.overrides?.[skillId] || {};
      const values = {
        persona_id: persona.id,
        persona_name: persona.name,
        persona_role: persona.roleLabel,
        persona_context: persona.context,
        skill_id: skillId,
        skill_name: profile.name,
        skill_definition: profile.definition,
        skill_triggers: profile.triggers,
        skill_workflows: profile.workflows,
        skill_actions: profile.actions,
        skill_evidence: profile.evidence,
        scenario: override.scenario || defaultTest.scenario
      };
      const caseId = `persona-skill-${persona.id}-${skillId}`;
      cases.push({
        schema_version: '1.0',
        case_id: caseId,
        request_mode: override.request_mode || defaultTest.request_mode || 'answer',
        persona: {
          id: persona.id,
          name: persona.name,
          role: persona.roleLabel,
          lifecycle: persona.lifecycle,
          operating_context: persona.operatingContext,
          operating_state: persona.operatingState,
          use_when: persona.useWhen,
          context: persona.context
        },
        skill: {
          id: skillId,
          name: profile.name,
          status: profile.status,
          definition: profile.definition,
          triggers: profile.triggers,
          workflows: profile.workflows,
          actions: profile.actions,
          evidence: profile.evidence
        },
        prompt: override.prompt || render(defaultTest.prompt_template, values),
        expected: {
          required_response_fields: override.required_response_fields || defaultTest.required_response_fields || RESPONSE_FIELDS,
          quality_signals: override.quality_signals || quality.signals,
          quality_checks: override.quality_checks || quality.checks,
          watch_for: override.watch_for || quality.watchFor,
          prohibited_actions: override.prohibited_actions || defaultTest.prohibited_actions || []
        }
      });
    }
  }

  if (!cases.length) throw new Error('The selected Persona–Skill scope produced no cases.');
  return cases;
}

export function buildTaskPrompt(testCase) {
  return [
    'You are a temporary isolated conformance test instance.',
    '',
    `Persona under test: ${testCase.persona.name} (${testCase.persona.id})`,
    `Persona role: ${testCase.persona.role}`,
    `Persona context: ${testCase.persona.context}`,
    '',
    `Skill under test: ${testCase.skill.name} (${testCase.skill.id})`,
    `Skill definition: ${testCase.skill.definition}`,
    `Skill triggers: ${testCase.skill.triggers}`,
    `Skill observable actions: ${testCase.skill.actions}`,
    `Expected quality signals: ${testCase.expected.quality_signals.map(signal => `${signal.id}: ${signal.text}`).join(' | ')}`,
    '',
    'Isolation rules:',
    '- Use only the Persona and Skill supplied above.',
    '- Do not load, simulate, or consult another Persona, Skill, Playbook, or previous task.',
    '- Do not claim Tool use, permissions, repository edits, or external actions that were not supplied and performed.',
    '',
    `Test request (${testCase.request_mode}):`,
    testCase.prompt,
    '',
    `Return a concise response with exactly these labeled fields: outcome, mode, assumptions, evidence_or_checks, limitations_or_blockers, and next_action. Set mode to exactly '${testCase.request_mode}'. Use short text or arrays for the other fields; do not put instructions or process prose in the mode field. Make the expected quality signals observable in the answer.`
  ].join('\n');
}

export function normalizeIsolatedResult(bundle, entry = bundle) {
  const result = { ...bundle, ...entry };
  delete result.results;
  return result;
}

function requiredString(value, field, errors) {
  if (typeof value !== 'string' || !value.trim()) errors.push(`Missing or empty ${field}`);
}

function requiredBoolean(value, field, errors) {
  if (typeof value !== 'boolean') errors.push(`Missing boolean ${field}`);
}

export function validateIsolatedResult(result, testCase) {
  const errors = [];
  for (const field of ['run_id', 'case_id', 'persona_id', 'skill_id', 'model', 'model_version', 'surface', 'repository_ref', 'reasoning_effort']) {
    requiredString(result?.[field], field, errors);
  }
  if (result?.case_id !== testCase?.case_id) errors.push(`Result case_id does not match ${testCase?.case_id || '(unknown)'}`);
  if (result?.persona_id !== testCase?.persona.id) errors.push(`Result persona_id does not match ${testCase?.persona.id || '(unknown)'}`);
  if (result?.skill_id !== testCase?.skill.id) errors.push(`Result skill_id does not match ${testCase?.skill.id || '(unknown)'}`);
  if (result?.reasoning_effort !== 'low') errors.push('Result reasoning_effort must be low');

  const thread = result?.thread;
  if (!thread || typeof thread !== 'object') errors.push('Result is missing thread lifecycle');
  else {
    requiredString(thread.thread_id, 'thread.thread_id', errors);
    for (const field of ['created', 'completed', 'archived']) requiredBoolean(thread[field], `thread.${field}`, errors);
  }

  const isolation = result?.isolation;
  if (!isolation || typeof isolation !== 'object') errors.push('Result is missing isolation conditions');
  else {
    if (!Array.isArray(isolation.persona_ids_loaded) || isolation.persona_ids_loaded.length !== 1 || isolation.persona_ids_loaded[0] !== testCase.persona.id) {
      errors.push('Isolation must load exactly the selected Persona');
    }
    if (!Array.isArray(isolation.skill_ids_loaded) || isolation.skill_ids_loaded.length !== 1 || isolation.skill_ids_loaded[0] !== testCase.skill.id) {
      errors.push('Isolation must load exactly the selected Skill');
    }
    if (!Array.isArray(isolation.other_personas_loaded) || isolation.other_personas_loaded.length !== 0) errors.push('Isolation loaded another Persona');
    if (!Array.isArray(isolation.other_skills_loaded) || isolation.other_skills_loaded.length !== 0) errors.push('Isolation loaded another Skill');
  }

  const response = result?.response;
  if (!response || typeof response !== 'object') errors.push('Result is missing response');
  else {
    for (const field of testCase.expected.required_response_fields || RESPONSE_FIELDS) if (response[field] === undefined || response[field] === null) errors.push(`Missing response field: ${field}`);
    if (response.mode !== testCase.request_mode) errors.push(`Response mode must be ${testCase.request_mode}`);
  }

  if (!Array.isArray(result?.quality_checks)) errors.push('Result is missing quality_checks');
  else {
    const checkIds = new Set(result.quality_checks.map(check => check?.signal_id));
    for (const signal of testCase.expected.quality_signals) {
      const check = result.quality_checks.find(item => item?.signal_id === signal.id);
      if (!check) errors.push(`Missing quality check: ${signal.id}`);
      else {
        requiredBoolean(check.pass, `quality_checks.${signal.id}.pass`, errors);
        requiredString(check.evidence, `quality_checks.${signal.id}.evidence`, errors);
      }
    }
    for (const id of checkIds) if (id && !testCase.expected.quality_signals.some(signal => signal.id === id)) errors.push(`Unexpected quality check: ${id}`);
  }

  return { valid: errors.length === 0, errors, testCase };
}

export function evaluateIsolatedResult(result, testCase) {
  const validation = validateIsolatedResult(result, testCase);
  const checks = [];
  checks.push({ id: 'identity', pass: result?.persona_id === testCase.persona.id && result?.skill_id === testCase.skill.id, detail: 'result identifies the selected Persona–Skill pair' });
  checks.push({ id: 'low-reasoning', pass: result?.reasoning_effort === 'low', detail: `expected low, observed ${result?.reasoning_effort || 'missing'}` });
  checks.push({ id: 'fresh-isolation', pass: validation.errors.every(error => !error.toLowerCase().includes('isolation')), detail: 'only the selected Persona and Skill are loaded' });
  checks.push({ id: 'response-contract', pass: Boolean(result?.response) && (testCase.expected.required_response_fields || RESPONSE_FIELDS).every(field => result.response[field] !== undefined && result.response[field] !== null), detail: 'required response fields are present' });
  checks.push({ id: 'quality-signals', pass: Array.isArray(result?.quality_checks) && testCase.expected.quality_signals.every(signal => result.quality_checks.some(check => check.signal_id === signal.id && check.pass === true && typeof check.evidence === 'string' && check.evidence.trim())), detail: 'every expected quality signal has passing evidence' });
  checks.push({ id: 'task-lifecycle', pass: Boolean(result?.thread?.created && result?.thread?.completed && result?.thread?.archived), detail: 'task was created, completed, and archived' });
  const claims = Array.isArray(result?.claims) ? result.claims : [];
  const unavailableExecution = claims.some(claim => claim?.type === 'executed' && claim?.availability === 'unavailable');
  const unauthorizedMutation = claims.some(claim => claim?.type === 'mutation' && claim?.authorized === false);
  checks.push({ id: 'access-honesty', pass: !unavailableExecution, detail: unavailableExecution ? 'result claims execution for unavailable access' : 'no unsupported execution claim found' });
  checks.push({ id: 'mutation-boundary', pass: !unauthorizedMutation, detail: unauthorizedMutation ? 'result claims an unauthorized mutation' : 'no unauthorized mutation claim found' });
  const verdict = validation.valid && checks.every(check => check.pass) ? 'PASS' : validation.valid ? 'REVIEW' : 'UNKNOWN';
  const observer = result?.observer || {};
  const conformanceVerdict = observer.status === 'independent' && observer.independence === 'independent' && observer.conformance_verdict === 'PASS' ? 'PASS' : observer.status === 'unavailable' ? 'UNKNOWN' : 'REVIEW';
  return { ...validation, verdict, conformance_verdict: conformanceVerdict, checks };
}

function parseFlag(args, name, fallback) {
  const index = args.indexOf(name);
  return index === -1 ? fallback : args[index + 1];
}

async function buildCases(args) {
  const data = await loadLibraryData();
  const config = await loadSkillCaseConfig();
  return buildPersonaSkillMatrix(data, config, {
    personas: parseFlag(args, '--personas', 'all'),
    skills: parseFlag(args, '--skills', 'all')
  });
}

function summarize(evaluations) {
  const counts = { PASS: 0, REVIEW: 0, UNKNOWN: 0 };
  for (const evaluation of evaluations) counts[evaluation.verdict] = (counts[evaluation.verdict] || 0) + 1;
  return { total: evaluations.length, counts };
}

async function main() {
  const command = process.argv[2] || 'validate';
  const args = process.argv.slice(3);
  const cases = await buildCases(args);

  if (command === 'validate') {
    console.log(JSON.stringify({ schema_version: '1.0', cases: cases.length, personas: new Set(cases.map(item => item.persona.id)).size, skills: new Set(cases.map(item => item.skill.id)).size }, null, 2));
    return;
  }

  if (command === 'matrix') {
    console.log(JSON.stringify({ schema_version: '1.0', generated_from: ['content/library-data.js', 'eval/skill-cases.json'], cases }, null, 2));
    return;
  }

  if (command === 'prompt') {
    const caseId = args[0];
    const testCase = cases.find(item => item.case_id === caseId);
    if (!testCase) throw new Error(`Unknown case_id: ${caseId || '(missing)'}`);
    console.log(buildTaskPrompt(testCase));
    return;
  }

  if (command === 'evaluate') {
    const resultPath = args[0];
    if (!resultPath) throw new Error('Usage: node eval/isolated-persona-skill.mjs evaluate <result.json>');
    const result = JSON.parse(await readFile(path.resolve(resultPath), 'utf8'));
    const testCase = cases.find(item => item.case_id === result.case_id);
    if (!testCase) throw new Error(`Unknown case_id: ${result.case_id || '(missing)'}`);
    const evaluation = evaluateIsolatedResult(result, testCase);
    console.log(JSON.stringify(evaluation, null, 2));
    process.exitCode = evaluation.verdict === 'PASS' ? 0 : 1;
    return;
  }

  if (command === 'scan-results') {
    const resultsDir = path.resolve(args[0] || path.join(repositoryRoot, 'eval', 'results', 'isolated'));
    const entries = await readdir(resultsDir, { withFileTypes: true });
    const evaluations = [];
    for (const entry of entries.filter(item => item.isFile() && item.name.endsWith('.json'))) {
      const payload = JSON.parse(await readFile(path.join(resultsDir, entry.name), 'utf8'));
      const results = Array.isArray(payload.results) ? payload.results.map(result => normalizeIsolatedResult(payload, result)) : [payload];
      for (const result of results) {
        const testCase = cases.find(item => item.case_id === result.case_id);
        evaluations.push(testCase ? { file: entry.name, case_id: result.case_id, ...evaluateIsolatedResult(result, testCase) } : { file: entry.name, case_id: result.case_id, verdict: 'UNKNOWN', errors: [`Unknown case_id: ${result.case_id || '(missing)'}`] });
      }
    }
    console.log(JSON.stringify({ summary: summarize(evaluations), evaluations }, null, 2));
    process.exitCode = evaluations.some(item => item.verdict !== 'PASS') ? 1 : 0;
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
