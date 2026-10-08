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
  const records = Object.fromEntries(keys.map(key => [key, plain(data.skillLibrary[key] || [])]));
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
    for (const profile of data.skillLibrary[key] || []) {
      for (const title of (profile.workflows || '').split(' · ').map(value => value.trim()).filter(Boolean)) {
        referenced.add(title);
        if (!titles.has(title)) unresolved.push({ sourceKey: key, skill: profile.name, title });
      }
    }
    for (const title of titles) if (!referenced.has(title)) unreferenced.push({ sourceKey: key, title });
  }
  return { unresolved: ordered(unresolved), unreferenced: ordered(unreferenced) };
}
