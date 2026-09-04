(() => {
  const data = window.PersonaLibraryData;
  const slugify = value => `skill-${value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;

  function buildSkillCatalog({ personas, skillLibrary, flowLibrary, skillUnits = [], skillRelations = [] }) {
    const catalog = new Map();
    for (const persona of personas) {
      for (const profile of skillLibrary[persona.id] || []) {
        const id = slugify(profile.name);
        if (!catalog.has(id)) catalog.set(id, { id, name: profile.name, personas: [], profiles: [], workflows: [] });
        const skill = catalog.get(id);
        if (!skill.personas.some(item => item.id === persona.id)) {
          skill.personas.push({ id: persona.id, name: persona.name, roleLabel: persona.roleLabel, role: persona.role });
        }
        skill.profiles.push({
          personaId: persona.id,
          personaName: persona.name,
          roleLabel: persona.roleLabel,
          status: profile.status,
          definition: profile.definition,
          triggers: profile.triggers,
          workflows: profile.workflows,
          actions: profile.actions,
          evidence: profile.evidence
        });
        const workflowNames = (profile.workflows || '').split(' · ').map(item => item.trim()).filter(Boolean);
        for (const flow of flowLibrary[persona.id] || []) {
          if (workflowNames.includes(flow.title) && !skill.workflows.some(item => item.personaId === persona.id && item.title === flow.title)) {
            skill.workflows.push({ personaId: persona.id, personaName: persona.name, type: flow.type, title: flow.title, cadence: flow.cadence });
          }
        }
      }
    }
    const unitsById = new Map(skillUnits.map(unit => [unit.id, { id: unit.id, kind: unit.kind, name: unit.name, summary: unit.summary }]));
    const skillsById = new Map(catalog);
    const entityFor = id => {
      if (unitsById.has(id)) return unitsById.get(id);
      const skill = skillsById.get(id);
      return skill ? { id: skill.id, kind: 'composed', name: skill.name, summary: skill.profiles[0]?.definition || '' } : null;
    };
    for (const skill of catalog.values()) {
      skill.buildingBlocks = skillRelations
        .filter(relation => relation.from === skill.id && relation.type === 'built-from')
        .map(relation => entityFor(relation.to))
        .filter(Boolean);
      skill.supportingConnections = skillRelations
        .filter(relation => relation.to === skill.id && relation.type === 'supports')
        .map(relation => entityFor(relation.from))
        .filter(Boolean);
      skill.relatedSkills = skillRelations
        .filter(relation => relation.from === skill.id && relation.type === 'related-to')
        .map(relation => entityFor(relation.to))
        .filter(Boolean);
    }
    return [...catalog.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  function buildMaintenance({ personas, skillCatalog }) {
    const personaMaintenance = Object.fromEntries(personas.map(persona => [persona.id, {
      version: '1.0',
      updated: '2026-09-04',
      revisions: [{
        version: '1.0',
        date: '2026-09-04',
        changeType: 'initial-synthesis',
        summary: 'Initial persona synthesis added to the library.',
        affectedFields: ['context', 'workflows', 'skills', 'needs'],
        evidence: persona.evidence,
        confidenceChange: 'Working draft established'
      }]
    }]));
    personaMaintenance['ui-expert'] = {
      version: '1.1',
      updated: '2026-09-04',
      revisions: [
        ...personaMaintenance['ui-expert'].revisions,
        {
          version: '1.1',
          date: '2026-09-04',
          changeType: 'capability-reconciliation',
          summary: 'Reconciled contextual visual judgment into Camille’s goals, behaviors, needs, foundational workflows, and product implication.',
          affectedFields: ['goals', 'behaviors', 'needs', 'workflows', 'implication', 'tags'],
          evidence: 'Visual-design principles, layout guidance, and design-system contribution practice',
          confidenceChange: 'Remains synthesized'
        }
      ]
    };
    const skillMaintenance = Object.fromEntries(skillCatalog.map(skill => [skill.id, {
      version: '1.0',
      updated: '2026-09-04',
      revisions: [{
        version: '1.0',
        date: '2026-09-04',
        changeType: 'initial-profile',
        summary: 'Initial capability profile added to the Skills Library.',
        affectedFields: ['definition', 'triggers', 'workflows', 'actions', 'evidence'],
        evidence: skill.profiles[0]?.evidence || 'Working synthesis',
        confidenceChange: 'Synthesized unless otherwise noted'
      }]
    }]));
    const visualSkillId = 'skill-contextual-visual-judgment-and-composition';
    skillMaintenance[visualSkillId] = {
      version: '1.1',
      updated: '2026-09-04',
      revisions: [
        ...skillMaintenance[visualSkillId].revisions,
        {
          version: '1.1',
          date: '2026-09-04',
          changeType: 'persona-reconciliation',
          summary: 'Expanded visual judgment into contextual composition, triggers, reference study, and explicit tradeoff reasoning.',
          affectedFields: ['definition', 'triggers', 'actions', 'evidence'],
          evidence: 'Visual-design principles, Material layout guidance, and design-system contribution practice',
          confidenceChange: 'Remains synthesized'
        }
      ]
    };
    return { personas: personaMaintenance, skills: skillMaintenance };
  }

  data.skillCatalog = buildSkillCatalog(data);
  data.maintenance = buildMaintenance(data);
  window.PersonaLibraryModel = { slugify, buildSkillCatalog, buildMaintenance };
})();
