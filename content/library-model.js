(() => {
  const data = window.PersonaLibraryData;
  const slugify = value => `skill-${value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
  const templateStateCatalog = {
    lifecycle: {
      candidate: { label: 'Candidate', detail: 'A reusable starting structure is cataloged, but broader reuse evidence is still developing.' },
      planned: { label: 'Planned', detail: 'The Template identity is recorded, but its reusable artifact path is not verified yet.' },
      deprecated: { label: 'Deprecated', detail: 'The Template should not be selected for new work unless its lifecycle note says otherwise.' }
    },
    source: {
      verified: { label: 'Source path verified', detail: 'The declared path and entrypoint were checked at the recorded source revision.' },
      planned: { label: 'Source path not verified', detail: 'No reusable artifact path and entrypoint are currently verified.' },
      unknown: { label: 'Source evidence incomplete', detail: 'The source record does not yet establish a complete path and entrypoint.' }
    },
    runtime: {
      available: { label: 'Runtime access available', detail: 'The current runtime records access to the declared source.' },
      unavailable: { label: 'Runtime access unavailable', detail: 'The source may be documented, but the current runtime cannot access it.' },
      'capability-dependent': { label: 'Capability-dependent', detail: 'The source is documented, but access depends on the current runtime and permissions.' },
      unknown: { label: 'Runtime access unknown', detail: 'Source verification does not establish access in the current runtime.' }
    },
    preview: {
      external: { label: 'External artifact', detail: 'The declared source is the artifact authority; this viewer does not fetch or execute it.' },
      illustrative: { label: 'Illustrative concept', detail: 'A local synthetic composition demonstrates the starting structure; it is not the external artifact.' },
      none: { label: 'No local view', detail: 'This viewer has no local illustrative composition for the Template yet.' }
    }
  };

  const templateRuntimeStateByAvailability = {
    repo_local: 'available',
    project_local: 'available',
    runtime_catalog: 'available',
    bundled_system: 'available',
    documentation_only: 'capability-dependent',
    planned: 'unknown',
    historical: 'unavailable',
    unavailable: 'unavailable'
  };
  const templatePreviewConfig = () => window.PersonaLibraryTemplatePreviewConfig?.previewRenderers || {};
  const templateState = (group, id, fallback) => ({ id, ...(templateStateCatalog[group][id] || fallback) });

  function buildOperationalScenarioCatalog({ operationalScenarios = [], personas = [], skillLibrary = {}, toolUseRecipes = [], operatingPacks = [] }) {
    const personaIds = new Set(personas.map(persona => persona.id));
    const skillIds = new Set(Object.values(skillLibrary).flat().map(profile => slugify(profile.name)));
    const recipeIds = new Set(toolUseRecipes.map(recipe => recipe.id));
    const operatingPackIds = new Set(operatingPacks.map(pack => pack.id));
    return operationalScenarios.map(scenario => {
      const ownerKnown = scenario.ownerType === 'skill' ? skillIds.has(scenario.ownerId) : scenario.ownerType === 'tool-use-recipe' ? recipeIds.has(scenario.ownerId) : false;
      const route = scenario.route || {};
      const unresolvedRouteIds = [
        ...(route.personaIds || []).filter(id => !personaIds.has(id)).map(id => 'persona:' + id),
        ...(route.skillIds || []).filter(id => !skillIds.has(id)).map(id => 'skill:' + id),
        ...(route.toolRecipeIds || []).filter(id => !recipeIds.has(id)).map(id => 'recipe:' + id),
        ...(route.operatingPackIds || []).filter(id => !operatingPackIds.has(id)).map(id => 'operating-pack:' + id)
      ];
      const searchableText = [scenario.title, scenario.situation, scenario.expectedRoute, ...(scenario.match?.phrases || []), ...(scenario.match?.keywords || [])].filter(Boolean).join(' ').toLowerCase();
      return {...scenario, ownerKnown, unresolvedRouteIds, searchableText};
    }).sort((a, b) => a.title.localeCompare(b.title));
  }

  function buildToolUseRecipes({ toolUseRecipes = [], operationalScenarioCatalog = [] }) {
    return toolUseRecipes.map(recipe => ({...recipe, operationalScenarios: operationalScenarioCatalog.filter(scenario => scenario.ownerType === 'tool-use-recipe' && scenario.ownerId === recipe.id && scenario.status === 'active')}));
  }

  function findOperationalScenarios(query, options = {}) {
    const catalog = options.catalog || data.operationalScenarioCatalog || [];
    const ownerType = options.ownerType || '';
    const ownerId = options.ownerId || '';
    const limit = Number.isInteger(options.limit) && options.limit > 0 ? options.limit : 3;
    const phrase = String(query || '').trim().toLowerCase();
    const tokens = [...new Set(phrase.split(/[^a-z0-9]+/).filter(token => token.length > 2))];
    return catalog.filter(scenario => scenario.status === 'active')
      .filter(scenario => !ownerType || scenario.ownerType === ownerType)
      .filter(scenario => !ownerId || scenario.ownerId === ownerId)
      .map(scenario => {
        const exactPhraseMatches = (scenario.match?.phrases || []).filter(item => phrase.includes(String(item).toLowerCase())).length;
        const keywordMatches = (scenario.match?.keywords || []).filter(item => tokens.includes(String(item).toLowerCase())).length;
        const textMatches = tokens.filter(token => scenario.searchableText.includes(token)).length;
        return {scenario, score: exactPhraseMatches * 8 + keywordMatches * 3 + textMatches};
      }).filter(item => item.score > 0).sort((a,b)=>b.score-a.score || a.scenario.title.localeCompare(b.scenario.title)).slice(0,limit).map(item=>item.scenario);
  }

  function buildSkillCatalog({ personas, skillLibrary, flowLibrary, skillUnits = [], skillRelations = [], skillGuidance = {}, skillPractice = {}, toolUseRecipes = [], operationalScenarioCatalog = [] }) {
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
      skill.operationalScenarios = operationalScenarioCatalog.filter(scenario => scenario.ownerType === 'skill' && scenario.ownerId === skill.id && scenario.status === 'active');
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
    const riley = personaMaintenance['ai-orchestrator'];
    riley.revisions.push({version:'1.1',date:'2026-09-08',changeType:'persona-routing-reconciliation',summary:'Narrowed Riley’s evaluation responsibility to orchestration coordination and made Noor’s conformance observation a required per-run handoff.',affectedFields:['skills','workflows','handoffs'],evidence:'Issue #43 role-boundary cleanup and declared Riley-to-Noor handoff in the conformance Work Order',confidenceChange:'Routing is declared in repository data; runtime enforcement remains untested'});
    riley.revisions.push({version:'1.2',date:'2026-09-14',changeType:'persona-routing-reconciliation',summary:'Confirmed Riley remains an AI orchestrator; Evidence-led Job Search is a Playbook-front-door contextual coordination role, not a Job Search Persona identity.',affectedFields:['roleLabel','implication'],evidence:'Issue #90 ownership correction; no domain expertise added to Riley',confidenceChange:'Identity remains general orchestration; job-search wording corrected on Playbook and docs surfaces'});
    riley.revisions.push({version:'1.3',date:'2026-09-15',changeType:'persona-routing-reconciliation',summary:'Restored Riley Morgan as the default interaction and routing front door for unqualified requests while preserving Playbook procedural ownership, specialist domain ownership, and explicit direct invocation.',affectedFields:['overview','behaviors','workflows'],evidence:'Issue #111 routing correction; issue #90 domain-ownership boundary remains intact',confidenceChange:'Default routing responsibility is explicit; Riley remains a general AI orchestrator and not a job-search domain owner'});
    riley.revisions.push({version:'1.4',date:'2026-09-21',changeType:'orchestration-continuity',summary:'Made cross-agent continuity explicit: Riley resumes substantial linked work from Current Work, uses the Work Order for detailed recovery state, and refreshes live systems only at freshness-sensitive boundaries.',affectedFields:['behaviors','needs','workflows','implication'],evidence:'Issue #178; existing Notion Current Work contract; Work Order recovery contract',confidenceChange:'Durable state hierarchy is declared and regression-tested; cross-runtime enforcement still depends on agents honoring the contract'});
    riley.revisions.push({version:'1.5',date:'2026-09-21',changeType:'orchestration-governance',summary:'Made Riley the default durable orchestration owner for every substantial Current Work workstream while preserving direct execution by the selected Persona, Skill, Playbook, Tool path, or runtime.',affectedFields:['behaviors','workflows','implication'],evidence:'Issue #180; Notion Current Work Operating Route and Parent Work ID fields; shared collaboration governance',confidenceChange:'Universal durable-orchestration ownership is explicit and structurally enforced; runtime compliance still depends on agents loading the contract'});
    riley.version = '1.5'; riley.updated = '2026-09-21';

    const elena = personaMaintenance['career-strategist'];
    elena.revisions.push({version:'1.1',date:'2026-09-14',changeType:'capability-extension',summary:'Attached durable job-ledger disposition to Elena’s search sequencing workflow so repeated discovery updates known opportunities instead of resurfacing them as new.',affectedFields:['skills','workflows'],evidence:'Issue #90 job ledger contract; search specialist owns disposition, Riley does not',confidenceChange:'Ledger ownership is declared; private runtime persistence remains outside Persona-Library'});
    elena.revisions.push({version:'1.2',date:'2026-09-16',changeType:'scope-correction',summary:'Narrowed repeated-search persistence from a full opportunity ledger to a lightweight private seen-job set that suppresses openings already presented.',affectedFields:['skills','workflows'],evidence:'Issue #96 clarified user need: find new jobs without repeating previously shown openings; JobAgent remains reference evidence only',confidenceChange:'Duplicate suppression is explicit; application lifecycle tracking is no longer implied by the deduplication contract'});
    elena.version = '1.2'; elena.updated = '2026-09-16';

    const searchSequencingSkillId = 'skill-search-sequencing-and-prioritization';
    const searchSequencingRecord = skillMaintenance[searchSequencingSkillId];
    searchSequencingRecord.version = '1.1';
    searchSequencingRecord.updated = '2026-09-14';
    searchSequencingRecord.revisions.push({
      version: '1.1',
      date: '2026-09-14',
      changeType: 'source-update',
      summary: 'Extended search sequencing to check and update the durable private job ledger before treating a posting as new.',
      affectedFields: ['definition', 'triggers', 'workflows', 'actions', 'evidence'],
      evidence: 'Issue #90 job ledger contract and Evidence-led Job Search shared-state boundary',
      confidenceChange: 'Contract-level ledger behavior added; repeated-search runtime proof deferred'
    });

    for (const id of ['frontend-systems-engineer', 'application-data-architect']) {
      const record = personaMaintenance[id];
      record.version = '1.0';
      record.updated = '2026-09-21';
      record.revisions = [{
        version:'1.0',
        date:'2026-09-21',
        changeType:'research-backed-persona-creation',
        summary:'Added the specialist Persona after the paired placement, Skill-deduplication, Tool-integration, and portfolio-to-CMS boundary review in issues #182 and #183.',
        affectedFields:['identity','context','goals','pains','behaviors','needs','skills','workflows','resources','handoffs'],
        evidence:'Issue #182 research result; issue #183 placement review; current O*NET, framework/structured-content, accessibility/security, performance, and ADR sources',
        confidenceChange:'Working draft established with evidence-backed role boundaries; repeated real-project use remains the validation path'
      }];
    }

    for (const id of ['skill-architecture-decision-making', 'skill-web-application-architecture', 'skill-application-and-data-architecture']) {
      const record = skillMaintenance[id];
      record.version = '1.0';
      record.updated = '2026-09-21';
      record.revisions = [{
        version:'1.0',
        date:'2026-09-21',
        changeType:'capability-formation',
        summary:'Added the reusable architecture capability after duplicate review and scenario validation across frontend/runtime and application/data decisions.',
        affectedFields:['definition','triggers','operation','quality','workflows','actions','evidence'],
        evidence:'Issues #182 and #183 plus authored Skill practice guidance and representative architecture scenarios',
        confidenceChange:'Working synthesis established; independent reuse should be rechecked after repeated project application'
      }];
    }

    const architectureReusedSkills = [
      'skill-problem-framing-and-systems-thinking',
      'skill-component-and-design-system-thinking',
      'skill-accessibility-and-inclusive-design',
      'skill-evidence-led-validation',
      'skill-decision-communication-and-rationale-documentation',
      'skill-cross-functional-systems-communication'
    ];
    for (const id of architectureReusedSkills) {
      const record = skillMaintenance[id];
      if (!record) continue;
      const [major, minor] = record.version.split('.').map(Number);
      const version = `${major}.${minor + 1}`;
      record.version = version;
      record.updated = '2026-09-21';
      record.revisions.push({
        version,
        date:'2026-09-21',
        changeType:'persona-application',
        summary:'Added a bounded Frontend Systems Engineer and/or Application & Data Architect application while preserving the portable Skill identity.',
        affectedFields:['profiles','workflows'],
        evidence:'Issue #183 Persona-Skill duplicate review and explicit role-boundary validation',
        confidenceChange:'Portable Skill definition remains unchanged; the new Persona application remains a working synthesis'
      });
    }

    const conformanceObserver = personaMaintenance['conformance-observer'];
    conformanceObserver.version = '1.1'; conformanceObserver.updated = '2026-09-08';
    conformanceObserver.revisions.push({version:'1.1',date:'2026-09-08',changeType:'evidence-reconciliation',summary:'Added the Issue #37 conformance suite, Issue #43 observation contract, and explicit live-runtime unknowns to Noor’s working-draft Persona record.',affectedFields:['evidence','resources','context','workflows','needs','implication'],evidence:'Persona Library Issues #37 and #43; conformance-observability Work Order; repository orientation and mutation contracts',confidenceChange:'Working synthesis remains; cross-LLM behavior and identity boundary require actual use'});
    return { personas: personaMaintenance, skills: skillMaintenance };
  }

  function buildOperatingPackCatalog({ operatingPacks = [], personas = [], skillCatalog = [], flowLibrary = {}, playbookCatalog = [] }) {
    const personaById = new Map(personas.map(persona => [persona.id, persona]));
    const skillById = new Map(skillCatalog.map(skill => [skill.id, skill]));
    const playbookById = new Map(playbookCatalog.map(playbook => [playbook.id, playbook]));
    return operatingPacks
      .map(pack => {
        const relatedSkills = (pack.relatedSkills || []).map(id => {
          const skill = skillById.get(id);
          return skill
            ? { id: skill.id, name: skill.name, definition: skill.profiles[0]?.definition || '', known: true, toolUseRecipes: skill.toolUseRecipes || [] }
            : { id, name: id, definition: '', known: false, toolUseRecipes: [] };
        });
        const applications = (pack.applications || []).map(application => {
          const persona = personaById.get(application.personaId);
          const skill = skillById.get(application.skillId);
          const workflow = persona ? (flowLibrary[persona.id] || []).find(item => item.title === application.workflow) : null;
          const skillProfile = skill?.profiles?.find(profile => profile.personaId === application.personaId);
          const profileWorkflows = (skillProfile?.workflows || '').split(' · ').map(workflowTitle => workflowTitle.trim()).filter(Boolean);
          const skillOwnsWorkflow = Boolean(
            skillProfile
            && profileWorkflows.includes(application.workflow)
            && skill.workflows?.some(item => item.personaId === application.personaId && item.title === application.workflow)
          );
          return {
            ...application,
            personaName: persona?.name || application.personaId,
            personaRoleLabel: persona?.roleLabel || '',
            skillName: skill?.name || application.skillId,
            workflowType: workflow?.type || '',
            known: Boolean(persona && skill && workflow && skillProfile && skillOwnsWorkflow)
          };
        });
        const relatedToolRecipes = [...new Map(relatedSkills.flatMap(skill => skill.toolUseRecipes || []).map(recipe => [recipe.id, recipe])).values()];
        return {
          ...pack,
          relatedSkills,
          relatedPersonas: [...new Map(applications.map(application => [application.personaId, { id: application.personaId, name: application.personaName, roleLabel: application.personaRoleLabel }])).values()],
          applications,
          playbooks: (pack.playbooks || []).map(id => {
            const playbook = playbookById.get(id);
            return playbook ? { ...playbook, known: true } : { id, name: id, status: 'Unknown reference', known: false };
          }),
          relatedToolRecipes
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  function buildTemplateCatalog({ templates = [], personas = [], skillCatalog = [], flowLibrary = {}, operatingPackCatalog = [], playbookCatalog = [] }) {
    const personaById = new Map(personas.map(persona => [persona.id, persona]));
    const skillById = new Map(skillCatalog.map(skill => [skill.id, skill]));
    const operatingPackById = new Map(operatingPackCatalog.map(pack => [pack.id, pack]));
    const playbookById = new Map(playbookCatalog.map(playbook => [playbook.id, playbook]));
    return templates
      .map(template => {
        const source = template.source || {};
        const lifecycleId = template.lifecycle || (String(template.status || '').toLowerCase().includes('planned') ? 'planned' : 'candidate');
        const sourceStateId = source.path && source.entrypoint && source.revision ? 'verified' : source.availability === 'planned' ? 'planned' : 'unknown';
        const runtimeAccessId = templateRuntimeStateByAvailability[source.availability] || 'unknown';
        const previewKind = Object.prototype.hasOwnProperty.call(templatePreviewConfig(), template.id) ? 'illustrative' : 'none';
        const lifecycleState = templateState('lifecycle', lifecycleId, { label: lifecycleId, detail: 'Lifecycle state is not fully described.' });
        const sourceState = templateState('source', sourceStateId, { label: sourceStateId, detail: 'Source evidence is not fully described.' });
        const runtimeAccessState = templateState('runtime', runtimeAccessId, { label: runtimeAccessId, detail: 'Runtime access state is not fully described.' });
        const previewState = templateState('preview', previewKind, { label: previewKind, detail: 'Viewer representation is not fully described.' });
        const relatedSkills = (template.relatedSkills || []).map(id => {
          const skill = skillById.get(id);
          return skill
            ? { id: skill.id, name: skill.name, definition: skill.profiles[0]?.definition || '', known: true, toolUseRecipes: skill.toolUseRecipes || [] }
            : { id, name: id, definition: '', known: false, toolUseRecipes: [] };
        });
        const applications = (template.applications || []).map(application => {
          const persona = personaById.get(application.personaId);
          const skill = skillById.get(application.skillId);
          const workflow = persona ? (flowLibrary[persona.id] || []).find(item => item.title === application.workflow) : null;
          const skillProfile = skill?.profiles?.find(profile => profile.personaId === application.personaId);
          const profileWorkflows = (skillProfile?.workflows || '').split(' · ').map(workflowTitle => workflowTitle.trim()).filter(Boolean);
          const skillOwnsWorkflow = Boolean(
            skillProfile
            && profileWorkflows.includes(application.workflow)
            && skill.workflows?.some(item => item.personaId === application.personaId && item.title === application.workflow)
          );
          return {
            ...application,
            personaName: persona?.name || application.personaId,
            personaRoleLabel: persona?.roleLabel || '',
            skillName: skill?.name || application.skillId,
            workflowType: workflow?.type || '',
            known: Boolean(persona && skill && workflow && skillProfile && skillOwnsWorkflow)
          };
        });
        const operatingPacks = (template.operatingPacks || []).map(id => {
          const pack = operatingPackById.get(id);
          return pack ? { id: pack.id, name: pack.name, purpose: pack.purpose, known: true } : { id, name: id, purpose: '', known: false };
        });
        const playbooks = (template.playbooks || []).map(id => {
          const playbook = playbookById.get(id);
          return playbook ? { ...playbook, known: true } : { id, name: id, status: 'Unknown reference', known: false };
        });
        const relatedToolRecipes = [...new Map(relatedSkills.flatMap(skill => skill.toolUseRecipes || []).map(recipe => [recipe.id, recipe])).values()];
        return {
          ...template,
          lifecycleState,
          sourceState,
          runtimeAccessState,
          previewState,
          relatedSkills,
          relatedPersonas: [...new Map(applications.map(application => [application.personaId, { id: application.personaId, name: application.personaName, roleLabel: application.personaRoleLabel }])).values()],
          applications,
          operatingPacks,
          playbooks,
          relatedToolRecipes
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  function buildPersonaToolRequirements({ personas, personaToolRequirements = [] }) {
    const personaIds = new Set(personas.map(persona => persona.id));
    return personaToolRequirements
      .filter(requirement => personaIds.has(requirement.personaId))
      .map(requirement => ({ ...requirement }));
  }

  function buildPersonaHandoffs({ personas, personaHandoffs = [] }) {
    const personaIds = new Set(personas.map(persona => persona.id));
    return personaHandoffs
      .filter(handoff => personaIds.has(handoff.fromPersonaId) && personaIds.has(handoff.toPersonaId))
      .map(handoff => ({ ...handoff }));
  }

  data.operationalScenarioCatalog = buildOperationalScenarioCatalog(data);
  data.toolUseRecipes = buildToolUseRecipes({ toolUseRecipes: data.toolUseRecipes, operationalScenarioCatalog: data.operationalScenarioCatalog });
  data.skillCatalog = buildSkillCatalog(data);
  data.operatingPackCatalog = buildOperatingPackCatalog(data);
  data.templateCatalog = buildTemplateCatalog(data);
  data.personaToolRequirements = buildPersonaToolRequirements(data);
  data.personaHandoffs = buildPersonaHandoffs(data);
  data.maintenance = buildMaintenance(data);
  window.PersonaLibraryModel = { slugify, buildOperationalScenarioCatalog, buildToolUseRecipes, findOperationalScenarios, buildSkillCatalog, buildOperatingPackCatalog, buildTemplateCatalog, buildPersonaToolRequirements, buildPersonaHandoffs, buildMaintenance, templateStateCatalog, templateRuntimeStateByAvailability };
})();
