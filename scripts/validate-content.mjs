#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildValidationIndexes, loadValidationContext } from './validation/context.mjs';
import { validateGeneratedOutputs } from './validation/generated.mjs';
import { validateMaintenance } from './validation/maintenance.mjs';
import { validateOperatingPackFixtures, validateOperatingPacks } from './validation/operating-packs.mjs';
import { validateOrientation } from './validation/orientation.mjs';
import { validatePersonas } from './validation/personas.mjs';
import { validateRelationships } from './validation/relationships.mjs';
import { validateSkillPilot, validateSkills } from './validation/skills.mjs';
import { validateTemplates } from './validation/templates.mjs';

export async function validateRepository(root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')) {
  const context = await loadValidationContext(root);
  const indexes = buildValidationIndexes(context.data);
  await validateGeneratedOutputs(context);
  await validateOrientation(context);
  validatePersonas(context, indexes);
  validateSkills(context, indexes);
  validateSkillPilot(context);
  validateRelationships(context, indexes);
  await validateOperatingPacks(context, indexes);
  await validateTemplates(context, indexes);
  validateOperatingPackFixtures(context);
  validateMaintenance(context);
  const roleCounts = context.data.personas.reduce((counts, persona) => {
    counts[persona.role] = (counts[persona.role] || 0) + 1;
    return counts;
  }, {});
  return `Validated ${context.data.personas.length} personas, ${roleCounts.operator || 0} operators, ${roleCounts.leader || 0} leaders, ${roleCounts.specialist || 0} specialists, ${Object.keys(context.data.flowLibrary).length} workflow maps.`;
}

const isEntrypoint = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isEntrypoint) console.log(await validateRepository());
