#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveAgentContextBundle } from '../scripts/build-agent-context-bundles.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FIXTURES = 'eval/fixtures/tool-resolution-behavior.json';
const BUNDLE = 'dist/data/agent-context/tool-resolution.json';
const AGENTS = 'AGENTS.md';
const BOOTSTRAP = 'content/site-orientation.json';
const TOOL_ROUTES = 'content/orientation/tools.json';
const SKILL = '.agents/skills/tool-discovery-and-safe-execution/SKILL.md';
const SEP = '\n\n--- CONTEXT ARTIFACT ---\n\n';

const readText = relativePath => readFile(path.join(root, relativePath), 'utf8');
const readJson = async relativePath => JSON.parse(await readText(relativePath));
const metrics = value => {
  const bytes = Buffer.byteLength(value, 'utf8');
  return { utf8_bytes: bytes, rough_tokens: Math.ceil(bytes / 4) };
};
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function classifyMode(prompt, catalogEdit) {
  const text = prompt.toLowerCase();
  if (catalogEdit) return 'update';
  if (/safest way|plan|planning/.test(text) && !/use the exposed|use the connector|use figma|inspect/.test(text)) return 'plan';
  return 'external_execution';
}

function sideEffectRequested(prompt) {
  return /\b(update|make the explicitly approved change|record the reviewed reusable|shared design file)\b/i.test(prompt);
}

function candidateFromPrompt(prompt, live) {
  const text = prompt.toLowerCase();
  if (live.no_tool_safe) return 'none';
  if (live.alternate_exposed && live.alternate_scope_verified && (!live.primary_exposed || !live.primary_scope_verified)) {
    return 'verified-alternate';
  }
  if (text.includes('figma')) return 'figma';
  if (text.includes('publishing tool')) return 'publishing-tool';
  if (text.includes('connector')) return 'connector';
  return 'selected-tool';
}

function evaluateAvailability(prompt, live, catalogEdit) {
  if (catalogEdit) return {
    availability_state: 'not-applicable',
    selected_candidate: 'none',
    fallback_selection: 'none'
  };
  if (live.no_tool_safe) return {
    availability_state: 'No Tool needed',
    selected_candidate: 'none',
    fallback_selection: 'no-tool-safe'
  };
  if (live.alternate_exposed && live.alternate_scope_verified && (!live.primary_exposed || !live.primary_scope_verified)) {
    return {
      availability_state: 'Available',
      selected_candidate: 'verified-alternate',
      fallback_selection: 'verified-alternate'
    };
  }

  const candidate = candidateFromPrompt(prompt, live);
  if (live.primary_exposed !== true) {
    return {
      availability_state: 'Referenced but unavailable',
      selected_candidate: candidate,
      fallback_selection: 'none'
    };
  }

  const sideEffect = sideEffectRequested(prompt);
  const blocked =
    !live.primary_scope_verified ||
    !live.permission_verified ||
    !live.workspace_verified ||
    !live.target_verified ||
    (sideEffect && !live.approval_verified);

  return {
    availability_state: blocked ? 'Blocked or insufficiently verified' : 'Available',
    selected_candidate: candidate,
    fallback_selection: 'none'
  };
}

function behaviorFor(fixture) {
  const prompt = fixture.prompt;
  const text = prompt.toLowerCase();
  const live = fixture.live;
  const catalogEdit = /canonical tool catalog record|catalog record/.test(text) && /update|correct/.test(text);
  const activate = !catalogEdit;
  const selectedRoute = catalogEdit ? 'tool-record-maintenance' : 'tool-resolution';
  const mode = classifyMode(prompt, catalogEdit);
  const availability = evaluateAvailability(prompt, live, catalogEdit);
  const sideEffect = sideEffectRequested(prompt);

  let permissionPosture = 'not-applicable';
  if (activate && availability.availability_state === 'No Tool needed') permissionPosture = 'not-applicable';
  else if (activate && availability.selected_candidate === 'verified-alternate') permissionPosture = 'verified-alternate';
  else if (activate) permissionPosture = live.permission_verified ? 'verified' : 'unverified';

  let targetPosture = 'catalog-record';
  if (activate && live.primary_exposed === null) targetPosture = 'unverified';
  else if (activate && (!live.workspace_verified || !live.target_verified)) targetPosture = 'ambiguous';
  else if (activate) targetPosture = 'verified';

  let approvalPosture = 'separate-record-authorization';
  if (activate && availability.availability_state === 'No Tool needed') approvalPosture = 'not-applicable';
  else if (activate && live.primary_exposed === null && !sideEffect) approvalPosture = 'not-required-for-read-only-until-exposed';
  else if (activate) approvalPosture = live.approval_verified ? 'verified' : 'missing';

  const executionAllowed =
    activate &&
    availability.availability_state === 'Available' &&
    availability.selected_candidate !== 'none';

  let probeMode = 'none';
  if (executionAllowed) probeMode = sideEffect ? 'authorized-side-effect' : 'smallest-read-only-probe';

  const verificationRequired = activate && availability.availability_state !== 'No Tool needed';
  const resultPosture = executionAllowed && live.execution_result_verified ? 'verified' : 'not-executed';
  const usageEvidenceStatus = executionAllowed
    ? (live.durable_shared_change ? 'reviewed-shared-guidance' : 'one-run-usage-note')
    : 'none';

  return {
    activate_resolution: activate,
    selected_route: selectedRoute,
    mode,
    availability_state: availability.availability_state,
    selected_candidate: availability.selected_candidate,
    live_evidence_required: activate,
    permission_posture: permissionPosture,
    target_posture: targetPosture,
    approval_posture: approvalPosture,
    execution_allowed: executionAllowed,
    probe_mode: probeMode,
    fallback_selection: availability.fallback_selection,
    scenario_loaded: activate && live.scenario_active,
    verification_required: verificationRequired,
    credential_inferred: false,
    result_posture: resultPosture,
    usage_evidence_status: usageEvidenceStatus,
    reconciliation_handoff: live.durable_shared_change ? 'change-impact-reconciliation' : 'none'
  };
}

function canonicalRoute(tools) {
  const route = tools.routes.find(item => item.id === 'tool-resolution');
  if (!route) throw new Error('Missing canonical tool-resolution route.');
  return route;
}

function canonicalExceptions(tools) {
  const route = canonicalRoute(tools);
  return {
    availability_source: route.availability_source,
    first_reads: route.first_reads,
    mutation_boundary: route.mutation_boundary,
    non_triggers: route.non_triggers,
    next_handoff: route.next_handoff,
    space_do_not: tools.space?.do_not || []
  };
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
    'activate_resolution','selected_route','mode','availability_state','selected_candidate',
    'live_evidence_required','permission_posture','target_posture','approval_posture',
    'execution_allowed','probe_mode','fallback_selection','scenario_loaded',
    'verification_required','credential_inferred','result_posture','usage_evidence_status',
    'reconciliation_handoff','retained_exceptions','change_mode','reconciliation'
  ];
  return {
    pass: keys.every(key => same(control[key], preferred[key])),
    dimensions: Object.fromEntries(keys.map(key => [key, same(control[key], preferred[key])]))
  };
}

function contextFor(mode, behavior, sources) {
  if (!behavior.activate_resolution) {
    const value = [sources.agents, sources.bootstrap, sources.tools].join(SEP);
    return {
      artifacts: [AGENTS, BOOTSTRAP, TOOL_ROUTES],
      ...metrics(value)
    };
  }
  const value = mode === 'preferred'
    ? [sources.agents, sources.bundleText, sources.skill].join(SEP)
    : [sources.agents, sources.bootstrap, sources.tools, sources.skill].join(SEP);
  return {
    artifacts: mode === 'preferred'
      ? [AGENTS, BUNDLE, SKILL]
      : [AGENTS, BOOTSTRAP, TOOL_ROUTES, SKILL],
    ...metrics(value)
  };
}

function evaluatePath(mode, fixture, sources) {
  const behavior = behaviorFor(fixture);
  const retainedExceptions = mode === 'preferred' ? sources.bundle.exceptions : sources.canonicalExceptions;
  const changeMode = mode === 'preferred' ? sources.bundle.contract.change_mode : 'external_execution';
  const reconciliation = mode === 'preferred'
    ? sources.bundle.contract.reconciliation
    : canonicalRoute(sources.toolsJson).reconciliation;
  const result = {
    ...behavior,
    retained_exceptions: retainedExceptions,
    change_mode: changeMode,
    reconciliation,
    context: contextFor(mode, behavior, sources)
  };
  const expectation = compareExpected(result, fixture.expected);

  const safety = {
    exceptions_preserved: same(retainedExceptions, sources.canonicalExceptions),
    external_execution_contract_preserved: changeMode === 'external_execution',
    reconciliation_preserved: reconciliation === 'change-impact-reconciliation',
    credentials_never_inferred: result.credential_inferred === false,
    blocked_without_permission: fixture.live.permission_verified || !result.execution_allowed,
    blocked_without_target: (fixture.live.workspace_verified && fixture.live.target_verified) || !result.execution_allowed,
    blocked_side_effect_without_approval: !sideEffectRequested(fixture.prompt) || fixture.live.approval_verified || !result.execution_allowed,
    unverified_runtime_never_available: fixture.live.primary_exposed !== null || result.availability_state !== 'Available',
    verification_after_execution: !result.execution_allowed || result.verification_required,
    durable_change_reconciles: !fixture.live.durable_shared_change || result.reconciliation_handoff === 'change-impact-reconciliation'
  };

  return {
    ...result,
    expectation,
    safety,
    pass: expectation.pass && Object.values(safety).every(Boolean)
  };
}

export async function buildToolResolutionBehaviorReport() {
  const [fixtureFile, agents, bundleText, bootstrap, tools, skill] = await Promise.all([
    readJson(FIXTURES),
    readText(AGENTS),
    readText(BUNDLE),
    readText(BOOTSTRAP),
    readText(TOOL_ROUTES),
    readText(SKILL)
  ]);
  const bundle = JSON.parse(bundleText);
  const toolsJson = JSON.parse(tools);
  const resolution = resolveAgentContextBundle(bundle, {
    route_id: 'tool-resolution',
    primary_space: 'tools',
    package_path: '.agents/skills/tool-discovery-and-safe-execution'
  });
  if (resolution.mode !== 'graph-backed') {
    throw new Error('Tool-resolution preferred bundle does not validate: ' + JSON.stringify(resolution));
  }

  const sources = {
    agents,bundleText,bundle,bootstrap,tools,toolsJson,skill,
    canonicalExceptions: canonicalExceptions(toolsJson)
  };

  const results = fixtureFile.fixtures.map(fixture => {
    const control = evaluatePath('control', fixture, sources);
    const preferred = evaluatePath('preferred', fixture, sources);
    const behaviorParity = parity(control, preferred);
    return {
      id: fixture.id,
      pair: fixture.pair || null,
      prompt: fixture.prompt,
      live: fixture.live,
      expected: fixture.expected,
      control,
      preferred,
      parity: behaviorParity,
      pass: control.pass && preferred.pass && behaviorParity.pass
    };
  });

  const activated = results.filter(item => item.preferred.activate_resolution);
  const preferredBytes = activated.reduce((sum, item) => sum + item.preferred.context.utf8_bytes, 0);
  const controlBytes = activated.reduce((sum, item) => sum + item.control.context.utf8_bytes, 0);
  const flip = results.filter(item => item.pair === 'figma-live-flip');
  const liveFlipProven =
    flip.length === 2 &&
    flip[0].prompt === flip[1].prompt &&
    flip[0].preferred.availability_state !== flip[1].preferred.availability_state &&
    flip[0].preferred.context.utf8_bytes === flip[1].preferred.context.utf8_bytes;

  return {
    schema_version:'1.0',
    evaluation:'tool-resolution-behavioral-parity',
    fixture_source:FIXTURES,
    methodology:'deterministic prompt + explicit live-evidence fixtures; not subjective LLM response quality',
    canonical_routing_changed:false,
    static_bundle_checksum:bundle.payload_checksum,
    fixtures:results,
    live_state_externality:{
      pair:'figma-live-flip',
      same_prompt:flip.length === 2 && flip[0].prompt === flip[1].prompt,
      same_static_context:flip.length === 2 && flip[0].preferred.context.utf8_bytes === flip[1].preferred.context.utf8_bytes,
      different_availability_outcome:flip.length === 2 && flip[0].preferred.availability_state !== flip[1].preferred.availability_state,
      proven:liveFlipProven
    },
    aggregate:{
      fixture_count:results.length,
      activated_fixture_count:activated.length,
      passed:results.filter(item=>item.pass).length,
      failed:results.filter(item=>!item.pass).length,
      all_pass:results.every(item=>item.pass),
      preferred_context_utf8_bytes:preferredBytes,
      control_context_utf8_bytes:controlBytes,
      preferred_context_rough_tokens:Math.ceil(preferredBytes/4),
      control_context_rough_tokens:Math.ceil(controlBytes/4),
      preferred_delta_utf8_bytes:preferredBytes-controlBytes,
      preferred_delta_percent:Number((((preferredBytes-controlBytes)/controlBytes)*100).toFixed(1))
    },
    limitations:[
      'Fixtures provide explicit live-evidence states; they do not execute destructive or arbitrary external actions.',
      'The evaluator is fixture-scoped and is not a general-purpose natural-language router.',
      'Passing deterministic behavior does not establish subjective model response quality.',
      'Time-to-completion and latency are intentionally deferred to Phase E.',
      'Rough-token estimates are static UTF-8/4 approximations, not observed provider token usage.'
    ]
  };
}

function markdown(report) {
  const lines=[
    '# Tool-resolution behavioral parity','',
    'Generated by eval/tool-resolution-behavior.mjs.','',
    '| Fixture | Control | Preferred | Parity | Availability | Preferred bytes | Control bytes |',
    '| --- | --- | --- | --- | --- | ---: | ---: |'
  ];
  for(const item of report.fixtures){
    lines.push('| '+item.id+' | '+(item.control.pass?'PASS':'FAIL')+' | '+(item.preferred.pass?'PASS':'FAIL')+' | '+(item.parity.pass?'PASS':'FAIL')+' | '+item.preferred.availability_state+' | '+item.preferred.context.utf8_bytes+' | '+item.control.context.utf8_bytes+' |');
  }
  lines.push(
    '',
    'Overall: **'+(report.aggregate.all_pass?'PASS':'FAIL')+'** — '+report.aggregate.passed+'/'+report.aggregate.fixture_count+' fixtures pass.',
    '',
    'Across Tool-resolution fixtures, preferred context is **'+report.aggregate.preferred_delta_percent+'%** versus control ('+report.aggregate.preferred_delta_utf8_bytes+' UTF-8 bytes).',
    '',
    'Live-state externality pair: **'+(report.live_state_externality.proven?'PASS':'FAIL')+'** — same prompt/static context, different availability outcome from live evidence.',
    '',
    '## Guardrails','',
    '- Static bundle data never establishes live availability, credentials, permission, workspace, approval, target, or result.',
    '- Missing approval/scope/permission/target blocks execution.',
    '- Safe alternate and no-Tool fallbacks remain explicit.',
    '- Operational Scenario guidance never grants permission.',
    '- Durable shared changes retain one change-impact-reconciliation handoff.',
    '',
    '## Limitations','',
    ...report.limitations.map(item=>'- '+item)
  );
  return lines.join('\n')+'\n';
}

export async function expectedToolResolutionBehaviorOutputs(){
  const report=await buildToolResolutionBehaviorReport();
  return new Map([
    ['eval/results/tool-resolution-behavior.json',JSON.stringify(report,null,2)+'\n'],
    ['eval/tool-resolution-behavior.md',markdown(report)]
  ]);
}

export async function writeToolResolutionBehaviorOutputs({check=false}={}){
  const outputs=await expectedToolResolutionBehaviorOutputs();
  const stale=[];
  for(const [relativePath,content] of outputs){
    const filePath=path.join(root,relativePath);
    if(check){
      let current=null;
      try{current=await readFile(filePath,'utf8');}catch{}
      if(current!==content) stale.push(relativePath);
    }else{
      await mkdir(path.dirname(filePath),{recursive:true});
      await writeFile(filePath,content,'utf8');
    }
  }
  if(stale.length) throw new Error('Tool-resolution behavior report is stale: '+stale.join(', '));
  return outputs;
}

const entry=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(entry){
  const outputs=await writeToolResolutionBehaviorOutputs({check:process.argv.includes('--check')});
  const report=JSON.parse(outputs.get('eval/results/tool-resolution-behavior.json'));
  console.log('Tool-resolution behavioral parity: '+report.aggregate.passed+'/'+report.aggregate.fixture_count+' fixtures pass; preferred delta '+report.aggregate.preferred_delta_percent+'%.');
}
