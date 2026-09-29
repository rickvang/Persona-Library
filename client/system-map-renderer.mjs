import {
  directNeighbors,
  indexGraph,
  rootNodeIds,
  visibleNodeIds
} from './system-map-graph.mjs';

export const DEFAULT_BRANCH_CHUNK = 24;

function readableRelationship(value) {
  return String(value || '').replaceAll('-', ' ');
}

function typeGroup(type) {
  const value = String(type || '').toLowerCase();
  if (value.includes('persona')) return 'persona';
  if (value.includes('skill')) return 'skill';
  if (value.includes('repository') || value.includes('repo')) return 'repository';
  if (value.includes('route') || value.includes('dispatcher') || value.includes('runtime')) return 'runtime';
  if (value.includes('source') || value.includes('generated') || value.includes('artifact')) return 'artifact';
  if (value.includes('boundary') || value.includes('validation') || value.includes('truth')) return 'boundary';
  return 'concept';
}

export function initialExpandedIds(graph, { maxVisible = 24 } = {}) {
  const roots = rootNodeIds(graph);
  const expanded = new Set(roots);
  const firstLevel = visibleNodeIds(graph, expanded);
  return firstLevel.size <= maxVisible ? expanded : new Set();
}

export function boundedVisibleNodeIds(
  graph,
  expandedIds = [],
  expansionLimits = new Map(),
  { chunkSize = DEFAULT_BRANCH_CHUNK, seedIds = [] } = {}
) {
  const knownIds = new Set(graph.nodes.map(node => node.id));
  const visible = new Set(rootNodeIds(graph));

  for (const id of seedIds) {
    if (knownIds.has(id)) visible.add(id);
  }

  for (const id of expandedIds) {
    if (!visible.has(id)) continue;
    const limitValue = Number(expansionLimits?.get?.(id) ?? chunkSize);
    const limit = Number.isFinite(limitValue) && limitValue > 0 ? Math.floor(limitValue) : chunkSize;
    for (const node of directNeighbors(graph, id).nodes.slice(0, limit)) visible.add(node.id);
  }

  return visible;
}

export function rendererElements(graph, visibleIds) {
  const visible = visibleIds instanceof Set ? visibleIds : new Set(visibleIds || []);
  const { incoming, outgoing } = indexGraph(graph);

  const nodes = graph.nodes
    .filter(node => visible.has(node.id))
    .map(node => ({
      group: 'nodes',
      data: {
        id: node.id,
        label: node.label,
        type: node.type,
        typeGroup: typeGroup(node.type),
        incomingCount: incoming.get(node.id).length,
        outgoingCount: outgoing.get(node.id).length
      }
    }));

  const edges = graph.edges
    .filter(edge => visible.has(edge.from) && visible.has(edge.to))
    .map(edge => ({
      group: 'edges',
      data: {
        id: edge.id,
        source: edge.from,
        target: edge.to,
        relationship: edge.relationship,
        label: readableRelationship(edge.relationship)
      }
    }));

  return [...nodes, ...edges];
}

function topologySignature(graph, elements) {
  const ids = elements.map(element => element.data.id).sort().join('|');
  return String(graph.scope || '') + '::' + ids;
}

function stylesheet() {
  return [
    {
      selector: 'node',
      style: {
        'background-color': '#fffefa',
        'border-color': '#b8c2c9',
        'border-width': 1.5,
        'color': '#15202b',
        'font-family': 'Inter, ui-sans-serif, system-ui, sans-serif',
        'font-size': 11,
        'font-weight': 650,
        'height': 58,
        'label': 'data(label)',
        'shape': 'round-rectangle',
        'text-halign': 'center',
        'text-max-width': 126,
        'text-valign': 'center',
        'text-wrap': 'wrap',
        'width': 154
      }
    },
    {
      selector: 'node[typeGroup = "persona"]',
      style: { 'background-color': '#f4e7ff', 'border-color': '#b18acb' }
    },
    {
      selector: 'node[typeGroup = "skill"]',
      style: { 'background-color': '#e9f5ff', 'border-color': '#82afd0' }
    },
    {
      selector: 'node[typeGroup = "repository"]',
      style: { 'background-color': '#e8f6ef', 'border-color': '#79ad92' }
    },
    {
      selector: 'node[typeGroup = "runtime"]',
      style: { 'background-color': '#fff1e8', 'border-color': '#c99878' }
    },
    {
      selector: 'node[typeGroup = "artifact"]',
      style: { 'background-color': '#f3f1e8', 'border-color': '#aaa17a' }
    },
    {
      selector: 'node[typeGroup = "boundary"]',
      style: { 'background-color': '#fff8db', 'border-color': '#c8aa48' }
    },
    {
      selector: 'edge',
      style: {
        'curve-style': 'bezier',
        'line-color': '#b9c3ca',
        'opacity': 0.82,
        'target-arrow-color': '#8c9aa4',
        'target-arrow-shape': 'triangle',
        'width': 1.5
      }
    },
    {
      selector: 'node.selected',
      style: {
        'border-color': '#234f68',
        'border-width': 3,
        'overlay-color': '#234f68',
        'overlay-opacity': 0.06
      }
    },
    {
      selector: 'node.neighbor',
      style: {
        'border-color': '#5f7e90',
        'border-width': 2
      }
    },
    {
      selector: 'node.path',
      style: {
        'background-color': '#fff0b8',
        'border-color': '#987416',
        'border-width': 3
      }
    },
    {
      selector: 'edge.outgoing-highlight',
      style: {
        'line-color': '#376f8c',
        'target-arrow-color': '#376f8c',
        'width': 2.6,
        'label': 'data(label)',
        'font-size': 9,
        'color': '#49606f',
        'text-background-color': '#fffefa',
        'text-background-opacity': 0.94,
        'text-background-padding': 3,
        'text-rotation': 'autorotate'
      }
    },
    {
      selector: 'edge.incoming-highlight',
      style: {
        'line-color': '#7d6aa1',
        'target-arrow-color': '#7d6aa1',
        'width': 2.6,
        'label': 'data(label)',
        'font-size': 9,
        'color': '#5f5573',
        'text-background-color': '#fffefa',
        'text-background-opacity': 0.94,
        'text-background-padding': 3,
        'text-rotation': 'autorotate'
      }
    },
    {
      selector: 'edge.path',
      style: {
        'line-color': '#a77f18',
        'target-arrow-color': '#a77f18',
        'width': 4,
        'opacity': 1,
        'label': 'data(label)',
        'font-size': 9,
        'font-weight': 700,
        'color': '#6e5719',
        'text-background-color': '#fffefa',
        'text-background-opacity': 0.96,
        'text-background-padding': 3,
        'text-rotation': 'autorotate'
      }
    },
    {
      selector: 'edge.exact-edge',
      style: {
        'line-color': '#d5563a',
        'target-arrow-color': '#d5563a',
        'width': 5,
        'opacity': 1,
        'label': 'data(label)',
        'font-size': 10,
        'font-weight': 800,
        'color': '#7e301f',
        'text-background-color': '#fffefa',
        'text-background-opacity': 0.98,
        'text-background-padding': 4,
        'text-rotation': 'autorotate'
      }
    },
    {
      selector: '.dimmed',
      style: { 'opacity': 0.18 }
    },
    {
      selector: '.filtered-out',
      style: { 'opacity': 0.1 }
    }
  ];
}

export class SystemMapRenderer {
  constructor({ container, cytoscapeFactory, onSelect } = {}) {
    if (!container) throw new Error('System Map renderer requires a container.');
    if (typeof cytoscapeFactory !== 'function') throw new Error('Cytoscape renderer is unavailable.');
    this.container = container;
    this.cytoscapeFactory = cytoscapeFactory;
    this.onSelect = onSelect;
    this.cy = null;
    this.signature = '';
  }

  destroy() {
    this.cy?.destroy();
    this.cy = null;
    this.signature = '';
  }

  fit({ padding = 56 } = {}) {
    if (!this.cy || this.cy.elements().empty()) return;
    this.cy.fit(this.cy.elements(), padding);
  }

  focus(id, { padding = 96 } = {}) {
    if (!this.cy || !id) return;
    const node = this.cy.getElementById(id);
    if (node.empty()) return;
    this.cy.fit(node.closedNeighborhood(), padding);
  }

  getViewport() {
    if (!this.cy) return null;
    return {
      zoom: this.cy.zoom(),
      pan: { ...this.cy.pan() }
    };
  }

  restoreViewport(viewport) {
    if (!this.cy || !viewport) return;
    if (Number.isFinite(viewport.zoom)) this.cy.zoom(viewport.zoom);
    if (viewport.pan && Number.isFinite(viewport.pan.x) && Number.isFinite(viewport.pan.y)) {
      this.cy.pan(viewport.pan);
    }
  }

  positionLocalTopology({ anchorNodeId, addedNodeIds = [], previousPositions, layoutDirection = 'vertical' }) {
    if (!this.cy || !previousPositions?.size) return;

    this.cy.nodes().forEach(node => {
      const previous = previousPositions.get(node.id());
      if (previous) node.position(previous);
    });

    if (!anchorNodeId || !addedNodeIds.length) return;
    const anchor = this.cy.getElementById(anchorNodeId);
    if (anchor.empty()) return;
    const origin = anchor.position();
    const outgoing = [];
    const incoming = [];
    const unclassified = [];

    for (const id of addedNodeIds) {
      const node = this.cy.getElementById(id);
      if (node.empty()) continue;
      const connecting = node.edgesWith(anchor);
      if (connecting.some(edge => edge.source().id() === anchorNodeId && edge.target().id() === id)) outgoing.push(node);
      else if (connecting.some(edge => edge.target().id() === anchorNodeId && edge.source().id() === id)) incoming.push(node);
      else unclassified.push(node);
    }

    const place = (nodes, sign) => {
      const perColumn = Math.min(6, Math.max(1, nodes.length));
      nodes.forEach((node, index) => {
        const column = Math.floor(index / perColumn);
        const row = index % perColumn;
        const rowsInColumn = Math.min(perColumn, nodes.length - column * perColumn);
        const crossOffset = (row - (rowsInColumn - 1) / 2) * 92;
        const primaryOffset = sign * (220 + column * 190);
        node.position(layoutDirection === 'horizontal'
          ? { x: origin.x + primaryOffset, y: origin.y + crossOffset }
          : { x: origin.x + crossOffset, y: origin.y + primaryOffset });
      });
    };

    place(outgoing, 1);
    place(incoming, -1);
    place(unclassified, 1);
  }

  revealLocalTopology({ anchorNodeId, addedNodeIds = [], padding = 28 } = {}) {
    if (!this.cy || !anchorNodeId || !addedNodeIds.length) return;
    const anchor = this.cy.getElementById(anchorNodeId);
    if (anchor.empty()) return;

    let collection = anchor;
    for (const id of addedNodeIds) {
      const node = this.cy.getElementById(id);
      if (!node.empty()) collection = collection.union(node);
    }

    const bounds = collection.renderedBoundingBox({ includeLabels: true });
    const width = this.container.clientWidth || 0;
    const height = this.container.clientHeight || 0;
    if (!width || !height) return;

    let x = 0;
    let y = 0;
    if (bounds.x1 < padding) x = padding - bounds.x1;
    else if (bounds.x2 > width - padding) x = width - padding - bounds.x2;
    if (bounds.y1 < padding) y = padding - bounds.y1;
    else if (bounds.y2 > height - padding) y = height - padding - bounds.y2;

    if (x || y) this.cy.panBy({ x, y });
  }

  render({
    graph,
    visibleIds,
    selectedId = null,
    path = null,
    highlightedEdgeId = null,
    filters = {},
    layoutDirection = 'vertical',
    preserveViewport = false,
    anchorNodeId = null,
    fitOnTopologyChange = true
  }) {
    const elements = rendererElements(graph, visibleIds);
    const signature = topologySignature(graph, elements);
    const topologyChanged = signature !== this.signature;
    const previousViewport = preserveViewport ? this.getViewport() : null;
    const previousPositions = new Map();
    const previousNodeIds = new Set();

    if (this.cy) {
      this.cy.nodes().forEach(node => {
        previousNodeIds.add(node.id());
        previousPositions.set(node.id(), { ...node.position() });
      });
    }

    if (!this.cy) {
      this.cy = this.cytoscapeFactory({
        container: this.container,
        elements,
        style: stylesheet(),
        minZoom: 0.22,
        maxZoom: 2.6,
        wheelSensitivity: 0.16,
        boxSelectionEnabled: false,
        autoungrabify: true
      });
      this.cy.on('tap', 'node', event => {
        this.onSelect?.(event.target.id());
      });
      this.signature = signature;
    } else if (topologyChanged) {
      this.cy.batch(() => {
        this.cy.elements().remove();
        this.cy.add(elements);
      });
      this.signature = signature;
    }

    if (topologyChanged) {
      const addedNodeIds = this.cy.nodes()
        .map(node => node.id())
        .filter(id => !previousNodeIds.has(id));

      if (preserveViewport && previousViewport && previousPositions.size) {
        this.positionLocalTopology({
          anchorNodeId,
          addedNodeIds,
          previousPositions,
          layoutDirection
        });
        this.restoreViewport(previousViewport);
        this.revealLocalTopology({ anchorNodeId, addedNodeIds });
      } else {
        this.cy.layout({
          name: 'breadthfirst',
          directed: true,
          circle: false,
          grid: false,
          avoidOverlap: true,
          nodeDimensionsIncludeLabels: true,
          spacingFactor: elements.length > 90 ? 0.92 : 1.12,
          padding: 42,
          animate: false,
          transform: layoutDirection === 'horizontal'
            ? (_node, position) => ({ x: position.y, y: position.x })
            : undefined
        }).run();

        if (fitOnTopologyChange) this.fit();
      }
    }

    this.applyState({ selectedId, path, highlightedEdgeId, filters });
  }

  applyState({ selectedId = null, path = null, highlightedEdgeId = null, filters = {} } = {}) {
    if (!this.cy) return;

    this.cy.elements().removeClass('selected neighbor path exact-edge dimmed filtered-out outgoing-highlight incoming-highlight');

    const nodeType = String(filters.nodeType || '');
    const relationship = String(filters.relationship || '');

    if (nodeType) {
      this.cy.nodes().forEach(node => {
        if (node.data('type') !== nodeType) node.addClass('filtered-out');
      });
      this.cy.edges().forEach(edge => {
        if (edge.source().hasClass('filtered-out') || edge.target().hasClass('filtered-out')) {
          edge.addClass('filtered-out');
        }
      });
    }

    if (relationship) {
      const matchingEdges = this.cy.edges().filter(edge => edge.data('relationship') === relationship);
      const matchingNodes = matchingEdges.connectedNodes();
      this.cy.edges().difference(matchingEdges).addClass('filtered-out');
      this.cy.nodes().difference(matchingNodes).addClass('filtered-out');
    }

    const selected = selectedId ? this.cy.getElementById(selectedId) : this.cy.collection();
    const pathNodeIds = new Set(path?.nodes || []);
    const pathEdgeIds = new Set(path?.edges || []);

    if (selected && !selected.empty()) {
      selected.removeClass('filtered-out').addClass('selected');
      const connectedEdges = selected.connectedEdges();
      connectedEdges.removeClass('filtered-out');
      connectedEdges.connectedNodes().removeClass('filtered-out').addClass('neighbor');
      connectedEdges.forEach(edge => {
        if (edge.source().id() === selectedId) edge.addClass('outgoing-highlight');
        if (edge.target().id() === selectedId) edge.addClass('incoming-highlight');
      });

      this.cy.elements().forEach(element => {
        if (
          element.same(selected) ||
          element.hasClass('neighbor') ||
          element.hasClass('outgoing-highlight') ||
          element.hasClass('incoming-highlight')
        ) return;
        element.addClass('dimmed');
      });
    }

    for (const id of pathNodeIds) {
      const node = this.cy.getElementById(id);
      if (!node.empty()) node.removeClass('dimmed filtered-out').addClass('path');
    }
    for (const id of pathEdgeIds) {
      const edge = this.cy.getElementById(id);
      if (!edge.empty()) edge.removeClass('dimmed filtered-out').addClass('path');
    }

    if (highlightedEdgeId) {
      const edge = this.cy.getElementById(highlightedEdgeId);
      if (!edge.empty()) {
        edge.removeClass('dimmed filtered-out').addClass('exact-edge');
        edge.connectedNodes().removeClass('dimmed filtered-out');
      }
    }
  }
}
