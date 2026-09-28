# Persona-Library repository dispatcher

Persona-Library owns the Persona system's canonical records, routing, documentation, Decisions, Playbooks, repository-local callable Skills, and generated Site contract. Use [docs/policy-ownership.md](docs/policy-ownership.md) to find the canonical owner of detailed repository policy instead of treating this file as a second policy manual.

Treat the **default mode as read-only** until the requested scope authorizes a mutation.

## Choose the shortest activation path

- **repository-plumbing:** use for CI/workflow maintenance, build scripts, generated-output reproducibility, repository hygiene, documentation-link repair, and straightforward file lifecycle work whose target is already clear. Go directly to the target file or architecture contract, the applicable Tool / Operational Scenario when needed, and repository validation.
- **library-semantic:** use for Persona records, Skill identity/profile/relationships, Tool identity/recipes, Template catalog relationships, Playbook identity/orchestration, Operating Pack relationships, Decisions, semantic routing, or other canonical library meaning. For an explicit Persona-Library system-orientation/navigation request, invoke `$persona-library-orientation` directly; that Skill prefers its generated bounded context bundle and owns the canonical fallback. For an explicit Template composition/adaptation request whose accepted research result and artifact/target boundary are already clear, invoke `$template-composer` directly; that Skill prefers its route-bounded generated context and owns the canonical fallback. Missing or ambiguous Template research, source/provenance, target placement, or authorization stays on the normal semantic route instead of being inferred. Other semantic work reads `content/site-orientation.json`, chooses one primary space, then loads only that route group and the selected records/capability.
- **Mixed work:** a task may start as plumbing, but **escalate to the library-semantic path** before changing canonical library meaning, identity, relationships, Decisions, or semantic routing.

Selecting the plumbing path never changes mutation authorization or validation requirements.

## Placement and semantic integrity

Use the documented placement table and gate directly (`docs/README.md`) when artifact kind, canonical owner, destination pattern, lifecycle, and source-of-truth boundary are already clear. **Escalate to Mara Okoye** when ownership is ambiguous, a new artifact class/top-level space/semantic identity is introduced, destinations compete, lifecycle/source-of-truth conflict remains, or a cross-repository/taxonomy boundary changes. Regenerating known output from an established source does not itself require Mara review.

For semantic work, preserve prototype isolation and append durable rationale to Decisions rather than rewriting history. Read the selected Skill's `change_mode`, `change_domain`, and `reconciliation` metadata; run `$change-impact-reconciliation` when that contract requires it. Metadata and routing never grant write authority.

## Durable work and recovery

For substantial cross-thread or cross-agent work, follow [docs/work-orders.md](docs/work-orders.md):

- Current Work is the concise durable cross-thread index.
- A Work Order is optional and exists only when Current Work + the issue/PR + domain artifact do not preserve enough unique execution/recovery state.
- Use Work Graph orchestration only for genuinely multi-node/dependency-aware work; the selected executor can operate directly.
- Verification Queue remains an independent deferred-verification lifecycle.
- GitHub, CI, review, deployment, permissions, and runtime state remain freshness-sensitive live authority; do not mirror volatile state into durable trackers.

## Repository execution and validation

**Current-state search boundary:** ordinary repository discovery and code/content search must exclude `docs/work-orders/archive/**`. Include that archive only when the task explicitly needs historical, provenance, incident, or recovery evidence. Archived Work Orders are evidence, not current ownership or current-state authority.

For repository work, `rickvang/Persona-Library` is canonical unless the requester names another target. Start from fresh `main` on a focused branch in a clean working copy when one is available; otherwise use the connected GitHub integration. GitHub remains authoritative for remote state.

Use `.github/workflows/repository-validation.yml` as the executable validation contract. Run the narrowest sufficient checks while iterating, then the repository-required build/validation/tests before completion. Required GitHub checks still govern merge readiness.

Follow the pinned [GitHub operating instructions](https://github.com/rickvang/tool-repo/blob/01198019e8f1520eb222dc6af2ec17bd81bc9c30/tools/github/AGENTS.md) for reusable GitHub mutation, freshness, review, merge, and linked-issue semantics.

For Persona-Library itself, a requester instruction to **implement**, **fix**, **build**, or **complete** a scoped repository issue/change is **standing completion authorization** for the normal implementation path, including branch/file changes, PR creation/updates, scoped review corrections, and merge after current completion gates pass. Explicit instructions such as **do not merge**, **PR only**, or **leave for review** narrow that stopping boundary and override standing completion authorization. This does not authorize unrelated issues, repository settings/access, other repositories, external publication, or external communications/actions.

Immediately before a consequential GitHub mutation, refresh the live state needed by the pinned contract. Do not merge with a known blocker, failing required check, unresolved blocking review, conflict, or out-of-scope side effect.

## Tool-heavy execution

When a selected Skill or Tool-use recipe has a matching active Operational Scenario, read `content/library-data/operational-scenarios/index.json` and load only the selected scenario body. Reuse still-valid evidence, refresh only at material freshness boundaries, validate at the cheapest sufficient layer, and stop when evidence is sufficient. Scenario guidance never overrides authorization or current source-of-truth rules.

## Shared Persona Workspace

The canonical human explanation of the wider system is [How Persona Workspace works](https://github.com/rickvang/persona-workspace/blob/main/docs/HOW-IT-WORKS.md). Keep this file optimized for repository execution; do not duplicate the whole-workspace human model here. The human model never overrides this repository's local authority or mutation boundaries.

When opened from [Persona Workspace](https://github.com/rickvang/persona-workspace), use the parent only for cross-repository discovery and coordination. Its generated repository map identifies sibling entrypoints and ownership; this repository's local instructions remain authoritative for work here. Workspace visibility is not cross-repository write permission.
