export function validateGraph(graph) {
  if (!graph || typeof graph !== 'object') throw new Error('System Map graph is unavailable.');
  if (graph.version !== 'system-map.graph/v0.1') throw new Error(`Unsupported graph version: ${graph.version || 'missing'}`);
  if (!Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) throw new Error('System Map graph is malformed.');
  const ids = new Set(graph.nodes.map(node => node.id));
  if (ids.size !== graph.nodes.length) throw new Error('System Map graph has duplicate node IDs.');
  for (const edge of graph.edges) {
    if (!ids.has(edge.from) || !ids.has(edge.to)) throw new Error(`System Map edge references an unknown node: ${edge.id}`);
  }
  return graph;
}

export function indexGraph(graph) {
  validateGraph(graph);
  const nodes = new Map(graph.nodes.map(node => [node.id, node]));
  const incoming = new Map(graph.nodes.map(node => [node.id, []]));
  const outgoing = new Map(graph.nodes.map(node => [node.id, []]));
  for (const edge of graph.edges) {
    outgoing.get(edge.from).push(edge);
    incoming.get(edge.to).push(edge);
  }
  return { nodes, incoming, outgoing };
}

export function rootNodeIds(graph) {
  const { incoming, outgoing } = indexGraph(graph);
  const roots = graph.nodes
    .filter(node => incoming.get(node.id).length === 0 && outgoing.get(node.id).length > 0)
    .map(node => node.id)
    .sort();
  return roots.length ? roots : graph.nodes.slice(0, 4).map(node => node.id);
}

export function directNeighbors(graph, id) {
  const { nodes, incoming, outgoing } = indexGraph(graph);
  if (!nodes.has(id)) return { nodes: [], edges: [] };
  const edges = [...incoming.get(id), ...outgoing.get(id)];
  const nodeIds = new Set(edges.map(edge => edge.from === id ? edge.to : edge.from));
  return {
    nodes: [...nodeIds].map(nodeId => nodes.get(nodeId)).sort((a, b) => a.label.localeCompare(b.label)),
    edges: [...new Map(edges.map(edge => [edge.id, edge])).values()].sort((a, b) => a.id.localeCompare(b.id))
  };
}

export function visibleNodeIds(graph, expandedIds = []) {
  const roots = rootNodeIds(graph);
  const visible = new Set(roots);
  for (const id of expandedIds) {
    if (!visible.has(id)) continue;
    for (const node of directNeighbors(graph, id).nodes) visible.add(node.id);
  }
  return visible;
}

export function findPath(graph, startId, endId) {
  const { nodes, incoming, outgoing } = indexGraph(graph);
  if (!nodes.has(startId) || !nodes.has(endId)) return null;
  if (startId === endId) return { nodes: [startId], edges: [] };

  const queue = [startId];
  const visited = new Set([startId]);
  const previous = new Map();

  while (queue.length) {
    const current = queue.shift();
    const candidates = [
      ...outgoing.get(current).map(edge => [edge.to, edge]),
      ...incoming.get(current).map(edge => [edge.from, edge])
    ];
    for (const [next, edge] of candidates) {
      if (visited.has(next)) continue;
      visited.add(next);
      previous.set(next, { from: current, edge });
      if (next === endId) {
        const pathNodes = [endId];
        const pathEdges = [];
        let cursor = endId;
        while (cursor !== startId) {
          const step = previous.get(cursor);
          pathEdges.unshift(step.edge.id);
          pathNodes.unshift(step.from);
          cursor = step.from;
        }
        return { nodes: pathNodes, edges: pathEdges };
      }
      queue.push(next);
    }
  }
  return null;
}

export function sourceUrl(source) {
  if (!source?.locator) return null;
  const repoFile = source.locator.match(/^([^:]+\/[^:]+):(.+)$/);
  if (source.kind === 'repo-file' && repoFile) {
    return `https://github.com/${repoFile[1]}/blob/main/${repoFile[2]}`;
  }
  if (source.kind === 'github' && /^https?:\/\//.test(source.locator)) return source.locator;
  return null;
}

export function nodeTypeLabel(type) {
  return String(type || 'concept')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
