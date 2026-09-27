import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { loadValidationContext } from './context.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const fields = ['status', 'definition', 'triggers', 'workflows', 'actions', 'evidence'];

test('shared Skill identities preserve distinct Persona application profiles', async () => {
  const { data, model } = await loadValidationContext(root);
  const byName = new Map();

  for (const [personaId, profiles] of Object.entries(data.skillLibrary)) {
    for (const profile of profiles) {
      if (!byName.has(profile.name)) byName.set(profile.name, []);
      byName.get(profile.name).push({ personaId, profile });
    }
  }

  const repeated = [...byName.entries()].filter(([, applications]) => applications.length > 1);
  assert.ok(repeated.length >= 14, 'expected the known repeated Skill-identity families');

  for (const [name, applications] of repeated) {
    const id = model.slugify(name);
    const canonical = data.skillCatalog.find(skill => skill.id === id);
    assert.ok(canonical, `missing canonical Skill identity for ${name}`);
    assert.equal(canonical.name, name);
    assert.equal(canonical.profiles.length, applications.length, `${name} lost Persona applications during normalization`);

    for (const { personaId, profile } of applications) {
      const normalized = canonical.profiles.find(candidate => candidate.personaId === personaId);
      assert.ok(normalized, `${name} lost application for ${personaId}`);
      for (const field of fields) {
        assert.equal(normalized[field], profile[field], `${name}/${personaId} changed ${field} during normalization`);
      }
    }
  }

  const decision = byName.get('Decision communication and rationale documentation');
  assert.ok(decision?.length >= 8);
  assert.ok(new Set(decision.map(item => item.profile.definition)).size > 1, 'role-specific definitions must remain distinguishable');
  assert.ok(new Set(decision.map(item => item.profile.triggers)).size > 1, 'role-specific triggers must remain distinguishable');

  const architecture = byName.get('Architecture decision-making');
  assert.equal(new Set(architecture.map(item => item.profile.definition)).size, 1, 'fixture expects a shared definition');
  assert.ok(new Set(architecture.map(item => item.profile.triggers)).size > 1, 'even a shared definition can have distinct Persona triggers');
});
