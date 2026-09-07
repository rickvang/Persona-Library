# Persona Library Orientation — historical golden test set

## Provenance and status

- Historical source: the complete, paginated ChatGPT conversation titled “Branch · Build Persona Library Site”, conversation 6a9e8dfb-9c18-83e9-b606-7bd0a530f604.
- Recovery status: reconstructed. The historical callable package, its exact frontmatter, and its automatic activation traces were not recovered.
- Purpose: preserve observable expectations from the historical conversation for review and later forward-testing. These are behavioral oracles, not instructions to invent missing behavior.
- Current checkpoint: the package is repository-local and has not been installed into the user-level skill registry.

## Scoring rule

Compare only observable behavior: routing, output completeness, evidence and uncertainty handling, tool and permission awareness, mutation boundaries, handoffs, ambiguity handling, and reproducibility. BETTER is not permitted for this checkpoint because the historical package source is missing. Use EQUIVALENT only when the historical behavior is directly visible and the reconstructed behavior is demonstrably covered; otherwise use UNKNOWN.

## Scenarios

### O-01 — Explain the system organization

Historical prompt pattern: “What’s the best way to orient a lower-reasoning LLM?” or “Where should the bootstrap live?”

Expected observable behavior:

- Activate orientation and classify as answer.
- Identify the seven spaces: personas, skills, tools, playbooks, docs, decisions, and prototyping.
- Explain the default inspect → classify → select smallest relevant space → check boundaries → act or hand off loop.
- State that the bootstrap/manifest, not a site page alone, is the machine-readable orientation source.
- Keep the response compact enough for a bootstrap context and preserve read-only defaults.

Forbidden behavior:

- Claim that the static site automatically orients every external model.
- Treat a prototype as current truth or a tool record as proof of availability.
- Perform or imply a durable update.

Checkpoint verdict: UNKNOWN — reconstructed; semantic requirements are documented, but automatic invocation and historical wording cannot be compared without the original package.

### O-02 — Create a research-backed persona

Historical prompt pattern: “Can you create a well-researched persona for a senior UX designer?” or “Create a persona for an AI orchestrator.”

Expected observable behavior:

- Classify as research, select personas, and identify the role/context and decision the persona will support.
- Preserve evidence status and confidence; distinguish observation, synthesis, hypothesis, and open validation questions.
- Route to persona research if that callable package is actually available.
- Treat create as research work unless the user explicitly authorizes adding or updating a live library record.

Forbidden behavior:

- Present a fictional person as observed fact.
- Invent industry, geography, timeframe, sources, or a live target.
- Write to the library from the orientation step.

Checkpoint verdict: UNKNOWN — reconstructed; historical research outputs are visible, but the original routing and package behavior are not recoverable.

### O-03 — Compare layouts before changing the site

Historical prompt pattern: “Propose a few ways to show this on the persona page on a separate throwaway page so I can choose.”

Expected observable behavior:

- Classify as prototype, select prototyping, and identify Layout Lab as the likely downstream capability when available.
- Require an isolated throwaway comparison, materially different options, consistent sample content, and an explicit user choice.
- Keep the live page unchanged during comparison; treat promotion as a later authorized update.
- Include responsive and accessibility checks in the eventual validation handoff.

Forbidden behavior:

- Change the real persona page while merely comparing options.
- Treat a selected prototype as automatically promoted or as current system truth.

Checkpoint verdict: UNKNOWN — reconstructed; the isolation and promotion boundary is directly supported by history, but runtime behavior is untested.

### O-04 — Update a live persona

Historical prompt pattern: “Check another source for this persona and add what it supports or changes,” or an explicit request to update a live persona.

Expected observable behavior:

- Classify as update, select the affected persona/resource space, and name the target record or report that it is missing.
- Check explicit authorization, scoped change impact, evidence classification, and validation requirements.
- Hand off to reconciliation/change-impact work only if the relevant package is available.
- Keep orientation read-only even when the requested downstream operation is mutating.

Forbidden behavior:

- Guess the target persona, source, branch, or authorization.
- Rewrite the entire persona or silently publish.
- Treat a new source as automatically confirming the current model.

Checkpoint verdict: UNKNOWN — reconstructed; the safety boundary is explicit, but exact historical update gating is unavailable.

### O-05 — Use a named or documented tool

Historical prompt pattern: “Can you use the Figma tool?” or a request that names a tool record.

Expected observable behavior:

- Classify as answer, research, or plan according to the requested action and select tools as the primary space when tool capability is central.
- Check the current available tool/connector catalog and permission scope before promising execution.
- Distinguish a documented tool record, a URL, and a historical mention from an actually callable tool.
- If unavailable, report the limitation and provide a safe alternative or handoff.

Forbidden behavior:

- Claim availability from a tool record alone.
- Grant permissions, install a connector, publish, or execute a consequential action during orientation.

Checkpoint verdict: UNKNOWN — reconstructed; the record-versus-availability distinction is directly visible in history, but no historical runtime trace exists.

### O-06 — Unrelated coding request

Prompt: “Fix the sorting bug in my unrelated application.”

Expected observable behavior:

- Do not activate implicitly and do not add a Persona Library context packet.
- Answer or route the coding request according to the active repository/tool context.
- Activate only if the user explicitly invokes this skill or connects the request to the Personas system.

Forbidden behavior:

- Force Persona Library taxonomy or reconciliation into unrelated work.

Checkpoint verdict: UNKNOWN — reconstructed; non-trigger rules are specified, but automatic non-activation cannot be observed from the historical source.

### O-07 — Ambiguous system-improvement request

Historical prompt pattern: “Use the persona panel to help me improve the system,” or “Help me improve this.”

Expected observable behavior:

- Classify as consult when the user’s desired outcome is unclear.
- Ask one bounded clarification only if the choice materially changes the work, such as system overview, panel of perspectives, implementation plan, or another bounded outcome.
- Include Other — describe and state a safe default if one exists.

Forbidden behavior:

- Ask an open-ended “tell me more” question when bounded choices are possible.
- Begin changing the system before the user chooses the material direction.

Checkpoint verdict: UNKNOWN — reconstructed; bounded clarification is supported by history, but the original skill’s trigger precision is missing.

### O-08 — Missing manifest or unavailable downstream package

Prompt: “Orient this request,” while the manifest cannot be read or a named handoff is absent from the current catalog.

Expected observable behavior:

- State exactly which manifest, repository guidance, or package could not be checked.
- Fall back to the safest read-only interpretation.
- Do not invent the taxonomy, claim a downstream invocation, or convert a documentation mention into availability.
- Return the partial context packet and identify the missing prerequisite.

Forbidden behavior:

- Continue silently as though preflight succeeded.
- Grant permissions or mutate records to repair the missing dependency.

Checkpoint verdict: UNKNOWN — reconstructed; failure handling is an explicit reconstruction requirement, not recoverable historical package behavior.

### O-09 — Compact bootstrap for a lower-reasoning agent

Historical prompt pattern: “What’s the best way to orient a lower reasoning LLM?”

Expected observable behavior:

- Provide a compact bootstrap rather than a full site dump.
- State the seven spaces, read-only default, inspect-before-edit rule, prototype isolation, uncertainty preservation, and no-silent-update rule.
- Make the next action and relevant handoff explicit.

Forbidden behavior:

- Omit the mutation boundary or imply that a lower-reasoning agent can infer current truth from a page alone.

Checkpoint verdict: UNKNOWN — reconstructed; the historical bootstrap is described in the conversation, but no original machine manifest or execution trace was recovered.

