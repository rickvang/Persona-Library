import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateGraph } from '../client/system-map-graph.mjs';
import { TOOL_PAGE_SOURCES } from './build-tools-pages.mjs';
import { REFERENCE_PAGE_SOURCES } from './build-reference-pages.mjs';

const REPO = 'rickvang/Persona-Library';
const OWNER = 'repository:rickvang/persona-library';
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRef = (file, selector) => ({ kind: 'repo-file', locator: REPO + ':' + file, selector });
const edgeId = (from, relationship, to) => 'edge:' + from + '--' + relationship + '--' + to;
const fileNodeId = file => 'file:' + file;
const stepNodeId = file => 'build-step:' + file;
const addEdge = (edges, from, to, relationship, derivation, source) => edges.push({
  id: edgeId(from, relationship, to), from, to, relationship, derivation, source
});
const sortGraph = graph => ({
  ...graph,
  nodes: graph.nodes.sort((a, b) => a.id.localeCompare(b.id)),
  edges: graph.edges.sort((a, b) => a.id.localeCompare(b.id))
});

function nodeOnce(nodes, node) {
  if (!nodes.some(item => item.id === node.id)) nodes.push(node);
}

function fileLabel(file) {
  return file.split('/').pop() || file;
}

function parseQuotedList(source, name) {
  const start = source.indexOf('const ' + name + ' = [');
  if (start < 0) throw new Error('Missing build list: ' + name);
  const end = source.indexOf('\n];', start);
  if (end < 0) throw new Error('Unterminated build list: ' + name);
  const segment = source.slice(start, end);
  return [...segment.matchAll(/['"]([^'"]+)['"]/g)].map(match => match[1]);
}

function parseLiteralPairs(source) {
  return [...source.matchAll(/\[\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\]/g)]
    .map(match => [match[1], match[2]])
    .filter(([, output]) => output.startsWith('dist/'));
}

function frontmatterValue(source, key) {
  const match = source.match(new RegExp('^\\s*' + key + ':\\s*([^\\n#]+)', 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : null;
}

async function readJson(root, relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
}

async function readText(root, relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

function graphOutputs(base) {
  return [
    'dist/data/system-map/' + base + '.json',
    'dist/data/system-map/' + base + '.agent.json',
    'dist/data/system-map/' + base + '.mmd'
  ];
}

function outputNode(nodes, output, source) {
  nodeOnce(nodes, {
    id: fileNodeId(output),
    label: output,
    type: 'generated-artifact',
    owner: OWNER,
    derivation: 'contract-derived',
    source
  });
}

function sourceNode(nodes, input, source) {
  nodeOnce(nodes, {
    id: fileNodeId(input),
    label: input,
    type: 'authored-source',
    owner: OWNER,
    derivation: 'contract-derived',
    source
  });
}

function stepNode(nodes, script, selector) {
  nodeOnce(nodes, {
    id: stepNodeId(script),
    label: fileLabel(script),
    type: 'build-step',
    owner: OWNER,
    derivation: 'contract-derived',
    source: sourceRef(script, selector)
  });
}

export async function deriveSourceGeneratedGraph(root = rootDir, { buildSourceOverride = null } = {}) {
  const buildPath = 'scripts/build-library.mjs';
  const buildSource = buildSourceOverride ?? await readText(root, buildPath);
  const orientation = await readJson(root, 'content/site-orientation.json');
  const scenarioIndex = await readJson(root, 'content/library-data/operational-scenarios/index.json');
  const nodes = [{
    id: 'view:source-generated',
    label: 'Source / generated',
    type: 'view-root',
    owner: OWNER,
    derivation: 'contract-derived',
    source: sourceRef(buildPath, 'generated Site build contract')
  }];
  const edges = [];

  stepNode(nodes, buildPath, 'generated Site build contract');
  addEdge(edges, 'view:source-generated', stepNodeId(buildPath), 'contains', 'contract-derived', sourceRef(buildPath, 'generated Site build contract'));

  const validationPath = 'scripts/check-generated-output.mjs';
  nodeOnce(nodes, {
    id: 'validation:generated-output-cleanliness',
    label: 'Generated output cleanliness',
    type: 'validation-boundary',
    owner: OWNER,
    derivation: 'contract-derived',
    source: sourceRef(validationPath, 'assertGeneratedOutputClean')
  });
  addEdge(edges, 'view:source-generated', 'validation:generated-output-cleanliness', 'contains', 'contract-derived', sourceRef(validationPath, 'assertGeneratedOutputClean'));

  const libraryInputs = parseQuotedList(buildSource, 'libraryDataSources')
    .filter(value => value.startsWith('content/'));
  for (const entry of scenarioIndex.scenarios || []) libraryInputs.splice(Math.max(0, libraryInputs.length - 1), 0, entry.path);
  const libraryOutput = 'dist/data/library-data.js';
  const bundleSource = sourceRef(buildPath, 'libraryDataSources -> ' + libraryOutput);
  outputNode(nodes, libraryOutput, bundleSource);
  for (const input of [...new Set(libraryInputs)]) {
    sourceNode(nodes, input, bundleSource);
    addEdge(edges, fileNodeId(input), fileNodeId(libraryOutput), 'contributes-to', 'contract-derived', bundleSource);
  }
  addEdge(edges, stepNodeId(buildPath), fileNodeId(libraryOutput), 'generates', 'contract-derived', bundleSource);

  const directPairs = parseLiteralPairs(buildSource);
  const authoredPages = parseQuotedList(buildSource, 'authoredSitePages').filter(name => name.endsWith('.html'));
  for (const name of authoredPages) directPairs.push(['content/site-pages/' + name, 'dist/' + name]);
  for (const record of Object.values(orientation.spaces || {})) {
    directPairs.push(['content/' + record.route_file, 'dist/data/' + record.route_file]);
  }

  const pairSource = sourceRef(buildPath, 'files copy contract');
  for (const [input, output] of directPairs) {
    if (output === 'dist/js/job-tracker-config.js') continue;
    if (output === 'dist/tools.html' && buildSource.includes('await buildToolsPage(root)')) continue;
    if (['dist/playbooks.html','dist/guide.html'].includes(output) && buildSource.includes('await buildReferencePages(root)')) continue;
    sourceNode(nodes, input, pairSource);
    outputNode(nodes, output, pairSource);
    addEdge(edges, fileNodeId(input), fileNodeId(output), 'copied-to', 'contract-derived', pairSource);
    addEdge(edges, stepNodeId(buildPath), fileNodeId(output), 'generates', 'contract-derived', pairSource);
  }

  const runtimeConfig = 'dist/js/job-tracker-config.js';
  outputNode(nodes, runtimeConfig, sourceRef(buildPath, 'trackerRuntimeConfig'));
  addEdge(edges, stepNodeId(buildPath), fileNodeId(runtimeConfig), 'generates-runtime-config', 'contract-derived', sourceRef(buildPath, 'trackerRuntimeConfig'));

  const decisionsStep = 'scripts/build-decisions.mjs';
  stepNode(nodes, decisionsStep, 'buildDecisionsPage');
  addEdge(edges, 'view:source-generated', stepNodeId(decisionsStep), 'contains', 'contract-derived', sourceRef(decisionsStep, 'buildDecisionsPage'));
  const decisionOutput = 'dist/decisions.html';
  outputNode(nodes, decisionOutput, sourceRef(decisionsStep, 'dist/decisions.html'));
  for (const input of ['content/decisions-page.html', 'docs/decisions/records.json']) {
    sourceNode(nodes, input, sourceRef(decisionsStep, input + ' -> ' + decisionOutput));
    addEdge(edges, fileNodeId(input), fileNodeId(decisionOutput), 'contributes-to', 'contract-derived', sourceRef(decisionsStep, input + ' -> ' + decisionOutput));
  }
  addEdge(edges, stepNodeId(decisionsStep), fileNodeId(decisionOutput), 'generates', 'contract-derived', sourceRef(decisionsStep, 'dist/decisions.html'));

  if (buildSource.includes('await buildToolsPage(root)')) {
    const toolsStep = 'scripts/build-tools-pages.mjs';
    const toolsOutput = 'dist/tools.html';
    stepNode(nodes, toolsStep, 'buildToolsPage');
    addEdge(edges, 'view:source-generated', stepNodeId(toolsStep), 'contains', 'contract-derived', sourceRef(toolsStep, 'buildToolsPage'));
    outputNode(nodes, toolsOutput, sourceRef(toolsStep, 'buildToolsPage'));
    for (const input of Object.values(TOOL_PAGE_SOURCES)) {
      const source = sourceRef(toolsStep, 'TOOL_PAGE_SOURCES');
      if (input.startsWith('dist/')) outputNode(nodes, input, source); else sourceNode(nodes, input, source);
      if (input.startsWith('dist/')) addEdge(edges, fileNodeId(input), stepNodeId(toolsStep), 'consumed-by', 'contract-derived', source);
      else addEdge(edges, fileNodeId(input), fileNodeId(toolsOutput), 'contributes-to', 'contract-derived', source);
    }
    addEdge(edges, stepNodeId(toolsStep), fileNodeId(toolsOutput), 'generates', 'contract-derived', sourceRef(toolsStep, 'buildToolsPage'));
  }

  if (buildSource.includes('await buildReferencePages(root)')) {
    const referenceStep = 'scripts/build-reference-pages.mjs';
    const manifest = await readJson(root,REFERENCE_PAGE_SOURCES.manifest);
    const source = sourceRef(referenceStep,'buildReferencePages / REFERENCE_PAGE_SOURCES / curated manifest');
    stepNode(nodes,referenceStep,'buildReferencePages');
    addEdge(edges,'view:source-generated',stepNodeId(referenceStep),'contains','contract-derived',source);
    const readers = [...manifest.playbooks.map(entry => 'dist/' + entry.id + '.html'),...manifest.documents.filter(entry => !manifest.playbooks.some(binding => binding.document === entry.id)).map(entry => 'dist/doc-' + entry.id + '.html')];
    const outputs = ['dist/playbooks.html','dist/guide.html','dist/data/site-publication.json',...readers,...manifest.documents.map(entry => entry.legacyMarkdown && 'dist/' + entry.legacyMarkdown).filter(Boolean)];
    for (const input of new Set([...Object.values(REFERENCE_PAGE_SOURCES),...manifest.documents.map(entry => entry.source),...manifest.playbooks.map(entry => entry.overviewSource).filter(Boolean)])) {
      if (input.startsWith('dist/')) outputNode(nodes,input,source); else sourceNode(nodes,input,source);
      addEdge(edges,fileNodeId(input),stepNodeId(referenceStep),'consumed-by','contract-derived',source);
    }
    for (const output of outputs) {
      outputNode(nodes,output,source);
      addEdge(edges,stepNodeId(referenceStep),fileNodeId(output),'generates','contract-derived',source);
    }
  }

  const personaStep = 'scripts/build-persona-skill-system-map.mjs';
  stepNode(nodes, personaStep, 'buildPersonaSkillSystemMap');
  addEdge(edges, 'view:source-generated', stepNodeId(personaStep), 'contains', 'contract-derived', sourceRef(personaStep, 'buildPersonaSkillSystemMap'));
  for (const output of graphOutputs('persona-skill')) {
    outputNode(nodes, output, sourceRef(personaStep, output));
    addEdge(edges, stepNodeId(personaStep), fileNodeId(output), 'generates', 'contract-derived', sourceRef(personaStep, output));
  }

  const technicalStep = 'scripts/build-technical-system-maps.mjs';
  stepNode(nodes, technicalStep, 'buildTechnicalSystemMaps');
  addEdge(edges, 'view:source-generated', stepNodeId(technicalStep), 'contains', 'contract-derived', sourceRef(technicalStep, 'buildTechnicalSystemMaps'));
  for (const base of ['source-generated', 'agent-runtime']) {
    for (const output of graphOutputs(base)) {
      outputNode(nodes, output, sourceRef(technicalStep, output));
      addEdge(edges, stepNodeId(technicalStep), fileNodeId(output), 'generates', 'contract-derived', sourceRef(technicalStep, output));
    }
  }

  const authoredSources = nodes.filter(node => node.type === 'authored-source');
  const authoredGroup = 'view:authored-sources';
  nodeOnce(nodes, {
    id: authoredGroup,
    label: 'Authored sources',
    type: 'view-group',
    owner: OWNER,
    derivation: 'contract-derived',
    source: sourceRef(buildPath, 'generated Site build contract')
  });
  addEdge(edges, 'view:source-generated', authoredGroup, 'contains', 'contract-derived', sourceRef(buildPath, 'generated Site build contract'));
  const sourceGroups = new Set();
  for (const source of authoredSources) {
    const top = source.label.split('/')[0] || 'other';
    const groupId = 'source-group:' + top;
    if (!sourceGroups.has(groupId)) {
      sourceGroups.add(groupId);
      nodeOnce(nodes, {
        id: groupId,
        label: top + '/',
        type: 'view-group',
        owner: OWNER,
        derivation: 'contract-derived',
        source: sourceRef(buildPath, 'generated Site build contract')
      });
      addEdge(edges, authoredGroup, groupId, 'contains', 'contract-derived', sourceRef(buildPath, 'generated Site build contract'));
    }
    addEdge(edges, groupId, source.id, 'contains', 'contract-derived', source.source);
  }

  const outputs = nodes.filter(node => node.type === 'generated-artifact');
  for (const output of outputs) {
    addEdge(edges, output.id, 'validation:generated-output-cleanliness', 'validated-by', 'contract-derived', sourceRef(validationPath, 'dist cleanliness scope'));
  }

  return validateGraph(sortGraph({
    version: 'system-map.graph/v0.1',
    scope: 'domain:source-generated',
    coverage: 'complete-for-scope',
    nodes,
    edges
  }));
}

function contractValueNode(nodes, kind, value, source) {
  const id = 'contract:' + kind + ':' + value;
  nodeOnce(nodes, {
    id,
    label: kind.replaceAll('-', ' ') + ': ' + value,
    type: 'skill-contract-value',
    owner: OWNER,
    derivation: 'structured-derived',
    source
  });
  return id;
}

export async function deriveAgentRuntimeGraph(root = rootDir, { orientationOverride = null } = {}) {
  const orientationPath = 'content/site-orientation.json';
  const orientation = orientationOverride ?? await readJson(root, orientationPath);
  const nodes = [{
    id: 'view:agent-runtime',
    label: 'Agent / runtime',
    type: 'view-root',
    owner: OWNER,
    derivation: 'contract-derived',
    source: sourceRef('AGENTS.md', 'Choose the shortest activation path')
  }];
  const edges = [];

  nodeOnce(nodes, {
    id: 'agent:repository-dispatcher',
    label: 'Repository dispatcher',
    type: 'agent-dispatcher',
    owner: OWNER,
    derivation: 'contract-derived',
    source: sourceRef('AGENTS.md', 'Choose the shortest activation path')
  });
  nodeOnce(nodes, {
    id: 'routing:orientation-bootstrap',
    label: 'Orientation bootstrap',
    type: 'routing-bootstrap',
    owner: OWNER,
    derivation: 'structured-derived',
    source: sourceRef(orientationPath, 'root')
  });
  nodeOnce(nodes, {
    id: 'validation:repository-validation',
    label: 'Repository validation',
    type: 'validation-boundary',
    owner: OWNER,
    derivation: 'contract-derived',
    source: sourceRef('.github/workflows/repository-validation.yml', 'jobs.validate')
  });
  nodeOnce(nodes, {
    id: 'boundary:live-runtime-state',
    label: 'Live runtime state stays external',
    type: 'runtime-boundary',
    owner: OWNER,
    derivation: 'contract-derived',
    source: sourceRef('AGENTS.md', 'GitHub, CI, review, deployment, permissions, and runtime state')
  });

  addEdge(edges, 'view:agent-runtime', 'agent:repository-dispatcher', 'contains', 'contract-derived', sourceRef('AGENTS.md', 'Choose the shortest activation path'));
  addEdge(edges, 'agent:repository-dispatcher', 'routing:orientation-bootstrap', 'loads-for-semantic-work', 'contract-derived', sourceRef('AGENTS.md', 'library-semantic'));
  addEdge(edges, 'agent:repository-dispatcher', 'validation:repository-validation', 'uses-validation-contract', 'contract-derived', sourceRef('AGENTS.md', 'Repository execution and validation'));
  addEdge(edges, 'view:agent-runtime', 'boundary:live-runtime-state', 'excludes-live-state', 'contract-derived', sourceRef('AGENTS.md', 'Durable work and recovery'));

  const packagePaths = new Set();
  const routeRecords = [];

  for (const [spaceId, space] of Object.entries(orientation.spaces || {})) {
    const spaceNode = 'space:' + spaceId;
    const groupPath = 'content/' + space.route_file;
    const groupNode = 'route-group:' + spaceId;
    nodeOnce(nodes, {
      id: spaceNode,
      label: space.label,
      type: 'primary-space',
      owner: OWNER,
      derivation: 'structured-derived',
      source: sourceRef(orientationPath, 'spaces.' + spaceId)
    });
    nodeOnce(nodes, {
      id: groupNode,
      label: space.label + ' routes',
      type: 'route-group',
      owner: OWNER,
      derivation: 'structured-derived',
      source: sourceRef(groupPath, 'root')
    });
    addEdge(edges, 'routing:orientation-bootstrap', spaceNode, 'declares-space', 'structured-derived', sourceRef(orientationPath, 'spaces.' + spaceId));
    addEdge(edges, spaceNode, groupNode, 'uses-route-group', 'structured-derived', sourceRef(orientationPath, 'spaces.' + spaceId + '.route_file'));

    const group = await readJson(root, groupPath);
    if ((group.routes || []).length !== space.route_count) throw new Error('Route count mismatch for ' + spaceId);
    for (const route of group.routes || []) {
      const routeNode = 'route:' + route.id;
      nodeOnce(nodes, {
        id: routeNode,
        label: route.id,
        type: 'routing-route',
        owner: OWNER,
        derivation: 'structured-derived',
        source: sourceRef(groupPath, 'routes[id=' + route.id + ']')
      });
      addEdge(edges, groupNode, routeNode, 'contains', 'structured-derived', sourceRef(groupPath, 'routes[id=' + route.id + ']'));
      routeRecords.push({ route, routeNode, groupPath });
      if (route.artifact_kind === 'callable_skill' && route.package_path) packagePaths.add(route.package_path);
    }
  }

  const packageMetadata = new Map();
  for (const packagePath of [...packagePaths].sort()) {
    const skillPath = packagePath + '/SKILL.md';
    const source = await readText(root, skillPath);
    const metadata = {
      skill_layer: frontmatterValue(source, 'skill_layer'),
      change_mode: frontmatterValue(source, 'change_mode'),
      change_domain: frontmatterValue(source, 'change_domain'),
      reconciliation: frontmatterValue(source, 'reconciliation')
    };
    packageMetadata.set(packagePath, metadata);
    nodeOnce(nodes, {
      id: 'skill-package:' + packagePath,
      label: packagePath.split('/').pop(),
      type: 'callable-skill-package',
      owner: OWNER,
      derivation: 'structured-derived',
      source: sourceRef(skillPath, 'frontmatter')
    });

    for (const [key, value] of Object.entries(metadata)) {
      if (!value) continue;
      const src = sourceRef(skillPath, 'frontmatter.' + key);
      const valueNode = contractValueNode(nodes, key.replaceAll('_', '-'), value, src);
      addEdge(edges, 'skill-package:' + packagePath, valueNode, 'declares-' + key.replaceAll('_', '-'), 'structured-derived', src);
    }
  }

  for (const { route, routeNode, groupPath } of routeRecords) {
    if (route.artifact_kind !== 'callable_skill' || !route.package_path) continue;
    const packageNode = 'skill-package:' + route.package_path;
    addEdge(edges, routeNode, packageNode, 'routes-to', 'structured-derived', sourceRef(groupPath, 'routes[id=' + route.id + '].package_path'));
  }

  return validateGraph(sortGraph({
    version: 'system-map.graph/v0.1',
    scope: 'domain:agent-runtime',
    coverage: 'complete-for-scope',
    nodes,
    edges
  }));
}

function mermaidId(id) {
  return 'n_' + id.replace(/[^A-Za-z0-9]/g, '_');
}

function mermaidLabel(value) {
  return String(value).replace(/"/g, '&quot;');
}

function renderSourceMermaid(graph) {
  const byId = new Map(graph.nodes.map(node => [node.id, node]));
  const stepIds = graph.nodes.filter(node => node.type === 'build-step').map(node => node.id);
  const lines = [
    '%% GENERATED. Bounded Source/generated overview; full relationships are in JSON.',
    'flowchart LR',
    '  source["Authored sources"]',
    '  generated["Generated dist/ artifacts"]',
    '  validation["Generated-output cleanliness"]'
  ];
  for (const id of stepIds) lines.push('  ' + mermaidId(id) + '["' + mermaidLabel(byId.get(id).label) + '"]');
  for (const id of stepIds) {
    lines.push('  source --> ' + mermaidId(id));
    lines.push('  ' + mermaidId(id) + ' --> generated');
  }
  lines.push('  generated --> validation');
  return lines.join('\n') + '\n';
}

function renderAgentMermaid(graph) {
  const spaces = graph.nodes.filter(node => node.type === 'primary-space').sort((a, b) => a.label.localeCompare(b.label));
  const lines = [
    '%% GENERATED. Advanced static routing overview; no live runtime availability claims.',
    'flowchart LR',
    '  dispatcher["Repository dispatcher"] --> bootstrap["Orientation bootstrap"]'
  ];
  for (const space of spaces) lines.push('  bootstrap --> ' + mermaidId(space.id) + '["' + mermaidLabel(space.label) + '"]');
  lines.push('  dispatcher --> validation["Repository validation"]');
  lines.push('  boundary["Live runtime state stays external"]');
  return lines.join('\n') + '\n';
}

function renderAgentView(graph, view) {
  const provenance = {};
  for (const node of graph.nodes) provenance[node.id] = node.source;
  for (const edge of graph.edges) provenance[edge.id] = edge.source;
  return {
    version: 'system-map.agent/v0.1',
    view,
    scope: graph.scope,
    coverage: graph.coverage,
    nodes: graph.nodes.map(({ id, label, type }) => ({ id, label, type })),
    edges: graph.edges.map(({ id, from, to, relationship }) => ({ id, from, to, relationship })),
    provenance
  };
}

export async function expectedTechnicalSystemMapOutputs(root = rootDir) {
  const [sourceGraph, runtimeGraph] = await Promise.all([
    deriveSourceGeneratedGraph(root),
    deriveAgentRuntimeGraph(root)
  ]);
  return {
    sourceGraph,
    runtimeGraph,
    files: new Map([
      ['dist/data/system-map/source-generated.json', JSON.stringify(sourceGraph, null, 2) + '\n'],
      ['dist/data/system-map/source-generated.agent.json', JSON.stringify(renderAgentView(sourceGraph, 'source-generated'), null, 2) + '\n'],
      ['dist/data/system-map/source-generated.mmd', renderSourceMermaid(sourceGraph)],
      ['dist/data/system-map/agent-runtime.json', JSON.stringify(runtimeGraph, null, 2) + '\n'],
      ['dist/data/system-map/agent-runtime.agent.json', JSON.stringify(renderAgentView(runtimeGraph, 'agent-runtime'), null, 2) + '\n'],
      ['dist/data/system-map/agent-runtime.mmd', renderAgentMermaid(runtimeGraph)]
    ])
  };
}

export async function buildTechnicalSystemMaps(root = rootDir, { check = false } = {}) {
  const { sourceGraph, runtimeGraph, files } = await expectedTechnicalSystemMapOutputs(root);
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
  if (stale.length) throw new Error('Generated technical System Map output is stale: ' + stale.join(', '));
  return { sourceGraph, runtimeGraph };
}

const isEntrypoint = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isEntrypoint) {
  const result = await buildTechnicalSystemMaps(rootDir, { check: process.argv.includes('--check') });
  console.log('Source/generated System Map: ' + result.sourceGraph.nodes.length + ' nodes, ' + result.sourceGraph.edges.length + ' edges.');
  console.log('Agent/runtime System Map: ' + result.runtimeGraph.nodes.length + ' nodes, ' + result.runtimeGraph.edges.length + ' edges.');
}
