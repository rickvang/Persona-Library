#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deriveAgentRuntimeGraph } from './build-technical-system-maps.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = 'rickvang/Persona-Library';
const SCHEMA_VERSION = 'persona-library.agent-context/v0.1';
const MIGRATED_ROUTE_IDS = ['system-orientation', 'template-composition', 'tool-resolution'];
const REQUIRED_EXCEPTION_FIELDS = [
  'availability_source',
  'first_reads',
  'mutation_boundary',
  'non_triggers',
  'next_handoff',
  'space_do_not'
];

const sourceRef = (file, selector) => ({
  kind: 'repo-file',
  locator: REPO + ':' + file,
  selector
});

function payloadChecksum(value) {
  const text = JSON.stringify(value);
  let hash = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= BigInt(text.charCodeAt(index));
    hash = BigInt.asUintN(64, hash * prime);
  }
  return hash.toString(16).padStart(16, '0');
}

async function readText(root, relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

async function readJson(root, relativePath) {
  return JSON.parse(await readText(root, relativePath));
}

function agentView(graph) {
  const provenance = {};
  for (const node of graph.nodes) provenance[node.id] = node.source;
  for (const edge of graph.edges) provenance[edge.id] = edge.source;
  return {
    version: 'system-map.agent/v0.1',
    view: 'agent-runtime',
    scope: graph.scope,
    coverage: graph.coverage,
    nodes: graph.nodes.map(({ id, label, type }) => ({ id, label, type })),
    edges: graph.edges.map(({ id, from, to, relationship }) => ({ id, from, to, relationship })),
    provenance
  };
}

async function findRoute(root, routeId) {
  const orientationPath = 'content/site-orientation.json';
  const orientation = await readJson(root, orientationPath);
  const matches = [];

  for (const [spaceId, space] of Object.entries(orientation.spaces || {})) {
    const routeFile = 'content/' + space.route_file;
    const group = await readJson(root, routeFile);
    for (const route of group.routes || []) {
      if (route.id === routeId) matches.push({ orientation, spaceId, space, routeFile, group, route });
    }
  }

  if (matches.length !== 1) {
    throw new Error('Expected exactly one canonical route for ' + routeId + '; found ' + matches.length);
  }
  return matches[0];
}

function boundedFragment(graph, { spaceId, route }) {
  const view = agentView(graph);
  const outgoing = new Map(view.nodes.map(node => [node.id, []]));
  for (const edge of view.edges) outgoing.get(edge.from)?.push(edge);

  const routeNode = 'route:' + route.id;
  const packageNode = 'skill-package:' + route.package_path;
  const ids = new Set([
    'view:agent-runtime',
    'agent:repository-dispatcher',
    'routing:orientation-bootstrap',
    'space:' + spaceId,
    'route-group:' + spaceId,
    routeNode,
    packageNode,
    'validation:repository-validation',
    'boundary:live-runtime-state'
  ]);

  for (const edge of outgoing.get(packageNode) || []) {
    if (edge.relationship.startsWith('declares-')) ids.add(edge.to);
  }

  for (const id of ids) {
    if (!view.nodes.some(node => node.id === id)) {
      throw new Error('Agent/runtime graph is missing required migration node ' + id);
    }
  }

  const nodes = view.nodes.filter(node => ids.has(node.id));
  const edges = view.edges.filter(edge => ids.has(edge.from) && ids.has(edge.to));
  const provenance = {};
  for (const node of nodes) provenance[node.id] = view.provenance[node.id];
  for (const edge of edges) provenance[edge.id] = view.provenance[edge.id];

  return {
    version: view.version,
    view: view.view,
    scope: view.scope,
    coverage: view.coverage,
    nodes,
    edges,
    provenance
  };
}

function routeExceptions(group, route) {
  return {
    availability_source: route.availability_source,
    first_reads: route.first_reads,
    mutation_boundary: route.mutation_boundary,
    non_triggers: route.non_triggers,
    next_handoff: route.next_handoff,
    space_do_not: group.space?.do_not || []
  };
}

function compactSpaceIndex(orientation, primarySpace, routeId) {
  const entries = Object.entries(orientation.spaces || {});
  const selected = routeId === 'system-orientation'
    ? entries
    : entries.filter(([id]) => id === primarySpace);

  return selected.map(([id, space]) => ({
    id,
    label: space.label,
    answers: space.answers,
    route_file: space.route_file
  }));
}

function canonicalSourcesForRoute(canonical, contract) {
  const sources = [
    sourceRef('AGENTS.md', 'Choose the shortest activation path / live-state boundary'),
    sourceRef('content/site-orientation.json', 'spaces.' + canonical.spaceId),
    sourceRef(canonical.routeFile, 'routes[id=' + canonical.route.id + ']'),
    sourceRef(canonical.route.package_path + '/SKILL.md', 'frontmatter')
  ];

  if (contract.reconciliation && contract.reconciliation !== 'skip') {
    sources.push(sourceRef(
      '.agents/skills/' + contract.reconciliation + '/SKILL.md',
      'frontmatter / downstream reconciliation contract'
    ));
  }

  return sources;
}

function graphContract(fragment, packagePath) {
  const packageId = 'skill-package:' + packagePath;
  const value = relationship => {
    const edge = fragment.edges.find(item => item.from === packageId && item.relationship === relationship);
    if (!edge) return null;
    const prefix = 'contract:' + relationship.replace(/^declares-/, '') + ':';
    return edge.to.startsWith(prefix) ? edge.to.slice(prefix.length) : null;
  };
  return {
    skill_layer: value('declares-skill-layer'),
    change_mode: value('declares-change-mode'),
    change_domain: value('declares-change-domain'),
    reconciliation: value('declares-reconciliation')
  };
}

export function validateAgentContextBundle(bundle, expected = {}) {
  const errors = [];
  if (!bundle || typeof bundle !== 'object') return ['bundle must be an object'];
  if (bundle.schema_version !== SCHEMA_VERSION) errors.push('unexpected schema_version');
  if (typeof bundle.route_id !== 'string' || !bundle.route_id) errors.push('route_id is required');
  if (typeof bundle.primary_space !== 'string' || !bundle.primary_space) errors.push('primary_space is required');
  if (typeof bundle.package_path !== 'string' || !bundle.package_path) errors.push('package_path is required');
  if (!bundle.graph_fragment || !Array.isArray(bundle.graph_fragment.nodes) || !Array.isArray(bundle.graph_fragment.edges)) {
    errors.push('graph_fragment nodes/edges are required');
  }
  if (!bundle.exceptions || typeof bundle.exceptions !== 'object') {
    errors.push('exceptions are required');
  } else {
    const fields = Object.keys(bundle.exceptions);
    if (JSON.stringify(fields) !== JSON.stringify(REQUIRED_EXCEPTION_FIELDS)) {
      errors.push('exception fields do not match the migration contract');
    }
  }
  if (!bundle.contract || typeof bundle.contract !== 'object') errors.push('contract is required');
  if (!Array.isArray(bundle.space_index) || !bundle.space_index.length) {
    errors.push('space_index is required');
  } else {
    const ids = new Set();
    for (const space of bundle.space_index) {
      if (!space?.id || !space?.label || !space?.answers || !space?.route_file) errors.push('space_index entry is incomplete');
      if (ids.has(space.id)) errors.push('space_index contains duplicate space ' + space.id);
      ids.add(space.id);
    }
    if (!ids.has(bundle.primary_space)) errors.push('space_index does not include primary_space');
  }
  if (!Array.isArray(bundle.canonical_sources) || bundle.canonical_sources.length < 4) errors.push('canonical_sources are incomplete');

  if (typeof bundle.payload_checksum !== 'string' || !/^[a-f0-9]{16}$/.test(bundle.payload_checksum)) {
    errors.push('payload_checksum is invalid');
  } else {
    const { payload_checksum, ...payload } = bundle;
    if (payloadChecksum(payload) !== payload_checksum) errors.push('payload_checksum does not match bundle payload');
  }

  if (expected.route_id && bundle.route_id !== expected.route_id) errors.push('route_id mismatch');
  if (expected.primary_space && bundle.primary_space !== expected.primary_space) errors.push('primary_space mismatch');
  if (expected.package_path && bundle.package_path !== expected.package_path) errors.push('package_path mismatch');

  if (bundle.graph_fragment?.nodes && bundle.graph_fragment?.edges && bundle.graph_fragment?.provenance) {
    const routeNode = 'route:' + bundle.route_id;
    const packageNode = 'skill-package:' + bundle.package_path;
    const routesTo = bundle.graph_fragment.edges.some(edge =>
      edge.from === routeNode && edge.to === packageNode && edge.relationship === 'routes-to'
    );
    if (!routesTo) errors.push('graph fragment is missing route → Skill edge');

    for (const fact of [...bundle.graph_fragment.nodes, ...bundle.graph_fragment.edges]) {
      if (!bundle.graph_fragment.provenance[fact.id]) errors.push('missing provenance for ' + fact.id);
    }

    const unrelatedRoutes = bundle.graph_fragment.nodes.filter(node =>
      node.type === 'routing-route' && node.id !== routeNode
    );
    if (unrelatedRoutes.length) errors.push('graph fragment contains unrelated route nodes');
  } else if (bundle.graph_fragment) {
    errors.push('graph_fragment provenance is required');
  }

  return errors;
}

export function resolveAgentContextBundle(raw, expected = {}) {
  if (raw === null || raw === undefined) {
    return { mode: 'canonical-fallback', reason: 'bundle-unavailable', bundle: null };
  }

  let bundle;
  try {
    bundle = typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return { mode: 'canonical-fallback', reason: 'bundle-malformed', bundle: null };
  }

  const errors = validateAgentContextBundle(bundle, expected);
  if (errors.length) {
    return { mode: 'canonical-fallback', reason: 'bundle-invalid', errors, bundle: null };
  }
  return { mode: 'graph-backed', reason: 'bundle-valid', errors: [], bundle };
}

export async function deriveAgentContextBundle(root = rootDir, routeId = 'system-orientation') {
  if (!MIGRATED_ROUTE_IDS.includes(routeId)) {
    throw new Error('Route is not enabled for graph-backed migration: ' + routeId);
  }

  const canonical = await findRoute(root, routeId);
  if (canonical.route.artifact_kind !== 'callable_skill' || !canonical.route.package_path) {
    throw new Error('Migrated route must resolve to a callable Skill package: ' + routeId);
  }

  const graph = await deriveAgentRuntimeGraph(root);
  const fragment = boundedFragment(graph, canonical);
  const exceptions = routeExceptions(canonical.group, canonical.route);
  const contract = graphContract(fragment, canonical.route.package_path);

  const payload = {
    schema_version: SCHEMA_VERSION,
    route_id: canonical.route.id,
    primary_space: canonical.route.primary_space,
    package_path: canonical.route.package_path,
    source_graph: {
      view: fragment.view,
      version: fragment.version,
      scope: fragment.scope,
      coverage: fragment.coverage
    },
    graph_fragment: fragment,
    space_index: compactSpaceIndex(canonical.orientation, canonical.route.primary_space, canonical.route.id),
    exceptions,
    contract,
    canonical_sources: canonicalSourcesForRoute(canonical, contract)
  };

  return { ...payload, payload_checksum: payloadChecksum(payload) };
}

export async function expectedAgentContextBundleOutputs(root = rootDir) {
  const files = new Map();
  for (const routeId of MIGRATED_ROUTE_IDS) {
    const bundle = await deriveAgentContextBundle(root, routeId);
    const errors = validateAgentContextBundle(bundle, {
      route_id: routeId,
      primary_space: bundle.primary_space,
      package_path: bundle.package_path
    });
    if (errors.length) throw new Error(routeId + ' bundle failed validation: ' + errors.join('; '));
    files.set('dist/data/agent-context/' + routeId + '.json', JSON.stringify(bundle, null, 2) + '\n');
  }
  return files;
}

export async function buildAgentContextBundles(root = rootDir, { check = false } = {}) {
  const files = await expectedAgentContextBundleOutputs(root);
  const stale = [];

  for (const [relativePath, content] of files) {
    const filePath = path.join(root, relativePath);
    if (check) {
      let current = null;
      try { current = await readFile(filePath, 'utf8'); } catch {}
      if (current !== content) stale.push(relativePath);
      continue;
    }
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, content, 'utf8');
  }

  if (stale.length) {
    throw new Error('Generated agent-context bundle is stale: ' + stale.join(', '));
  }
  return files;
}

const isEntrypoint = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isEntrypoint) {
  const files = await buildAgentContextBundles(rootDir, { check: process.argv.includes('--check') });
  console.log('Agent context bundles: ' + files.size + ' route(s).');
}
