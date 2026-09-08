#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const enumValues = {
  status: new Set(['active', 'blocked', 'completed']),
  participantStatus: new Set(['available', 'unavailable']),
  evidenceStatus: new Set(['observed', 'sourced', 'inferred', 'proposed', 'unknown']),
  disposition: new Set(['adopted', 'modified', 'rejected', 'unresolved']),
  gateStatus: new Set(['pass', 'fail', 'defer']),
  artifactStatus: new Set(['proposed', 'draft', 'reviewed', 'approved', 'published'])
};

function fail(message) {
  console.error(`problem-context: ${message}`);
  process.exitCode = 1;
}

function now() {
  return new Date().toISOString();
}

function id(prefix) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function requireValue(value, flag) {
  if (value === undefined || value === null || String(value).trim() === '') {
    throw new Error(`missing required ${flag}`);
  }
  return String(value).trim();
}

function parseArgs(argv) {
  const positional = [];
  const options = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      positional.push(token);
      continue;
    }
    const name = token.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      options[name] = true;
      continue;
    }
    if (Object.hasOwn(options, name)) {
      options[name] = Array.isArray(options[name]) ? [...options[name], next] : [options[name], next];
    } else {
      options[name] = next;
    }
    i += 1;
  }
  return { positional, options };
}

function values(options, name) {
  const value = options[name];
  if (value === undefined) return [];
  return Array.isArray(value) ? value.map(String) : [String(value)];
}

function readContext(file) {
  const resolved = path.resolve(file);
  if (!fs.existsSync(resolved)) throw new Error(`context file not found: ${file}`);
  try {
    return { resolved, context: JSON.parse(fs.readFileSync(resolved, 'utf8')) };
  } catch (error) {
    throw new Error(`cannot parse context ${file}: ${error.message}`);
  }
}

function writeContext(resolved, context, action, details = {}) {
  context.updated_at = now();
  context.revisions.push({
    revision: context.revisions.length + 1,
    at: context.updated_at,
    action,
    details
  });
  fs.writeFileSync(resolved, `${JSON.stringify(context, null, 2)}\n`, 'utf8');
}

function mutate(file, action, details, callback) {
  const { resolved, context } = readContext(file);
  if (context.status === 'completed') throw new Error('context is completed; create a new context for further work');
  callback(context);
  writeContext(resolved, context, action, details);
  return context;
}

function participant(context, participantId) {
  const result = context.participants.find(item => item.id === participantId);
  if (!result) throw new Error(`unknown participant: ${participantId}`);
  return result;
}

function assertUnique(items, field, label) {
  const seen = new Set();
  for (const item of items) {
    if (!item || typeof item[field] !== 'string' || item[field].trim() === '') throw new Error(`${label} has a missing ${field}`);
    if (seen.has(item[field])) throw new Error(`${label} contains duplicate ${field}: ${item[field]}`);
    seen.add(item[field]);
  }
}

function validateContext(context, { complete = false } = {}) {
  const errors = [];
  const warnings = [];
  const required = ['schema_version', 'context_id', 'status', 'created_at', 'updated_at', 'request', 'participants', 'playbook', 'evidence', 'contributions', 'decisions', 'artifacts', 'handoffs', 'gates', 'open_questions', 'blockers', 'next_action', 'solution', 'authorization', 'revisions'];
  for (const key of required) if (!(key in context)) errors.push(`missing top-level field: ${key}`);
  if (context.schema_version !== '1.0') errors.push('schema_version must be 1.0');
  if (!enumValues.status.has(context.status)) errors.push(`invalid status: ${context.status}`);
  if (!context.context_id) errors.push('context_id is empty');
  const request = context.request ?? {};
  for (const key of ['requester', 'problem', 'desired_outcome', 'stopping_condition']) if (!String(request[key] ?? '').trim()) errors.push(`request.${key} is empty`);
  for (const key of ['scope', 'non_goals', 'constraints', 'success_criteria']) if (!Array.isArray(request[key])) errors.push(`request.${key} must be an array`);
  if (!Array.isArray(request.success_criteria) || request.success_criteria.length === 0) errors.push('request.success_criteria must contain at least one criterion');
  if (!Array.isArray(context.participants)) errors.push('participants must be an array');
  else {
    try { assertUnique(context.participants, 'id', 'participants'); } catch (error) { errors.push(error.message); }
    for (const item of context.participants) {
      if (!enumValues.participantStatus.has(item.status)) errors.push(`invalid participant status for ${item.id}: ${item.status}`);
      if (!String(item.role ?? '').trim()) errors.push(`participant ${item.id} has no role`);
      if (!String(item.responsibility ?? '').trim()) errors.push(`participant ${item.id} has no responsibility`);
      if (typeof item.write_scope !== 'string') errors.push(`participant ${item.id} has no write_scope`);
    }
  }
  if (!context.playbook?.name || !context.playbook?.stage || !context.playbook?.owner) errors.push('playbook must include name, stage, and owner');
  for (const listName of ['evidence', 'contributions', 'decisions', 'artifacts', 'handoffs', 'gates', 'revisions']) {
    if (!Array.isArray(context[listName])) errors.push(`${listName} must be an array`);
  }
  if (!String(context.next_action ?? '').trim()) errors.push('next_action is empty');
  if (Array.isArray(context.contributions)) {
    try { assertUnique(context.contributions, 'id', 'contributions'); } catch (error) { errors.push(error.message); }
    const ids = new Set((context.participants ?? []).map(item => item.id));
    for (const item of context.contributions) {
      if (!ids.has(item.participant_id)) errors.push(`contribution ${item.id ?? '<missing>'} names unknown participant ${item.participant_id}`);
      if (!enumValues.evidenceStatus.has(item.evidence_status)) errors.push(`contribution ${item.id ?? '<missing>'} has invalid evidence_status`);
      for (const key of ['finding', 'recommended_action']) if (!String(item[key] ?? '').trim()) errors.push(`contribution ${item.id ?? '<missing>'} has empty ${key}`);
      if (item.disposition !== undefined && !enumValues.disposition.has(item.disposition)) errors.push(`contribution ${item.id} has invalid disposition`);
    }
  }
  if (Array.isArray(context.gates)) {
    for (const gate of context.gates) {
      if (!gate.stage || !enumValues.gateStatus.has(gate.status)) errors.push(`gate ${gate.stage ?? '<missing>'} has invalid stage or status`);
      if (!String(gate.reviewer ?? '').trim()) errors.push(`gate ${gate.stage ?? '<missing>'} has no reviewer`);
      if (!String(gate.note ?? '').trim()) errors.push(`gate ${gate.stage ?? '<missing>'} has no note`);
    }
  }
  if (Array.isArray(context.artifacts)) {
    try { assertUnique(context.artifacts, 'id', 'artifacts'); } catch (error) { errors.push(error.message); }
    for (const artifact of context.artifacts) if (artifact.status && !enumValues.artifactStatus.has(artifact.status)) errors.push(`artifact ${artifact.id ?? '<missing>'} has invalid status`);
  }
  if (complete) {
    const pending = (context.contributions ?? []).filter(item => !enumValues.disposition.has(item.disposition));
    if (pending.length) errors.push(`completion requires dispositions for: ${pending.map(item => item.id ?? '<missing>').join(', ')}`);
    const passed = (context.gates ?? []).some(gate => gate.stage === 'solution-quality' && gate.status === 'pass');
    if (!passed) errors.push('completion requires a passing solution-quality gate');
    if ((context.handoffs ?? []).length < 2) errors.push('completion requires at least two recorded handoffs');
    if (!String(context.solution?.summary ?? '').trim()) errors.push('completion requires solution.summary');
    if (!String(context.solution?.deliverable ?? '').trim()) errors.push('completion requires a concrete solution.deliverable');
  }
  if ((context.participants ?? []).length === 0) warnings.push('no participants have been selected');
  if ((context.contributions ?? []).length === 0) warnings.push('no contributions have been recorded');
  if ((context.gates ?? []).length === 0) warnings.push('no quality gate has been recorded');
  return { errors, warnings };
}

function emit(value) {
  console.log(JSON.stringify(value, null, 2));
}

function init(file, options) {
  const resolved = path.resolve(file);
  if (fs.existsSync(resolved)) throw new Error(`refusing to overwrite existing context: ${file}`);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  const timestamp = now();
  const context = {
    schema_version: '1.0',
    context_id: requireValue(options['context-id'], '--context-id'),
    status: 'active',
    created_at: timestamp,
    updated_at: timestamp,
    request: {
      requester: requireValue(options.requester, '--requester'),
      problem: requireValue(options.problem, '--problem'),
      desired_outcome: requireValue(options.outcome, '--outcome'),
      scope: values(options, 'scope'),
      non_goals: values(options, 'non-goal'),
      constraints: values(options, 'constraint'),
      success_criteria: values(options, 'success-criterion'),
      stopping_condition: requireValue(options['stopping-condition'], '--stopping-condition')
    },
    participants: [],
    playbook: { name: options.playbook ?? 'multi-persona-collaboration', stage: 'frame', owner: options.owner ?? 'coordinator', decision_rights: { coordinator: 'maintain context and stage transitions', contributor: 'return scoped records', reviewer: 'pass, fail, or defer gates' } },
    evidence: [],
    contributions: [],
    decisions: [],
    artifacts: [],
    handoffs: [],
    gates: [],
    open_questions: [],
    blockers: [],
    next_action: 'Select explicit participants and record their responsibilities.',
    solution: { status: 'not_started', summary: null, deliverable: null, artifact_ids: [], decision_ids: [] },
    authorization: { durable_write: false, scope: 'context-only', authorized_by: null, authorized_at: null },
    revisions: [{ revision: 0, at: timestamp, action: 'init', details: { context_id: options['context-id'] } }]
  };
  const result = validateContext(context);
  if (result.errors.length) throw new Error(result.errors.join('; '));
  fs.writeFileSync(resolved, `${JSON.stringify(context, null, 2)}\n`, 'utf8');
  emit({ ok: true, file: resolved, context_id: context.context_id, status: context.status });
}

function addParticipant(file, options) {
  const participantId = requireValue(options.id, '--id');
  const context = mutate(file, 'add-participant', { participant_id: participantId }, current => {
    if (current.participants.some(item => item.id === participantId)) throw new Error(`participant already exists: ${participantId}`);
    const status = options.status ?? (options.unavailable ? 'unavailable' : 'available');
    if (!enumValues.participantStatus.has(status)) throw new Error(`invalid participant status: ${status}`);
    current.participants.push({
      id: participantId,
      role: requireValue(options.role, '--role'),
      responsibility: requireValue(options.responsibility, '--responsibility'),
      status,
      loaded_records: values(options, 'record'),
      unavailable_reason: options['unavailable-reason'] ?? null,
      write_scope: options['write-scope'] ?? 'return contribution to coordinator; no direct durable mutation'
    });
    if (status === 'unavailable' && !String(options['unavailable-reason'] ?? '').trim()) throw new Error('unavailable participant requires --unavailable-reason');
    current.playbook.stage = 'select';
    current.next_action = 'Request independent scoped contributions from available participants.';
  });
  emit({ ok: true, context_id: context.context_id, participants: context.participants });
}

function appendContribution(file, options) {
  const participantId = requireValue(options['participant-id'], '--participant-id');
  const context = mutate(file, 'append-contribution', { participant_id: participantId }, current => {
    const selected = participant(current, participantId);
    if (selected.status !== 'available') throw new Error(`participant is unavailable: ${participantId}`);
    const contributionId = options.id ?? id('contribution');
    if (current.contributions.some(item => item.id === contributionId)) throw new Error(`contribution already exists: ${contributionId}`);
    const evidenceStatus = options['evidence-status'] ?? 'unknown';
    if (!enumValues.evidenceStatus.has(evidenceStatus)) throw new Error(`invalid evidence status: ${evidenceStatus}`);
    current.contributions.push({
      id: contributionId,
      participant_id: participantId,
      stage: current.playbook.stage,
      finding: requireValue(options.finding, '--finding'),
      evidence_status: evidenceStatus,
      evidence: values(options, 'evidence'),
      tradeoffs_or_risks: values(options, 'tradeoff'),
      recommended_action: requireValue(options['recommended-action'], '--recommended-action'),
      confidence: options.confidence ?? 'unknown',
      sources: values(options, 'source'),
      disposition: null,
      disposition_reason: null,
      recorded_at: now()
    });
    current.playbook.stage = 'synthesize';
    current.next_action = 'Compare contributions, preserve disagreement, and record dispositions.';
  });
  emit({ ok: true, contribution: context.contributions.at(-1) });
}

function setDisposition(file, options) {
  const contributionId = requireValue(options['contribution-id'], '--contribution-id');
  const disposition = requireValue(options.status, '--status');
  if (!enumValues.disposition.has(disposition)) throw new Error(`invalid disposition: ${disposition}`);
  const context = mutate(file, 'set-disposition', { contribution_id: contributionId, disposition }, current => {
    const contribution = current.contributions.find(item => item.id === contributionId);
    if (!contribution) throw new Error(`contribution not found: ${contributionId}`);
    contribution.disposition = disposition;
    contribution.disposition_reason = requireValue(options.reason, '--reason');
  });
  emit({ ok: true, contribution: context.contributions.find(item => item.id === contributionId) });
}

function addDecision(file, options) {
  const decisionId = options.id ?? id('decision');
  const context = mutate(file, 'add-decision', { decision_id: decisionId }, current => {
    if (current.decisions.some(item => item.id === decisionId)) throw new Error(`decision already exists: ${decisionId}`);
    current.decisions.push({ id: decisionId, decision: requireValue(options.decision, '--decision'), rationale: requireValue(options.rationale, '--rationale'), owner: requireValue(options.owner ?? current.playbook.owner, '--owner'), evidence_ids: values(options, 'evidence-id'), based_on_contribution_ids: values(options, 'contribution-id'), recorded_at: now() });
    current.playbook.stage = 'build';
    current.next_action = 'Build one concrete deliverable and map it to the success criteria.';
  });
  emit({ ok: true, decision: context.decisions.at(-1) });
}

function addArtifact(file, options) {
  const artifactId = requireValue(options.id, '--id');
  const status = options.status ?? 'draft';
  if (!enumValues.artifactStatus.has(status)) throw new Error(`invalid artifact status: ${status}`);
  const context = mutate(file, 'add-artifact', { artifact_id: artifactId }, current => {
    if (current.artifacts.some(item => item.id === artifactId)) throw new Error(`artifact already exists: ${artifactId}`);
    current.artifacts.push({ id: artifactId, kind: requireValue(options.kind, '--kind'), title: requireValue(options.title, '--title'), status, location: options.location ?? null, summary: requireValue(options.summary, '--summary'), source_context_id: current.context_id, recorded_at: now() });
    current.playbook.stage = 'review';
    current.next_action = 'Run the solution-quality gate against the stated success criteria.';
  });
  emit({ ok: true, artifact: context.artifacts.at(-1) });
}

function gate(file, options) {
  const stage = requireValue(options.stage, '--stage');
  const status = requireValue(options.status, '--status');
  if (!enumValues.gateStatus.has(status)) throw new Error(`invalid gate status: ${status}`);
  const context = mutate(file, 'gate', { stage, status }, current => {
    current.gates.push({ stage, status, reviewer: requireValue(options.reviewer, '--reviewer'), note: requireValue(options.note, '--note'), checked_success_criteria: values(options, 'success-criterion'), recorded_at: now() });
    if (stage === 'solution-quality' && status === 'pass') {
      current.playbook.stage = 'close';
      current.next_action = 'Record the final solution and close the context, or hand it to the named next owner.';
    } else if (status !== 'pass') {
      current.status = status === 'defer' ? 'blocked' : 'active';
      current.next_action = options['next-action'] ?? 'Resolve the gate findings before advancing.';
    }
  });
  emit({ ok: true, gate: context.gates.at(-1), stage: context.playbook.stage });
}

function handoff(file, options) {
  const context = mutate(file, 'handoff', { to: options.to }, current => {
    current.handoffs.push({ id: options.id ?? id('handoff'), from_stage: requireValue(options['from-stage'], '--from-stage'), to_stage: requireValue(options['to-stage'], '--to-stage'), owner: requireValue(options.owner, '--owner'), accepted_facts: values(options, 'accepted-fact'), open_questions: values(options, 'open-question'), blockers_or_fallback: options.blockers ?? null, required_output: requireValue(options['required-output'], '--required-output'), next_action: requireValue(options['next-action'], '--next-action'), status: options.accepted ? 'accepted' : 'pending', recorded_at: now() });
    current.playbook.stage = options['to-stage'];
    current.next_action = current.handoffs.at(-1).next_action;
  });
  emit({ ok: true, handoff: context.handoffs.at(-1) });
}

function authorize(file, options) {
  const context = mutate(file, 'authorize', { scope: options.scope }, current => {
    current.authorization = { durable_write: true, scope: requireValue(options.scope, '--scope'), authorized_by: requireValue(options.by, '--by'), authorized_at: now() };
  });
  emit({ ok: true, authorization: context.authorization });
}

function complete(file, options) {
  const { resolved, context } = readContext(file);
  context.solution = { status: 'complete', summary: requireValue(options.summary, '--summary'), deliverable: requireValue(options.deliverable, '--deliverable'), artifact_ids: values(options, 'artifact-id'), decision_ids: values(options, 'decision-id'), completed_at: now() };
  const result = validateContext(context, { complete: true });
  if (result.errors.length) throw new Error(result.errors.join('; '));
  context.status = 'completed';
  context.playbook.stage = 'close';
  context.next_action = options['next-action'] ?? 'Share the deliverable and record any follow-up as a separate authorized task.';
  writeContext(resolved, context, 'complete', { deliverable: context.solution.deliverable });
  emit({ ok: true, context_id: context.context_id, status: context.status, solution: context.solution });
}

function validate(file) {
  const { resolved, context } = readContext(file);
  const result = validateContext(context);
  emit({ ok: result.errors.length === 0, file: resolved, context_id: context.context_id, errors: result.errors, warnings: result.warnings });
  if (result.errors.length) process.exitCode = 1;
}

function summary(file, resume = false) {
  const { resolved, context } = readContext(file);
  const pending = context.contributions.filter(item => !enumValues.disposition.has(item.disposition)).map(item => item.id);
  const output = { file: resolved, context_id: context.context_id, status: context.status, stage: context.playbook.stage, owner: context.playbook.owner, problem: context.request.problem, desired_outcome: context.request.desired_outcome, participants: context.participants.map(item => ({ id: item.id, status: item.status, responsibility: item.responsibility })), contribution_count: context.contributions.length, pending_dispositions: pending, decisions: context.decisions.map(item => item.id), artifacts: context.artifacts.map(item => ({ id: item.id, status: item.status })), passed_gates: context.gates.filter(item => item.status === 'pass').map(item => item.stage), open_questions: context.open_questions, blockers: context.blockers, next_action: context.next_action, solution: context.solution };
  if (resume) output.resume_packet = { accepted_facts: [...context.evidence, ...context.decisions], open_questions: context.open_questions, blockers_or_fallback: context.blockers, required_output: context.request.desired_outcome, next_action: context.next_action, last_revision: context.revisions.at(-1)?.revision ?? null };
  emit(output);
}

function usage() {
  console.error('Usage: problem-context.mjs <init|add-participant|append-contribution|set-disposition|add-decision|add-artifact|gate|handoff|authorize|complete|validate|summary|resume> <context.json> [--options]');
  process.exitCode = 2;
}

try {
  const { positional, options } = parseArgs(process.argv.slice(2));
  const command = positional[0];
  const file = positional[1];
  if (!command || !file) {
    usage();
  } else if (command === 'init') init(file, options);
  else if (command === 'add-participant') addParticipant(file, options);
  else if (command === 'append-contribution') appendContribution(file, options);
  else if (command === 'set-disposition') setDisposition(file, options);
  else if (command === 'add-decision') addDecision(file, options);
  else if (command === 'add-artifact') addArtifact(file, options);
  else if (command === 'gate') gate(file, options);
  else if (command === 'handoff') handoff(file, options);
  else if (command === 'authorize') authorize(file, options);
  else if (command === 'complete') complete(file, options);
  else if (command === 'validate') validate(file);
  else if (command === 'summary') summary(file);
  else if (command === 'resume') summary(file, true);
  else usage();
} catch (error) {
  fail(error.message);
}

