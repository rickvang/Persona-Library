# Rebuild plan: $persona-library-orientation

## Status and recovery basis

- Historical status: claimed created and deployed, then later reported missing from the active environment.
- Current evidence: the repository has the orientation manifest, repository activation instructions, Guide prompts, and an isolated Persona Library Guide prototype.
- Exact package status: not recovered. Treat the implementation as a reconstruction unless the original package is later found.

## Build target

Create .agents/skills/persona-library-orientation/SKILL.md with automatic discovery enabled and an explicit invocation prompt supported.

Proposed frontmatter contract:

~~~yaml
name: persona-library-orientation
description: Orient requests about the Personas system by loading its manifest, classifying the request, selecting the smallest relevant space, and stating read-only or mutation boundaries.
metadata:
  change_mode: read_only
  change_domain: personas-system
  reconciliation: skip
~~~

The exact reconciliation value must be checked against the package validator before implementation.

## Scope and routing

Activate for work involving Personas, Skills, Tools, Playbooks, Docs, Decisions, Prototyping, the Persona Library repository, or the Site’s operating model.

Do not activate for unrelated coding, writing, research, or general questions unless the request explicitly invokes the skill.

This skill orients the work. It does not research a persona, create a skill, execute a tool, alter a record, or decide the user’s goal on the user’s behalf.

## Operating procedure

1. Locate and load content/site-orientation.json or the approved generated copy.
2. Classify the request as answer, research, plan, prototype, update, or consult.
3. Identify the smallest relevant system space.
4. Read only the minimum linked records needed for the request.
5. Build a compact context packet containing goal, artifacts, constraints, available tools, permissions, success criteria, and requested output.
6. Ask a scoped multiple-choice question only when ambiguity would materially change the work; otherwise state the default assumption.
7. State whether the next step is read-only, prototype-only, or an authorized live update.
8. Return the context packet and handoff to the appropriate skill or direct response.

## Context contract

Inputs:

- User request and explicit authorization.
- Repository or Site location.
- Orientation manifest.
- Available tools and permissions.
- Relevant records discovered during the minimum read.

Outputs:

- Selected mode and space.
- Records or artifacts to inspect.
- Assumptions and unresolved ambiguity.
- Mutation boundary.
- Recommended next action or downstream skill.

## Safety and authority

- Default to read-only behavior.
- A documented Tool is not proof that the Tool is available.
- A prototype is not current truth.
- Do not silently update Personas, Skills, Tools, Playbooks, Docs, or Decisions.
- Preserve the user’s explicit scope even when the manifest suggests additional work.

## Dependencies and resources

Required resources:

- content/site-orientation.json
- AGENTS.md

No scripts, assets, or extra references are required for the first version. Add a focused reference only if the manifest becomes too large for the entrypoint.

## Build steps with $skill-creator

1. Check that .agents/skills/persona-library-orientation does not already exist.
2. Initialize the package with the system skill creator.
3. Replace the scaffold with the frontmatter, routing, procedure, context contract, and safety rules above.
4. Add agents/openai.yaml only if the UI needs a concise display name or default prompt.
5. Link the manifest and repository instructions using relative paths.
6. Run the skill validator and test the behavior independently.

## Validation cases

1. “Explain how the Personas system is organized.” Expected: orientation mode, Docs or overview space, read-only response.
2. “Create a persona for a hospital scheduling coordinator.” Expected: research mode and handoff to persona research; no persona write without authorization.
3. “Show me three layouts before changing the page.” Expected: prototype mode and Layout Lab handoff.
4. “Update the live persona record.” Expected: update mode, explicit authorization and target required.
5. “Use a Figma tool.” Expected: tool availability must be checked rather than inferred from the catalog.
6. An unrelated coding question. Expected: no implicit orientation unless explicitly requested.

## Acceptance criteria

- The description routes system requests without attracting unrelated work.
- The skill returns a small context packet rather than restating the whole repository.
- It distinguishes site documentation from callable skills.
- It never performs a durable write by itself.
- It handles missing manifests and unavailable tools explicitly.
- The package passes quick validation and the behavioral cases above.

## Migration notes

- The historical package may have lived under .codex/skills rather than .agents/skills.
- The original frontmatter, UI policy, and response wording are unavailable.
- Preserve any recovered historical files if found; otherwise label the package reconstruction as a working draft.

