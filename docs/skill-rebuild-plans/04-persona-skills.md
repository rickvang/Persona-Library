# Rebuild plan: $persona-skills

## Status and recovery basis

- Historical status: explicitly invoked and claimed created, updated, and used as the Persona capability builder.
- Current evidence: the repository has skillLibrary, skillGuidance, skillPractice, skillUnits, skillRelations, skill deep dives, and Guide prompts.
- Exact package status: missing. The current site model is evidence for behavior, not a recovered package.

## Build target

Create .agents/skills/persona-skills/SKILL.md.

Proposed frontmatter contract:

~~~yaml
name: persona-skills
description: Identify, define, expand, deduplicate, and validate the reusable skills behind a persona’s activities and workflows.
metadata:
  change_mode: source_update
  change_domain: skills
  reconciliation: persona-reconciliation
~~~

## Scope and routing

Activate when the user asks what skills a Persona needs, asks to expand a capability, wants skill triggers or quality signals, or wants to connect skills to workflows and Persona applications.

Do not activate for Tool execution, Tool catalog maintenance, credentials, generic skill creation, or a one-off behavior that is not independently reusable.

## Operating modes

### Identify skills

Read the Persona’s activities and workflows, then propose a deduplicated capability inventory.

### Expand a skill

Create a profile with definition, boundaries, inputs, method, heuristics, triggers, observable actions, outputs, quality signals, failure modes, tools, evidence, proficiency, workflow reach, and Persona applications.

### Modularize a skill

Check whether a capability is a primitive, composed skill, contextual application, workflow method, or tool-use recipe.

### Skill source update

Use a source to confirm, extend, qualify, or contradict only the supported capability claims.

## Operating procedure

1. Load the orientation and the target Persona’s workflows and activity inventory.
2. Separate skills from tools, behaviors, credentials, preferences, and workflow names.
3. Check the canonical skill catalog and aliases before creating a new identity.
4. Assign a stable skill ID and distinguish primitive units from composed capabilities.
5. Define the capability and its boundaries.
6. Describe how it operates: trigger, inputs, decisions, observable actions, outputs, feedback, and what it leaves behind.
7. Describe how quality is recognized: signals, inspection methods, realistic tests, and watch-for failure modes.
8. Link the skill to workflows, tools, evidence, validation activities, and Persona applications.
9. Use multi-perspective synthesis only when several Personas contribute distinct evidence.
10. For an authorized live update, hand off to persona-reconciliation and then the universal reconciliation pass.

## Context contract

Inputs:

- Persona record and workflow/activity context.
- Existing skill catalog and relationships.
- Sources and evidence status.
- Requested scope and output destination.

Outputs:

- Skill inventory or expanded profile.
- Stable identity and aliases.
- Modular relationships.
- Workflow reach and Persona applications.
- Tools and recipes as separate relationships.
- Evidence, confidence, validation questions, and open gaps.

## Safety and authority

- Do not create a skill when a relationship, workflow, recipe, or Persona application is sufficient.
- Do not make every small action a standalone skill.
- Do not copy Persona-specific judgment into the canonical capability.
- Do not treat a tool record as a skill or proof of availability.
- Do not write live content without explicit authorization.

## Dependencies and resources

Required:

- persona-library-orientation
- persona-research
- current skill catalog and normalization model
- persona-reconciliation
- system skill-creator when formalizing a callable package

Potential references:

- references/skill-profile-contract.md
- references/skill-modularity.md
- references/quality-signal-patterns.md

Use references only if the entrypoint becomes too large; current repository data remains the content source.

## Build steps with $skill-creator

1. Check for an existing skill package and canonical name aliases.
2. Initialize the package with $skill-creator.
3. Write the three operating modes and modularity boundary into SKILL.md.
4. Add the profile and quality contracts as focused references if useful.
5. Keep UI metadata optional and consistent with the skill description.
6. Validate package structure and run the behavioral tests.

## Validation cases

1. Identify skills for a Persona with several workflows; expected: deduplicated inventory.
2. Expand Interface hierarchy and visual communication; expected: operation and quality sections.
3. Detect a tool-specific procedure; expected: recommend a Tool recipe rather than a new core skill.
4. Detect a reusable primitive shared by two composed skills.
5. New source qualifies a capability; expected: only affected claims change.
6. Existing skill alias found; expected: reuse canonical ID.
7. Explicit live update absent; expected: proposal only.

## Acceptance criteria

- Skills are portable, observable, and independently reusable.
- Quality is expressed through inspectable signals rather than vague traits.
- Modular relationships do not erase Persona-specific applications.
- Tool procedures remain separate from core skill judgment.
- The skill supports research-only and authorized-update paths.
- It passes quick validation and all behavior cases.

## Migration notes

The current site’s 22-plus capability records, modular units, and relationships can seed a catalog review. They must not be copied wholesale into the package or treated as proof that every historical callable skill still exists.


