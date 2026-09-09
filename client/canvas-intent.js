(() => {
  // Portable intent inference over a workflow-graph diff.
  // Deterministic and rule-based on purpose: every reading names the evidence that
  // produced it, so a wrong reading is inspectable rather than mysterious.
  // No Persona Library imports.

  const laneLabel = laneId => ({ foundational: 'Foundational', supporting: 'Supporting', edge: 'Edge' }[laneId] || laneId);
  const isGate = node => window.WorkflowCanvasGraph.isGateNode(node);

  function reading(id, confidence, statement, evidence, openQuestions, proposedChange) {
    return { id, confidence, statement, evidence, openQuestions, proposedChange };
  }

  function interpret(diff, graph) {
    const readings = [];

    // Two different upstream moves matter, and they mean different things.
    // A gate moving earlier is "catch this sooner"; ordinary work moving earlier
    // past a gate is "this should happen before the check".
    for (const move of diff.reorders) {
      const passedLabels = move.movedPast.map(node => `“${node.label}”`).join(', ');
      const gatesPassed = move.movedPast.filter(isGate);
      if (move.direction === 'earlier' && isGate(move.node)) {
        readings.push(reading(
          `reorder-gate-earlier-${move.node.id}`, 'high',
          `Run the “${move.node.label}” check earlier${move.movedPast.length ? `, before ${passedLabels}` : ''} — you want problems caught sooner rather than after that work is done.`,
          [
            `“${move.node.label}” reads as a verification step${move.node.quality ? ` (quality signal: “${move.node.quality}”)` : ''}.`,
            `It moved from position ${move.fromIndex + 1} to ${move.toIndex + 1} in ${laneLabel(move.lane)}, ahead of ${move.movedPast.length} step${move.movedPast.length === 1 ? '' : 's'}.`
          ],
          [`Does the check have everything it needs this early${move.movedPast.length ? `, given ${passedLabels} now runs after it?` : '?'}`],
          `Reorder activities in the “${graph.title}” workflow so the check runs earlier.`
        ));
      } else if (move.direction === 'earlier' && gatesPassed.length) {
        readings.push(reading(
          `reorder-upstream-${move.node.id}`, 'high',
          `Move “${move.node.label}” ahead of ${gatesPassed.map(node => `“${node.label}”`).join(' and ')} — it should happen before that check, not after it.`,
          [
            `“${move.node.label}” moved from position ${move.fromIndex + 1} to ${move.toIndex + 1} in ${laneLabel(move.lane)}.`,
            `It crossed ${gatesPassed.length} verification step${gatesPassed.length > 1 ? 's' : ''}: ${gatesPassed.map(node => node.label).join(', ')}.`
          ],
          [`Should the check now cover this step's output as well?`],
          `Reorder activities in the “${graph.title}” workflow so this step precedes its gate.`
        ));
      } else if (move.direction === 'earlier') {
        readings.push(reading(
          `reorder-earlier-${move.node.id}`, 'medium',
          `Run “${move.node.label}” earlier in ${laneLabel(move.lane)} — a sequence correction rather than a change of purpose.`,
          [`Position ${move.fromIndex + 1} → ${move.toIndex + 1}, passing ${move.movedPast.length} step${move.movedPast.length === 1 ? '' : 's'}.`],
          [`Is the earlier position a genuine dependency, or a preference about ordering?`],
          `Update the activity order for “${graph.title}”.`
        ));
      } else {
        readings.push(reading(
          `reorder-later-${move.node.id}`, 'medium',
          `Defer “${move.node.label}” until later in ${laneLabel(move.lane)} — it depends on work that comes first.`,
          [`Position ${move.fromIndex + 1} → ${move.toIndex + 1}.`],
          [`Was this blocked by a missing input, or is it simply lower priority?`],
          `Update the activity order for “${graph.title}”.`
        ));
      }
    }

    // Lane changes are reclassification, not reordering: the step's tier in the
    // workflow model changes, which is a records-level edit.
    for (const move of diff.laneMoves) {
      const promoted = move.direction === 'promoted';
      readings.push(reading(
        `lane-${move.node.id}`, 'high',
        promoted
          ? `Treat “${move.node.label}” as ${laneLabel(move.toLane)} work — it is more central than its ${laneLabel(move.fromLane)} placement implied.`
          : `Demote “${move.node.label}” to ${laneLabel(move.toLane)} — it is less central than its ${laneLabel(move.fromLane)} placement implied.`,
        [`Lane changed from ${laneLabel(move.fromLane)} to ${laneLabel(move.toLane)}.`],
        [`Does the cadence still hold at the new tier? ${move.node.cadence ? `It is currently “${move.node.cadence}”.` : 'No cadence is recorded.'}`],
        `Change this activity's flow tier in the workflow map for “${graph.title}”.`
      ));
    }

    // Deliberately ambiguous: the canvas cannot distinguish deletion from absorption,
    // so this reports both readings instead of picking one.
    for (const drop of diff.removed) {
      const stranded = [...drop.strandedBefore, ...drop.strandedAfter];
      readings.push(reading(
        `removed-${drop.node.id}`, stranded.length ? 'low' : 'medium',
        stranded.length
          ? `Remove “${drop.node.label}” — but the canvas cannot tell whether the work disappears or moves into ${stranded.map(node => `“${node.label}”`).join(' / ')}.`
          : `Remove “${drop.node.label}” from the workflow.`,
        [
          `Node removed along with ${drop.lostEdges.length} connection${drop.lostEdges.length === 1 ? '' : 's'}.`,
          ...(stranded.length ? [`${stranded.length} neighbouring step${stranded.length === 1 ? '' : 's'} lost a connection: ${stranded.map(node => node.label).join(', ')}.`] : [])
        ],
        stranded.length
          ? [
              `Does this step's work disappear, or is it absorbed by a neighbour?`,
              `Should ${drop.strandedBefore.map(n => `“${n.label}”`).join(', ') || 'the upstream step'} now connect directly to ${drop.strandedAfter.map(n => `“${n.label}”`).join(', ') || 'the downstream step'}?`
            ]
          : [`Is the quality signal it carried${drop.node.quality ? ` (“${drop.node.quality}”)` : ''} covered elsewhere?`],
        `Remove the activity, and reconcile any skill or tool record that cited it.`
      ));
    }

    // Additions split by whether they were wired in. An unconnected node is an
    // incomplete thought, and saying so is more useful than guessing at it.
    for (const insert of diff.added) {
      const context = insert.insertedBetween;
      if (!insert.connected) {
        readings.push(reading(
          `added-orphan-${insert.node.id}`, 'low',
          `Add “${insert.node.label}” to ${laneLabel(insert.lane)} — but it is not connected to anything, so the intent is incomplete.`,
          [`New node with no incoming or outgoing connections.`],
          [`Where does this step belong in the sequence?`, `What triggers it?`],
          `Nothing to apply yet — the placement is unresolved.`
        ));
      } else {
        const between = context.before.length && context.after.length;
        readings.push(reading(
          `added-${insert.node.id}`, between ? 'high' : 'medium',
          between
            ? `Insert “${insert.node.label}” between “${context.before[0].label}” and “${context.after[0].label}” — a missing step in the middle of the sequence.`
            : `Add “${insert.node.label}” to ${laneLabel(insert.lane)}${context.before.length ? ` after “${context.before[0].label}”` : ''}${context.after.length ? ` before “${context.after[0].label}”` : ''}.`,
          [`New node wired into the sequence.`],
          [`What quality signal and failure mode does this step carry?`],
          `Add the activity row to the workflow map for “${graph.title}”.`
        ));
      }
    }

    // A reroute past a still-present node is a bypass; the node surviving without
    // traffic is the distinguishing detail.
    for (const route of diff.reroutes) {
      const source = graph.nodes.find(node => node.id === route.from);
      const wasTarget = graph.nodes.find(node => node.id === route.wasTo);
      const nowTarget = graph.nodes.find(node => node.id === route.nowTo);
      const bypassed = wasTarget && graph.nodes.some(node => node.id === route.wasTo);
      readings.push(reading(
        `reroute-${route.from}-${route.nowTo}`, bypassed ? 'medium' : 'high',
        bypassed
          ? `Route “${source?.label || route.from}” straight to “${nowTarget?.label || route.nowTo}”, bypassing “${wasTarget.label}” — either it becomes conditional or it is on its way out.`
          : `Reconnect “${source?.label || route.from}” to “${nowTarget?.label || route.nowTo}”.`,
        [`Connection changed: ${wasTarget?.label || route.wasTo} → ${nowTarget?.label || route.nowTo}.`, ...(bypassed ? [`“${wasTarget.label}” is still on the canvas but no longer receives this path.`] : [])],
        bypassed ? [`Is “${wasTarget.label}” now conditional, or should it be removed?`, `If conditional, what is the condition?`] : [],
        `Update the sequence relationship in the workflow map.`
      ));
    }

    // Branching without a condition is the clearest case of a canvas gesture that
    // cannot express the whole intent.
    for (const branch of diff.branches) {
      if (!branch.unconditioned.length) continue;
      readings.push(reading(
        `branch-${branch.node.id}`, 'medium',
        `Split the path after “${branch.node.label}” into ${branch.targets.length} branches — the canvas cannot express what decides between them.`,
        [`“${branch.node.label}” now has ${branch.targets.length} outgoing paths: ${branch.targets.map(node => node.label).join(', ')}.`],
        [`What condition selects each branch?`, `Do the branches rejoin, or are they terminal?`],
        `Record a decision point with explicit conditions before this becomes a workflow record.`
      ));
    }

    const rank = { high: 0, medium: 1, low: 2 };
    readings.sort((a, b) => rank[a.confidence] - rank[b.confidence] || b.evidence.length - a.evidence.length);

    return {
      readings,
      // The panel leads with this so a change set is never presented as more
      // certain than the gestures behind it actually were.
      summary: summarize(diff, readings),
      openQuestionCount: readings.reduce((total, item) => total + item.openQuestions.length, 0)
    };
  }

  function summarize(diff, readings) {
    if (diff.empty) return 'No semantic change yet. Moving a card without changing its order or tier is layout, not intent.';
    const highest = readings[0]?.confidence;
    const counts = [];
    if (diff.added.length) counts.push(`${diff.added.length} added`);
    if (diff.removed.length) counts.push(`${diff.removed.length} removed`);
    if (diff.laneMoves.length) counts.push(`${diff.laneMoves.length} reclassified`);
    if (diff.reorders.length) counts.push(`${diff.reorders.length} reordered`);
    if (diff.edgesAdded.length || diff.edgesRemoved.length) counts.push(`${diff.edgesAdded.length + diff.edgesRemoved.length} connection change${diff.edgesAdded.length + diff.edgesRemoved.length === 1 ? '' : 's'}`);
    const confidenceNote = highest === 'high'
      ? 'The strongest reading is well supported by the change itself.'
      : highest === 'medium'
        ? 'No reading is fully determined by the canvas alone; the questions below would settle it.'
        : 'The change is ambiguous. Answer the open questions before treating any reading as intent.';
    return `${counts.join(', ')}. ${confidenceNote}`;
  }

  // The packet is what a downstream skill would consume. It carries the readings
  // and, deliberately, the unanswered questions alongside them.
  function toIntentPacket(diff, interpretation, graph) {
    return {
      schema: 'workflow-canvas-intent/0.1',
      graph: { id: graph.id, title: graph.title },
      status: interpretation.openQuestionCount ? 'needs_clarification' : 'proposed',
      change_counts: {
        added: diff.added.length,
        removed: diff.removed.length,
        reclassified: diff.laneMoves.length,
        reordered: diff.reorders.length,
        connections: diff.edgesAdded.length + diff.edgesRemoved.length
      },
      readings: interpretation.readings.map(item => ({
        id: item.id,
        confidence: item.confidence,
        statement: item.statement,
        evidence: item.evidence,
        open_questions: item.openQuestions,
        proposed_change: item.proposedChange
      })),
      boundary: 'Prototype output. No live record is changed by this packet.'
    };
  }

  window.WorkflowCanvasIntent = { interpret, toIntentPacket };
})();
