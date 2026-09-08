(() => {
  // Portable workflow-graph model and semantic diff.
  // No Persona Library imports: this module takes a graph in and gives a diff out,
  // so it can be lifted into a standalone project without edits.

  const LANES = [
    { id: 'foundational', label: 'Foundational', note: 'Core work the role repeats' },
    { id: 'supporting', label: 'Supporting', note: 'Work that keeps the core viable' },
    { id: 'edge', label: 'Edge', note: 'Recovery and exception handling' }
  ];

  const laneIndex = laneId => LANES.findIndex(lane => lane.id === laneId);

  const GATE_WORDS = ['review', 'verify', 'validat', 'check', 'approv', 'audit', 'test', 'quality', 'confirm', 'gate'];
  // A "gate" is a step whose job is to catch problems. Moving one is the signal the
  // intent layer cares most about, so the diff needs to recognize it too.
  const isGateNode = node => {
    if (!node) return false;
    if (node.kind === 'gate') return true;
    const text = `${node.label || ''} ${node.quality || ''}`.toLowerCase();
    return GATE_WORDS.some(word => text.includes(word));
  };

  function cloneGraph(graph) {
    return {
      id: graph.id,
      title: graph.title,
      subtitle: graph.subtitle || '',
      nodes: (graph.nodes || []).map(node => ({ ...node })),
      edges: (graph.edges || []).map(edge => ({ ...edge }))
    };
  }

  // Order is derived from array position within a lane, so callers never maintain it by hand.
  function nodesInLane(graph, laneId) {
    return graph.nodes.filter(node => node.lane === laneId);
  }

  function positionOf(graph, nodeId, only) {
    const node = graph.nodes.find(item => item.id === nodeId);
    if (!node) return null;
    // `only` restricts the ordering to a set of ids. The diff passes the nodes present
    // in both graphs so that adding or removing a step does not report every step
    // after it as "reordered" when nothing about their sequence was touched.
    const lane = nodesInLane(graph, node.lane).filter(item => !only || only.has(item.id));
    return { lane: node.lane, index: lane.findIndex(item => item.id === nodeId) };
  }

  function edgesTouching(graph, nodeId) {
    return graph.edges.filter(edge => edge.from === nodeId || edge.to === nodeId);
  }

  function outgoing(graph, nodeId) {
    return graph.edges.filter(edge => edge.from === nodeId);
  }

  function incoming(graph, nodeId) {
    return graph.edges.filter(edge => edge.to === nodeId);
  }

  function isOrphan(graph, nodeId) {
    return edgesTouching(graph, nodeId).length === 0;
  }

  function edgeKey(edge) {
    return `${edge.from}->${edge.to}`;
  }

  // --- mutations -----------------------------------------------------------
  // Each returns a new graph. The canvas never mutates state in place, so any
  // two snapshots can be diffed against each other.

  function moveNode(graph, nodeId, targetLane, targetIndex) {
    const next = cloneGraph(graph);
    const node = next.nodes.find(item => item.id === nodeId);
    if (!node) return next;
    const remaining = next.nodes.filter(item => item.id !== nodeId);
    const laneMembers = remaining.filter(item => item.lane === targetLane);
    const bounded = Math.max(0, Math.min(targetIndex, laneMembers.length));
    node.lane = targetLane;
    const anchor = laneMembers[bounded];
    const insertAt = anchor ? remaining.indexOf(anchor) : remaining.length;
    remaining.splice(insertAt, 0, node);
    next.nodes = remaining;
    return next;
  }

  function addNode(graph, node) {
    const next = cloneGraph(graph);
    next.nodes.push({ kind: 'activity', cadence: '', quality: '', failureMode: '', ...node });
    return next;
  }

  function removeNode(graph, nodeId) {
    const next = cloneGraph(graph);
    next.nodes = next.nodes.filter(item => item.id !== nodeId);
    next.edges = next.edges.filter(edge => edge.from !== nodeId && edge.to !== nodeId);
    return next;
  }

  function connect(graph, fromId, toId) {
    if (fromId === toId) return cloneGraph(graph);
    const next = cloneGraph(graph);
    if (next.edges.some(edge => edge.from === fromId && edge.to === toId)) return next;
    next.edges.push({ id: `edge-${fromId}-${toId}`, from: fromId, to: toId, kind: 'sequence', condition: '' });
    return next;
  }

  function disconnect(graph, fromId, toId) {
    const next = cloneGraph(graph);
    next.edges = next.edges.filter(edge => !(edge.from === fromId && edge.to === toId));
    return next;
  }

  // --- diff ----------------------------------------------------------------

  function diffGraphs(before, after) {
    const beforeNodes = new Map(before.nodes.map(node => [node.id, node]));
    const afterNodes = new Map(after.nodes.map(node => [node.id, node]));
    const beforeEdges = new Map(before.edges.map(edge => [edgeKey(edge), edge]));
    const afterEdges = new Map(after.edges.map(edge => [edgeKey(edge), edge]));

    // Ordering is measured among nodes that stayed put in the same lane. A node that
    // was added, removed, or moved to another lane shifts the index of everything
    // around it, and those shifts are consequences of one gesture rather than
    // separate intentions.
    const stable = new Set([...beforeNodes.keys()].filter(id => {
      const after = afterNodes.get(id);
      return after && after.lane === beforeNodes.get(id).lane;
    }));

    const added = [];
    const removed = [];
    const laneMoves = [];
    const reorders = [];
    const edgesAdded = [];
    const edgesRemoved = [];

    for (const [id, node] of afterNodes) {
      if (!beforeNodes.has(id)) {
        added.push({
          node,
          lane: node.lane,
          connected: !isOrphan(after, id),
          insertedBetween: insertionContext(after, id)
        });
      }
    }

    for (const [id, node] of beforeNodes) {
      if (!afterNodes.has(id)) {
        const lostEdges = edgesTouching(before, id);
        removed.push({
          node,
          lostEdges,
          // A predecessor and successor that are now disconnected is the ambiguous case:
          // the step may be deleted outright, or its work absorbed elsewhere.
          strandedBefore: incoming(before, id).map(edge => beforeNodes.get(edge.from)).filter(Boolean),
          strandedAfter: outgoing(before, id).map(edge => beforeNodes.get(edge.to)).filter(Boolean)
        });
      }
    }

    for (const [id, node] of afterNodes) {
      const previous = beforeNodes.get(id);
      if (!previous) continue;
      const from = positionOf(before, id, stable);
      const to = positionOf(after, id, stable);
      if (!from || !to) continue;
      if (from.lane !== to.lane) {
        laneMoves.push({
          node,
          fromLane: from.lane,
          toLane: to.lane,
          direction: laneIndex(to.lane) < laneIndex(from.lane) ? 'promoted' : 'demoted'
        });
      } else if (from.index !== to.index) {
        reorders.push({
          node,
          lane: to.lane,
          fromIndex: from.index,
          toIndex: to.index,
          delta: Math.abs(to.index - from.index),
          direction: to.index < from.index ? 'earlier' : 'later',
          movedPast: nodesBetween(before, id, from.index, to.index, stable)
        });
      }
    }

    for (const [key, edge] of afterEdges) if (!beforeEdges.has(key)) edgesAdded.push(edge);
    for (const [key, edge] of beforeEdges) if (!afterEdges.has(key)) edgesRemoved.push(edge);

    // An edge removed and another added from the same source in one change set reads
    // as a reroute rather than two unrelated edits.
    const reroutes = [];
    for (const removedEdge of edgesRemoved) {
      const replacement = edgesAdded.find(edge => edge.from === removedEdge.from && edge.to !== removedEdge.to);
      if (replacement) {
        reroutes.push({ from: removedEdge.from, wasTo: removedEdge.to, nowTo: replacement.to });
      }
    }

    const branches = [];
    for (const node of after.nodes) {
      const out = outgoing(after, node.id);
      const wasOut = beforeNodes.has(node.id) ? outgoing(before, node.id) : [];
      if (out.length > 1 && out.length > wasOut.length) {
        branches.push({ node, targets: out.map(edge => afterNodes.get(edge.to)).filter(Boolean), unconditioned: out.filter(edge => !edge.condition) });
      }
    }

    const orphans = after.nodes.filter(node => isOrphan(after, node.id) && after.nodes.length > 1);

    const intentionalReorders = dropDisplaced(reorders, isGateNode);

    const semanticCount = added.length + removed.length + laneMoves.length + intentionalReorders.length
      + edgesAdded.length + edgesRemoved.length;

    return {
      added, removed, laneMoves, reorders: intentionalReorders,
      edgesAdded, edgesRemoved, reroutes, branches, orphans,
      semanticCount,
      empty: semanticCount === 0
    };
  }

  function insertionContext(graph, nodeId) {
    const before = incoming(graph, nodeId).map(edge => graph.nodes.find(node => node.id === edge.from)).filter(Boolean);
    const after = outgoing(graph, nodeId).map(edge => graph.nodes.find(node => node.id === edge.to)).filter(Boolean);
    return { before, after };
  }

  function nodesBetween(before, nodeId, fromIndex, toIndex, only) {
    const node = before.nodes.find(item => item.id === nodeId);
    if (!node) return [];
    const lane = nodesInLane(before, node.lane)
      .filter(item => item.id !== nodeId && (!only || only.has(item.id)));
    return lane.slice(Math.min(fromIndex, toIndex), Math.max(fromIndex, toIndex));
  }

  // Moving one card necessarily shifts the cards it passes. Those shifts are a
  // consequence of the gesture, not separate intentions, so only the card that
  // actually moved is reported.
  function dropDisplaced(reorders, gateTest) {
    const ordered = reorders.slice().sort((a, b) =>
      b.delta - a.delta
      || Number(gateTest(b.node)) - Number(gateTest(a.node))
      || (a.direction === 'earlier' ? -1 : 1));
    const kept = [];
    for (const move of ordered) {
      const displaced = kept.some(anchor =>
        anchor.lane === move.lane
        && anchor.direction !== move.direction
        && move.delta <= anchor.delta
        && anchor.movedPast.some(node => node.id === move.node.id));
      if (!displaced) kept.push(move);
    }
    return kept;
  }

  window.WorkflowCanvasGraph = {
    LANES, laneIndex, cloneGraph, nodesInLane, positionOf,
    edgesTouching, outgoing, incoming, isOrphan,
    moveNode, addNode, removeNode, connect, disconnect,
    isGateNode, diffGraphs
  };
})();
