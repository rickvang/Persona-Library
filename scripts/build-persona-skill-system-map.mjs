import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadValidationContext } from './validation/context.mjs';
import { validateGraph } from '../client/system-map-graph.mjs';

const GRAPH_SCOPE = 'domain:persona-skill';
const REPO = 'rickvang/Persona-Library';
const OWNER = 'repository:rickvang/persona-library';
const ARCHITECTURE = 'ARCHITECTURE.md';
const MODEL = 'content/library-model.js';
const PERSONA_SOURCES = [
  'content/library-data/personas-core.js',
  'content/library-data/personas-career.js',
  'content/library-data/personas-systems.js'
];
const PROFILE_SOURCES = [
  'content/library-data/skills-core.js',
  'content/library-data/skills-specialists.js'
];
const GUIDANCE_SOURCE = 'content/library-data/skill-guidance.js';
const PRACTICE_SOURCE = 'content/library-data/skill-practice.js';
const ANATOMY_SOURCE = 'content/library-data/skill-anatomy.js';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const sourceRef = (file, selector) => ({
  kind: 'repo-file',
  locator: `${REPO}:${file}`,
  selector
});

const edgeId = (from, relationship, to) => `edge:${from}--${relationship}--${to}`;
const skillNodeId = id => `skill:${id}`;
const personaNodeId = id => `persona:${id}`;
const applicationNodeId = (personaId, skillId) => `skill-application:${personaId}/${skillId}`;
const unitNodeId = id => `skill-unit:${id}`;
const guidanceNodeId = id => `skill-guidance:${id}`;
const practiceNodeId = id => `skill-practice:${id}`;

function escaped(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findUniqueSource(sources, needles, kind) {
  const searchNeedles = Array.isArray(needles) ? needles : [needles];
  const matches = [...sources.entries()]
    .filter(([, content]) => searchNeedles.some(needle => content.includes(needle)))
    .map(([file]) => file);
  if (matches.length !== 1) throw new Error(`Expected exactly one ${kind} source; found ${matches.join(', ') || 'none'}`);
  return matches[0];
}

// The current Persona/Skill graph remains a historical compatibility view
// during CW-92. An application derived from a migrated method must point to
// the one authored neutral method, not the former Persona-keyed source row.
function neutralApplicationSource(sources, skillId, methodId) {
  // A source ID can be declared in two different files, including whitespace
  // variants that a literal prefilter misses. Count real authored sections
  // across every eligible source before trusting the provenance locator.
  const keyPattern = new RegExp(`['"]${escaped(skillId)}['"]\\s*:\\s*\\[`, 'g');
  const sections = [...sources.entries()].flatMap(([file, content]) =>
    [...content.matchAll(keyPattern)].map(key => ({ file, content, key })));
  if (sections.length !== 1) throw new Error(`Expected exactly one authored neutral Skill section for ${skillId}; found ${sections.length}`);
  const { file, content, key } = sections[0];
  const end = key && content.indexOf('\n  ],', key.index + key[0].length);
  if (!key || end < 0) throw new Error(`Cannot locate authored neutral Skill section for ${skillId}`);
  const section = content.slice(key.index + key[0].length, end);
  const methodIdPattern = new RegExp(`(?:\\bid|['"]id['"])\\s*:\\s*['"]${escaped(methodId)}['"]`);
  if (!methodIdPattern.test(section)) throw new Error(`Missing authored neutral method ${skillId}/${methodId}`);
  return sourceRef(file, `skillLibrary[${skillId}][id=${methodId}]`);
}

function addEdge(edges, from, to, relationship, derivation, source) {
  edges.push({
    id: edgeId(from, relationship, to),
    from,
    to,
    relationship,
    derivation,
    source
  });
}

async function sourceTextMap(context, paths) {
  return new Map(await Promise.all(paths.map(async file => [file, await context.readFile(file)])));
}

export async function derivePersonaSkillGraph(context) {
  const { data } = context;
  const [personaSources, profileSources, guidanceSource, practiceSource] = await Promise.all([
    sourceTextMap(context, PERSONA_SOURCES),
    sourceTextMap(context, PROFILE_SOURCES),
    context.readFile(GUIDANCE_SOURCE),
    context.readFile(PRACTICE_SOURCE)
  ]);

  const architectureSource = sourceRef(ARCHITECTURE, 'Skill identity/application invariant');
  const nodes = [
    {
      id: 'view:persona-skill',
      label: 'Persona / Skill',
      type: 'view-root',
      owner: OWNER,
      derivation: 'contract-derived',
      source: architectureSource
    },
    {
      id: 'view:personas',
      label: 'Personas',
      type: 'view-group',
      owner: OWNER,
      derivation: 'contract-derived',
      source: architectureSource
    },
    {
      id: 'view:skills',
      label: 'Skills',
      type: 'view-group',
      owner: OWNER,
      derivation: 'contract-derived',
      source: architectureSource
    }
  ];
  const edges = [];

  addEdge(edges, 'view:persona-skill', 'view:personas', 'contains', 'contract-derived', architectureSource);
  addEdge(edges, 'view:persona-skill', 'view:skills', 'contains', 'contract-derived', architectureSource);

  for (const persona of data.personas) {
    const file = findUniqueSource(
      personaSources,
      [`id:'${persona.id}'`, `id: '${persona.id}'`, `id:"${persona.id}"`, `id: "${persona.id}"`],
      `Persona ${persona.id}`
    );
    const id = personaNodeId(persona.id);
    nodes.push({
      id,
      label: persona.name,
      type: 'persona',
      owner: OWNER,
      derivation: 'structured-derived',
      source: sourceRef(file, `personas[id=${persona.id}]`)
    });
    addEdge(edges, 'view:personas', id, 'contains', 'contract-derived', architectureSource);
  }

  const profileSourceByPersona = new Map();
  for (const sourceKey of Object.keys(data.skillLibrary).filter(key => !key.startsWith('skill-'))) {
    const file = findUniqueSource(
      profileSources,
      [`'${sourceKey}':[`, `'${sourceKey}': [`, `"${sourceKey}":[`, `"${sourceKey}": [`],
      `Skill applications for ${sourceKey}`
    );
    profileSourceByPersona.set(sourceKey, file);
  }

  for (const skill of data.skillCatalog) {
    const skillId = skillNodeId(skill.id);
    nodes.push({
      id: skillId,
      label: skill.name,
      type: 'skill',
      owner: OWNER,
      derivation: 'contract-derived',
      source: sourceRef(MODEL, `buildSkillCatalog:${skill.id}`)
    });
    addEdge(edges, 'view:skills', skillId, 'contains', 'contract-derived', architectureSource);

    for (const method of skill.methods) {
      const persona = skill.personas.find(item => item.id === method.legacySourceKey);
      let appSource;
      if ((data.skillLibrary[skill.id] || []).some(record => record.id === method.id)) {
        appSource = neutralApplicationSource(profileSources, skill.id, method.id);
      } else {
        const file = profileSourceByPersona.get(method.legacySourceKey);
        if (!file) throw new Error(`Missing authored method source for ${method.legacySourceKey} / ${skill.id}`);
        appSource = sourceRef(file, `skillLibrary[${method.legacySourceKey}][name=${skill.name}]`);
      }
      const appId = applicationNodeId(method.legacySourceKey || method.id, skill.id);
      nodes.push({
        id: appId,
        label: persona ? `${persona.name} · ${skill.name}` : `${skill.name} · ${method.id}`,
        type: method.legacySourceKey ? 'persona-skill-application' : 'skill-method',
        owner: OWNER,
        derivation: 'structured-derived',
        source: appSource
      });
      if (persona) addEdge(edges, personaNodeId(persona.id), appId, 'has-skill-application', 'structured-derived', appSource);
      addEdge(edges, appId, skillId, 'application-of', 'structured-derived', appSource);
    }

    const guidanceKeyPattern = new RegExp(`['"]${escaped(skill.id)}['"]\\s*:\\s*\\{`);
    if (guidanceKeyPattern.test(guidanceSource)) {
      const id = guidanceNodeId(skill.id);
      const src = sourceRef(GUIDANCE_SOURCE, `skillGuidance[${skill.id}]`);
      nodes.push({
        id,
        label: `${skill.name} · operating/quality guidance`,
        type: 'skill-guidance',
        owner: OWNER,
        derivation: 'structured-derived',
        source: src
      });
      addEdge(edges, skillId, id, 'has-guidance', 'structured-derived', src);
    }

    if (guidanceKeyPattern.test(practiceSource)) {
      const id = practiceNodeId(skill.id);
      const src = sourceRef(PRACTICE_SOURCE, `skillPractice[${skill.id}]`);
      nodes.push({
        id,
        label: `${skill.name} · practice override`,
        type: 'skill-practice',
        owner: OWNER,
        derivation: 'structured-derived',
        source: src
      });
      addEdge(edges, skillId, id, 'has-practice', 'structured-derived', src);
    }
  }

  for (const unit of data.skillUnits) {
    nodes.push({
      id: unitNodeId(unit.id),
      label: unit.name,
      type: 'skill-unit',
      owner: OWNER,
      derivation: 'structured-derived',
      source: sourceRef(ANATOMY_SOURCE, `skillUnits[id=${unit.id}]`)
    });
  }

  const graphIdForEntity = id => {
    if (String(id).startsWith('skill-')) return skillNodeId(id);
    if (String(id).startsWith('unit-')) return unitNodeId(id);
    throw new Error(`Unsupported Persona/Skill graph relation endpoint: ${id}`);
  };

  for (const relation of data.skillRelations) {
    const src = sourceRef(ANATOMY_SOURCE, `skillRelations[from=${relation.from},to=${relation.to},type=${relation.type}]`);
    addEdge(
      edges,
      graphIdForEntity(relation.from),
      graphIdForEntity(relation.to),
      relation.type,
      'structured-derived',
      src
    );
  }

  const graph = {
    version: 'system-map.graph/v0.1',
    scope: GRAPH_SCOPE,
    coverage: 'complete-for-scope',
    nodes: nodes.sort((a, b) => a.id.localeCompare(b.id)),
    edges: edges.sort((a, b) => a.id.localeCompare(b.id))
  };
  return validateGraph(graph);
}

function mermaidId(id) {
  return `n_${id.replace(/[^A-Za-z0-9]/g, '_')}`;
}

function mermaidText(value) {
  return String(value).replace(/"/g, '&quot;');
}

export function renderPersonaSkillMermaid(graph) {
  const skillApplications = new Map();
  const nodeById = new Map(graph.nodes.map(node => [node.id, node]));

  for (const edge of graph.edges.filter(edge => edge.relationship === 'application-of')) {
    const application = nodeById.get(edge.from);
    const personaEdge = graph.edges.find(candidate => candidate.to === application.id && candidate.relationship === 'has-skill-application');
    if (!personaEdge) continue;
    const list = skillApplications.get(edge.to) || [];
    list.push({ personaId: personaEdge.from, source: application.source });
    skillApplications.set(edge.to, list);
  }

  const sharedSkillIds = new Set([...skillApplications.entries()].filter(([, apps]) => apps.length > 1).map(([id]) => id));
  const personaIds = new Set(
    [...skillApplications.entries()]
      .filter(([skillId]) => sharedSkillIds.has(skillId))
      .flatMap(([, apps]) => apps.map(app => app.personaId))
  );

  const lines = [
    '%% GENERATED from Persona-Library canonical Persona/Skill sources. Do not edit directly.',
    '%% Static view intentionally shows only shared Skill identities and their Persona applications.',
    'flowchart LR'
  ];

  for (const id of [...personaIds].sort()) {
    const node = nodeById.get(id);
    lines.push(`  ${mermaidId(id)}["${mermaidText(node.label)}"]`);
  }
  for (const id of [...sharedSkillIds].sort()) {
    const node = nodeById.get(id);
    lines.push(`  ${mermaidId(id)}["${mermaidText(node.label)}"]`);
  }
  for (const skillId of [...sharedSkillIds].sort()) {
    for (const app of skillApplications.get(skillId).sort((a, b) => a.personaId.localeCompare(b.personaId))) {
      lines.push(`  ${mermaidId(app.personaId)} -->|"applies"| ${mermaidId(skillId)}`);
    }
  }

  return `${lines.join('\n')}\n`;
}

export function renderPersonaSkillAgentView(graph) {
  const provenance = {};
  for (const node of graph.nodes) provenance[node.id] = node.source;
  for (const edge of graph.edges) provenance[edge.id] = edge.source;

  return {
    version: 'system-map.agent/v0.1',
    view: 'persona-skill',
    scope: graph.scope,
    coverage: graph.coverage,
    nodes: graph.nodes.map(({ id, label, type }) => ({ id, label, type })),
    edges: graph.edges.map(({ id, from, to, relationship }) => ({ id, from, to, relationship })),
    provenance
  };
}

export async function expectedPersonaSkillOutputs(root = rootDir) {
  const context = await loadValidationContext(root);
  const graph = await derivePersonaSkillGraph(context);
  return {
    graph,
    files: new Map([
      ['dist/data/system-map/persona-skill.json', `${JSON.stringify(graph, null, 2)}\n`],
      ['dist/data/system-map/persona-skill.mmd', renderPersonaSkillMermaid(graph)],
      ['dist/data/system-map/persona-skill.agent.json', `${JSON.stringify(renderPersonaSkillAgentView(graph), null, 2)}\n`]
    ])
  };
}

export async function buildPersonaSkillSystemMap(root = rootDir, { check = false } = {}) {
  const { graph, files } = await expectedPersonaSkillOutputs(root);
  const stale = [];

  for (const [relativePath, content] of files) {
    const filePath = path.join(root, relativePath);
    if (check) {
      let current = null;
      try {
        current = await readFile(filePath, 'utf8');
      } catch {}
      if (current !== content) stale.push(relativePath);
      continue;
    }
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, content, 'utf8');
  }

  if (stale.length) throw new Error(`Generated Persona / Skill System Map output is stale: ${stale.join(', ')}`);
  return graph;
}

const isEntrypoint = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isEntrypoint) {
  const graph = await buildPersonaSkillSystemMap(rootDir, { check: process.argv.includes('--check') });
  console.log(`Persona / Skill System Map: ${graph.nodes.length} nodes, ${graph.edges.length} edges.`);
}
