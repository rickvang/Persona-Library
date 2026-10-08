import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const fixture = JSON.parse(await readFile(new URL('./v2-capability-preservation.fixture.json', import.meta.url), 'utf8'));
export const plain = value => JSON.parse(JSON.stringify(value));
const sorted = entries => [...entries].sort(([a], [b]) => a.localeCompare(b));
const ordered = values => [...values].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

// Use the committed baseline and its own full loader, not a copied catalog loop or
// today's loader against yesterday's data. No network access or fixture refresh.
export async function loadPinnedBaseline(root) {
  assert.match(fixture.baselineCommit, /^[0-9a-f]{40}$/);
  const scratch = await mkdtemp(path.join(os.tmpdir(), 'cw92-baseline-'));
  const checkout = path.join(scratch, 'source');
  await mkdir(checkout);
  try {
    const resolved = execFileSync('git', ['rev-parse', `${fixture.baselineCommit}^{commit}`], { cwd: root, encoding: 'utf8' }).trim();
    assert.equal(resolved, fixture.baselineCommit, 'The immutable fixture commit must be available; use a full-history checkout');
    const archive = path.join(scratch, 'baseline.tar');
    execFileSync('git', ['archive', '--format=tar', '--output', archive, resolved], { cwd: root });
    execFileSync('tar', ['-xf', archive, '-C', checkout]);
    const { loadValidationContext } = await import(pathToFileURL(path.join(checkout, 'scripts/validation/context.mjs')).href);
    const context = await loadValidationContext(checkout);
    const sourceBlobs = {};
    for (const relative of [...context.libraryDataSources, 'content/library-model.js', 'client/template-preview.js']) {
      const bytes = await readFile(path.join(checkout, relative));
      sourceBlobs[relative] = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
    }
    return { context, sourceBlobs, cleanup: () => rm(scratch, { recursive: true, force: true }) };
  } catch (error) {
    await rm(scratch, { recursive: true, force: true });
    throw new Error(`CW-92 pinned full-source fixture unavailable: ${error.message}`, { cause: error });
  }
}

function mentions(value, ids) {
  if (typeof value === 'string') return ids.has(value);
  if (Array.isArray(value)) return value.some(item => mentions(item, ids));
  if (value && typeof value === 'object') return Object.entries(value).some(([key, item]) => ids.has(key) || mentions(item, ids));
  return false;
}

export function capturePilot(context) {
  const { data, model } = context;
  const keys = fixture.pilotSourceKeys;
  // During the authorized pilot move, legacy display fields are derived from
  // the one authored method. Do not require an old Persona-keyed source bucket.
  const records = Object.fromEntries(keys.map(key => [key, plain([
    ...(data.skillLibrary[key] || []),
    ...Object.entries(data.skillLibrary).flatMap(([sourceKey, methods]) => sourceKey.startsWith('skill-')
      ? methods.filter(method => method.legacySourceKey === key).map(method => ({
        name: method.name, status: method.status, definition: method.definition,
        triggers: method.when, workflows: method.workflowRefs.map(ref => ref.title).join(' · '),
        actions: method.actions, evidence: method.evidence
      })) : [])
  ])]));
  const flows = Object.fromEntries(keys.map(key => [key, plain(data.flowLibrary[key] || [])]));
  const skillIds = new Set(Object.values(records).flat().map(record => model.slugify(record.name)));
  // Include peer applications of a shared semantic ID and transitive Skill-unit
  // relationships. Useful differences are not collapsed to the first profile.
  const entityIds = new Set(skillIds);
  let previousSize;
  do {
    previousSize = entityIds.size;
    for (const edge of data.skillRelations || []) {
      if (entityIds.has(edge.from) || entityIds.has(edge.to)) {
        entityIds.add(edge.from);
        entityIds.add(edge.to);
      }
    }
  } while (entityIds.size !== previousSize);
  const relevantIds = new Set([...keys, ...entityIds]);
  const linked = {};
  for (const field of ['toolUseRecipes', 'personaToolRequirements', 'personaHandoffs', 'operationalScenarios', 'operationalScenarioCatalog', 'playbookCatalog', 'operatingPacks', 'operatingPackCatalog', 'templates', 'templateCatalog', 'toolCatalog', 'toolReferences']) {
    linked[field] = plain((data[field] || []).filter(item => mentions(item, relevantIds)));
  }
  const keyed = field => Object.fromEntries(sorted(Object.entries(data[field] || {}).filter(([key]) => entityIds.has(key))));
  return plain({
    sourceOrder: context.libraryDataSources,
    dataKeys: Object.keys(data).sort(),
    definitions: data.personas.filter(persona => keys.includes(persona.id)),
    records, flows,
    skillIds: [...skillIds].sort(),
    catalog: data.skillCatalog.filter(skill => entityIds.has(skill.id)),
    guidance: keyed('skillGuidance'),
    practice: keyed('skillPractice'),
    units: (data.skillUnits || []).filter(unit => entityIds.has(unit.id)),
    relations: (data.skillRelations || []).filter(edge => entityIds.has(edge.from) || entityIds.has(edge.to)),
    linked,
    maintenance: {
      personas: Object.fromEntries(keys.map(key => [key, data.maintenance?.personas?.[key]])),
      skills: Object.fromEntries(sorted(Object.entries(data.maintenance?.skills || {}).filter(([id]) => entityIds.has(id))))
    }
  });
}

export function assertPreserved(actual, expected) {
  assert.deepStrictEqual(actual, expected, 'Pilot material fields, variants, evidence, activities, or relationships changed from the pinned baseline; classify the change rather than refreshing the baseline');
}

export function profilePayloads(catalog) {
  return ordered(catalog.flatMap(skill => skill.profiles.map(profile => {
    const { personaName, roleLabel, ...content } = profile;
    return plain({ skillId: skill.id, ...content });
  })));
}

export function workflowDiagnostics(data) {
  const unresolved = [], unreferenced = [];
  for (const key of fixture.pilotSourceKeys) {
    const titles = new Set((data.flowLibrary[key] || []).map(flow => flow.title));
    const referenced = new Set();
    const applications = [
      ...(data.skillLibrary[key] || []),
      ...Object.entries(data.skillLibrary).flatMap(([id, methods]) => id.startsWith('skill-')
        ? methods.filter(method => method.legacySourceKey === key).map(method => ({
          name: method.name, workflows: method.workflowRefs.map(ref => ref.title).join(' · ')
        })) : [])
    ];
    for (const profile of applications) {
      for (const title of (profile.workflows || '').split(' · ').map(value => value.trim()).filter(Boolean)) {
        referenced.add(title);
        if (!titles.has(title)) unresolved.push({ sourceKey: key, skill: profile.name, title });
      }
    }
    for (const title of titles) if (!referenced.has(title)) unreferenced.push({ sourceKey: key, title });
  }
  return { unresolved: ordered(unresolved), unreferenced: ordered(unreferenced) };
}

// Explicit WP04 expected transformation. Authored fields and history remain
// byte-for-byte material inputs. Only the new derived view and the documented
// all-method/shared fallback replace old first-profile presentation.
export const uiWorkflowBackfill = [
  ['Translate intent into interface structure', 'workflow-translate-intent-into-interface-structure'],
  ['Craft the core interaction and visual system', 'workflow-craft-core-interaction-and-visual-system'],
  ['Extend and govern the design system', 'workflow-extend-and-govern-design-system'],
  ['Partner through implementation', 'workflow-partner-through-implementation'],
  ['Validate usability and accessibility', 'workflow-validate-usability-and-accessibility'],
  ['Repair a broken or confusing interface', 'workflow-repair-broken-or-confusing-interface'],
  ['Resolve a pattern or constraint conflict', 'workflow-resolve-pattern-or-constraint-conflict']
];

export const orchestrationWorkflowBackfill = [
  ['Frame the system goal and boundary', 'workflow-frame-system-goal-and-boundary'],
  ['Compose the agent and tool system', 'workflow-compose-agent-and-tool-system'],
  ['Coordinate evaluation and improvement', 'workflow-coordinate-evaluation-and-improvement'],
  ['Operate and improve the system', 'workflow-operate-and-improve-system'],
  ['Coordinate stakeholders and governance', 'workflow-coordinate-stakeholders-and-governance'],
  ['Recover a failed or unsafe run', 'workflow-run-recovery-containment-and-control'],
  ['Adapt after a model or tool change', 'workflow-adapt-after-model-or-tool-change']
];

export function readerBaseline(context) {
  const snapshot = capturePilot(context);
  // WP04-F1: only the seven explicitly accepted UI workflow IDs are added to
  // the immutable baseline projection; no workflow body or unrelated source is
  // normalized away. Method references gain those IDs, not a new authored copy.
  const backfills = {
    'ui-expert': new Map(uiWorkflowBackfill),
    'ai-orchestrator': new Map(orchestrationWorkflowBackfill)
  };
  for (const [sourceKey, mapping] of Object.entries(backfills)) {
    for (const flow of snapshot.flows[sourceKey]) {
      const id = mapping.get(flow.title);
      if (!id) throw new Error(`Unexpected pinned ${sourceKey} workflow: ${flow.title}`);
      flow.id = id;
    }
  }
  const { data, model } = context;
  const selected = 'Select the applicable method by its task conditions; no single shared procedure is authored.';
  const uniqueValue = (profiles, field, fallback) => new Set(profiles.map(profile => profile[field])).size === 1 ? profiles[0][field] : fallback;
  for (const skill of snapshot.catalog) {
    const profiles = skill.profiles;
    skill.methods = Object.entries(data.skillLibrary).flatMap(([key, records]) => records.flatMap((record, index) => model.slugify(record.name) !== skill.id ? [] : [{
      id: `method-legacy-${key}-${skill.id.slice(6)}`, name: record.name, status: record.status,
      definition: record.definition, when: record.triggers, actions: record.actions, evidence: record.evidence,
      workflowRefs: record.workflows.split(' · ').map(title => title.trim()).filter(Boolean).map(title => ({ legacySourceKey: key, title, ...(!(data.flowLibrary[key] || []).some(flow => flow.title === title) ? { unresolved: true } : {}) })),
      provenance: { source: { collection: 'skillLibrary', key, index } }, legacySourceKey: key
    }])).sort((a, b) => a.id.localeCompare(b.id));
    for (const method of skill.methods) {
      const mapping = backfills[method.legacySourceKey];
      if (mapping) method.workflowRefs = method.workflowRefs.map(ref => mapping.has(ref.title)
        ? { id: mapping.get(ref.title), title: ref.title }
        : ref);
      if (['ui-expert', 'ai-orchestrator'].includes(method.legacySourceKey)) {
        // WP05/WP06 expected representations derive only from the immutable
        // original record and accepted semantic ID, never current candidate data.
        method.id = `method-${skill.id.slice(6)}`;
        method.provenance = {
          original: {
            repository: 'rickvang/Persona-Library', revision: fixture.baselineCommit,
            path: 'content/library-data/skills-core.js',
            selector: `skillLibrary[${method.legacySourceKey}]/${method.name}`
          },
          current: { repository: 'rickvang/Persona-Library', path: 'content/library-data/skills-core.js', selector: skill.id }
        };
      }
    }
    skill.methods.sort((a, b) => a.id.localeCompare(b.id));
    const authored = { ...(data.skillGuidance[skill.id]?.operation || {}), ...(data.skillPractice[skill.id]?.operation || {}) };
    const trigger = uniqueValue(profiles, 'triggers', selected);
    const definition = uniqueValue(profiles, 'definition', 'Method-specific result; inspect the selected method.');
    const moves = authored.moves || [uniqueValue(profiles, 'actions', selected)];
    const operation = skill.guidance.operation;
    if (!authored.startsWith) operation.startsWith = trigger;
    if (!authored.loop) operation.loop = [`Notice the trigger: ${trigger}`, 'Frame the decision and relevant constraints.', `Apply the capability: ${moves[0]}`, `Check the result: ${skill.guidance.quality.checks[0]}`, 'Adjust the approach based on what was learned.'];
    if (!authored.inputs) operation.inputs = [trigger];
    if (!authored.decisions) operation.decisions = moves;
    if (!authored.outputs) operation.outputs = [authored.leavesBehind || definition];
    if (!authored.moves) operation.moves = moves;
    if (!authored.leavesBehind) operation.leavesBehind = definition;
    for (const field of ['buildingBlocks', 'supportingConnections', 'relatedSkills']) {
      for (const entity of skill[field]) {
        if (entity.kind !== 'composed') continue;
        const target = data.skillCatalog.find(candidate => candidate.id === entity.id);
        entity.summary = uniqueValue(target.profiles, 'definition', 'Select a task-conditioned method for its applicable definition.');
      }
    }
  }
  return plain(snapshot);
}
