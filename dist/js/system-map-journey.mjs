function snapshot(state) {
  return {
    view: state.view,
    expandedGroups: [...state.expandedGroups],
    selectedGroupId: state.selectedGroupId,
    selectedItemId: state.selectedItemId,
    selectedStageId: state.selectedStageId
  };
}

function checkpoint(state) {
  return {
    ...state,
    expandedGroups: [...state.expandedGroups],
    history: [...state.history, snapshot(state)]
  };
}

export function createJourneyState() {
  return {
    view: 'system',
    expandedGroups: [],
    selectedGroupId: null,
    selectedItemId: null,
    selectedStageId: null,
    history: []
  };
}

export function toggleGroup(state, groupId) {
  const next = checkpoint(state);
  const expanded = new Set(next.expandedGroups);
  if (expanded.has(groupId)) expanded.delete(groupId);
  else expanded.add(groupId);
  return {
    ...next,
    view: 'system',
    expandedGroups: [...expanded],
    selectedGroupId: groupId
  };
}

export function selectItem(state, groupId, itemId) {
  const next = checkpoint(state);
  return {
    ...next,
    view: 'system',
    selectedGroupId: groupId,
    selectedItemId: itemId,
    selectedStageId: null
  };
}

export function selectSystemGroup(state, groupId, itemId) {
  const next = checkpoint(state);
  return {
    ...next,
    view: 'system',
    selectedGroupId: groupId,
    selectedItemId: itemId,
    selectedStageId: null
  };
}

export function switchView(state, view, defaultStageId = null) {
  if (state.view === view) return state;
  const next = checkpoint(state);
  return {
    ...next,
    view,
    selectedStageId: view === 'request' ? (state.selectedStageId || defaultStageId) : state.selectedStageId
  };
}

export function openRequestStage(state, itemId, stageId) {
  const next = checkpoint(state);
  return {
    ...next,
    view: 'request',
    selectedItemId: itemId,
    selectedStageId: stageId
  };
}

export function selectStage(state, stageId) {
  const next = checkpoint(state);
  return {
    ...next,
    view: 'request',
    selectedStageId: stageId,
    selectedItemId: null
  };
}

export function inspectParticipant(state, itemId, stageId = state.selectedStageId) {
  const next = checkpoint(state);
  return {
    ...next,
    view: 'request',
    selectedItemId: itemId,
    selectedStageId: stageId
  };
}

export function goBack(state) {
  if (!state.history.length) return state;
  const previous = state.history[state.history.length - 1];
  return {
    ...previous,
    expandedGroups: [...previous.expandedGroups],
    history: state.history.slice(0, -1)
  };
}
