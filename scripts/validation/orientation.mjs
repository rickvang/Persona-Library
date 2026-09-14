import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const UNIVERSAL_ORIENTATION_FIELDS = ['site', 'purpose', 'default_entry', 'bootstrap_rule', 'request_modes', 'creation_gate', 'skill_contract', 'default_process', 'mutation_policy', 'response_contract', 'activation'];
const EXPECTED_ROUTE_IDS = ['system-orientation', 'persona-research', 'persona-capability-maintenance', 'persona-consultation', 'persona-reconciliation', 'skill-formation', 'skill-package-maintenance', 'operating-pack-catalog', 'operating-pack-research', 'operating-pack-composition', 'operating-pack-reconciliation', 'template-catalog', 'template-library-stewardship', 'template-research', 'template-composition', 'template-reconciliation', 'playbook-composition', 'multi-persona-collaboration', 'tool-resolution', 'tool-record-maintenance', 'docs-and-onboarding', 'decision-record', 'prototype-comparison', 'workflow-canvas-intent', 'work-order-start', 'cross-space-reconciliation', 'conformance-evaluation', 'isolated-persona-skill-testing', 'resume-application-work'];

export async function validateOrientation(context) {
  const { orientation, routeGroups, requiredSpaces, root } = context;
  if (orientation.schema_version !== '2.0' || orientation.site !== 'Personas' || !orientation.bootstrap_rule || !orientation.spaces || !orientation.request_modes || !orientation.skill_contract || !Array.isArray(orientation.skill_contract.required_metadata) || orientation.skill_contract.required_metadata.length !== 4 || !orientation.skill_contract.routing?.source_update?.includes('$change-impact-reconciliation') || !Array.isArray(orientation.default_process) || orientation.default_process.length < 5 || orientation.mutation_policy?.default?.toLowerCase() !== 'read-only' || !Array.isArray(orientation.response_contract) || orientation.response_contract.length < 4 || !orientation.activation?.explicit_prompt?.includes('$persona-library-orientation') || !orientation.routing || !orientation.routing.skill_layers || !Array.isArray(orientation.routing.artifact_kinds) || !Array.isArray(orientation.routing.availability_sources) || Object.hasOwn(orientation.routing, 'routes') || !orientation.routing.route_group_rule) {
    throw new Error('Orientation bootstrap is missing required universal policy or route-group fields');
  }

  for (const space of requiredSpaces) {
    const record = orientation.spaces[space];
    const group = routeGroups.get(space);
    if (!record || !record.label || !record.answers || !record.route_file || !Number.isInteger(record.route_count) || Object.hasOwn(record, 'read') || Object.hasOwn(record, 'write') || Object.hasOwn(record, 'do_not')) throw new Error(`Orientation bootstrap has an incomplete space: ${space}`);
    if (!group || group.schema_version !== '2.0' || group.primary_space !== space || !group.space || !group.space.label || !group.space.answers || !group.space.read || !group.space.write || !group.space.do_not || !Array.isArray(group.routes) || group.routes.length !== record.route_count) throw new Error(`Orientation route group is incomplete: ${space}`);
    for (const field of UNIVERSAL_ORIENTATION_FIELDS) if (Object.hasOwn(group, field)) throw new Error(`Universal orientation field is duplicated in route group: ${space}.${field}`);
  }

  const allowedSkillLayers = new Set(Object.keys(orientation.routing.skill_layers));
  const allowedArtifactKinds = new Set(orientation.routing.artifact_kinds);
  const allowedAvailabilitySources = new Set(orientation.routing.availability_sources);
  const routeIds = new Set();
  const routedPackagePaths = new Set();
  const routes = requiredSpaces.flatMap(space => routeGroups.get(space).routes);
  for (const route of routes) {
    if (!route.id || routeIds.has(route.id) || !route.request || !Array.isArray(route.modes) || !route.modes.length || !requiredSpaces.includes(route.primary_space) || !Array.isArray(route.secondary_spaces) || !route.target || !allowedArtifactKinds.has(route.artifact_kind) || !allowedAvailabilitySources.has(route.availability_source) || !Array.isArray(route.first_reads) || !route.first_reads.length || !route.mutation_boundary || !route.reconciliation || !Array.isArray(route.non_triggers) || !route.non_triggers.length || !route.next_handoff) {
      throw new Error(`Invalid or incomplete orientation route: ${route.id || '(missing)'}`);
    }
    routeIds.add(route.id);
    if (route.artifact_kind === 'callable_skill' && route.availability_source === 'repo_local') {
      if (!route.package_path || !route.package_path.startsWith('.agents/skills/')) throw new Error(`Repository Skill route has no package path: ${route.id}`);
      routedPackagePaths.add(route.package_path);
      try {
        await readFile(path.join(root, route.package_path, 'SKILL.md'), 'utf8');
      } catch {
        throw new Error(`Repository Skill route package is missing: ${route.id}`);
      }
    }
  }
  if (routeIds.size !== EXPECTED_ROUTE_IDS.length || EXPECTED_ROUTE_IDS.some(routeId => !routeIds.has(routeId))) throw new Error('Orientation route migration lost or duplicated a route ID');

  const routeById = new Map(routes.map(route => [route.id, route]));
  const operatingPackDependentRoutes = ['persona-reconciliation', 'skill-formation', 'skill-package-maintenance', 'operating-pack-reconciliation', 'playbook-composition', 'multi-persona-collaboration', 'tool-resolution', 'tool-record-maintenance', 'cross-space-reconciliation'];
  for (const routeId of operatingPackDependentRoutes) if (!routeById.get(routeId)?.secondary_spaces.includes('operating-packs')) throw new Error(`Operating Pack dependency is missing from route: ${routeId}`);
  if (!routeById.get('cross-space-reconciliation')?.first_reads.some(read => /Operating Pack/i.test(read))) throw new Error('Universal reconciliation route does not declare Operating Pack inspection');
  const templateDependentRoutes = ['persona-reconciliation', 'skill-formation', 'skill-package-maintenance', 'operating-pack-reconciliation', 'playbook-composition', 'docs-and-onboarding', 'cross-space-reconciliation'];
  for (const routeId of templateDependentRoutes) if (!routeById.get(routeId)?.secondary_spaces.includes('templates')) throw new Error(`Template dependency is missing from route: ${routeId}`);
  if (!routeById.get('cross-space-reconciliation')?.first_reads.some(read => /Template/i.test(read))) throw new Error('Universal reconciliation route does not declare Template inspection');

  const skillEntries = await readdir(path.join(root, '.agents', 'skills'), { withFileTypes: true });
  for (const entry of skillEntries.filter(item => item.isDirectory())) {
    const skillPath = path.join(root, '.agents', 'skills', entry.name, 'SKILL.md');
    let skillSource;
    try {
      skillSource = await readFile(skillPath, 'utf8');
    } catch {
      throw new Error(`Repository Skill package is missing SKILL.md: ${entry.name}`);
    }
    const frontmatter = skillSource.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const layer = frontmatter?.[1].match(/^\s*skill_layer:\s*([^\r\n]+)\s*$/m)?.[1].trim();
    if (!frontmatter || !layer || !allowedSkillLayers.has(layer)) throw new Error(`Skill package has missing or unsupported skill_layer metadata: ${entry.name}`);
    for (const field of orientation.skill_contract.required_metadata) if (!frontmatter[1].match(new RegExp(`^\\s*${field}:\\s*[^\\r\\n]+$`, 'm'))) throw new Error(`Skill package has missing required metadata ${field}: ${entry.name}`);
    if (!routedPackagePaths.has(`.agents/skills/${entry.name}`)) throw new Error(`Skill package is missing from the onboarding routing map: ${entry.name}`);
  }
}
