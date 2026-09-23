window.PersonaLibraryDataFragments = window.PersonaLibraryDataFragments || {};
window.PersonaLibraryDataFragments.operationalScenarios = window.PersonaLibraryDataFragments.operationalScenarios || [];
window.PersonaLibraryDataFragments.operationalScenarios.push({
  "id": "scenario-github-issue-implementation",
  "title": "Implement a GitHub issue without remote-call churn",
  "ownerType": "tool-use-recipe",
  "ownerId": "recipe-riley-github-efficient-change",
  "situation": "A scoped repository issue is authorized for implementation and the agent needs current remote truth, coherent mutations, review evidence, and a safe completion boundary.",
  "expectedRoute": "Riley Morgan → Tool and context design → GitHub efficient-change recipe",
  "route": {
    "personaIds": [
      "ai-orchestrator"
    ],
    "skillIds": [
      "skill-tool-and-context-design"
    ],
    "toolRecipeIds": [
      "recipe-riley-github-efficient-change"
    ],
    "operatingPackIds": []
  },
  "match": {
    "phrases": [
      "implement github issue",
      "implement repository issue",
      "fix github issue",
      "complete repository change"
    ],
    "keywords": [
      "github",
      "repository",
      "issue",
      "implement",
      "fix",
      "pull request",
      "merge"
    ]
  },
  "preconditions": [
    "Named repository and scoped issue or requested change.",
    "Current repository instructions and base state are available.",
    "Mutation class and completion authorization are known."
  ],
  "do": [
    "Gather the minimum coherent source and live state before editing.",
    "Reuse still-valid evidence until a named freshness trigger occurs.",
    "Batch related mutations into reviewable checkpoints.",
    "Edit, build, and validate in a clean working copy created from freshly fetched origin/main, then push coherent commits.",
    "Use repository/static validation before escalating to deployed-state verification.",
    "Refresh base/head/check/review/mergeability state immediately before merge."
  ],
  "dont": [
    "Refetch unchanged issue, branch, or file state after every internal thought.",
    "Use commits, pull requests, or deployments as a diagnostic scratchpad.",
    "Poll checks when no new run or freshness trigger exists.",
    "Create a Preview to answer a source-level question that CI or static validation can answer.",
    "Continue calling Tools after the requested outcome and completion gate are satisfied."
  ],
  "recommendedSequence": [
    "Read the issue, repository contract, relevant source, and current base in one bounded evidence pass.",
    "Define scope, success criteria, stale-state triggers, and validation layers.",
    "Create or reuse the scoped branch in a clean working copy, then batch coherent source changes.",
    "Run the cheapest sufficient validation locally with the repository CI workflow commands; GitHub CI remains the required check.",
    "Open or update the pull request only when there is a coherent review checkpoint.",
    "Inspect the current PR head, checks, reviews, and threads; correct observed failures rather than speculative ones.",
    "Immediately before merge, refresh base/head, required checks, blocking review state, unresolved threads, mergeability, and linked-completion effects.",
    "Merge only when the current gate is clean, reconcile durable state, then stop."
  ],
  "stateToReuse": [
    "Issue scope and repository contract until the requester or repository changes them.",
    "Fetched source content until that path, branch, or base relationship changes.",
    "Completed validation evidence until a relevant source change invalidates it."
  ],
  "freshnessTriggers": [
    "A source or branch mutation affects previously inspected state.",
    "A check/review event is expected to have changed.",
    "The base branch moves in a way that can affect mergeability or validation.",
    "Immediately before a consequential mutation such as merge or close."
  ],
  "stopConditions": [
    "Repository evidence is sufficient for the requested claim and no higher-cost evidence is required.",
    "The pull request is merged and linked completion/reconciliation is verified.",
    "A required permission, review, or target cannot be verified; stop with the exact blocker rather than trying alternate workspaces."
  ],
  "escalationTriggers": [
    "Repository CI cannot answer a deployed runtime question.",
    "A failed gate adds new evidence requiring another read or correction.",
    "A materially new visual/integration state is useful for requester review."
  ],
  "successSignals": [
    "Remote reads are bounded by explicit invalidation events.",
    "Commits represent coherent review states.",
    "Validation escalates only when the cheaper layer cannot answer the question.",
    "Final merge uses fresh state and leaves no known blocking review or failed required check."
  ],
  "goodTrace": [
    "issue + AGENTS + relevant source + base → scoped branch → batched edits → source/static validation → PR → CI/review evidence → one final freshness pass → merge → stop"
  ],
  "antiPatterns": [
    "Read-edit-refetch loops with no stale-state trigger.",
    "Premature PR/Preview creation before a coherent checkpoint.",
    "Repeated status polling merely because time passed.",
    "Deploying to diagnose failures already observable in source or CI."
  ],
  "badTrace": [
    "fetch issue → fetch main → fetch file → edit → refetch issue → refetch main → edit another file → open PR early → deploy Preview → edit again → deploy again → repeatedly poll PR"
  ],
  "whyBad": [
    "No invalidation rule distinguishes stale state from reusable state.",
    "Writes and review checkpoints are fragmented instead of batched.",
    "Without a working copy, every file change is a separate remote commit and only CI can reveal build or validation failures.",
    "Higher-cost deployment evidence is used before cheaper validation is exhausted.",
    "The agent keeps operating after useful evidence has stopped increasing."
  ],
  "recoveryPath": [
    "If base/head diverges, refresh only the affected branch/merge state and revalidate the impacted layer.",
    "If CI fails, inspect the failed job/evidence, correct that failure, and rerun the smallest relevant validation.",
    "If scope or authorization changes, stop and reconcile the Work Order/Current Work route before further mutation."
  ],
  "evidenceStatus": "validated",
  "evidence": [
    "DEC-018",
    "DEC-024",
    "Issue #159 deployment/tool-call investigation",
    "Persona-Library GitHub operating contract",
    "Repeated repository implementation work through PR #184"
  ],
  "confidence": "High within Persona-Library repository work; runtime-specific connector availability remains separate.",
  "status": "active"
});
