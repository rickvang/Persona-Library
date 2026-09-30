import {
  createJourneyState,
  toggleGroup,
  selectItem,
  selectSystemGroup,
  switchView,
  openRequestStage,
  selectStage,
  inspectParticipant,
  goBack
} from './system-map-journey.mjs';

const root = document.querySelector('[data-system-map-simple]');
const primary = document.getElementById('primary-surface');
const explanation = document.getElementById('explanation-panel');
const breadcrumbs = document.getElementById('map-breadcrumbs');
const backButton = document.getElementById('map-back');
const status = document.getElementById('map-status');
const tabSystem = document.getElementById('tab-system');
const tabRequest = document.getElementById('tab-request');

let state = createJourneyState();
let model = null;

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
  if (!source || source.kind !== 'repo-file' || !source.locator?.includes(':')) return '';
  const divider = source.locator.indexOf(':');
  const repo = source.locator.slice(0, divider);
  const path = source.locator.slice(divider + 1);
  return 'https://github.com/' + repo + '/blob/main/' + path;
}

function describeRecord(kind, record, context = {}) {
  if (kind === 'persona') {
    const workflows = context.workflows || [];
    const skills = context.skills || [];
    return {
      summary: firstText(record.summary, record.definition, record.purpose, record.tagline, record.description, record.role ? record.name + ' is a ' + record.role + ' Persona.' : ''),
      role: record.role ? 'This Persona is classified as ' + record.role + '. Its authored workflows and Skill applications describe the decisions it owns.' : 'Its authored workflows and Skill applications describe the decisions and work assigned to this Persona.',
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
      role: 'This is a normalized reusable Skill identity. Persona application profiles preserve role-specific triggers, workflows, actions, and evidence.',
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
      summary: firstText(record.purpose, record.description, record.name + (record.status ? ' — ' + record.status : '')),
      role: 'A Playbook supplies a process surface for Personas: stages, handoffs, state, gates, recovery, and learning toward an outcome. It is not an autonomous owner.',
      inside: labels(record.stages, 'title'),
      used: record.status ? 'Catalog status: ' + record.status + '.' : 'This record is present in the canonical Playbook catalog.',
      next: []
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

function buildModel(bundle, docs, data) {
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
  const groupIds = ['personas','skills','tools','playbooks','docs'];
  const itemById = new Map();

  const register = item => {
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
      for (const record of data.toolCatalog || []) {
        const recipes = (data.toolUseRecipes || []).filter(recipe => recipe.toolId === record.id || recipe.tool === record.name);
        const detail = describeRecord('tool', record, {recipes});
        items.push(register({id:'tool:' + record.id, groupId, label:record.name || record.id, kind:'Tool', detail, raw:record}));
      }
    }
    if (groupId === 'playbooks') {
      for (const record of data.playbookCatalog || []) {
        const detail = describeRecord('playbook', record);
        items.push(register({id:'playbook:' + record.id, groupId, label:record.name || record.id, kind:'Playbook', detail, raw:record}));
      }
    }
    if (groupId === 'docs') {
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
        summary:space.answers,
        role:'This is one of the semantic spaces declared by the canonical Persona-Library orientation index.',
        inside:items.slice(0, 12).map(item => item.label),
        used:groupId === 'docs' ? 'The documented system-orientation request route enters the Docs space before choosing a downstream capability.' : 'This space is available to the orientation router when it is the smallest relevant domain for a request.',
        next:items.slice(0, 8).map(item => item.label)
      },
      source:graph.provenance['space:' + groupId] || {kind:'repo-file',locator:'rickvang/Persona-Library:content/site-orientation.json',selector:'spaces.' + groupId}
    });
    return {id:groupId, label:space.label, purpose:space.answers, routeFile:space.route_file, items, spaceItem};
  });

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
    bundle, docs, graph, groups, itemById, stages, stageById, stageLinksByItem,
    otherSpaces:(bundle.space_index || []).filter(space => !groupIds.includes(space.id))
  };
}

function renderBreadcrumbs() {
  const parts = [];
  parts.push(state.view === 'system' ? '<strong>My System</strong>' : 'My System');
  if (state.view === 'request') parts.push('<strong>How Requests Work</strong>');
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
    const items = isOpen ? '<div class="contained">' + group.items.map(item => {
      const selected = state.selectedItemId === item.id;
      return '<button type="button" class="contained-item" data-item-id="' + htmlEscape(item.id) + '" data-group-id="' + htmlEscape(group.id) + '" aria-current="' + (selected ? 'true' : 'false') + '"><span class="item-kind">' + htmlEscape(item.kind) + '</span><strong>' + htmlEscape(item.label) + '</strong></button>';
    }).join('') + '</div>' : '';
    return '<section class="system-group" data-group="' + htmlEscape(group.id) + '">' +
      '<div class="group-head">' +
        '<button type="button" class="group-select" data-group-select="' + htmlEscape(group.id) + '" aria-current="' + (selectedGroup ? 'true' : 'false') + '">' +
          '<strong>' + htmlEscape(group.label) + '</strong>' +
          '<span class="group-purpose">' + htmlEscape(group.purpose) + '</span>' +
          '<span class="group-preview">' + htmlEscape(group.items.length + ' records' + (preview ? ' · ' + preview : '')) + '</span>' +
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
  primary.innerHTML = '<p class="boundary-note"><strong>Documented / intended behavior — not an execution trace.</strong> This walkthrough shows declared routing contracts. It does not claim that a conversation followed these stages, expose hidden reasoning, or provide observed runtime evidence.</p><ol class="stage-list">' + stages + '</ol>';
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

  const inside = listMarkup(item.detail?.inside || []);
  const next = listMarkup(item.detail?.next || []);
  const whereText = stages.length
    ? htmlEscape(item.detail?.used || 'This item participates in the documented request walkthrough.')
    : htmlEscape(item.detail?.used || 'No request-stage link is established for this item in the bounded prototype.');

  explanation.innerHTML =
    '<p class="explain-kicker">' + htmlEscape(item.kind) + '</p>' +
    '<h2 tabindex="-1" id="selected-heading">' + htmlEscape(item.label) + '</h2>' +
    '<p class="explain-id">' + htmlEscape(item.id) + '</p>' +
    '<section class="explain-section"><h3>What is this?</h3><p>' + htmlEscape(item.detail?.summary || 'The loaded source does not provide a plain-language description for this item.') + '</p></section>' +
    '<section class="explain-section"><h3>What role does it play?</h3><p>' + htmlEscape(item.detail?.role || 'Its role is not described in the loaded bounded source.') + '</p></section>' +
    '<section class="explain-section"><h3>What is inside it?</h3>' + inside + '</section>' +
    '<section class="explain-section"><h3>Where is it used?</h3><p>' + whereText + '</p>' + whereButtons + '</section>' +
    '<section class="explain-section"><h3>What can I explore next?</h3>' + next + '</section>' +
    '<details class="ask"><summary>Ask about this</summary><p class="prototype-boundary">Prototype boundary: this prepares the selected context for a question. It does not generate or submit an answer inside this page.</p><textarea id="ask-context" aria-label="Question context">' + htmlEscape(contextText(item)) + '</textarea><button type="button" class="copy-context" data-copy-context>Copy context</button></details>' +
    sourceDetails(item.source);
}

function sourceDetails(source) {
  if (!source) return '';
  const href = sourceHref(source);
  return '<details class="source-details"><summary>Identifiers & source</summary><dl>' +
    '<dt>Kind</dt><dd>' + htmlEscape(source.kind || 'not declared') + '</dd>' +
    '<dt>Locator</dt><dd>' + (href ? '<a href="' + htmlEscape(href) + '">' + htmlEscape(source.locator || '') + '</a>' : htmlEscape(source.locator || 'not declared')) + '</dd>' +
    '<dt>Selector</dt><dd>' + htmlEscape(source.selector || 'not declared') + '</dd>' +
    '</dl></details>';
}

function announce(message) {
  status.innerHTML = '<strong>Updated.</strong> ' + htmlEscape(message);
}

function render(options = {}) {
  tabSystem.setAttribute('aria-selected', String(state.view === 'system'));
  tabRequest.setAttribute('aria-selected', String(state.view === 'request'));
  backButton.disabled = !state.history.length;
  if (state.view === 'system') renderSystem();
  else renderRequest();
  renderBreadcrumbs();
  renderExplanation();
  if (options.ensureVisible) requestAnimationFrame(ensureCurrentVisible);
}

function ensureCurrentVisible() {
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  const behavior = reduced ? 'auto' : 'smooth';
  let target = null;
  if (state.view === 'system' && state.selectedItemId) {
    target = [...document.querySelectorAll('[data-item-id]')].find(element => element.dataset.itemId === state.selectedItemId);
  }
  if (state.view === 'request' && state.selectedStageId) {
    target = [...document.querySelectorAll('[data-stage-row]')].find(element => element.dataset.stageRow === state.selectedStageId);
  }
  target?.scrollIntoView({block:'nearest', behavior});
}

root.addEventListener('click', async event => {
  const viewButton = event.target.closest('[data-view]');
  if (viewButton) {
    const requested = viewButton.dataset.view;
    state = switchView(state, requested, 'stage-dispatch');
    if (requested === 'request' && !state.selectedStageId) state = {...state, selectedStageId:'stage-dispatch'};
    render({ensureVisible:true});
    announce(requested === 'system' ? 'Returned to My System.' : 'Opened documented request handling.');
    return;
  }

  const expand = event.target.closest('[data-expand-group]');
  if (expand) {
    const groupId = expand.dataset.expandGroup;
    state = toggleGroup(state, groupId);
    render({ensureVisible:true});
    const group = model.groups.find(item => item.id === groupId);
    announce((state.expandedGroups.includes(groupId) ? 'Expanded ' : 'Collapsed ') + (group?.label || groupId) + ' contents.');
    return;
  }

  const groupSelect = event.target.closest('[data-group-select]');
  if (groupSelect) {
    const group = model.groups.find(item => item.id === groupSelect.dataset.groupSelect);
    if (!group) return;
    state = selectSystemGroup(state, group.id, group.spaceItem.id);
    render({ensureVisible:true});
    announce('Selected ' + group.label + '.');
    return;
  }

  const itemButton = event.target.closest('[data-item-id]');
  if (itemButton) {
    state = selectItem(state, itemButton.dataset.groupId, itemButton.dataset.itemId);
    render({ensureVisible:true});
    announce('Selected ' + (model.itemById.get(itemButton.dataset.itemId)?.label || itemButton.dataset.itemId) + '.');
    return;
  }

  const stageButton = event.target.closest('[data-stage-id]');
  if (stageButton) {
    state = selectStage(state, stageButton.dataset.stageId);
    render({ensureVisible:true});
    announce('Opened request stage ' + (model.stageById.get(stageButton.dataset.stageId)?.title || '') + '.');
    return;
  }

  const participant = event.target.closest('[data-participant]');
  if (participant) {
    state = inspectParticipant(state, participant.dataset.participant, participant.dataset.stage);
    render({ensureVisible:true});
    announce('Inspecting ' + (model.itemById.get(participant.dataset.participant)?.label || participant.dataset.participant) + ' in this stage.');
    return;
  }

  const where = event.target.closest('[data-where-stage]');
  if (where) {
    state = openRequestStage(state, where.dataset.whereItem, where.dataset.whereStage);
    render({ensureVisible:true});
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
  render({ensureVisible:true});
  announce('Restored the previous exploration context.');
});

let resizeFrame = null;
globalThis.addEventListener('resize', () => {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(ensureCurrentVisible);
});

async function start() {
  try {
    const [bundleResponse, docsResponse] = await Promise.all([
      fetch('data/agent-context/system-orientation.json', {cache:'no-store'}),
      fetch('data/orientation/docs.json', {cache:'no-store'})
    ]);
    if (!bundleResponse.ok || !docsResponse.ok) throw new Error('Could not load the generated orientation sources.');
    const [bundle, docs] = await Promise.all([bundleResponse.json(), docsResponse.json()]);
    const data = globalThis.PersonaLibraryData;
    if (!data) throw new Error('Persona Library data did not initialize.');
    model = buildModel(bundle, docs, data);
    render();
    announce('Loaded source-backed system contents and documented request routing.');
  } catch (error) {
    primary.innerHTML = '<p class="boundary-note"><strong>Prototype unavailable.</strong> ' + htmlEscape(error.message) + '</p>';
    explanation.innerHTML = '<p class="empty-state">No system relationships were inferred to fill the gap.</p>';
    status.textContent = 'Source loading failed.';
  }
}

start();
