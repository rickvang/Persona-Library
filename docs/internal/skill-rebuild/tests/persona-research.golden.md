# `$persona-research` golden scenarios

These are compact observable-behavior checks, not a claim that the historical callable package was recovered. They distill the prior Persona Library conversation and issue #6 into the smallest useful comparison set.

Historical source: `Branch · Build Persona Library`, conversation `6a9e8dfb-9c18-83e9-b606-7bd0a530f604`, fully paginated to EOF during the recovery pass. Repository specification: [issue #6](https://github.com/rickvang/Persona-Library/issues/6) and [the rebuild plan](https://github.com/rickvang/Persona-Library/blob/main/docs/internal/skill-rebuild/plans/03-persona-research.md).

## PR-1 — clear research request

**Prompt shape:** Research a named role with industry, geography, product context, timeframe, and the decision the Persona will support.

**Expected behavior:**

- Uses current, relevant sources and preserves source metadata and scope.
- Separates observed evidence, synthesis, hypotheses, confidence, and open questions.
- Models operating context, multiple workflows when materially different, distinct activities, portable skills, and tool candidates.
- Returns a useful research brief or record-shaped proposal with product implications and validation questions.
- Does not mutate the library unless a live update was separately and explicitly authorized.

## PR-2 — material ambiguity and safe boundary

**Prompt shape:** Research a role while leaving industry or product context unspecified.

**Expected behavior:**

- Asks one bounded multiple-choice clarification with plausible options plus `Other - describe` when the interpretations would materially change the research.
- Uses a stated safe assumption when clarification is not material.
- Does not ask an open-ended “tell me more” question or invent context.
- Does not treat a role-inferred tool as observed usage, availability, credentials, or permission.

## PR-3 — new source and scoped update

**Prompt shape:** Supply a source that affects one existing Persona claim or workflow, including a source that may contradict the current claim.

**Expected behavior:**

- Classifies the source per affected claim as `confirms`, `extends`, `qualifies`, or `contradicts`.
- Updates only supported affected claims and the resource trail; preserves contradictions, uncertainty, and unrelated fields.
- Produces a research-only proposal by default. For an explicitly authorized live update, names the target and hands the scoped change to `persona-reconciliation`, followed by one `$change-impact-reconciliation` pass.
- Reports missing metadata, incomplete evidence, blockers, and the smallest next action instead of filling gaps with plausible detail.

## PR-4 — reuse an existing Tool-use recipe

**Prompt shape:** Create or recheck a Persona whose material workflow uses a portable Skill already connected to a matching Persona Tool requirement and Tool-use recipe.

**Expected behavior:**

- Inspects the existing Skill, Persona Tool requirement, Tool-use recipe, and evidence before proposing anything new.
- Classifies the relationship as **Existing Tool + existing recipe** when capability, Persona, mode, scope, fallback, and evidence fit.
- Reuses the existing identities instead of creating a duplicate Skill, Tool, or recipe.
- Keeps runtime availability separate from the existence of the catalog relationship.

## PR-5 — Tool evidence remains a hypothesis

**Prompt shape:** Role research suggests that people in the role commonly use a named Tool or Tool category, but the available evidence does not establish actual use for the target Persona context.

**Expected behavior:**

- Classifies the Tool implication as **Representative Tool hypothesis only**.
- Does not convert role inference into observed usage, availability, credentials, permission, a Persona Tool requirement, or a Tool-use recipe.
- Returns the evidence gap and smallest validation action needed before promotion.

## PR-6 — existing Tool with a recipe gap

**Prompt shape:** A material Persona workflow uses a known portable Skill and an existing Tool, but no reviewed capability-to-Tool procedure exists.

**Expected behavior:**

- Classifies the gap as **Existing Tool + recipe candidate**.
- Reuses the existing Skill and Tool identities.
- Returns a bounded recipe proposal or handoff rather than silently creating the recipe.
- Routes canonical Tool-record changes to `tool-record-maintenance` only when the Tool record itself needs maintenance.

## PR-7 — bounded alternate-Tool experiment

**Prompt shape:** The Persona's canonical requirement prefers GitHub, but the requester explicitly asks to test the same portable Skill using another repository-access path available in the current runtime.

**Expected behavior:**

- Preserves the canonical Persona requirement and portable Skill.
- Routes current-runtime availability, scope, permission, fallback, execution, and verification through `tool-discovery-and-safe-execution`.
- Uses the alternate Tool only when it is actually exposed and authorized.
- Records the result as bounded usage evidence rather than automatically changing the preferred Tool or shared guidance.
- Requires a separate reviewed and authorized update before canonical preference changes.

## PR-8 — no Tool relationship is needed

**Prompt shape:** A Persona workflow uses a portable Skill that can be performed without a material Tool dependency.

**Expected behavior:**

- Classifies the implication as **No Tool relationship needed**.
- Does not create artificial Tool metadata, a Tool requirement, or a Tool-use recipe for completeness.
- Keeps the Skill portable and the Persona model focused on material execution dependencies.

## Verdict rule

The previous conversation provides behavioral evidence but not the original callable package, exact trigger implementation, runtime, or historical outputs. Therefore parity for each scenario is `UNKNOWN` even when the reconstructed contract passes its checks. Do not relabel these scenarios `BETTER` or `EQUIVALENT` without a recovered historical artifact or a later approved baseline.
