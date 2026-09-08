(() => {
  const data = window.PersonaLibraryData;
  const slugify = value => `skill-${value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;

  function buildSkillCatalog({ personas, skillLibrary, flowLibrary, skillUnits = [], skillRelations = [], skillGuidance = {}, skillPractice = {}, toolUseRecipes = [] }) {
    const catalog = new Map();
    for (const persona of personas) {
      for (const profile of skillLibrary[persona.id] || []) {
        const id = slugify(profile.name);
        if (!catalog.has(id)) catalog.set(id, { id, name: profile.name, personas: [], profiles: [], workflows: [], guidance: skillGuidance[id] || null });
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
    for (const skill of catalog.values()) {
      const base = skill.guidance || {};
      const primary = skill.profiles[0] || {};
      const operation = {...(base.operation || {}), ...(skillPractice[skill.id]?.operation || {})};
      const quality = {...(base.quality || {}), ...(skillPractice[skill.id]?.quality || {})};
      const moves = operation.moves || [primary.actions || primary.definition || 'Apply the capability through observable practice.'];
      const checks = quality.checks || ['Define a skill-specific inspection method, then compare the actual result with the intended outcome and realistic variation.'];
      const specified = (record, fields) => fields.every(field => Array.isArray(record[field]) ? record[field].length > 0 : Boolean(record[field]));
      skill.guidanceCoverage = {
        operation: specified(operation, ['loop', 'inputs', 'decisions', 'outputs', 'feedback', 'boundaries']) ? 'Authored' : 'Starter or partial',
        quality: specified(quality, ['signals', 'checks', 'watchFor']) ? 'Authored' : 'Starter or partial'
      };
      skill.toolUseRecipes = toolUseRecipes.filter(recipe => recipe.skillId === skill.id);
      skill.guidance = {
        operation: {
          startsWith: operation.startsWith || primary.triggers || 'A situation where this capability is relevant.',
          loop: operation.loop || [`Notice the trigger: ${primary.triggers || 'identify the relevant situation.'}`, 'Frame the decision and relevant constraints.', `Apply the capability: ${moves[0]}`, `Check the result: ${checks[0]}`, 'Adjust the approach based on what was learned.'],
          inputs: operation.inputs || [primary.triggers || 'Relevant signals and constraints'],
          decisions: operation.decisions || moves,
          outputs: operation.outputs || [operation.leavesBehind || primary.definition || 'A clearer path toward the intended outcome.'],
          feedback: operation.feedback || checks,
          boundaries: operation.boundaries || 'This capability informs the decision; it does not replace domain knowledge, evidence, or decision ownership.',
          moves,
          leavesBehind: operation.leavesBehind || primary.definition || 'A result that supports the intended outcome.'
        },
        quality: {
          signals: quality.signals || ['The result supports the intended outcome and holds up under realistic variation.'],
          checks,
          watchFor: quality.watchFor || ['A plausible-looking shortcut is treated as evidence of capability.']
        }
      };
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
    const atsSkillId = 'skill-ats-aware-formatting-and-terminology';
    skillMaintenance[atsSkillId] = {
      version: '1.1',
      updated: '2026-09-06',
      revisions: [
        ...skillMaintenance[atsSkillId].revisions,
        {
          version: '1.1',
          date: '2026-09-06',
          changeType: 'preflight-reconciliation',
          summary: 'Added deterministic resume preflight for chronology, date consistency, overlaps, employer records, and parser-safe structure before council review.',
          affectedFields: ['operation', 'quality', 'workflows', 'actions'],
          evidence: 'Observed chronology error in a council-reviewed draft packet; ATS and integrity requirements',
          confidenceChange: 'Rule is deterministic; role-specific interpretation remains subject to review'
        }
      ]
    };
    const editorialSkills = ['requirement-to-evidence-mapping', 'persuasive-professional-writing', 'voice-preservation-and-ethical-editing', 'editorial-content-shaping', 'content-density-and-scanability-judgment'];
    skillMaintenance[atsSkillId].version = '1.2';
    skillMaintenance[atsSkillId].updated = '2026-09-07';
    skillMaintenance[atsSkillId].revisions.push({version:'1.2',date:'2026-09-07',changeType:'review-contract-correction',summary:'Requires inspection of the actual final artifact and preserves legitimate repeat engagements. Replaces assumed automatic preflight with recorded checks and explicit unavailable results.',affectedFields:['operation','quality','actions'],evidence:'Resume builder audit and application-review contract',confidenceChange:'Instruction clarified; execution and employer-parser results require separate evidence'});
    for (const suffix of editorialSkills) {
      const record = skillMaintenance[`skill-${suffix}`];
      record.version = '1.1'; record.updated = '2026-09-07';
      record.revisions.push({version:'1.1',date:'2026-09-07',changeType:'practice-expansion',summary:'Added source-preserving editorial methods and concrete reader/document quality checks.',affectedFields:['operation','quality','actions'],evidence:'Resume audit and source-to-draft comparison; see Decisions / Document evidence and quality.',confidenceChange:'Authored working method; reader trial remains untested'});
    }
    for (const id of ['application-editor', 'document-designer']) {
      const record = personaMaintenance[id];
      record.version = '1.1'; record.updated = '2026-09-07';
      record.revisions.push({version:'1.1',date:'2026-09-07',changeType:'capability-reconciliation',summary:'Connected evidence-led editing, small content trials, and version-specific review to existing activities.',affectedFields:['behaviors','needs','implication','workflows','skills'],evidence:'Expanded editorial skill methods and application-review contract',confidenceChange:'Remains synthesized; no reader outcome or candidate approval claimed'});
    }
    const reusedCreativeSkills = [
      'skill-problem-framing-and-systems-thinking',
      'skill-multi-perspective-skill-synthesis',
      'skill-facilitation-and-cross-functional-alignment',
      'skill-contextual-visual-judgment-and-composition',
      'skill-prototyping-and-interaction-craft',
      'skill-evidence-led-validation',
      'skill-decision-communication-and-rationale-documentation',
      'skill-cross-functional-systems-communication'
    ];
    for (const id of reusedCreativeSkills) {
      const record = skillMaintenance[id];
      const [major, minor] = record.version.split('.').map(Number);
      const version = `${major}.${minor + 1}`;
      record.version = version; record.updated = '2026-09-08';
      record.revisions.push({version,date:'2026-09-08',changeType:'persona-application',summary:'Added Mira Sol’s creative-orchestration application while preserving the existing portable Skill boundary.',affectedFields:['profiles','workflows'],evidence:'Persona Skills catalog comparison against Mira’s creative brief, panel, critique, synthesis, and handoff workflows',confidenceChange:'Portable Skill remains unchanged; Persona-specific application remains a working synthesis'});
    }
    for (const id of ['skill-divergent-concept-generation', 'skill-creative-critique-and-quality-calibration', 'skill-narrative-synthesis-and-concept-articulation']) {
      const record = skillMaintenance[id];
      record.version = '1.1'; record.updated = '2026-09-08';
      record.revisions.push({version:'1.1',date:'2026-09-08',changeType:'capability-formation',summary:'Expanded a distinctive creative-orchestration capability with explicit operation, quality signals, failure indicators, and validation checks.',affectedFields:['operation','quality','workflows','actions','evidence'],evidence:'Mira’s differentiated workflows plus the Persona Skills duplicate and modularity review',confidenceChange:'Working synthesis; reuse boundary and independent validation remain open'});
    }
    const creativeOrchestrator = personaMaintenance['creative-orchestrator'];
    creativeOrchestrator.version = '1.2'; creativeOrchestrator.updated = '2026-09-08';
    creativeOrchestrator.revisions.push({version:'1.1',date:'2026-09-08',changeType:'evidence-reconciliation',summary:'Added an authoritative source trail for creative direction, multidisciplinary collaboration, and divergent/convergent exploration; clarified the working-synthesis boundary.',affectedFields:['evidence','resources','context','workflows','needs','implication'],evidence:'U.S. Bureau of Labor Statistics Art Directors; O*NET Art Directors; Design Council Double Diamond; GOV.UK multidisciplinary service-team guidance',confidenceChange:'Working synthesis remains; source support is stronger and direct observation is still required'});
    creativeOrchestrator.revisions.push({version:'1.2',date:'2026-09-08',changeType:'skill-reconciliation',summary:'Reused existing framing, facilitation, visual judgment, prototyping, validation, rationale, and cross-functional communication Skills; retained only differentiated creative capabilities as new profiles.',affectedFields:['skills'],evidence:'Persona Skills catalog comparison against existing normalized Skill identities and Mira’s workflows',confidenceChange:'Skill inventory deduplicated; new capabilities remain working syntheses'});
    const conformanceSkills = [
      'skill-problem-framing-and-systems-thinking',
      'skill-tool-and-context-design',
      'skill-evaluation-and-observability',
      'skill-failure-recovery-and-operational-judgment',
      'skill-evidence-led-validation',
      'skill-decision-communication-and-rationale-documentation',
      'skill-cross-functional-systems-communication'
    ];
    for (const id of conformanceSkills) {
      const record = skillMaintenance[id];
      const [major, minor] = record.version.split('.').map(Number);
      const version = `${major}.${minor + 1}`;
      record.version = version; record.updated = '2026-09-08';
      record.revisions.push({version,date:'2026-09-08',changeType:'persona-application',summary:'Added Noor Vale’s conformance and workflow-observability application while preserving the existing portable Skill boundary.',affectedFields:['profiles','workflows'],evidence:'Issues #37 and #43 plus the conformance Work Order and normalized result contract',confidenceChange:'Portable Skill remains unchanged; Persona-specific application remains a working synthesis'});
    }
    const conformanceObserver = personaMaintenance['conformance-observer'];
    conformanceObserver.version = '1.1'; conformanceObserver.updated = '2026-09-08';
    conformanceObserver.revisions.push({version:'1.1',date:'2026-09-08',changeType:'evidence-reconciliation',summary:'Added the Issue #37 conformance suite, Issue #43 observation contract, and explicit live-runtime unknowns to Noor’s working-draft Persona record.',affectedFields:['evidence','resources','context','workflows','needs','implication'],evidence:'Persona Library Issues #37 and #43; conformance-observability Work Order; repository orientation and mutation contracts',confidenceChange:'Working synthesis remains; cross-LLM behavior and identity boundary require actual use'});
    return { personas: personaMaintenance, skills: skillMaintenance };
  }

  function buildPersonaToolRequirements({ personas, personaToolRequirements = [] }) {
    const personaIds = new Set(personas.map(persona => persona.id));
    return personaToolRequirements
      .filter(requirement => personaIds.has(requirement.personaId))
      .map(requirement => ({ ...requirement }));
  }

  data.skillCatalog = buildSkillCatalog(data);
  data.personaToolRequirements = buildPersonaToolRequirements(data);
  data.maintenance = buildMaintenance(data);
  window.PersonaLibraryModel = { slugify, buildSkillCatalog, buildPersonaToolRequirements, buildMaintenance };
})();
