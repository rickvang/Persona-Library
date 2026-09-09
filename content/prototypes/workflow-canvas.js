(() => {
  // Prototype seed adapter: turns a persona's workflow map into a canvas graph.
  //
  // This is the only file that knows about both the Persona Library content shape and
  // the canvas graph shape. The graph and intent modules stay generic; this adapter is
  // what would be rewritten to point the canvas at a different source.
  //
  // Prototype scope: it reads live content and never writes to it.

  const slug = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);

  function buildGraph(personaId, personaName, roleLabel, flows) {
    const nodes = [];
    const edges = [];

    flows.forEach((flow, flowIndex) => {
      let previousId = null;
      (flow.activities || []).forEach((activity, activityIndex) => {
        // Activity rows are positional: name, cadence, quality signal, failure mode,
        // and an optional representative tool.
        const [label, cadence, quality, failureMode, tool] = activity;
        const id = `${personaId}-f${flowIndex}-a${activityIndex}-${slug(label)}`;
        nodes.push({
          id,
          label,
          lane: flow.type,
          kind: 'activity',
          cadence: cadence || flow.cadence || '',
          quality: quality || '',
          failureMode: failureMode || '',
          tool: tool || '',
          flowTitle: flow.title
        });
        if (previousId) {
          edges.push({ id: `edge-${previousId}-${id}`, from: previousId, to: id, kind: 'sequence', condition: '' });
        }
        previousId = id;
      });
    });

    return {
      id: `canvas-${personaId}`,
      personaId,
      // Name and role stay separate fields so a picker can present them apart,
      // while `title` remains the phrase the intent readings quote.
      personaName,
      roleLabel,
      title: `${personaName} — workflow map`,
      subtitle: `${roleLabel} · ${flows.length} workflows · ${nodes.length} activities`,
      nodes,
      edges
    };
  }

  function buildGraphs(data) {
    if (!data || !data.flowLibrary) return [];
    return data.personas
      .filter(persona => Array.isArray(data.flowLibrary[persona.id]) && data.flowLibrary[persona.id].length)
      .map(persona => buildGraph(persona.id, persona.name, persona.roleLabel, data.flowLibrary[persona.id]));
  }

  window.WorkflowCanvasSeed = { buildGraphs, buildGraph };
})();
