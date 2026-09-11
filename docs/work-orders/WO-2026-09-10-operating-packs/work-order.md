# Operating Packs first-class library space Work Order

- Work Order ID: WO-2026-09-10-operating-packs
- Title: Add Operating Packs as a first-class library space
- Status: ready-for-review
- Created: 2026-09-10
- Last updated: 2026-09-10
- Requester: repository user
- Current owner: Codex
- Request mode: update
- GitHub issue: [#54](https://github.com/rickvang/Persona-Library/issues/54)

## Outcome

Extend the static Persona Library with a small, catalog-level Operating Pack space for reusable Markdown-based operating context. Add the routing, canonical source/location relationship model, lifecycle Skills, generated Site surface, Docs orientation, and validation needed to distinguish packs from Skills, Tools, Playbooks, and project-specific context.

## Scope

- Add authored Operating Pack and minimal Playbook identity references to `content/library-data.js`.
- Normalize pack relationships in `content/library-model.js`.
- Add Operating Packs to `content/site-orientation.json`, repository guidance, Docs, and Site navigation.
- Add the smallest viable repository-local lifecycle Skills: research, composition, and reconciliation.
- Add a static-first `dist/operating-packs.html` catalog/detail surface and extend normal validation.
- Build generated data and verify the Site output is fresh.

## Non-goals and constraints

- Do not fetch, sync, install, vendor, or execute Operating Packs.
- Do not add an MCP or plugin runtime, Git submodules, remote transport, or deep versioning system.
- Do not duplicate Markdown pack contents in Persona Library records.
- Do not move reusable expertise into packs or orchestration into packs.
- Preserve unrelated working-tree changes already present in the repository.
- Keep prototypes isolated from live Operating Pack records.

## Placement and boundary review

Mara Okoye’s knowledge-systems review is recorded in [ia.md](ia.md). The proposed concept is a new first-class library space because it has a distinct responsibility, lifecycle, source/location relationship, and cross-space impact that cannot be reduced to a Skill, Tool-use recipe, Playbook, Doc, or project Work Order. The canonical record remains a catalog pointer; actual Markdown files remain in their repository or project source.

## Evidence and assumptions

- `content/site-orientation.json`, `ARCHITECTURE.md`, `content/library-data.js`, and `content/library-model.js` establish the current static-first and normalization boundaries. Status: observed.
- Existing repository-local Skill contracts require frontmatter metadata and route validation. Status: observed.
- Historical at 2026-09-10: `rickvang/TemplateRepo` was a user-specified future source reference. Its Operating Pack path and migrated naming were not verified in that checkout. Status at the time: unknown; represent as planned. This assumption is superseded by the dated source verification below.
- Existing Playbook pages are static Site records rather than a typed canonical Playbook array. A minimal identity index is introduced only so pack references can resolve without copying Playbook definitions. Status: design assumption.

## Success criteria

- Operating Packs appear as a first-class space in the manifest, Docs, navigation, and Site.
- A known pack can be browsed with purpose, applicability, source/location, entrypoint, availability/status, context types, scoped relationships, evidence, and revision context.
- Pack relationships resolve to known Persona, Skill, workflow, Playbook, and Tool-use recipe identities where used.
- Local sources are checked for path and entrypoint resolution; external planned sources do not imply availability.
- The lifecycle Skills explain proposal-first research, minimal Markdown composition, and read-only impact classification.
- Normal build and content validation pass, including generated data freshness and prototype isolation.

## Current phase and next action

Phase: implementation and validation complete after orientation and placement review. Next action: commit the scoped changes, open the pull request, merge it, then close the Work Order.

## Completion boundary

Complete when the linked implementation files, generated output, validation evidence, reconciliation report, and issue link are inspectable. Any remote TemplateRepo inspection or transport was outside this historical Work Order; the follow-up source verification below records the current canonical source.

## Follow-up source supersession (2026-09-11)

The initial Design System source assumption pointed to `rickvang/TemplateRepo` as a planned, unverified future source. That assumption was accurate for this Work Order’s 2026-09-10 state and is now superseded for current catalog truth.

Verified canonical source for the existing `operating-pack-design-system` record:

- Repository: `rickvang/operating-packs`
- Path: `packs/design-system`
- Entrypoint: `AGENTS.md`
- Verification revision: `569c326f6f9df4077ee77352fe691bda6ec37b92`

The source remains an external documentation reference; runtime access is capability-dependent.
