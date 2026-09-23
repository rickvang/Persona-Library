window.PersonaLibraryDataFragments = window.PersonaLibraryDataFragments || {};
window.PersonaLibraryDataFragments.operationalScenarios = window.PersonaLibraryDataFragments.operationalScenarios || [];
window.PersonaLibraryDataFragments.operationalScenarios.push({
  "id": "scenario-riley-work-graph-supervision",
  "title": "Supervise several implementation lanes without losing authoritative ownership",
  "ownerType": "skill",
  "ownerId": "skill-work-graph-orchestration",
  "situation": "A substantial outcome spans several issues, branches, PRs, agents, or runtimes and Riley must decide dependencies, safe parallelism, authoritative attempts, gates, recovery, and completion.",
  "expectedRoute": "Riley Morgan → Work graph orchestration → smallest capable execution routes → live evidence / review gates → Current Work and Work Order reconciliation",
  "route": {
    "personaIds": ["ai-orchestrator"],
    "skillIds": ["skill-work-graph-orchestration", "skill-task-decomposition-and-routing", "skill-tool-and-context-design", "skill-failure-recovery-and-operational-judgment"],
    "toolRecipeIds": [],
    "operatingPackIds": []
  },
  "match": {
    "phrases": ["orchestrate multiple agents", "work graph", "multiple branches and prs", "coordinate current tasks", "supervise delegated work"],
    "keywords": ["orchestration", "agents", "branches", "pull requests", "dependencies", "parallel", "dispatch", "recovery", "current work"]
  },
  "preconditions": [
    "One substantial outcome and stopping condition are known.",
    "Current Work / Work Order checkpoints are available when the workstream already exists.",
    "Current repository, issue, PR, and runtime references are available when those systems are involved.",
    "Execution permissions and available runtimes are known or can be checked before dispatch."
  ],
  "do": [
    "Keep WorkNode identity separate from agent, task, branch, worktree, session, and PR identity.",
    "Keep one authoritative active Dispatch per WorkNode.",
    "Prefer sequential work when dependencies or collision risk are unclear.",
    "Treat human, validation, review, and authorization conditions as explicit Gates.",
    "Use Current Work as the durable cross-agent index, Work Order as detailed recovery state, and live systems as volatile authority.",
    "Keep runtime-specific syntax outside the portable Skill until repeated evidence justifies a dedicated recipe."
  ],
  "dont": [
    "Do not infer completion from idle, silence, process exit, commit existence, or executor self-report alone.",
    "Do not create a second authoritative task database.",
    "Do not spawn a replacement before checking whether the previous Dispatch created durable work.",
    "Do not let two Dispatches silently remain authoritative for the same WorkNode.",
    "Do not maximize parallelism or build a new runtime to normalize every provider."
  ],
  "recommendedSequence": [
    "Rehydrate durable and freshness-sensitive state; do not reconstruct from transcript memory when stable references exist.",
    "Build the smallest WorkGraph with WorkNodes, dependencies, Gates, evidence requirements, and explicit stop conditions.",
    "Check file, schema, architecture, environment, and decision collisions before allowing parallel dispatch.",
    "Create one authoritative Dispatch per ready WorkNode using available runtimes; record returned identities and permission boundaries.",
    "Supervise lifecycle signals, but judge completion only from the WorkNode evidence contract and required review / authorization Gates.",
    "On interruption or failure, read current state before retrying; resume or explicitly supersede the previous Dispatch.",
    "Give every settled Dispatch a disposition, reconcile meaningful checkpoints, and declare the outcome complete only under the graph stopping condition."
  ],
  "stateToReuse": [
    "WorkGraph outcome, WorkNode objectives, dependencies, and evidence requirements until the objective or source-of-truth changes.",
    "Stable dispatch identifiers and branch / task / session / PR references until a live-state freshness trigger occurs.",
    "Completed evidence until a relevant source mutation or review event invalidates it."
  ],
  "freshnessTriggers": [
    "A source or branch mutation affects previously inspected dependencies or collision state.",
    "A runtime timeout, lost callback, reconnect, or retry decision occurs.",
    "A check, review, or mergeability state is expected to have changed.",
    "Immediately before a consequential mutation or reassignment."
  ],
  "stopConditions": [
    "No WorkNode is ready and the next Gate requires a consequential user decision.",
    "A required runtime, permission, or authoritative source cannot be inspected safely.",
    "Every required WorkNode is accepted or explicitly blocked / deferred under the declared stopping condition and durable state is reconciled."
  ],
  "escalationTriggers": [
    "A hidden dependency or collision invalidates planned parallelism.",
    "Ownership or source-of-truth conflict cannot be resolved from the current contracts.",
    "A consequential authorization or product decision is required before an executor can continue."
  ],
  "successSignals": [
    "Every active WorkNode has one authoritative Dispatch, known dependencies, a next Gate, and an evidence requirement.",
    "Parallel lanes have explicit independence and collision evidence.",
    "Retries and reassignments supersede prior attempts explicitly rather than duplicating authority.",
    "Another agent can resume from stable identifiers and compact checkpoints without child transcripts.",
    "Completion is supported by node evidence and required Gates, then reconciled to durable state."
  ],
  "goodTrace": [
    "Current Work + Work Order + live state → minimal WorkGraph → dependency/collision review → bounded Dispatches → evidence/Gates → explicit dispositions → reconciliation → stop"
  ],
  "antiPatterns": [
    "Spawning agents because capacity exists rather than because nodes are independent.",
    "Treating process or agent lifecycle state as proof of outcome completion.",
    "Creating replacement tasks, branches, or PRs before inspecting the previous Dispatch.",
    "Copying volatile runtime state into Notion after every event."
  ],
  "badTrace": [
    "load task list → spawn several agents immediately → lose track of branch ownership → timeout → spawn duplicates → accept whichever PR finishes first → update Current Work from stale assumptions"
  ],
  "whyBad": [
    "Work identity and execution-attempt identity are conflated.",
    "Parallelism is not constrained by dependencies or collision risk.",
    "Retry is not idempotent and can leave duplicate authoritative work.",
    "Completion is inferred from runtime behavior rather than explicit evidence and Gates."
  ],
  "recoveryPath": [
    "Inspect the current Dispatch, branch / task / session / PR, and last proven evidence before any retry.",
    "Adopt discovered partial work only when provenance matches the WorkNode and current source.",
    "Explicitly supersede or quarantine duplicate attempts and leave one authoritative Dispatch.",
    "Resume another agent from stable identifiers and compact checkpoints rather than child transcripts."
  ],
  "evidenceStatus": "candidate",
  "evidence": [
    "CW-44 external orchestration pattern review",
    "Persona-Library issue #197 implementation plan",
    "Existing Riley Current Work continuity and bounded-parallel implementation contracts",
    "CW-44 runtime-dispatch-proof.md: live dispatch, context-free reconstruction, and same-identity interrupted resume"
  ],
  "confidence": "Working synthesis; one live supervised dispatch and same-identity interrupted resume are evidenced. A distinct agent takeover and runtime replacement/supersession remain unproven; repository validation and final Riley conformance are pending.",
  "status": "active",
  "version": "1.0",
  "updated": "2026-09-22"
});
