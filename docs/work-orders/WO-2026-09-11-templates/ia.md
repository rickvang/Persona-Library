# Templates placement review

## Review owner

Mara Okoye · Knowledge systems architect

## Placement decision

Create `templates` as a top-level first-class library space and keep the canonical source array in `content/library-data.js`, the normalizer in `content/library-model.js`, the machine-readable route in `content/site-orientation.json`, and the static discovery surface at `dist/templates.html`.

Persona-Library owns Template identity, applicability, relationships, evidence, source metadata, lifecycle/status, and revision context. The reusable artifact may live in `rickvang/template-library` or an authorized project source.

## Why this is a distinct concept

Templates answer “What proven starting structure or artifact should I begin this work from?” They provide reusable structure that can be copied, instantiated, or adapted. That responsibility is different from:

- Skills, which own reusable expertise and judgment;
- Operating Packs, which own contextual rules, standards, procedures, and validation guidance;
- Tools, which own execution capability and permissions;
- Playbooks, which own stages, participants, handoffs, gates, shared state, and outcomes;
- Work Orders, which track active project work and authorization.

The Template record is intentionally a small catalog pointer. It does not carry generic methodology or actual external artifact contents.

## Closest alternatives checked

- Extending the Design System Operating Pack: rejected because a pack governs how work is performed and must remain separate from the artifact used to start it.
- Extending a Skill or Tool-use recipe: rejected because reusable judgment and tool-specific execution remain separate from starting structure.
- Adding a Playbook artifact: rejected because orchestration belongs to the Playbook, even when a Playbook begins with a Template.
- Keeping a project starter only in a Work Order: appropriate for local output, but insufficient for a reusable identity and catalog once broader reuse is supported.
- Keeping a link only in Docs: insufficient for status, evidence, applicability, source verification, and reconciliation.

## Boundary and promotion rule

A project-specific starter remains local until evidence supports broader reuse. Promotion adds or updates canonical Template metadata and approved relationships, then runs Template reconciliation followed by one universal change-impact pass. Repository existence alone never promotes an individual Template or proves runtime access.
