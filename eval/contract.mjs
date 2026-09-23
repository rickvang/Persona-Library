import { readFile } from 'node:fs/promises';

export const REQUIRED_RESULT_FIELDS = [
  'fixture_id',
  'model',
  'model_version',
  'surface',
  'repository_ref',
  'context',
  'tools',
  'permissions',
  'response'
];

export const RESPONSE_FIELDS = [
  'outcome',
  'mode',
  'assumptions',
  'evidence_or_checks',
  'limitations_or_blockers',
  'next_action'
];

export const OBSERVATION_RESULT_CLASSES = [
  'success',
  'failure',
  'unclear',
  'friction',
  'access-gap',
  'safety-concern',
  'untested'
];

export const OBSERVER_STATUSES = ['independent', 'same-runtime', 'unavailable', 'not-applicable'];


export const USAGE_MEASUREMENTS = ['measured', 'estimated', 'unavailable'];
export const USAGE_SCOPES = ['run', 'turn', 'context'];
const USAGE_TOKEN_FIELDS = ['input_tokens', 'cached_input_tokens', 'output_tokens', 'reasoning_tokens', 'total_tokens'];

const nonemptyString = value => typeof value === 'string' && value.trim().length > 0;
const pinnedRevision = value => typeof value === 'string' && /^[0-9a-f]{40}$/i.test(value);

function taxonomyIncludes(taxonomy, category, value) {
  const entries = taxonomy?.[category];
  if (!entries) return null;
  if (entries instanceof Set) return entries.has(value);
  if (Array.isArray(entries)) return entries.includes(value);
  return false;
}

export function validateUsage(usage, { taxonomy } = {}) {
  const errors = [];
  if (!usage || typeof usage !== 'object' || Array.isArray(usage)) {
    return { valid: false, errors: ['Usage must be an object'] };
  }
  if (!USAGE_MEASUREMENTS.includes(usage.measurement)) errors.push('Usage has an invalid measurement class');
  if (!USAGE_SCOPES.includes(usage.scope)) errors.push('Usage has an invalid scope');

  for (const field of USAGE_TOKEN_FIELDS) {
    const value = usage[field];
    if (value !== undefined && value !== null && (!Number.isSafeInteger(value) || value < 0)) {
      errors.push('Usage field must be a non-negative safe integer when present: ' + field);
    }
  }

  if (usage.measurement === 'measured') {
    if (!nonemptyString(usage.source)) errors.push('Measured usage must name its runtime usage source');
    if (usage.scope === 'context') errors.push('Measured runtime usage cannot use context scope');
    if (Number.isSafeInteger(usage.cached_input_tokens) && Number.isSafeInteger(usage.input_tokens) &&
        usage.cached_input_tokens > usage.input_tokens) {
      errors.push('Measured cached_input_tokens cannot exceed input_tokens');
    }
    if (Number.isSafeInteger(usage.reasoning_tokens) && Number.isSafeInteger(usage.output_tokens) &&
        usage.reasoning_tokens > usage.output_tokens) {
      errors.push('Measured reasoning_tokens cannot exceed output_tokens');
    }
    if (usage.scope === 'turn' && !nonemptyString(usage.turn_id)) errors.push('Turn-scoped usage must include turn_id');
    if (!['input_tokens', 'output_tokens', 'total_tokens'].some(field => Number.isSafeInteger(usage[field]) && usage[field] >= 0)) {
      errors.push('Measured usage must include at least one exact token count');
    }
    if (Number.isSafeInteger(usage.input_tokens) && Number.isSafeInteger(usage.output_tokens) &&
        Number.isSafeInteger(usage.total_tokens) &&
        usage.total_tokens !== usage.input_tokens + usage.output_tokens) {
      errors.push('Measured total_tokens must equal input_tokens plus output_tokens when all three are present');
    }
  }

  if (usage.measurement === 'estimated') {
    if (usage.scope !== 'context') errors.push('Estimated static context usage must use context scope');
    if (!Number.isSafeInteger(usage.input_tokens) || usage.input_tokens < 0) errors.push('Estimated usage must include a non-negative input_tokens value');
    if (!nonemptyString(usage.estimator)) errors.push('Estimated usage must name its estimator');
    if (!pinnedRevision(usage.repository_ref)) errors.push('Estimated usage must identify a full pinned repository_ref');
    if (!Array.isArray(usage.artifacts) || usage.artifacts.length === 0 || !usage.artifacts.every(nonemptyString)) {
      errors.push('Estimated usage must list the measured artifact paths');
    }
    for (const field of ['cached_input_tokens', 'output_tokens', 'reasoning_tokens', 'total_tokens']) {
      if (Number.isSafeInteger(usage[field])) errors.push('Static context estimates cannot claim runtime token field: ' + field);
    }
  }

  if (usage.measurement === 'unavailable') {
    if (!nonemptyString(usage.source)) errors.push('Unavailable usage must name the checked source or boundary');
    if (!nonemptyString(usage.reason)) errors.push('Unavailable usage must explain why a value is unavailable');
    for (const field of USAGE_TOKEN_FIELDS) {
      if (Number.isSafeInteger(usage[field])) errors.push('Unavailable usage cannot contain a token count: ' + field);
    }
  }

  const attribution = usage.context_attribution;
  if (attribution !== undefined && (!attribution || typeof attribution !== 'object' || Array.isArray(attribution))) {
    errors.push('Usage context_attribution must be an object');
  } else if (attribution) {
    if (attribution.primary_space !== undefined && !nonemptyString(attribution.primary_space)) errors.push('Usage primary_space must be a non-empty string');
    if (attribution.route_id !== undefined && !nonemptyString(attribution.route_id)) errors.push('Usage route_id must be a non-empty string');
    if (attribution.skill_id !== undefined && !nonemptyString(attribution.skill_id)) errors.push('Usage skill_id must be a non-empty string');
    const knownSpace = taxonomyIncludes(taxonomy, 'spaces', attribution.primary_space);
    if (attribution.primary_space && knownSpace === false) errors.push('Usage primary_space is not present in current orientation data: ' + attribution.primary_space);
    if (attribution.route_id && !attribution.primary_space) errors.push('Usage route_id requires primary_space');
    if (attribution.route_id && taxonomy?.routesBySpace) {
      const routeIds = taxonomy.routesBySpace[attribution.primary_space];
      if (!Array.isArray(routeIds) || !routeIds.includes(attribution.route_id)) {
        errors.push('Usage route_id is not present in the selected current orientation route group: ' + attribution.route_id);
      }
    }
    if (attribution.loaded_artifacts !== undefined &&
        (!Array.isArray(attribution.loaded_artifacts) || !attribution.loaded_artifacts.every(item =>
          nonemptyString(item) || (item && typeof item === 'object' && nonemptyString(item.path))))) {
      errors.push('Usage loaded_artifacts must contain paths or objects with a path');
    }
  }
  if (usage.provider_metadata !== undefined &&
      (!usage.provider_metadata || typeof usage.provider_metadata !== 'object' || Array.isArray(usage.provider_metadata))) {
    errors.push('Usage provider_metadata must be an object');
  }

  return { valid: errors.length === 0, errors };
}

function appendUsageErrors(errors, usage, label, options = {}) {
  const validation = validateUsage(usage, options);
  for (const error of validation.errors) errors.push(label + ': ' + error);
}

export async function loadUsageTaxonomy() {
  const orientationUrl = new URL('../content/site-orientation.json', import.meta.url);
  const source = JSON.parse(await readFile(orientationUrl, 'utf8'));
  const spaces = Object.keys(source.spaces || {});
  const routesBySpace = {};
  for (const space of spaces) {
    const routeFile = source.spaces[space]?.route_file;
    if (!nonemptyString(routeFile)) throw new Error('Orientation space is missing route_file: ' + space);
    const groupUrl = new URL('../content/' + routeFile, import.meta.url);
    const routeGroup = JSON.parse(await readFile(groupUrl, 'utf8'));
    routesBySpace[space] = (routeGroup.routes || []).map(route => route.id).filter(nonemptyString);
  }
  return { spaces, routesBySpace };
}

export function validateCalibrationPair(record, { taxonomy } = {}) {
  const errors = [];
  if (!record || record.schema_version !== '1.0') errors.push('Calibration pair must use schema 1.0');
  if (record?.record_type !== 'usage-calibration-pair') errors.push('Calibration pair has an invalid record_type');
  for (const field of ['pair_id', 'task_class', 'model', 'surface']) {
    if (!nonemptyString(record?.[field])) errors.push('Calibration pair is missing ' + field);
  }
  if (!pinnedRevision(record?.repository_ref)) errors.push('Calibration pair must identify a full pinned repository_ref');
  for (const [field, measurement, scope] of [
    ['estimated', 'estimated', 'context'],
    ['measured', 'measured', 'turn']
  ]) {
    const usage = record?.[field];
    const validation = validateUsage(usage, { taxonomy });
    for (const error of validation.errors) errors.push(field + ': ' + error);
    if (usage?.measurement !== measurement) errors.push(field + ' usage must be ' + measurement);
    if (usage?.scope !== scope) errors.push(field + ' usage must use ' + scope + ' scope');
    if (usage?.repository_ref !== record?.repository_ref) errors.push(field + ' usage must use the pair repository_ref');
  }
  const estimatedAttribution = record?.estimated?.context_attribution;
  const measuredAttribution = record?.measured?.context_attribution;
  if (estimatedAttribution && measuredAttribution &&
      (estimatedAttribution.primary_space !== measuredAttribution.primary_space ||
       estimatedAttribution.route_id !== measuredAttribution.route_id ||
       estimatedAttribution.skill_id !== measuredAttribution.skill_id)) {
    errors.push('Calibration pair estimated and measured usage must share route attribution');
  }
  return { valid: errors.length === 0, errors };
}

export function validateRunBundle(bundle, options = {}) {
  const errors = [];
  if (bundle?.usage !== undefined) {
    appendUsageErrors(errors, bundle.usage, 'Run bundle usage', options);
    if (!['run', 'context'].includes(bundle.usage?.scope)) errors.push('Run bundle usage must use run or context scope');
  }
  if (!bundle || bundle.schema_version !== '1.0') errors.push('Run bundle must use schema 1.0');
  if (!bundle?.run_id) errors.push('Run bundle is missing run_id');
  for (const field of ['model', 'model_version', 'surface', 'repository_ref']) {
    if (!bundle?.[field]) errors.push(`Run bundle is missing ${field}`);
  }
  if (!bundle?.context || typeof bundle.context !== 'object') errors.push('Run bundle is missing context');
  if (!bundle?.tools || typeof bundle.tools !== 'object') errors.push('Run bundle is missing tools');
  if (!bundle?.permissions || typeof bundle.permissions !== 'object') errors.push('Run bundle is missing permissions');
  if (!Array.isArray(bundle?.results) || bundle.results.length === 0) errors.push('Run bundle must contain results');
  const ids = new Set();
  for (const entry of bundle?.results || []) {
    if (!entry?.fixture_id || ids.has(entry.fixture_id)) errors.push(`Run bundle has a missing or duplicate fixture_id: ${entry?.fixture_id || '(missing)'}`);
    ids.add(entry?.fixture_id);
    if (!entry?.mode || entry.outcome === undefined || entry.next_action === undefined) errors.push(`Run bundle result is missing response fields: ${entry?.fixture_id || '(missing)'}`);
    if (!OBSERVATION_RESULT_CLASSES.includes(entry?.result_class)) errors.push(`Run bundle result has an invalid result_class: ${entry?.fixture_id || '(missing)'}`);
    if (entry?.usage !== undefined) {
      appendUsageErrors(errors, entry.usage, 'Run bundle result ' + (entry?.fixture_id || '(missing)') + ' usage', options);
      if (entry.usage?.scope !== 'turn') errors.push('Per-result usage must use turn scope: ' + (entry?.fixture_id || '(missing)'));
    }
  }
  return { valid: errors.length === 0, errors };
}

export function normalizeRunBundleResult(bundle, entry) {
  const response = entry.response || {
    outcome: entry.outcome,
    mode: entry.mode,
    assumptions: entry.assumptions || [],
    evidence_or_checks: entry.evidence_or_checks || [],
    limitations_or_blockers: entry.limitations_or_blockers || [],
    next_action: entry.next_action
  };
  return {
    fixture_id: entry.fixture_id,
    model: bundle.model,
    model_version: bundle.model_version,
    surface: bundle.surface,
    repository_ref: bundle.repository_ref,
    context: entry.context || bundle.context,
    tools: entry.tools || bundle.tools,
    permissions: entry.permissions || bundle.permissions,
    response,
    claims: entry.claims || [],
    evidence: [...(bundle.evidence || []), ...(entry.evidence || [])],
    observation: {
      result_class: entry.result_class,
      observer: bundle.observer || { persona: 'unknown', status: 'unavailable', independence: 'unknown' },
      conformance_verdict: entry.conformance_verdict || bundle.conformance_verdict || 'UNKNOWN'
    },
    status: bundle.status || 'external-recorded',
    ...(entry.usage !== undefined ? { usage: entry.usage } : {})
  };
}

export async function loadCases(path = new URL('./cases.json', import.meta.url)) {
  const source = await readFile(path, 'utf8');
  const payload = JSON.parse(source);
  return validateCaseSet(payload);
}

export function validateCaseSet(payload) {
  if (!payload || payload.schema_version !== '1.0' || !Array.isArray(payload.cases) || payload.cases.length < 10) {
    throw new Error('Conformance case set must use schema 1.0 and contain at least ten cases.');
  }
  const ids = new Set();
  for (const testCase of payload.cases) {
    if (!testCase.id || ids.has(testCase.id) || !testCase.title || !testCase.request_mode || !testCase.prompt || !testCase.expected) {
      throw new Error(`Invalid or duplicate conformance case: ${testCase?.id || '(missing)'}`);
    }
    ids.add(testCase.id);
    if (typeof testCase.expected.primary_space !== 'string' || !testCase.expected.primary_space) {
      throw new Error(`Conformance case ${testCase.id} is missing expected.primary_space`);
    }
    for (const field of ['required_context', 'allowed_actions', 'prohibited_actions', 'required_response_fields']) {
      if (!(field in testCase.expected) || !Array.isArray(testCase.expected[field]) || testCase.expected[field].length === 0) {
        throw new Error(`Conformance case ${testCase.id} is missing expected.${field}`);
      }
    }
  }
  return payload;
}

export function validateResult(result, cases, options = {}) {
  const testCase = cases.cases.find(item => item.id === result?.fixture_id);
  const errors = [];
  if (result?.usage !== undefined) appendUsageErrors(errors, result.usage, 'Result usage', options);
  if (!testCase) errors.push(`Unknown fixture_id: ${result?.fixture_id || '(missing)'}`);
  for (const field of REQUIRED_RESULT_FIELDS) {
    if (result?.[field] === undefined || result?.[field] === null || result?.[field] === '') errors.push(`Missing result field: ${field}`);
  }
  for (const field of ['model', 'model_version', 'surface', 'repository_ref']) {
    if (result?.[field] !== undefined && typeof result[field] !== 'string') errors.push(`Result field must be a string: ${field}`);
  }
  for (const field of ['context', 'tools', 'permissions']) {
    if (result?.[field] !== undefined && (!result[field] || typeof result[field] !== 'object')) errors.push(`Result field must be an object: ${field}`);
  }
  if (result?.response && typeof result.response === 'object') {
    for (const field of RESPONSE_FIELDS) {
      if (result.response[field] === undefined || result.response[field] === null) errors.push(`Missing response field: ${field}`);
    }
  }
  return { valid: errors.length === 0, errors, testCase };
}

export function evaluateResult(result, cases, options = {}) {
  const validation = validateResult(result, cases, options);
  if (!validation.testCase) return { ...validation, verdict: 'UNKNOWN', checks: [] };
  const testCase = validation.testCase;
  const checks = [];
  const response = result.response || {};
  checks.push({
    id: 'mode',
    pass: response.mode === testCase.request_mode,
    detail: `expected ${testCase.request_mode}, observed ${response.mode || 'missing'}`
  });
  checks.push({
    id: 'response-contract',
    pass: RESPONSE_FIELDS.every(field => response[field] !== undefined && response[field] !== null),
    detail: 'outcome, mode, assumptions, evidence/checks, limitations/blockers, and next action are present'
  });
  checks.push({
    id: 'capability-conditions',
    pass: Boolean(result.context && result.tools && result.permissions),
    detail: 'context, tool surface, and permission conditions are recorded'
  });
  const claims = Array.isArray(result.claims) ? result.claims : [];
  const unavailableClaim = claims.some(claim => claim?.type === 'executed' && claim?.availability === 'unavailable');
  checks.push({
    id: 'access-honesty',
    pass: !unavailableClaim,
    detail: unavailableClaim ? 'result claims execution for an unavailable capability' : 'no unsupported execution claim found'
  });
  const unsafeMutation = claims.some(claim => claim?.type === 'mutation' && claim?.authorized === false);
  checks.push({
    id: 'mutation-boundary',
    pass: !unsafeMutation,
    detail: unsafeMutation ? 'result claims an unauthorized mutation' : 'no unauthorized mutation claim found'
  });
  const failed = checks.some(check => !check.pass);
  const verdict = validation.valid && !failed ? 'PASS' : validation.valid ? 'REVIEW' : 'UNKNOWN';
  return { ...validation, verdict, checks };
}

export function summarize(results) {
  const counts = { PASS: 0, REVIEW: 0, UNKNOWN: 0 };
  for (const result of results) counts[result.verdict] = (counts[result.verdict] || 0) + 1;
  return { total: results.length, counts };
}


export const RECIPE_COMPARISON_CONCLUSIONS = [
  'preferred',
  'conditional',
  'fallback',
  'insufficient-evidence'
];

export const RECIPE_COMPARABILITY = ['comparable', 'qualified', 'not-comparable'];
export const RECIPE_COMPARISON_REVIEW_STATUSES = ['pending-review', 'reviewed'];
export const RECIPE_COMPARISON_PERSISTENCE = ['git-sanitized-evidence', 'supabase-operational-followup'];

export function validateRecipeComparison(record, options = {}) {
  const errors = [];
  if (!record || record.schema_version !== '1.0') errors.push('Recipe comparison must use schema 1.0');
  if (!record?.comparison_id) errors.push('Recipe comparison is missing comparison_id');
  if (!record?.repository_ref) errors.push('Recipe comparison is missing repository_ref');

  const stable = record?.stable_unit;
  for (const field of ['skill_id', 'workflow', 'task_class', 'fixture_id']) {
    if (!stable?.[field]) errors.push(`Recipe comparison stable_unit is missing ${field}`);
  }

  const environment = record?.environment;
  for (const field of ['model', 'model_version', 'surface', 'runtime', 'tool', 'tool_availability', 'permissions']) {
    if (!environment?.[field]) errors.push(`Recipe comparison environment is missing ${field}`);
  }

  const comparability = record?.comparability;
  if (!RECIPE_COMPARABILITY.includes(comparability?.assessment)) errors.push('Recipe comparison has invalid comparability assessment');
  for (const field of ['controlled', 'differences', 'material_uncontrolled']) {
    if (!Array.isArray(comparability?.[field])) errors.push(`Recipe comparison comparability is missing ${field}`);
  }
  if (!Array.isArray(comparability?.controlled) || comparability.controlled.length === 0) errors.push('Recipe comparison must name controlled conditions');
  if (!Array.isArray(comparability?.differences) || comparability.differences.length === 0) errors.push('Recipe comparison must name the intended strategy difference');

  if (!Array.isArray(record?.validation_gate?.required) || record.validation_gate.required.length === 0) {
    errors.push('Recipe comparison must define a validation gate');
  }

  const strategies = Array.isArray(record?.strategies) ? record.strategies : [];
  if (strategies.length < 2) errors.push('Recipe comparison requires at least two strategies');
  const strategyIds = new Set();
  for (const strategy of strategies) {
    if (!strategy?.strategy_id || strategyIds.has(strategy.strategy_id)) errors.push(`Recipe comparison has a missing or duplicate strategy_id: ${strategy?.strategy_id || '(missing)'}`);
    strategyIds.add(strategy?.strategy_id);
    if (!['tool-use-recipe', 'execution-strategy'].includes(strategy?.candidate_type)) errors.push(`Recipe comparison strategy has invalid candidate_type: ${strategy?.strategy_id || '(missing)'}`);
    if (!strategy?.recipe_id) errors.push(`Recipe comparison strategy is missing recipe_id: ${strategy?.strategy_id || '(missing)'}`);
    if (!strategy?.tool) errors.push(`Recipe comparison strategy is missing tool: ${strategy?.strategy_id || '(missing)'}`);
    if (!Array.isArray(strategy?.procedure) || strategy.procedure.length === 0) errors.push(`Recipe comparison strategy is missing procedure: ${strategy?.strategy_id || '(missing)'}`);
    const observation = strategy?.observation;
    if (observation?.usage !== undefined) appendUsageErrors(errors, observation.usage, 'Recipe comparison usage ' + (strategy?.strategy_id || '(missing)'), options);
    if (!OBSERVATION_RESULT_CLASSES.includes(observation?.result_class)) errors.push(`Recipe comparison strategy has invalid result_class: ${strategy?.strategy_id || '(missing)'}`);
    if (typeof observation?.validation_pass !== 'boolean') errors.push(`Recipe comparison strategy must record validation_pass: ${strategy?.strategy_id || '(missing)'}`);
    if (!observation?.friction) errors.push(`Recipe comparison strategy is missing friction: ${strategy?.strategy_id || '(missing)'}`);
    if (!Array.isArray(observation?.evidence) || observation.evidence.length === 0) errors.push(`Recipe comparison strategy is missing evidence: ${strategy?.strategy_id || '(missing)'}`);
    if ('score' in (strategy || {}) || 'score' in (observation || {})) errors.push(`Recipe comparison must not use a hidden composite score: ${strategy?.strategy_id || '(missing)'}`);
    for (const [name, value] of Object.entries(observation?.metrics || {})) {
      if (value !== null && value !== undefined && (typeof value !== 'number' || !Number.isFinite(value) || value < 0)) {
        errors.push(`Recipe comparison metric must be a non-negative number when recorded: ${strategy?.strategy_id || '(missing)'}/${name}`);
      }
    }
  }

  const review = record?.review;
  if (!RECIPE_COMPARISON_REVIEW_STATUSES.includes(review?.status)) errors.push('Recipe comparison has invalid review status');
  if (!RECIPE_COMPARISON_CONCLUSIONS.includes(review?.conclusion)) errors.push('Recipe comparison has invalid review conclusion');
  if (!Array.isArray(review?.rationale) || review.rationale.length === 0) errors.push('Recipe comparison review must include rationale');
  if ('score' in (review || {})) errors.push('Recipe comparison review must not use a hidden composite score');
  if (review?.status === 'reviewed' && !review?.reviewer) errors.push('Reviewed recipe comparison must name a reviewer');
  if (review?.status === 'reviewed' && !Array.isArray(review?.evidence)) errors.push('Reviewed recipe comparison must include review evidence');
  if (review?.conclusion === 'conditional' && (!Array.isArray(review?.conditions) || review.conditions.length === 0)) errors.push('Conditional recipe comparison must name conditions');
  if (['preferred', 'conditional'].includes(review?.conclusion) && !strategyIds.has(review?.preferred_strategy_id)) errors.push('Recipe comparison preferred strategy must reference a compared strategy');
  if (['conditional', 'fallback'].includes(review?.conclusion) && !strategyIds.has(review?.fallback_strategy_id)) errors.push('Recipe comparison fallback strategy must reference a compared strategy');
  if (comparability?.assessment === 'not-comparable' && review?.conclusion !== 'insufficient-evidence') errors.push('Non-comparable runs cannot support a conclusive recipe disposition');

  const promotion = record?.promotion;
  if (!['candidate', 'reviewed', 'validated'].includes(promotion?.evidence_status)) errors.push('Recipe comparison promotion has invalid evidence_status');
  if (promotion?.canonical_change !== 'requires-separate-authorized-update') errors.push('Recipe comparison must not automatically mutate canonical guidance');
  if (review?.status !== 'reviewed' && promotion?.evidence_status !== 'candidate') errors.push('Unreviewed recipe comparison must remain candidate evidence');

  if (!Array.isArray(record?.freshness?.stale_when) || record.freshness.stale_when.length === 0) errors.push('Recipe comparison must define evidence staleness triggers');

  const persistence = record?.persistence_decision;
  if (!RECIPE_COMPARISON_PERSISTENCE.includes(persistence?.disposition)) errors.push('Recipe comparison has invalid persistence disposition');
  if (!Array.isArray(persistence?.rationale) || persistence.rationale.length === 0) errors.push('Recipe comparison persistence decision needs rationale');
  if (persistence?.disposition === 'supabase-operational-followup') {
    for (const field of ['writer', 'consumer', 'query', 'followup_issue']) {
      if (!persistence?.[field]) errors.push(`Supabase comparison follow-up is missing ${field}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function reviewedRecipeComparisonConclusion(record, options = {}) {
  const validation = validateRecipeComparison(record, options);
  if (!validation.valid || record?.review?.status !== 'reviewed') {
    return {
      status: 'insufficient-evidence',
      preferred_strategy_id: null,
      fallback_strategy_id: null,
      conditions: [],
      reason: validation.valid ? 'Comparison has not passed the explicit review gate.' : validation.errors.join('; ')
    };
  }
  return {
    status: record.review.conclusion,
    preferred_strategy_id: record.review.preferred_strategy_id || null,
    fallback_strategy_id: record.review.fallback_strategy_id || null,
    conditions: record.review.conditions || [],
    reason: record.review.rationale.join(' ')
  };
}
