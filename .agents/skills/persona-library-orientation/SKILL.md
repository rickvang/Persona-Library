---
name: persona-library-orientation
description: Orient requests about the Persona Library by loading its manifest, classifying the request, selecting the smallest relevant space, and stating read-only or mutation boundaries.
metadata:
  change_mode: read_only
  change_domain: personas-system
  reconciliation: skip
---

# Persona Library Orientation

## Recovery status

This is a repository-local reconstruction. The historical callable package was not recovered from the previous Persona Library conversation or the current skill registries. Treat the current repository manifest and operating contract as the source of truth, and preserve uncertainty about anything that is not present there.

## Use this skill when

Activate for an explicit `$persona-library-orientation` request or when the user is asking how to work with the Persona Library system, including its personas, skills, tools, playbooks, docs, decisions, prototypes, or operating model.

Do not activate implicitly for unrelated coding, writing, research, or general questions. A mention of a skill in a site document is documentation evidence, not proof that the callable package is installed. An explicit invocation can activate this skill even when the request is otherwise brief.

## Source-of-truth preflight

1. Read [the site orientation manifest](../../../content/site-orientation.json) and [the repository operating contract](../../../AGENTS.md) before making a routing decision. Follow links from those files only when the request needs them.
2. Use the current repository files and available tool catalog to establish what is actually available. Do not infer tool, connector, skill, credential, or permission availability from a record, a historical claim, or a URL.
3. If the manifest or repository context is unavailable, say exactly what could not be checked and fall back to the safest read-only response. Do not invent the missing taxonomy or silently continue as if the preflight passed.

## Classify the request

Choose the smallest applicable mode. Use more than one only when the user's request genuinely combines them.

- **Answer:** explain the system or a documented concept.
- **Research:** investigate a persona, source, workflow, skill, or tool with evidence and uncertainty.
- **Plan:** define an implementation, comparison, migration, or validation approach.
- **Prototype:** explore a throwaway layout or interaction in isolation.
- **Update:** change a live persona, source, skill, record, guide, or other durable artifact.
- **Consult:** help choose among perspectives, options, or next actions when a decision is needed.

Then select the smallest relevant space from the manifest: personas, skills, tools, playbooks, docs, decisions, or prototyping. Keep lifecycle, operating context, and operating state inside a persona unless the current manifest explicitly says otherwise. Record the primary space and any necessary secondary space in the context packet.

## Build the orientation packet

Return a compact packet that downstream work can use without rereading the whole repository:

```text
Goal: what the user is trying to accomplish
Mode: answer | research | plan | prototype | update | consult
Relevant space(s): primary, then any secondary space
Artifacts in scope: records, files, pages, or prototypes that are actually identified
Constraints and permissions: read-only, isolated prototype, or explicitly authorized live target
Success criteria: what a useful result must contain or demonstrate
Assumptions and open questions: only material uncertainties
Next action: direct answer or a named downstream handoff if that package is available
```

Use the response contract from the manifest: outcome, mode, assumptions, evidence/checks, limitations or blockers, and next action. Keep orientation compact; it is a routing and boundary-setting step, not a substitute for the research or implementation itself.

## Clarify only when needed

Proceed when the role, target, and intent are clear. Ask a question only when competing interpretations would materially change the work. Make it bounded and actionable: provide two or three plausible choices plus `Other - describe`, rather than an open-ended request for context. State the default assumption when a safe default exists.

For an update, do not fill in a missing target or authorization by guessing. For a request such as "help me improve the system," route it as consult and ask whether the user wants a system overview, a panel of perspectives, a plan, or another bounded outcome when that choice changes the work.

## Boundaries and handoffs

- This skill is read-only. It may inspect the manifest, repository guidance, relevant docs, and availability signals, but it does not write files, edit live records, send external messages, publish, merge, grant permissions, or install skills.
- A mode of **update** describes the user's requested operation; it does not authorize this skill or a downstream skill to mutate anything. Live changes require explicit authorization, an identified target, scoped impact review, and validation.
- A **prototype** must be isolated and clearly labeled as non-live. Do not use prototype counts, relationships, or decisions as current library truth. Promotion is a separate, explicitly authorized step.
- Preserve observed, synthesized, hypothesized, and unknown distinctions. Do not turn a plausible interpretation into a fact.
- If required metadata is missing, use the safest read-only interpretation and report the metadata gap. Metadata never grants write authority.
- If a downstream package is not present in the available catalog, report that it is unavailable and provide the packet instead of pretending to invoke it.

When the packet is ready, hand off only to the smallest available downstream capability. Typical examples are persona research for evidence-backed role understanding, persona skills for capability modeling, change-impact or persona reconciliation for scoped propagation, panel orchestration for multiple perspectives, layout lab for isolated visual comparison, tool discovery for safe capability checks, and tool record maintenance for durable tool records. These names are routing targets only; verify actual availability before invoking any of them.

## Historical behavior covered

The previous conversation visibly described a compact bootstrap for lower-reasoning agents, seven library spaces, explicit separation of prototype from current truth, inspection before editing, no silent updates, bounded clarifications, and the distinction between a tool record and actual availability. Those behaviors are included here as reconstructed requirements. The original frontmatter, exact wording, automatic trigger behavior, and any unavailable historical resources remain unknown.

## Validation checklist

Before handing off, confirm:

- The manifest and repository contract were checked or their absence was reported.
- The mode and smallest relevant space are explicit.
- The context packet contains scope, boundary, success criteria, and next action.
- Any clarification is materially necessary and bounded.
- No documentation, record, URL, or historical claim was treated as proof of callable availability.
- No mutation or installation was performed.

See the [orientation golden tests and checkpoint comparison](../../../docs/skill-rebuild-tests/persona-library-orientation.golden.md).

