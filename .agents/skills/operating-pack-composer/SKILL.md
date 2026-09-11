---
name: operating-pack-composer
description: Compose a minimal Markdown-based Operating Pack from verified project instructions, architecture, conventions, constraints, best practices, and relevant Persona or Skill needs.
metadata:
  skill_layer: library_management
  change_mode: artifact_generation
  change_domain: operating-packs
  reconciliation: operating-pack-reconciliation
---

# Operating Pack Composer

## Role

Compile a reusable or project-specific body of operating context and instructions for a domain, system, or project environment. The result is a file-based package with a clear `AGENTS.md` entrypoint and only the Markdown files the evidence justifies. It is not an execution runtime, MCP server, installer, or Playbook.

## Use this Skill when

- an accepted research proposal identifies a real need for a new Operating Pack;
- a project needs its repository rules, architecture, conventions, constraints, procedures, references, and validation guidance gathered into a navigable package;
- an existing pack needs a bounded, authorized composition update.

Check for an existing suitable pack first. Use `operating-pack-research` when evidence or scope is not yet clear.

## Composition procedure

1. Confirm outcome, domain, target location, authorization, source material, and whether the pack is canonical, project-specific, planned, or unavailable.
2. Reuse the existing pack identity when the purpose and scope fit. Do not create a duplicate because the source repository uses different filenames.
3. Build the smallest useful structure. Recommend `AGENTS.md`, `ARCHITECTURE.md`, `CONVENTIONS.md`, `TESTING.md`, `SECURITY.md`, `ACCESSIBILITY.md`, and `workflows/*.md` only when the domain has supported content that needs that separation. References may remain links or be placed under `references/` when necessary.
4. Keep `AGENTS.md` as the entrypoint. It should state scope, precedence, source authority, how to navigate the pack, and how to distinguish verified rules, best practice, local convention, inference, and unresolved gaps.
5. Preserve the boundary: contextual rules belong in the pack; reusable expertise remains in Skills; Persona applications keep role-specific priorities; Tools keep execution and permission; Playbooks coordinate outcomes and reference pack context.
6. Compile source content without inventing requirements. Include validation commands or checks only when the source and environment support them, and label unavailable checks.
7. Record source/location, entrypoint, availability, evidence, revision context, related identities, and whether lessons remain project-local or are candidates for Skill review.
8. Validate links, paths, entrypoint, file justification, scope, status, and the representative and failure cases before handoff.

## Output contract

Return the mode, target, authorization, pack identity, file manifest with a reason for each file, entrypoint, source/location, status, context classifications, relationships, validation evidence, limitations, unresolved gaps, and reconciliation handoff. For proposal mode, return the file plan without mutating live records or files. For an authorized update, apply only the named change and preserve revision history.

## Quality and safety

- A minimal pack is acceptable; do not add files to satisfy a template.
- A project-specific rule is labeled local and does not become shared guidance automatically.
- External source availability is never inferred from a URL, repository name, or catalog record.
- A pack does not grant Tool permission, install a dependency, execute a workflow, or replace a Playbook.
- A repeated contextual rule may be handed to `persona-skills` for possible generalization, but this Skill never mutates a Skill automatically.
- After a durable pack change, hand off to `operating-pack-reconciliation`, then run `$change-impact-reconciliation` once.

See `docs/work-orders/` for the active packet and the orientation manifest for placement and mutation boundaries.
