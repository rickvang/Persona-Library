import {
  directNeighbors,
  indexGraph,
  rootNodeIds,
  visibleNodeIds
} from './system-map-graph.mjs';

export const DEFAULT_BRANCH_CHUNK = 24;
export const NODE_LABEL_MODEL_PX = 11;
export const MIN_RENDERED_LABEL_PX = 12;
export const MIN_READABLE_ZOOM = MIN_RENDERED_LABEL_PX / NODE_LABEL_MODEL_PX;
export const MAX_INITIAL_ZOOM = 1.32;
export const LOCAL_REVEAL_GAP = 30;
export const NODE_MODEL_WIDTH = 144;
export const NODE_MODEL_HEIGHT = 54;
export const LOCAL_PRIMARY_GAP = 62;

export function renderedLabelPixels(zoom, modelFontPx = NODE_LABEL_MODEL_PX) {
  return Math.max(0, Number(zoom) || 0) * Math.max(0, Number(modelFontPx) || 0);
}

export function neighborhoodWindow({
  total,
  offset = 0,
  batchSize = 1,
  direction = 'current'
} = {}) {
  const count = Math.max(0, Math.floor(Number(total) || 0));
  const size = Math.max(1, Math.floor(Number(batchSize) || 1));
  const maxOffset = count ? Math.floor((count - 1) / size) * size : 0;
  const currentOffset = Math.min(maxOffset, Math.max(0, Math.floor(Number(offset) || 0)));
  let nextOffset = currentOffset;

  if (direction === 'next') nextOffset = Math.min(maxOffset, currentOffset + size);
  if (direction === 'previous') nextOffset = Math.max(0, currentOffset - size);

  const end = Math.min(count, nextOffset + size);
  return {
    offset: nextOffset,
    start: count ? nextOffset + 1 : 0,
    end,
    total: count,
    size: Math.max(0, end - nextOffset),
    hasPrevious: nextOffset > 0,
    hasNext: end < count
  };
}

export function rectangleFromCenter({ x, y, width, height, id = null }) {
  return {
    id,
    x,
    y,
    width,
    height,
    x1: x - width / 2,
    x2: x + width / 2,
    y1: y - height / 2,
    y2: y + height / 2
  };
}

export function rectanglesOverlap(a, b, gap = 0) {
  return !(
    a.x2 + gap <= b.x1 ||
    a.x1 - gap >= b.x2 ||
    a.y2 + gap <= b.y1 ||
    a.y1 - gap >= b.y2
  );
}

function crossSlot(index) {
  if (index === 0) return 0;
  const distance = Math.ceil(index / 2);
  return index % 2 ? -distance : distance;
}

export function planLocalNodePositions({
  anchor,
  nodes = [],
  occupied = [],
  layoutDirection = 'vertical',
  gap = LOCAL_REVEAL_GAP,
  primaryGap = LOCAL_PRIMARY_GAP,
  maxColumns = 14,
  maxCrossSlots = 18
} = {}) {
  if (!anchor) return new Map();
  const placed = new Map();
  const reserved = occupied.map(item => rectangleFromCenter(item));
  const anchorRect = rectangleFromCenter(anchor);
  if (!reserved.some(item => item.id === anchor.id)) reserved.push(anchorRect);

  for (const spec of nodes) {
    const width = Math.max(1, Number(spec.width) || 1);
    const height = Math.max(1, Number(spec.height) || 1);
    const sign = spec.direction === 'incoming' ? -1 : 1;
    const nodePrimary = layoutDirection === 'horizontal' ? width : height;
    const anchorPrimary = layoutDirection === 'horizontal' ? anchor.width : anchor.height;
    const nodeCross = layoutDirection === 'horizontal' ? height : width;
    const anchorCross = layoutDirection === 'horizontal' ? anchor.height : anchor.width;
    const primaryStride = nodePrimary + gap + 26;
    const crossStride = Math.max(nodeCross, anchorCross) + gap;
    let chosen = null;

    for (let column = 0; column < maxColumns && !chosen; column += 1) {
      const primary = sign * (anchorPrimary / 2 + nodePrimary / 2 + primaryGap + column * primaryStride);
      for (let slotIndex = 0; slotIndex < maxCrossSlots; slotIndex += 1) {
        const cross = crossSlot(slotIndex) * crossStride;
        const candidate = layoutDirection === 'horizontal'
          ? rectangleFromCenter({
            id: spec.id,
            x: anchor.x + primary,
            y: anchor.y + cross,
            width,
            height
          })
          : rectangleFromCenter({
            id: spec.id,
            x: anchor.x + cross,
            y: anchor.y + primary,
            width,
            height
          });

        if (!reserved.some(existing => rectanglesOverlap(candidate, existing, gap / 2))) {
          chosen = candidate;
          break;
        }
      }
    }

    if (!chosen) {
      const fallbackIndex = placed.size + 1;
      chosen = rectangleFromCenter({
        id: spec.id,
        x: anchor.x + (layoutDirection === 'horizontal' ? sign * fallbackIndex * (width + gap) : 0),
        y: anchor.y + (layoutDirection === 'horizontal' ? 0 : sign * fallbackIndex * (height + gap)),
        width,
        height
      });
    }

    reserved.push(chosen);
    placed.set(spec.id, { x: chosen.x, y: chosen.y });
  }

  return placed;
}

export function localRevealCamera({
  bounds,
  canvasWidth,
  canvasHeight,
  currentZoom,
  minZoom = MIN_READABLE_ZOOM,
  padding = 32
} = {}) {
  const width = Math.max(0, Number(canvasWidth) || 0);
  const height = Math.max(0, Number(canvasHeight) || 0);
  const zoom = Math.max(minZoom, Number(currentZoom) || minZoom);
  if (!bounds || !width || !height) {
    return { zoom, scale: 1, fits: false };
  }

  const availableWidth = Math.max(1, width - padding * 2);
  const availableHeight = Math.max(1, height - padding * 2);
  const boundsWidth = Math.max(1, bounds.width ?? (bounds.x2 - bounds.x1));
  const boundsHeight = Math.max(1, bounds.height ?? (bounds.y2 - bounds.y1));
  const scale = Math.min(1, availableWidth / boundsWidth, availableHeight / boundsHeight);
  const targetZoom = Math.max(minZoom, Math.min(zoom, zoom * scale));
  const effectiveScale = targetZoom / zoom;

  return {
    zoom: targetZoom,
    scale: effectiveScale,
    fits: boundsWidth * effectiveScale <= availableWidth + 0.5
      && boundsHeight * effectiveScale <= availableHeight + 0.5
  };
}

export function localCollectionFitsReadable({
  bounds,
  canvasWidth,
  canvasHeight,
  zoom = MIN_READABLE_ZOOM,
  currentZoom = zoom,
  padding = 32
} = {}) {
  const camera = localRevealCamera({
    bounds,
    canvasWidth,
    canvasHeight,
    currentZoom,
    minZoom: zoom,
    padding
  });
  return camera.fits && camera.zoom >= zoom;
}

export function panForVisibleBounds({
  bounds,
  canvasWidth,
  canvasHeight,
  padding = 32
} = {}) {
  if (!bounds) return { x: 0, y: 0 };
  const width = Math.max(0, Number(canvasWidth) || 0);
  const height = Math.max(0, Number(canvasHeight) || 0);
  if (!width || !height) return { x: 0, y: 0 };

  let x = 0;
  let y = 0;
  const boundsWidth = bounds.width ?? (bounds.x2 - bounds.x1);
  const boundsHeight = bounds.height ?? (bounds.y2 - bounds.y1);
  const fitsWidth = boundsWidth <= width - padding * 2;
  const fitsHeight = boundsHeight <= height - padding * 2;

  if (fitsWidth) {
    if (bounds.x1 < padding) x = padding - bounds.x1;
    else if (bounds.x2 > width - padding) x = width - padding - bounds.x2;
  }
  if (fitsHeight) {
    if (bounds.y1 < padding) y = padding - bounds.y1;
    else if (bounds.y2 > height - padding) y = height - padding - bounds.y2;
  }

  return { x, y };
}

function boundsForRectangles(rectangles = []) {
  if (!rectangles.length) return null;
  const x1 = Math.min(...rectangles.map(rect => rect.x1));
  const x2 = Math.max(...rectangles.map(rect => rect.x2));
  const y1 = Math.min(...rectangles.map(rect => rect.y1));
  const y2 = Math.max(...rectangles.map(rect => rect.y2));
  return { x1, x2, y1, y2, width: x2 - x1, height: y2 - y1 };
}

export function readableLocalPageCapacity({
  total,
  viewportWidth,
  viewportHeight,
  layoutDirection = 'horizontal',
  directions = [],
  padding = 32,
  minZoom = MIN_READABLE_ZOOM,
  nodeWidth = NODE_MODEL_WIDTH,
  nodeHeight = NODE_MODEL_HEIGHT,
  preserveUpstreamContext = true,
  maxItems = 5
} = {}) {
  const count = Math.max(0, Math.floor(Number(total) || 0));
  if (!count) return 0;
  const width = Math.max(0, Number(viewportWidth) || 0);
  const height = Math.max(0, Number(viewportHeight) || 0);
  if (!width || !height) return 1;

  const anchor = {
    id: '__anchor__',
    x: 0,
    y: 0,
    width: nodeWidth,
    height: nodeHeight
  };
  const occupied = [anchor];
  const contextRects = [rectangleFromCenter(anchor)];

  if (preserveUpstreamContext) {
    const primaryOffset = layoutDirection === 'horizontal'
      ? nodeWidth / 2 + nodeWidth / 2 + LOCAL_PRIMARY_GAP
      : nodeHeight / 2 + nodeHeight / 2 + LOCAL_PRIMARY_GAP;
    const context = layoutDirection === 'horizontal'
      ? { id: '__context__', x: -primaryOffset, y: 0, width: nodeWidth, height: nodeHeight }
      : { id: '__context__', x: 0, y: -primaryOffset, width: nodeWidth, height: nodeHeight };
    occupied.push(context);
    contextRects.push(rectangleFromCenter(context));
  }

  let capacity = 0;
  const limit = Math.min(count, Math.max(1, Math.floor(Number(maxItems) || 1)));
  for (let size = 1; size <= limit; size += 1) {
    const specs = Array.from({ length: size }, (_, index) => ({
      id: '__candidate_' + index,
      direction: directions[index] === 'incoming' ? 'incoming' : 'outgoing',
      width: nodeWidth,
      height: nodeHeight
    }));
    const placements = planLocalNodePositions({
      anchor,
      nodes: specs,
      occupied,
      layoutDirection
    });
    const rectangles = [
      ...contextRects,
      ...specs.map(spec => {
        const position = placements.get(spec.id);
        return rectangleFromCenter({
          id: spec.id,
          x: position.x,
          y: position.y,
          width: nodeWidth,
          height: nodeHeight
        });
      })
    ];
    const bounds = boundsForRectangles(rectangles);
    if (!localCollectionFitsReadable({
      bounds,
      canvasWidth: width,
      canvasHeight: height,
      zoom: minZoom,
      currentZoom: minZoom,
      padding
    })) break;
    capacity = size;
  }

  return Math.max(1, capacity);
}

export function localRevealBatchSize({
  total,
  viewportWidth,
  viewportHeight,
  kind = 'connections',
  layoutDirection = 'horizontal',
  directions = [],
  preserveUpstreamContext = true
} = {}) {
  return readableLocalPageCapacity({
    total,
    viewportWidth,
    viewportHeight,
    layoutDirection,
    directions,
    preserveUpstreamContext,
    maxItems: kind === 'contents' ? 6 : 5
  });
}

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
        'font-size': NODE_LABEL_MODEL_PX,
        'font-weight': 650,
        'height': NODE_MODEL_HEIGHT,
        'label': 'data(label)',
        'shape': 'round-rectangle',
        'text-halign': 'center',
        'text-max-width': 118,
        'text-valign': 'center',
        'text-wrap': 'wrap',
        'width': NODE_MODEL_WIDTH
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

  fit({ padding = 56, maxZoom = 1.55 } = {}) {
    if (!this.cy || this.cy.elements().empty()) return;
    const collection = this.cy.elements();
    this.cy.fit(collection, padding);
    if (this.cy.zoom() > maxZoom) {
      this.cy.zoom(maxZoom);
      this.cy.center(collection);
    }
  }

  focus(id, { padding = 96, maxZoom = 1.45 } = {}) {
    if (!this.cy || !id) return;
    const node = this.cy.getElementById(id);
    if (node.empty()) return;
    const collection = node.closedNeighborhood();
    this.cy.fit(collection, padding);
    if (this.cy.zoom() > maxZoom) {
      this.cy.zoom(maxZoom);
      this.cy.center(collection);
    }
  }

  getViewport() {
    if (!this.cy) return null;
    return {
      zoom: this.cy.zoom(),
      pan: { ...this.cy.pan() }
    };
  }

  getNodePositions() {
    if (!this.cy) return [];
    return this.cy.nodes().map(node => [node.id(), { ...node.position() }]);
  }

  restoreNodePositions(entries = []) {
    if (!this.cy || !Array.isArray(entries)) return;
    const positions = new Map(entries);
    this.cy.nodes().forEach(node => {
      const position = positions.get(node.id());
      if (position && Number.isFinite(position.x) && Number.isFinite(position.y)) {
        node.position(position);
      }
    });
  }

  restoreViewport(viewport) {
    if (!this.cy || !viewport) return;
    if (Number.isFinite(viewport.zoom)) this.cy.zoom(viewport.zoom);
    if (viewport.pan && Number.isFinite(viewport.pan.x) && Number.isFinite(viewport.pan.y)) {
      this.cy.pan(viewport.pan);
    }
  }

  nodeLayoutSpec(node, direction = 'outgoing') {
    return {
      id: node.id(),
      direction,
      width: Math.max(1, node.outerWidth()),
      height: Math.max(1, node.outerHeight())
    };
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

    const anchorPosition = anchor.position();
    const anchorSpec = {
      id: anchor.id(),
      x: anchorPosition.x,
      y: anchorPosition.y,
      width: Math.max(1, anchor.outerWidth()),
      height: Math.max(1, anchor.outerHeight())
    };

    const addedSet = new Set(addedNodeIds);
    const occupied = this.cy.nodes()
      .filter(node => !addedSet.has(node.id()))
      .map(node => {
        const position = node.position();
        return {
          id: node.id(),
          x: position.x,
          y: position.y,
          width: Math.max(1, node.outerWidth()),
          height: Math.max(1, node.outerHeight())
        };
      });

    const specs = [];
    for (const id of addedNodeIds) {
      const node = this.cy.getElementById(id);
      if (node.empty()) continue;
      const connecting = node.edgesWith(anchor);
      let direction = 'outgoing';
      if (connecting.some(edge => edge.target().id() === anchorNodeId && edge.source().id() === id)) {
        direction = 'incoming';
      }
      specs.push(this.nodeLayoutSpec(node, direction));
    }

    const placements = planLocalNodePositions({
      anchor: anchorSpec,
      nodes: specs,
      occupied,
      layoutDirection
    });

    for (const [id, position] of placements) {
      const node = this.cy.getElementById(id);
      if (!node.empty()) node.position(position);
    }
  }

  revealLocalTopology({
    anchorNodeId,
    addedNodeIds = [],
    padding = 32,
    minZoom = MIN_READABLE_ZOOM
  } = {}) {
    if (!this.cy || !anchorNodeId || !addedNodeIds.length) return;
    const anchor = this.cy.getElementById(anchorNodeId);
    if (anchor.empty()) return;

    let collection = anchor;
    for (const id of addedNodeIds) {
      const node = this.cy.getElementById(id);
      if (!node.empty()) collection = collection.union(node);
    }

    const width = this.container.clientWidth || 0;
    const height = this.container.clientHeight || 0;
    if (!width || !height) return;

    let bounds = collection.renderedBoundingBox({ includeLabels: true });
    const camera = localRevealCamera({
      bounds,
      canvasWidth: width,
      canvasHeight: height,
      currentZoom: this.cy.zoom(),
      minZoom,
      padding
    });

    if (Math.abs(camera.zoom - this.cy.zoom()) > 0.001) {
      const anchorRendered = anchor.renderedPosition();
      this.cy.zoom({
        level: camera.zoom,
        renderedPosition: anchorRendered
      });
      bounds = collection.renderedBoundingBox({ includeLabels: true });
    }

    const collectionPan = panForVisibleBounds({
      bounds,
      canvasWidth: width,
      canvasHeight: height,
      padding
    });
    if (collectionPan.x || collectionPan.y) this.cy.panBy(collectionPan);

    const anchorBounds = anchor.renderedBoundingBox({ includeLabels: true });
    const anchorPan = panForVisibleBounds({
      bounds: anchorBounds,
      canvasWidth: width,
      canvasHeight: height,
      padding
    });
    if (anchorPan.x || anchorPan.y) this.cy.panBy(anchorPan);

    // Anchor correction can slightly shift an otherwise fitting local page.
    // Re-check the complete page once more so the selected node and every
    // node in the current semantic window finish inside the same safe area.
    bounds = collection.renderedBoundingBox({ includeLabels: true });
    if (localCollectionFitsReadable({
      bounds,
      canvasWidth: width,
      canvasHeight: height,
      zoom: minZoom,
      currentZoom: this.cy.zoom(),
      padding
    })) {
      const finalPan = panForVisibleBounds({
        bounds,
        canvasWidth: width,
        canvasHeight: height,
        padding
      });
      if (finalPan.x || finalPan.y) this.cy.panBy(finalPan);
    }
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
        minZoom: MIN_READABLE_ZOOM,
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

        if (fitOnTopologyChange) this.fit({ maxZoom: MAX_INITIAL_ZOOM });
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
