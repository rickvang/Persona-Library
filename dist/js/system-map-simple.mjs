import {
  createJourneyState,
  toggleGroup,
  selectItem,
  selectSystemGroup,
  switchView,
  openRequestStage,
  selectStage,
  inspectParticipant,
  openWorkflow,
  goBack
} from './system-map-journey.mjs';
import {buildWorkflowConnections} from './system-map-workflows.mjs';
import {buildToolEntries} from './tool-catalog.mjs';

const root = document.querySelector('[data-system-map-simple]');
const primary = document.getElementById('primary-surface');
const explanation = document.getElementById('explanation-panel');
const breadcrumbs = document.getElementById('map-breadcrumbs');
const backButton = document.getElementById('map-back');
const status = document.getElementById('map-status');
const tabSystem = document.getElementById('tab-system');
const tabRequest = document.getElementById('tab-request');
const tabWorkflow = document.getElementById('tab-workflow');
const layout = document.querySelector('.app-layout');

let state = createJourneyState();
let model = null;
let workflowSearch = '';
const groupFilters = new Map();
const groupScroll = new Map();
const activityDisclosure = new Map();

const htmlEscape = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function firstText(...values) {
  return values.find(value => typeof value === 'string' && value.trim())?.trim() || '';
}

function labels(values, key = 'name') {
  return (values || []).map(value => typeof value === 'string' ? value : value?.[key]).filter(Boolean);
}

function listMarkup(values) {
  const clean = (values || []).filter(Boolean);
  if (!clean.length) return '<p>No contained records are declared for this item in the loaded source.</p>';
  return '<ul class="explain-list">' + clean.map(value => '<li>' + htmlEscape(value) + '</li>').join('') + '</ul>';
}

function sourceHref(source) {
  if (source?.kind === 'github_repository' && source.repository && source.path) {
    return 'https://github.com/' + source.repository + '/blob/' + (source.revision || 'main') + '/' + source.path + (source.entrypoint ? '/' + source.entrypoint : '');
  }
  if (!source || !['repo-file', 'repo-directory'].includes(source.kind) || !source.locator?.includes(':')) return '';
  const divider = source.locator.indexOf(':');
  const repo = source.locator.slice(0, divider);
  const path = source.locator.slice(divider + 1);
  return 'https://github.com/' + repo + (source.kind === 'repo-directory' ? '/tree/main/' : '/blob/main/') + path;
}

function describeRecord(kind, record, context = {}) {
  if (kind === 'persona') {
    const workflows = context.workflows || [];
    const skills = context.skills || [];
    return {
      summary: firstText(record.overview, record.summary, record.definition, record.purpose, record.tagline, record.description, record.role ? record.name + ' is a ' + record.role + ' Persona.' : ''),
      role: firstText(record.useWhen, record.context, record.roleLabel),
      inside: workflows.map(flow => flow.title || flow.name).filter(Boolean),
      used: workflows.length ? 'Used by ' + workflows.length + ' authored workflow' + (workflows.length === 1 ? '' : 's') + ' in this Persona record.' : 'No authored workflow entries were found for this Persona in the loaded catalog.',
      next: skills.slice(0, 8).map(skill => skill.name)
    };
  }
  if (kind === 'skill') {
    const profiles = record.profiles || [];
    const workflows = record.workflows || [];
    const recipes = record.toolUseRecipes || [];
    return {
      summary: firstText(record.definition, record.summary, profiles[0]?.definition, profiles[0]?.summary, record.name),
      role: [...new Set(profiles.map(profile => profile.actions).filter(Boolean))].join(' '),
      inside: [
        ...profiles.map(profile => 'Persona application: ' + firstText(profile.personaName, profile.personaId)).filter(Boolean),
        ...recipes.map(recipe => 'Tool-use recipe: ' + firstText(recipe.title, recipe.id)).filter(Boolean)
      ],
      used: workflows.length ? 'Appears in ' + workflows.length + ' authored Persona workflow relationship' + (workflows.length === 1 ? '' : 's') + '.' : 'No workflow reach is declared for this Skill in the loaded catalog.',
      next: workflows.slice(0, 8).map(workflow => firstText(workflow.title, workflow.name))
    };
  }
  if (kind === 'tool') {
    const recipes = context.recipes || [];
    return {
      summary: firstText(record.purpose, record.description, record.capability, record.summary, record.name),
      role: firstText(record.scope, record.availability, 'A Tool record describes an acting capability, its scope and evidence boundary; catalog presence does not prove live runtime availability.'),
      inside: recipes.map(recipe => firstText(recipe.title, recipe.id)).filter(Boolean),
      used: recipes.length ? 'Referenced by ' + recipes.length + ' Tool-use recipe' + (recipes.length === 1 ? '' : 's') + ' in the authored catalog.' : 'No Tool-use recipe was linked to this Tool in the loaded catalog.',
      next: recipes.slice(0, 8).map(recipe => firstText(recipe.skillName, recipe.title))
    };
  }
  if (kind === 'playbook') {
    return {
      summary: record.summary,
      role: record.kind === 'overview' ? 'Authored overview; an authoritative process source is not yet bound. This is not an execution contract.' : 'This documented process coordinates work, handoffs, and checks. Its outline is not evidence that your assistant followed it.',
      inside: record.outline,
      used: 'Catalog status: ' + record.status + '. Source: ' + record.source + '.',
      next: []
    };
  }
  if (kind === 'document') {
    return {summary:record.summary,role:'Current reference guidance. Category: ' + record.category + '.',inside:record.headings.map(heading => heading.label),used:'Published from ' + record.source + '.',next:[]};
  }
  if (kind === 'operating-pack' || kind === 'template') {
    return {
      summary: record.purpose,
      role: record.useWhen,
      inside: record.provides || [],
      used: record.status + (record.source?.availability === 'documentation_only' ? '. Source is documented; access depends on the assistant and its permissions.' : ''),
      next: []
    };
  }
  if (kind === 'recipe') {
    return {
      summary: record.when,
      role: record.requires,
      inside: record.steps || [],
      used: record.status + '. ' + record.mode,
      next: [record.output, record.fallback].filter(Boolean)
    };
  }
  if (kind === 'route') {
    return {
      summary: firstText(record.request, record.id),
      role: 'This documented route maps a request shape to a bounded target and declares its read, mutation, and handoff boundary.',
      inside: [
        ...(record.modes || []).map(mode => 'Mode: ' + mode),
        ...(record.first_reads || []).map(item => 'First read: ' + item)
      ],
      used: 'Primary space: ' + firstText(record.primary_space, 'unknown') + '. Target: ' + firstText(record.target, 'not declared') + '.',
      next: [record.next_handoff].filter(Boolean)
    };
  }
  return { summary:firstText(record.description, record.label, record.name), role:'', inside:[], used:'', next:[] };
}

function buildModel(bundle, docs, data, publication) {
  if (publication?.schema_version !== 'persona-library.site-publication/v1' || !Array.isArray(publication.documents) || !Array.isArray(publication.playbooks)) throw new Error('The generated Playbook and Docs publication is unavailable.');
  const canonicalPlaybookIds = new Set((data.playbookCatalog || []).map(record => record.id));
  if (publication.playbooks.length !== canonicalPlaybookIds.size || publication.playbooks.some(record => !canonicalPlaybookIds.has(record.id))) throw new Error('Playbook publication does not match the loaded canonical catalog.');
  if (bundle?.schema_version !== 'persona-library.agent-context/v0.1' || bundle?.route_id !== 'system-orientation') {
    throw new Error('The generated system-orientation bundle is unavailable or does not match the documented route.');
  }
  const graph = bundle.graph_fragment;
  if (!graph?.nodes?.length || !graph?.edges?.length || !graph?.provenance) {
    throw new Error('The system-orientation graph fragment is incomplete.');
  }
  const nodeById = new Map(graph.nodes.map(node => [node.id, node]));
  const edgeKey = (from, relationship, to) => graph.edges.some(edge => edge.from === from && edge.relationship === relationship && edge.to === to);
  const requiredEdges = [
    ['agent:repository-dispatcher','loads-for-semantic-work','routing:orientation-bootstrap'],
    ['route-group:docs','contains','route:system-orientation'],
    ['route:system-orientation','routes-to','skill-package:.agents/skills/persona-library-orientation'],
    ['routing:orientation-bootstrap','declares-space','space:docs'],
    ['space:docs','uses-route-group','route-group:docs']
  ];
  for (const [from, relationship, to] of requiredEdges) {
    if (!edgeKey(from, relationship, to)) throw new Error('Required documented routing edge is missing: ' + from + ' ' + relationship + ' ' + to);
  }

  const spaceById = new Map((bundle.space_index || []).map(space => [space.id, space]));
  const groupIds = ['personas','skills','operating-packs','templates','tools','playbooks','docs'];
  const itemById = new Map();
  const connections = buildWorkflowConnections(data);
  const groupDescriptions = {
    personas: 'The roles and perspectives that guide the work.',
    skills: 'Reusable capabilities applied by those roles.',
    'operating-packs': 'Context, conventions, and checks for a domain or project.',
    templates: 'Starting structures for documents and other artifacts.',
    tools: 'Capabilities for acting on files, services, and other systems.',
    playbooks: 'Guidance for coordinating work across stages and people.',
    docs: 'Instructions and routes for using the library.'
  };

  const register = item => {
    item.source ||= {kind:'repo-directory', locator:'rickvang/Persona-Library:content/library-data', selector:item.id};
    itemById.set(item.id, item);
    return item;
  };

  const groups = groupIds.map(groupId => {
    const space = spaceById.get(groupId);
    if (!space) throw new Error('Canonical system space is missing from the orientation index: ' + groupId);
    const items = [];
    if (groupId === 'personas') {
      for (const record of data.personas || []) {
        const workflows = data.flowLibrary?.[record.id] || [];
        const skills = (data.skillCatalog || []).filter(skill => skill.profiles?.some(profile => profile.personaId === record.id));
        const detail = describeRecord('persona', record, {workflows,skills});
        items.push(register({id:'persona:' + record.id, groupId, label:record.name || record.id, kind:'Persona', detail, raw:record}));
      }
    }
    if (groupId === 'skills') {
      for (const record of data.skillCatalog || []) {
        const detail = describeRecord('skill', record);
        items.push(register({id:'skill:' + record.id, groupId, label:record.name || record.id, kind:'Skill', detail, raw:record}));
      }
    }
    if (groupId === 'tools') {
      for (const record of buildToolEntries(data).filter(entry => entry.kind === 'canonical')) {
        const recipes = record.recipes;
        const detail = describeRecord('tool', record, {recipes});
        items.push(register({id:'tool:' + record.id, groupId, label:record.name || record.id, kind:'Tool', detail, raw:record, catalogHref:record.href}));
      }
    }
    if (groupId === 'playbooks') {
      for (const record of publication.playbooks) {
        const detail = describeRecord('playbook', record);
        items.push(register({id:'playbook:' + record.id, groupId, label:record.name || record.id, kind:'Playbook', detail, raw:record, catalogHref:record.href,source:{kind:'repo-file',locator:'rickvang/Persona-Library:' + record.source,selector:record.kind === 'overview' ? 'authored overview' : 'documented process'}}));
      }
    }
    if (groupId === 'operating-packs' || groupId === 'templates') {
      const kind = groupId === 'templates' ? 'template' : 'operating-pack';
      const catalog = groupId === 'templates' ? data.templateCatalog : data.operatingPackCatalog;
      for (const record of catalog || []) {
        items.push(register({id:kind + ':' + record.id, groupId, label:record.name,
          kind:kind === 'template' ? 'Template' : 'Operating Pack', detail:describeRecord(kind, record), raw:record, source:record.source}));
      }
    }
    if (groupId === 'docs') {
      for (const record of publication.documents) {
        items.push(register({id:'doc:' + record.id,groupId,label:record.title,kind:'Reference document',detail:describeRecord('document',record),raw:record,catalogHref:record.href,source:{kind:'repo-file',locator:'rickvang/Persona-Library:' + record.source,selector:'curated reference document'}}));
      }
      for (const record of docs.routes || []) {
        const detail = describeRecord('route', record);
        const id = 'route:' + record.id;
        items.push(register({
          id, groupId, label:record.id, kind:'Documented route', detail, raw:record,
          source:graph.provenance[id] || {kind:'repo-file',locator:'rickvang/Persona-Library:content/orientation/docs.json',selector:'routes[id=' + record.id + ']'}
        }));
      }
    }
    const spaceItem = register({
      id:'space:' + groupId,
      groupId,
      label:space.label,
      kind:'System space',
      detail:{
        summary:groupDescriptions[groupId],
        role:space.answers,
        inside:items.slice(0, 12).map(item => item.label),
        used:groupId === 'docs' ? 'The documented system-orientation request route enters the Docs space before choosing a downstream capability.' : 'This space is available to the orientation router when it is the smallest relevant domain for a request.',
        next:items.slice(0, 8).map(item => item.label)
      },
      source:graph.provenance['space:' + groupId] || {kind:'repo-file',locator:'rickvang/Persona-Library:content/site-orientation.json',selector:'spaces.' + groupId}
    });
    return {id:groupId, label:space.label, purpose:groupDescriptions[groupId], routeFile:space.route_file, items, spaceItem};
  });

  for (const record of data.toolUseRecipes || []) {
    register({id:'recipe:' + record.id, groupId:'tools', label:record.title, kind:'Tool-use guidance', detail:describeRecord('recipe',record), raw:record});
  }
  for (const workflow of connections.workflows) {
    register({id:workflow.id, groupId:'personas', label:workflow.title, kind:'Workflow', source:workflow.source});
  }

  const specialDescriptions = {
    'agent:repository-dispatcher': {
      summary:'The repository dispatcher is the root Persona-Library activation point.',
      role:'It chooses the shortest applicable path: repository plumbing can go directly to its target; library-semantic work uses semantic orientation; mixed work escalates before changing canonical meaning.',
      inside:['repository-plumbing path','library-semantic path','mixed-work escalation'],
      used:'It is the documented first decision point for repository work.',
      next:['Orientation bootstrap for semantic system work','Direct target for clear repository plumbing']
    },
    'routing:orientation-bootstrap': {
      summary:'The orientation bootstrap is the machine-readable entry point for request modes, semantic spaces, policy references, and route-group files.',
      role:'It identifies the relevant primary space without making that generated projection a new source of truth.',
      inside:(bundle.space_index || []).map(space => space.label),
      used:'The repository dispatcher loads it for library-semantic work.',
      next:['Docs routes','The smallest relevant semantic space']
    },
    'route-group:docs': {
      summary:'Docs routes are the documented request routes whose primary semantic space is Docs.',
      role:'They connect Docs-shaped requests to bounded targets and their read/mutation boundaries.',
      inside:(docs.routes || []).map(route => route.id),
      used:'The Docs space uses this route group. It contains system-orientation.',
      next:['system-orientation']
    },
    'skill-package:.agents/skills/persona-library-orientation': {
      summary:'A repository-local callable Skill for navigating Persona-Library semantic questions.',
      role:'It prefers the generated system-orientation bundle when valid, falls back to canonical route sources when needed, chooses the smallest relevant space, and returns a bounded read-only handoff packet.',
      inside:['bundle validation','smallest-space selection','canonical fallback','bounded orientation packet'],
      used:'The system-orientation route targets this package.',
      next:['Load the chosen space route only when a downstream route is needed','Hand off to the smallest available capability']
    }
  };

  for (const [id, detail] of Object.entries(specialDescriptions)) {
    const node = nodeById.get(id);
    if (!node) throw new Error('Required request-participant node is missing: ' + id);
    if (!itemById.has(id)) {
      register({id, groupId:'docs', label:node.label, kind:node.type.replaceAll('-', ' '), detail, raw:node, source:graph.provenance[id]});
    } else {
      const existing = itemById.get(id);
      existing.source ||= graph.provenance[id];
    }
  }

  const routeItem = itemById.get('route:system-orientation');
  if (routeItem) routeItem.source = graph.provenance['route:system-orientation'] || routeItem.source;

  const stages = [
    {
      id:'stage-dispatch', number:'01', title:'Choose the applicable request path',
      what:'The repository dispatcher separates clear repository plumbing from library-semantic work. Mixed work uses the plumbing path only until it would change canonical library meaning.',
      participants:['agent:repository-dispatcher'],
      next:'A question about the Persona Library system follows the library-semantic path and loads semantic orientation.',
      source:{kind:'repo-file',locator:'rickvang/Persona-Library:AGENTS.md',selector:'Choose the shortest activation path'}
    },
    {
      id:'stage-orientation', number:'02', title:'Load the documented system-orientation route',
      what:'For a Persona-Library system question, the dispatcher loads the orientation bootstrap, the bootstrap declares Docs, Docs uses its route group, and system-orientation routes to the persona-library-orientation package.',
      participants:['routing:orientation-bootstrap','space:docs','route-group:docs','route:system-orientation','skill-package:.agents/skills/persona-library-orientation'],
      next:'The orientation package validates the bounded generated bundle or falls back to the canonical bootstrap and Docs route sources.',
      source:graph.provenance['route:system-orientation']
    },
    {
      id:'stage-space', number:'03', title:'Choose the smallest relevant semantic space',
      what:'The orientation package uses the canonical space index to choose the smallest primary semantic space. It loads only that space’s route file when a downstream route must be selected.',
      participants:['skill-package:.agents/skills/persona-library-orientation','space:docs'],
      next:'The selected route determines the bounded downstream capability and preserves its mutation boundary.',
      source:{kind:'repo-file',locator:'rickvang/Persona-Library:.agents/skills/persona-library-orientation/SKILL.md',selector:'Preflight'}
    },
    {
      id:'stage-handoff', number:'04', title:'Hand off a bounded orientation packet',
      what:'Orientation returns only the goal, mode, primary and secondary spaces, artifacts, permission boundary, success criteria, assumptions or unknowns, and the smallest next handoff.',
      participants:['skill-package:.agents/skills/persona-library-orientation'],
      next:'The exact capability after this point depends on the selected space and request. The documented orientation route does not define one universal execution pipeline.',
      unknown:true,
      source:{kind:'repo-file',locator:'rickvang/Persona-Library:.agents/skills/persona-library-orientation/SKILL.md',selector:'Orientation packet / Handoff'}
    }
  ];

  const stageById = new Map(stages.map(stage => [stage.id, stage]));
  const stageLinksByItem = new Map([
    ['agent:repository-dispatcher',['stage-dispatch']],
    ['routing:orientation-bootstrap',['stage-orientation']],
    ['space:docs',['stage-orientation','stage-space']],
    ['route-group:docs',['stage-orientation']],
    ['route:system-orientation',['stage-orientation']],
    ['skill-package:.agents/skills/persona-library-orientation',['stage-orientation','stage-space','stage-handoff']]
  ]);

  return {
    bundle, docs, graph, groups, itemById, stages, stageById, stageLinksByItem, ...connections,
    otherSpaces:(bundle.space_index || []).filter(space => !groupIds.includes(space.id))
  };
}

function renderBreadcrumbs() {
  const parts = [];
  parts.push(state.view === 'system' ? '<strong>My System</strong>' : 'My System');
  if (state.view === 'request') parts.push('<strong>How Requests Work</strong>');
  if (state.view === 'workflow') {
    parts.push('<strong>Workflows</strong>');
    const workflow = model.workflowById.get(state.selectedWorkflowId);
    if (workflow) parts.push(htmlEscape(workflow.title));
    const item = model.itemById.get(state.selectedItemId);
    if (item) parts.push(htmlEscape(item.label));
  }
  const group = model.groups.find(item => item.id === state.selectedGroupId);
  if (state.view === 'system' && group) parts.push(htmlEscape(group.label));
  if (state.view === 'system' && state.selectedItemId) {
    const item = model.itemById.get(state.selectedItemId);
    if (item && item.id !== group?.spaceItem?.id) parts.push('<strong>' + htmlEscape(item.label) + '</strong>');
  }
  if (state.view === 'request' && state.selectedStageId) {
    const stage = model.stageById.get(state.selectedStageId);
    if (stage) parts.push(htmlEscape(stage.title));
  }
  breadcrumbs.innerHTML = parts.join('<span aria-hidden="true">›</span>');
}

function renderSystem() {
  const expanded = new Set(state.expandedGroups);
  const groups = model.groups.map(group => {
    const isOpen = expanded.has(group.id);
    const selectedGroup = state.selectedItemId === group.spaceItem.id;
    const preview = group.items.slice(0, 3).map(item => item.label).join(' · ');
    const query = groupFilters.get(group.id) || '';
    const filter = group.items.length > 10 ? '<input class="catalog-search" data-filter-group="' + htmlEscape(group.id) + '" type="search" aria-label="Filter ' + htmlEscape(group.label) + '" placeholder="Find in ' + htmlEscape(group.label) + '" value="' + htmlEscape(query) + '">' : '';
    const items = isOpen ? filter + '<div class="contained">' + group.items.map(item => {
      const selected = state.selectedItemId === item.id;
      const hidden = query && !item.label.toLowerCase().includes(query.toLowerCase());
      return '<button type="button" class="contained-item" data-item-id="' + htmlEscape(item.id) + '" data-group-id="' + htmlEscape(group.id) + '" aria-current="' + (selected ? 'true' : 'false') + '"' + (hidden ? ' hidden' : '') + '><span class="item-kind">' + htmlEscape(item.kind) + '</span><strong>' + htmlEscape(item.label) + '</strong></button>';
    }).join('') + '</div>' : '';
    return '<section class="system-group" data-group="' + htmlEscape(group.id) + '">' +
      '<div class="group-head">' +
        '<button type="button" class="group-select" data-group-select="' + htmlEscape(group.id) + '" aria-current="' + (selectedGroup ? 'true' : 'false') + '">' +
          '<strong>' + htmlEscape(group.label) + '</strong>' +
          '<span class="group-purpose">' + htmlEscape(group.purpose) + '</span>' +
          '<span class="group-preview">' + htmlEscape(group.items.length + ' record' + (group.items.length === 1 ? '' : 's') + (preview ? ' · ' + preview : '')) + '</span>' +
        '</button>' +
        '<button type="button" class="expand" data-expand-group="' + htmlEscape(group.id) + '" aria-expanded="' + (isOpen ? 'true' : 'false') + '" aria-label="' + htmlEscape((isOpen ? 'Collapse ' : 'Expand ') + group.label + ' contents') + '">' + (isOpen ? '−' : '+') + '</button>' +
      '</div>' + items + '</section>';
  }).join('');

  const other = model.otherSpaces.length ? '<details class="other-spaces"><summary>Other canonical spaces in the same orientation index</summary><dl>' +
    model.otherSpaces.map(space => '<dt>' + htmlEscape(space.label) + '</dt><dd>' + htmlEscape(space.answers) + '</dd>').join('') +
    '</dl></details>' : '';

  primary.innerHTML = '<p class="boundary-note"><strong>System contents.</strong> These groups and records come from the canonical library and orientation sources. Catalog presence describes declared system structure; it does not prove live runtime availability.</p><div class="group-list">' + groups + '</div>' + other;
}

function renderRequest() {
  const stages = model.stages.map(stage => {
    const selected = state.selectedStageId === stage.id;
    const participantMarkup = selected ? '<div class="stage-detail"><h3>System parts in this stage</h3><div class="participants">' +
      stage.participants.map(id => {
        const item = model.itemById.get(id);
        return item ? '<button type="button" class="participant" data-participant="' + htmlEscape(id) + '" data-stage="' + htmlEscape(stage.id) + '">' + htmlEscape(item.label) + '</button>' : '';
      }).join('') + '</div><h3 style="margin-top:12px">What determines the next step</h3><p>' + htmlEscape(stage.next) + '</p>' +
      (stage.unknown ? '<p class="unknown"><strong>Known boundary:</strong> this is where the universal walkthrough ends. Later execution is request-specific and is not represented here as if it were guaranteed.</p>' : '') +
      '</div>' : '';
    return '<li class="stage ' + (selected ? 'selected' : '') + '" data-number="' + stage.number + '" data-stage-row="' + htmlEscape(stage.id) + '">' +
      '<button type="button" class="stage-button" data-stage-id="' + htmlEscape(stage.id) + '" aria-current="' + (selected ? 'step' : 'false') + '"><h2>' + htmlEscape(stage.title) + '</h2><p>' + htmlEscape(stage.what) + '</p></button>' +
      participantMarkup + '</li>';
  }).join('');
  primary.innerHTML = '<p class="boundary-note"><strong>Documented / intended behavior — not an execution trace.</strong> This is the routing for a question about Persona Library. Task-specific work continues through the workflows below.</p><button type="button" class="where-button workflow-entry" data-view="workflow">Explore documented workflows →</button><ol class="stage-list">' + stages + '</ol>';
}

function connectionMarkup(id, includedLabels = null) {
  const links = (model.linksById.get(id) || []).filter(link => !includedLabels || includedLabels.includes(link.label));
  return links.map(link => {
    const item = model.itemById.get(link.id);
    if (!item) return '';
    const workflow = model.workflowById.get(link.id);
    const label = workflow ? workflow.title + ' · ' + workflow.personaName : item.label;
    return '<button type="button" class="connection-link" data-related-item="' + htmlEscape(item.id) + '"><span class="connection-kind">' + htmlEscape(link.label) + '</span><span>' + htmlEscape(label) + '</span><span aria-hidden="true">→</span></button>';
  }).join('');
}

function renderWorkflows() {
  const workflow = model.workflowById.get(state.selectedWorkflowId);
  if (!workflow) {
    const query = workflowSearch.trim().toLowerCase();
    const filtered = model.workflows.filter(item => (item.title + ' ' + item.personaName + ' ' + item.summary).toLowerCase().includes(query));
    primary.innerHTML = '<div class="workflow-index"><label for="workflow-search">Find a workflow</label><input class="catalog-search" id="workflow-search" type="search" placeholder="Name, purpose, or Persona" value="' + htmlEscape(workflowSearch) + '"><p class="catalog-count">' + filtered.length + ' documented workflows</p><div class="workflow-list">' + filtered.map(item => '<button type="button" class="workflow-row" data-related-item="' + htmlEscape(item.id) + '"><span class="connection-kind">' + htmlEscape(item.personaName) + '</span><strong>' + htmlEscape(item.title) + '</strong><span>' + htmlEscape(item.summary) + '</span><span class="row-arrow" aria-hidden="true">→</span></button>').join('') + (filtered.length ? '' : '<p>No workflows match this search.</p>') + '</div></div>';
    return;
  }
  const openActivities = activityDisclosure.get(workflow.id) || new Set([0]);
  const activities = workflow.activities.map((activity, index) => '<li class="activity"><details data-activity-index="' + index + '"' + (openActivities.has(index) ? ' open' : '') + '><summary><span class="activity-number">' + String(index + 1).padStart(2,'0') + '</span><span><strong>' + htmlEscape(activity.title) + '</strong><span class="activity-purpose">' + htmlEscape(activity.purpose || '') + '</span></span></summary><dl class="activity-detail">' + [
    ['When', activity.cadence], ['Watch for', activity.watchFor], ['Reference / tool example', activity.reference]
  ].filter(([,value]) => value).map(([label,value]) => '<dt>' + label + '</dt><dd>' + htmlEscape(value) + '</dd>').join('') + '</dl></details></li>').join('');
  primary.innerHTML = '<header class="workflow-head"><p class="explain-kicker">Documented workflow</p><h2 id="workflow-heading" tabindex="-1">' + htmlEscape(workflow.title) + '</h2><p>' + htmlEscape(workflow.summary) + '</p><p class="workflow-cadence">' + htmlEscape(workflow.cadence || '') + '</p></header><div class="workflow-connections">' + connectionMarkup(workflow.id, ['Owned by']) + '</div><p class="boundary-note"><strong>Documented activities.</strong> Shown in the order recorded, without a claim that a request followed them. Timing between activities and branches are not specified.</p><ol class="activity-list" data-workflow-id="' + htmlEscape(workflow.id) + '">' + activities + '</ol><section class="workflow-parts"><h3>Skills used in this workflow</h3>' + (connectionMarkup(workflow.id, ['Uses skill']) || '<p>No skill applications are linked in the catalog.</p>') + '</section>' + (connectionMarkup(workflow.id, ['Operating context','Starting artifact']) ? '<section class="workflow-parts"><h3>Context and starting artifacts</h3>' + connectionMarkup(workflow.id, ['Operating context','Starting artifact']) + '</section>' : '') + sourceDetails(workflow.source) + '<button type="button" class="where-button" data-workflow-index>All workflows →</button>';
}

function contextText(item) {
  const source = item.source || {};
  return [
    'Selected context: ' + item.label,
    'Type: ' + item.kind,
    'What it is: ' + firstText(item.detail?.summary, 'Not described'),
    'Role: ' + firstText(item.detail?.role, 'Not described'),
    source.locator ? 'Source: ' + source.locator + (source.selector ? ' — ' + source.selector : '') : '',
    '',
    'Question:'
  ].filter(line => line !== '').join('\n');
}

function renderExplanation() {
  const item = state.selectedItemId ? model.itemById.get(state.selectedItemId) : null;
  if (!item) {
    if (state.view === 'request' && state.selectedStageId) {
      const stage = model.stageById.get(state.selectedStageId);
      explanation.innerHTML = '<p class="explain-kicker">Documented request stage</p><h2>' + htmlEscape(stage?.title || 'Request stage') + '</h2><div class="explain-section"><h3>What is supposed to happen?</h3><p>' + htmlEscape(stage?.what || '') + '</p></div><div class="explain-section"><h3>What determines the next step?</h3><p>' + htmlEscape(stage?.next || '') + '</p></div>' + sourceDetails(stage?.source);
      return;
    }
    explanation.innerHTML = '<p class="empty-state">Select a system part to see what it is, why it matters, where it is used, and what you can explore next.</p>';
    return;
  }

  const stages = model.stageLinksByItem.get(item.id) || [];
  const whereButtons = stages.map(stageId => {
    const stage = model.stageById.get(stageId);
    return stage ? '<button type="button" class="where-button" data-where-stage="' + htmlEscape(stageId) + '" data-where-item="' + htmlEscape(item.id) + '">Open “' + htmlEscape(stage.title) + '” →</button>' : '';
  }).join('');

  const group = model.groups.find(group => group.spaceItem.id === item.id);
  const links = connectionMarkup(item.id);
  const inside = listMarkup(item.detail?.inside || []);
  const next = listMarkup(item.detail?.next || []);
  const whereText = stages.length
    ? htmlEscape(item.detail?.used || 'This item participates in the documented request walkthrough.')
    : htmlEscape(item.detail?.used || 'No request-stage link is established for this item in the bounded prototype.');

  explanation.innerHTML =
    '<p class="explain-kicker">' + htmlEscape(item.kind) + '</p>' +
    '<h2 tabindex="-1" id="selected-heading">' + htmlEscape(item.label) + '</h2>' +
    '<section class="explain-section"><h3>What is this?</h3><p>' + htmlEscape(item.detail?.summary || 'The loaded source does not provide a plain-language description for this item.') + '</p></section>' +
    '<section class="explain-section"><h3>What role does it play?</h3><p>' + htmlEscape(item.detail?.role || 'Its role is not described in the loaded bounded source.') + '</p></section>' +
    (item.catalogHref ? '<p><a href="' + htmlEscape(item.catalogHref) + '">Open full ' + htmlEscape(item.kind === 'Reference document' ? 'document' : item.kind) + ' details</a></p>' : '') +
    (group ? '<section class="explain-section"><h3>Contents</h3><button type="button" class="where-button" data-open-contents="' + htmlEscape(group.id) + '">Open ' + htmlEscape(group.label) + ' contents →</button></section>' : item.kind === 'Persona' || item.kind === 'Skill' ? '' : '<section class="explain-section"><h3>What is inside it?</h3>' + inside + '</section>') +
    '<section class="explain-section"><h3>Where is it used?</h3><p>' + whereText + '</p>' + whereButtons + '</section>' +
    '<section class="explain-section"><h3>Connected parts</h3>' + (links || (group ? '<p>Open this group to explore its records.</p>' : '<p>No additional connections are recorded here.</p>')) + '</section>' +
    (item.kind === 'Tool-use guidance' ? '<section class="explain-section"><h3>Result and fallback</h3>' + next + '</section>' : '') +
    '<details class="ask"><summary>Ask about this</summary><p class="prototype-boundary">Prototype boundary: this prepares the selected context for a question. It does not generate or submit an answer inside this page.</p><textarea id="ask-context" aria-label="Question context">' + htmlEscape(contextText(item)) + '</textarea><button type="button" class="copy-context" data-copy-context>Copy context</button></details>' +
    sourceDetails(item.source, item.id);
}

function sourceDetails(source, id = '') {
  if (!source) return '';
  const href = sourceHref(source);
  return '<details class="source-details"><summary>Identifiers & source</summary><dl>' +
    (id ? '<dt>Record</dt><dd>' + htmlEscape(id) + '</dd>' : '') +
    '<dt>Kind</dt><dd>' + htmlEscape(source.kind || 'not declared') + '</dd>' +
    '<dt>Locator</dt><dd>' + (href ? '<a href="' + htmlEscape(href) + '">' + htmlEscape(source.locator || source.repository + '/' + source.path) + '</a>' : htmlEscape(source.locator || 'not declared')) + '</dd>' +
    '<dt>Selector</dt><dd>' + htmlEscape(source.selector || 'not declared') + '</dd>' +
    '</dl></details>';
}

function announce(message) {
  status.innerHTML = '<strong>Updated.</strong> ' + htmlEscape(message);
}

function render(options = {}) {
  const active = document.activeElement;
  const focusAttribute = ['id','data-expand-group','data-stage-id','data-filter-group','data-view'].find(name => active?.hasAttribute(name));
  const previousFocus = focusAttribute ? '[' + focusAttribute + '="' + CSS.escape(active.getAttribute(focusAttribute)) + '"]' : null;
  const caret = active instanceof HTMLInputElement ? active.selectionStart : null;
  for (const list of primary.querySelectorAll('.contained')) groupScroll.set(list.closest('[data-group]').dataset.group, list.scrollTop);
  tabSystem.setAttribute('aria-selected', String(state.view === 'system'));
  tabRequest.setAttribute('aria-selected', String(state.view === 'request'));
  tabWorkflow.setAttribute('aria-selected', String(state.view === 'workflow'));
  for (const tab of [tabSystem,tabRequest,tabWorkflow]) tab.tabIndex = tab.getAttribute('aria-selected') === 'true' ? 0 : -1;
  backButton.disabled = !state.history.length;
  if (state.view === 'system') renderSystem();
  else if (state.view === 'workflow') renderWorkflows();
  else renderRequest();
  renderBreadcrumbs();
  renderExplanation();
  explanation.hidden = state.view === 'workflow' && !state.selectedItemId;
  layout.classList.toggle('full-width', explanation.hidden);
  layout.classList.toggle('is-detail', Boolean(state.selectedItemId));
  primary.setAttribute('aria-labelledby', state.view === 'system' ? 'tab-system' : state.view === 'workflow' ? 'tab-workflow' : 'tab-request');
  for (const list of primary.querySelectorAll('.contained')) list.scrollTop = groupScroll.get(list.closest('[data-group]').dataset.group) || 0;
  const focus = document.querySelector(options.focus || previousFocus || '#workflow-heading, #selected-heading');
  focus?.focus({preventScroll:true});
  if (caret !== null && focus instanceof HTMLInputElement) focus.setSelectionRange(caret,caret);
  if (options.ensureVisible) requestAnimationFrame(() => ensureCurrentVisible(options.scroll));
}

function ensureCurrentVisible(selector = null) {
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  const behavior = reduced ? 'auto' : 'smooth';
  let target = selector ? document.querySelector(selector) : null;
  if (!target && state.selectedItemId && matchMedia('(max-width:760px)').matches) target = explanation;
  if (!target && state.view === 'system' && state.selectedItemId) {
    target = [...document.querySelectorAll('[data-item-id]')].find(element => element.dataset.itemId === state.selectedItemId);
  }
  if (!target && state.view === 'system' && state.selectedGroupId) {
    target = [...document.querySelectorAll('[data-group]')].find(element => element.dataset.group === state.selectedGroupId);
  }
  if (!target && state.view === 'request' && state.selectedStageId) {
    target = [...document.querySelectorAll('[data-stage-row]')].find(element => element.dataset.stageRow === state.selectedStageId);
  }
  if (!target && state.view === 'workflow') target = document.getElementById('workflow-heading') || document.getElementById('workflow-search');
  target?.scrollIntoView({block:'nearest', behavior});
}

root.addEventListener('click', async event => {
  const related = event.target.closest('[data-related-item]');
  if (related) {
    const id = related.dataset.relatedItem;
    const item = model.itemById.get(id);
    if (!item) return;
    if (model.workflowById.has(id)) state = openWorkflow(state, id);
    else if (state.view === 'workflow' || state.view === 'request') state = inspectParticipant(state,id);
    else {
      state = selectItem(state,item.groupId,id);
      if (model.groups.find(group => group.id === item.groupId)?.items.some(item => item.id === id)) {
        state = {...state,expandedGroups:[...new Set([...state.expandedGroups,item.groupId])]};
      }
    }
    render({ensureVisible:true,focus:model.workflowById.has(id) ? '#workflow-heading' : '#selected-heading'});
    announce('Opened ' + item.label + '.');
    return;
  }
  const allWorkflows = event.target.closest('[data-workflow-index]');
  if (allWorkflows) {
    state = openWorkflow(state,null);
    render({ensureVisible:true,focus:'#workflow-search'});
    return;
  }
  const contents = event.target.closest('[data-open-contents]');
  if (contents) {
    const groupId = contents.dataset.openContents;
    state = {...selectItem(state,groupId,null),expandedGroups:[...new Set([...state.expandedGroups,groupId])]};
    render({ensureVisible:true,focus:'[data-expand-group="' + CSS.escape(groupId) + '"]',scroll:'[data-group="' + CSS.escape(groupId) + '"]'});
    return;
  }
  const viewButton = event.target.closest('[data-view]');
  if (viewButton) {
    const requested = viewButton.dataset.view;
    state = switchView(state, requested, 'stage-dispatch');
    if (requested === 'request' && !state.selectedStageId) state = {...state, selectedStageId:'stage-dispatch'};
    render({ensureVisible:true,focus:'[data-view="' + requested + '"]'});
    announce(requested === 'system' ? 'Returned to My System.' : requested === 'workflow' ? 'Opened documented workflows.' : 'Opened documented request handling.');
    return;
  }

  const expand = event.target.closest('[data-expand-group]');
  if (expand) {
    const groupId = expand.dataset.expandGroup;
    state = toggleGroup(state, groupId);
    render({ensureVisible:true,scroll:'[data-group="' + CSS.escape(groupId) + '"]'});
    const group = model.groups.find(item => item.id === groupId);
    announce((state.expandedGroups.includes(groupId) ? 'Expanded ' : 'Collapsed ') + (group?.label || groupId) + ' contents.');
    return;
  }

  const groupSelect = event.target.closest('[data-group-select]');
  if (groupSelect) {
    const group = model.groups.find(item => item.id === groupSelect.dataset.groupSelect);
    if (!group) return;
    state = selectSystemGroup(state, group.id, group.spaceItem.id);
    render({ensureVisible:true,focus:'#selected-heading'});
    announce('Selected ' + group.label + '.');
    return;
  }

  const itemButton = event.target.closest('[data-item-id]');
  if (itemButton) {
    state = selectItem(state, itemButton.dataset.groupId, itemButton.dataset.itemId);
    render({ensureVisible:true,focus:'#selected-heading'});
    announce('Selected ' + (model.itemById.get(itemButton.dataset.itemId)?.label || itemButton.dataset.itemId) + '.');
    return;
  }

  const stageButton = event.target.closest('[data-stage-id]');
  if (stageButton) {
    state = selectStage(state, stageButton.dataset.stageId);
    render({ensureVisible:true,focus:'[data-stage-id="' + CSS.escape(stageButton.dataset.stageId) + '"]'});
    announce('Opened request stage ' + (model.stageById.get(stageButton.dataset.stageId)?.title || '') + '.');
    return;
  }

  const participant = event.target.closest('[data-participant]');
  if (participant) {
    state = inspectParticipant(state, participant.dataset.participant, participant.dataset.stage);
    render({ensureVisible:true,focus:'#selected-heading'});
    announce('Inspecting ' + (model.itemById.get(participant.dataset.participant)?.label || participant.dataset.participant) + ' in this stage.');
    return;
  }

  const where = event.target.closest('[data-where-stage]');
  if (where) {
    state = openRequestStage(state, where.dataset.whereItem, where.dataset.whereStage);
    render({ensureVisible:true,focus:'#selected-heading'});
    announce('Opened the documented request stage that uses this item.');
    return;
  }

  const copy = event.target.closest('[data-copy-context]');
  if (copy) {
    const textarea = document.getElementById('ask-context');
    if (!textarea) return;
    try {
      await navigator.clipboard.writeText(textarea.value);
      announce('Question context copied.');
    } catch {
      textarea.focus();
      textarea.select();
      announce('Clipboard access was unavailable; the context is selected for copying.');
    }
  }
});

backButton.addEventListener('click', () => {
  const previous = state;
  state = goBack(state);
  if (state === previous) return;
  render({ensureVisible:true,focus:state.selectedItemId ? '#selected-heading' : state.view === 'workflow' ? '#workflow-heading, #workflow-search' : '#map-back'});
  announce('Restored the previous exploration context.');
});

root.addEventListener('input', event => {
  if (event.target.id === 'workflow-search') {
    workflowSearch = event.target.value;
    render({focus:'#workflow-search'});
  }
  const groupId = event.target.dataset.filterGroup;
  if (groupId) {
    groupFilters.set(groupId,event.target.value);
    const group = model.groups.find(group => group.id === groupId);
    for (const button of primary.querySelectorAll('[data-item-id]')) {
      if (button.dataset.groupId !== groupId) continue;
      const item = group.items.find(item => item.id === button.dataset.itemId);
      button.hidden = !item.label.toLowerCase().includes(event.target.value.toLowerCase());
    }
  }
});

root.addEventListener('toggle', event => {
  if (!event.target.isConnected || !event.target.hasAttribute('data-activity-index')) return;
  const list = event.target.closest('[data-workflow-id]');
  activityDisclosure.set(list.dataset.workflowId, new Set([...list.querySelectorAll('details[open]')].map(item => Number(item.dataset.activityIndex))));
}, true);

root.querySelector('[role="tablist"]').addEventListener('keydown', event => {
  if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
  event.preventDefault();
  const tabs = [tabSystem,tabRequest,tabWorkflow];
  const index = tabs.indexOf(document.activeElement);
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  tabs[next].click();
  tabs[next].focus();
});

let resizeFrame = null;
globalThis.addEventListener('resize', () => {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => ensureCurrentVisible());
});

async function start() {
  try {
    const [bundleResponse, docsResponse, publicationResponse] = await Promise.all([
      fetch('data/agent-context/system-orientation.json', {cache:'no-store'}),
      fetch('data/orientation/docs.json', {cache:'no-store'}),
      fetch('data/site-publication.json', {cache:'no-store'})
    ]);
    if (!bundleResponse.ok || !docsResponse.ok || !publicationResponse.ok) throw new Error('Could not load the generated orientation and publication sources.');
    const [bundle, docs, publication] = await Promise.all([bundleResponse.json(), docsResponse.json(), publicationResponse.json()]);
    const data = globalThis.PersonaLibraryData;
    if (!data) throw new Error('Persona Library data did not initialize.');
    model = buildModel(bundle, docs, data, publication);
    render();
    announce('Loaded source-backed system contents and documented request routing.');
  } catch (error) {
    primary.innerHTML = '<p class="boundary-note"><strong>System Map unavailable.</strong> ' + htmlEscape(error.message) + '</p>';
    explanation.innerHTML = '<p class="empty-state">No system relationships were inferred to fill the gap.</p>';
    status.textContent = 'Source loading failed.';
  }
}

start();
