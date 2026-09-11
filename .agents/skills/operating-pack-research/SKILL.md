---
name: operating-pack-research
description: Research the operating context, standards, conventions, procedures, references, and validation guidance that govern a domain or project before proposing an Operating Pack.
metadata:
  skill_layer: library_management
  change_mode: source_update
  change_domain: operating-packs
  reconciliation: operating-pack-reconciliation
---

# Operating Pack Research

## Role

Determine what context and instructions actually govern work in a domain or project. This skill produces an evidence-aware proposal for an Operating Pack; it does not fetch, install, execute, or silently create a live pack.

## Use this Skill when

- a project needs reusable operating context, repository rules, conventions, standards, procedures, references, or validation guidance;
- an existing pack may fit and needs to be checked for scope, source, availability, and reuse;
- a project-specific pack is being considered and its local rules must remain distinguishable from general best practice.

Do not use it for defining reusable professional judgment (route to `persona-skills`), composing multi-stage outcomes (route to `playbook-composer`), executing Tools, or transporting an external pack.

## Research contract

1. Identify the domain or project, task conditions, intended users, source boundaries, and requested destination.
2. Search the existing Operating Pack catalog and compare candidates by purpose, applicability, source, status, and evidence before proposing a new identity.
3. Read verified repository or project instructions, architecture, conventions, testing, security, accessibility, workflow, and reference material that is actually in scope. Record missing or inaccessible sources.
4. Classify each finding as one of:
   - verified project or repository instruction;
   - reusable best practice supported by a source;
   - project-specific convention;
   - inferred guidance or working hypothesis;
   - unresolved gap.
5. Separate persistent operating context from Skill expertise, Persona-specific judgment, Tool permissions, and Playbook orchestration. A rule such as “use pnpm” stays contextual.
6. Return a proposal containing the smallest useful pack boundary, intended `AGENTS.md` entrypoint, source/location and availability state, candidate files, relevant relationships, evidence, revision context, and open questions.

Research mode defaults to a proposal. An authorized update may record a reviewed source or pack change, but authorization and target come from the initiating request, never from this Skill’s metadata.

## Quality checks

- Every material rule has a source, scope, confidence, and classification.
- External repositories and paths are marked planned or unavailable until verified.
- Project conventions are not promoted to universal best practice by repetition alone.
- Proposed files are justified by the domain; the pack is not a template exercise.
- Persona, Skill, Playbook, Tool, and dependent pack references use stable identities and unresolved references remain visible.
- The proposal states what evidence would confirm, qualify, contradict, or close each open gap.

## Output and boundaries

Return the mode, scope, authorization, candidate pack or reuse result, evidence ledger, classifications, proposed source/location, relationships, open gaps, limitations, and next action. Do not create or edit pack files, install a package, contact an external repository, or update a Skill automatically. If repeated contextual findings suggest reusable judgment, hand that possibility to `persona-skills` for review.

For an authorized durable source or record change, hand the result to `operating-pack-reconciliation`, then to `$change-impact-reconciliation` once. Do not recurse.

See the repository Work Order and orientation manifest for placement, issue, and mutation rules.
