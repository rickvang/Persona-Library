window.PersonaLibraryDataFragments = window.PersonaLibraryDataFragments || {};
window.PersonaLibraryDataFragments.operationalScenarios = window.PersonaLibraryDataFragments.operationalScenarios || [];
window.PersonaLibraryDataFragments.operationalScenarios.push({
  id:'scenario-riley-work-graph-supervision',
  title:'Supervise several implementation lanes without losing authoritative ownership',
  ownerType:'skill',
  ownerId:'skill-work-graph-orchestration',
  situation:'A substantial outcome spans several issues, branches, PRs, agents, or runtimes and Riley must decide dependencies, safe parallelism, authoritative attempts, gates, recovery, and completion.',
  expectedRoute:'Riley Morgan → Work graph orchestration → smallest capable execution routes → live evidence / review gates → Current Work and Work Order reconciliation',
  route:{
    personaIds:['ai-orchestrator'],
    skillIds:['skill-work-graph-orchestration','skill-task-decomposition-and-routing','skill-tool-and-context-design','skill-failure-recovery-and-operational-judgment'],
    toolRecipeIds:[],
    operatingPackIds:[]
  },
  match:{
    phrases:['orchestrate multiple agents','work graph','multiple branches and prs','coordinate current tasks','supervise delegated work'],
    keywords:['orchestration','agents','branches','pull requests','dependencies','parallel','dispatch','recovery','current work']
  },
  inputs:[
    'One substantial outcome with a stopping condition',
    'Current Work / Work Order checkpoint when the work already exists',
    'Current repository / issue / PR state when repository work is involved',
    'Available execution runtimes and permission boundaries'
  ],
  decisions:[
    'Which responsibilities deserve separate WorkNodes',
    'Which nodes are truly independent and collision-safe',
    'Which execution route is the smallest capable choice for each ready node',
    'Which dispatch is authoritative after retry, interruption, or reassignment',
    'What evidence and gates prove each node and the overall outcome are settled'
  ],
  sequence:[
    'Rehydrate durable and freshness-sensitive state; do not reconstruct from transcript memory when stable references exist.',
    'Build the smallest WorkGraph with nodes, dependencies, gates, evidence requirements, and explicit stop conditions.',
    'Check file, schema, architecture, environment, and decision collisions before allowing parallel dispatch.',
    'Create one authoritative dispatch per ready node using available runtimes; record returned identities and permission boundaries.',
    'Supervise lifecycle signals, but judge completion only from the node evidence contract and required review / authorization gates.',
    'On interruption or failure, read current state before retrying; resume or explicitly supersede the previous dispatch.',
    'Give every settled dispatch a disposition, reconcile meaningful checkpoints, and declare the outcome complete only under the graph stopping condition.'
  ],
  do:[
    'Keep WorkNode identity separate from agent/session/branch/PR identity.',
    'Prefer sequential work when dependencies or collision risk are unclear.',
    'Treat human, validation, review, and authorization conditions as explicit gates.',
    'Use Current Work as durable cross-agent index, Work Order as detailed recovery state, and live systems as volatile authority.',
    'Keep runtime-specific syntax outside the portable Skill until repeated evidence justifies a dedicated recipe.'
  ],
  dont:[
    'Do not infer completion from idle, silence, process exit, commit existence, or executor self-report alone.',
    'Do not create a second authoritative task database.',
    'Do not spawn a replacement before checking whether the previous dispatch actually created durable work.',
    'Do not let two dispatches silently remain authoritative for the same WorkNode.',
    'Do not maximize parallelism or build a new runtime to normalize every provider.'
  ],
  freshness:[
    'Refresh issue / PR / branch / check state before a decision that depends on current repository truth.',
    'Refresh runtime state after timeout, lost callback, reconnect, or before retry / cancellation.',
    'Reuse durable graph/node definitions until the objective, dependency, owner, or completion evidence changes materially.'
  ],
  stop:[
    'Stop dispatching when no node is ready, a consequential gate requires the user, or runtime/tool access is unavailable.',
    'Stop the run when every required node is accepted or explicitly blocked/deferred under the declared stopping condition and durable state is reconciled.'
  ],
  escalation:[
    'Escalate hidden dependency or collision findings by serializing affected nodes and updating the graph.',
    'Escalate conflicting ownership or source-of-truth questions to the appropriate architecture/placement owner before execution.',
    'Escalate consequential authorization decisions to the user rather than answering them inside a child executor.'
  ],
  recovery:[
    'Inspect the current dispatch, branch/task/session/PR, and last proven evidence before any retry.',
    'Adopt discovered partial work only when provenance matches the node and current source.',
    'Explicitly supersede or quarantine duplicate attempts and leave one authoritative dispatch.',
    'Resume another agent from stable identifiers and compact checkpoints rather than child transcripts.'
  ],
  output:'A compact WorkGraph supervisory packet with node states, authoritative dispatches, evidence/gates, blockers, dispositions, next orchestration action, and durable-checkpoint status.',
  evidenceStatus:'candidate',
  evidence:[
    'CW-44 external orchestration pattern review',
    'Persona-Library #197 implementation plan',
    'Existing Riley Current Work continuity and bounded-parallel implementation contracts'
  ],
  status:'active',
  version:'1.0',
  updated:'2026-09-22'
});
