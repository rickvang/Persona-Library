---
name: work-graph-orchestration
description: Supervise dependency-aware work across multiple agents, issues, branches, PRs, or execution runtimes while keeping one authoritative work graph, explicit gates, recoverable dispatches, and evidence-based completion.
metadata:
  skill_layer: orchestration
  change_mode: external_execution
  change_domain: multi-agent-supervision
  reconciliation: change-impact-reconciliation
---

# Work Graph Orchestration

## Purpose

Turn one substantial outcome into a minimal, inspectable work graph and supervise it through execution without becoming the execution runtime. Riley owns the graph, routing policy, evidence requirements, recovery decisions, and reconciliation. Codex, Work, Herdr, Orca, Maestro, Vicoa, direct Tools, or later runtimes may execute individual nodes when available.

This Skill composes Riley's existing Agent Workflow Architecture, Task Decomposition and Routing, Tool and Context Design, Risk / Guardrails / Human Oversight, and Failure Recovery capabilities. Use the bounded-parallel implementation Playbook when repository implementation needs its source-grounding, review, correction, and merge stages.

## Use this Skill when

- one outcome spans multiple issues, branches, PRs, agents, or specialist workstreams;
- some work can proceed concurrently but dependencies or collision risk must be managed;
- Riley must supervise delegated work rather than transfer ownership completely;
- an interrupted or stale execution attempt must be resumed, superseded, or reassigned safely;
- the user wants to hand Riley a set of current tasks and have Riley plan, route, supervise, and reconcile them.

Do not use it for a single bounded task that one executor can complete directly, ordinary Persona routing, a one-way ownership handoff with no supervision, or as a reason to spawn more agents than the work requires.

## Source-of-truth hierarchy

1. **Current Work** is the durable human-facing cross-thread/cross-agent index.
2. **Work Order** is detailed project-scoped execution and recovery state.
3. **Live systems** such as GitHub, CI, and the selected runtime are freshness-sensitive authority for volatile state.
4. The **WorkGraph packet** is a compact supervisory representation derived from those sources; it is not a second orchestration database.

Never mirror continuously changing runtime, PR, check, or mergeability state into Notion merely to keep the graph current. Record the last proven checkpoint and refresh the live source when freshness matters.

## Minimal work-graph model

### WorkGraph

Record:

- outcome and stopping condition;
- required WorkNodes;
- dependency edges;
- explicit Gates;
- current authoritative Dispatch for each active node;
- evidence required for acceptance;
- unresolved blockers and next orchestration action.

### WorkNode

Each node has:

- stable node ID within the graph;
- bounded objective and owner;
- dependencies;
- expected output/evidence;
- execution route;
- state: `ready | running | waiting | review | accepted | blocked | deferred | superseded`;
- current authoritative dispatch ID when one exists.

A node describes **what must be achieved**. It is not an agent session, branch, PR, or model invocation.

### Dispatch

A Dispatch is one execution attempt for one WorkNode. Record:

- dispatch ID;
- node ID;
- executor / runtime / method;
- created-from checkpoint or source revision;
- branch, worktree, session, task, issue, or PR references when available;
- lifecycle state;
- last proven evidence;
- disposition.

Only one Dispatch may hold active authority for a node at a time; this is an ownership limit, not a limit on historical attempts. Keep every attempt under its own dispatch ID with its own lifecycle state and disposition. Before retry or reassignment, inspect live runtime state and record evidence that the prior attempt can no longer act on the node. Name who may stop or supersede it and whether human authorization is required; when required, name the approver and approval evidence. If the prior attempt's authority cannot be confirmed ended, or required approval evidence is absent, hold the node as blocked or waiting and do not dispatch a replacement. Otherwise, explicitly disposition the old Dispatch, then persist the new Dispatch ID before launching it.

### Gate

Represent consequential conditions explicitly, such as:

- dependency completion;
- source-grounding;
- collision review;
- human decision;
- authorization;
- validation;
- review;
- merge / publication boundary.

A Gate is satisfied only by its named evidence. Do not treat a conversational implication as a passed gate.

### Evidence and disposition

Evidence is inspectable proof: current issue/PR state, checks, test output, review result, artifact reference, or a named blocker with re-entry condition.

Every settled Dispatch receives a disposition:

- `accepted`;
- `blocked`;
- `deferred`;
- `retry`;
- `superseded`;
- `released` / cleaned up.

## Orchestration invariants

1. Keep **one authoritative active dispatch per WorkNode**.
2. Treat retries and reassignments as new dispatches; stale attempts never silently regain authority.
3. Do not infer completion from silence, idle state, process exit, a commit, a branch, or the executor's self-report alone.
4. Distinguish **handoff** from **supervised delegation**. A handoff transfers responsibility; supervised delegation leaves Riley accountable for the outcome.
5. Parallelize only nodes that are dependency-independent and pass collision review. Serialize shared-file, shared-schema, shared-architecture, or unknown-overlap work by default.
6. Recovery is **read-before-retry**. Rediscover live state before spawning another agent, branch, task, or PR.
7. Give every settled dispatch an explicit disposition, cleanup state, and re-entry condition when applicable.
8. Keep human, review, validation, and authorization gates explicit.
9. Discover runtime capability at dispatch time. Adapt the execution route without changing the WorkNode contract.
10. Declare the outcome complete only when every required node is accepted or explicitly blocked/deferred under the stopping condition and durable orchestration state is reconciled.

## Operating procedure

1. **Rehydrate.** Resolve the Current Work item, linked Work Order, current repository/source state, and any live execution references. Refresh volatile state only where it affects the next decision.
2. **Frame the graph.** State the outcome, stop condition, WorkNodes, dependencies, evidence, and required gates. Prefer the smallest graph that explains the work.
3. **Check concurrency.** Identify file, schema, architecture, state, environment, and decision collisions. Remove fake parallelism and serialize uncertain overlap.
4. **Resolve execution routes.** For each ready node, select the smallest capable Persona / Skill / Playbook / Tool / runtime. Verify access before claiming dispatch.
5. **Create bounded dispatches.** Give each executor one node, the minimum necessary context, a stop condition, expected evidence, and explicit permission boundary. Record returned IDs rather than predicting them.
6. **Supervise by events and evidence.** Use runtime lifecycle signals when available, but verify completion through the WorkNode evidence contract. Do not poll without a freshness reason.
7. **Handle gates and blockers.** Pause the affected node, preserve independent lanes when safe, and surface consequential human decisions instead of answering them on the user's behalf.
8. **Recover safely.** On timeout, stale state, failure, or interruption, inspect the existing Dispatch and live references first. Establish from live evidence that it can no longer act on the node; if the adapter cannot establish this, pause or block the node instead of issuing a replacement. Name the stop/supersession authority and any required human approval, and keep replacement work waiting until its approval evidence is recorded. Resume the same Dispatch when safe; otherwise record its disposition and persist the new Dispatch ID before launch.
9. **Review and reconcile.** Apply the relevant Playbook / Tool contract for review and consequential mutations. Update the Work Order and Current Work only at meaningful lifecycle boundaries.
10. **Stop cleanly.** Accept, block, defer, supersede, or release every active node/dispatch; record the exact next action for anything unfinished.

## Execution-adapter contract

A runtime adapter may support some subset of:

- create, resume, or cancel a dispatch;
- get lifecycle state;
- send a bounded follow-up;
- wait for a settled or blocked state;
- read output and evidence;
- expose branch, worktree, task, session, issue, or PR identity;
- clean up state owned by the dispatch.

Treat adapter capabilities as runtime evidence, not assumptions. If a capability is absent, choose a simpler route or expose the limitation. Do not build a new scheduler, terminal multiplexer, worker daemon, model gateway, queue, or runtime abstraction merely to make every provider look identical.

## GitHub / repository mapping

For repository work, a common mapping is:

`issue or scoped workstream → WorkNode → Dispatch → branch/worktree/session → PR → validation/review Gate → disposition`

Use the repository's pinned GitHub operating contract for mutation classes, authorization, review, merge, and linked-issue completion. This Skill does not create merge permission.

Before parallel repository dispatch, confirm:

- different nodes are genuinely separable;
- shared files or architectural surfaces are known;
- branch/base relationships are explicit;
- downstream nodes name dependencies;
- later merges can be serialized safely.

### Repository dispatch identity

For repository work, keep these identities distinct:

- **WorkNode** is the stable objective. It survives commits, CI reruns, review cycles, rebases, and bounded corrections.
- **Dispatch** is one authoritative execution attempt for the WorkNode.
- **Branch / worktree / task / session / PR** are references owned by the Dispatch; none of them alone replaces WorkNode or Dispatch identity.
- **CI runs, review events, comments, and commits** are evidence events inside a Dispatch, not new Dispatches.

A bounded correction on the same owned execution attempt stays inside the current Dispatch. Do **not** create a new Dispatch merely because CI failed, review requested changes, a rebase was required, or another commit was added.

Create a **new Dispatch identity** only when the current execution attempt is abandoned, superseded, reassigned, or replaced by another route/branch/task/session that will now own the WorkNode. Before doing so, re-read the current branch/PR/runtime state and explicitly disposition the previous Dispatch.

### Repository state mapping

A typical repository lane maps as follows:

- `ready`: dependencies and collision gate pass; no execution attempt owns the node yet;
- `running`: one authoritative Dispatch owns the node and is mutating/validating its branch or equivalent execution surface;
- `review`: the Dispatch produced a coherent review checkpoint such as a PR and required implementation-stage validation is complete or explicitly bounded;
- `waiting`: a dependency, shared-file collision, base change, authorization gate, or external condition prevents safe progress;
- `accepted`: the node's declared completion evidence and required review/authorization conditions are satisfied;
- `blocked | deferred | superseded`: use the named disposition and re-entry/cleanup rule.

If collision or dependency uncertainty appears after dispatch, freeze the affected later node, serialize the lanes, refresh the relevant base after the earlier node settles, then resume/rebase or explicitly supersede. Do not keep conflicting authority active in parallel.

## Recovery rules

- A timeout or lost callback does not prove the action failed; inspect current state before retrying.
- A branch or PR discovered after an interruption may be adopted only when its provenance matches the node/dispatch and current source.
- If two attempts exist, choose one authoritative dispatch explicitly and supersede or quarantine the other.
- Preserve partial useful work when it can be reviewed safely; do not delete evidence merely to simplify the graph.
- Resume from stable identifiers and the last proven checkpoint, not from remembered child transcripts.
- If the runtime cannot be inspected or resumed safely, mark the node blocked/deferred and name the re-entry condition.

## Output contract

For an active run, return a compact supervisory packet:

```text
outcome:
graph status:
nodes:
  - node id:
    objective:
    state:
    dependencies:
    authoritative dispatch:
    route:
    evidence:
    blocker / next gate:
next orchestration action:
durable checkpoint updated:
limitations:
```

Do not dump child transcripts or hidden reasoning into the packet.

## Boundaries

- This Skill supervises execution; it does not replace the specialist capability needed to do each node's work.
- It does not grant mutation, merge, deployment, publication, purchasing, communication, credential, or access permission.
- It does not require a particular runtime.
- It does not persist a second canonical task database.
- It does not maximize parallelism; sequential execution is correct when dependencies, collision risk, or runtime limits make it safer or cheaper.
- Provider-specific procedures belong in Tool-use recipes or runtime packages only after repeated evidence justifies them.
