# Candidate context integration for application work

## Purpose

Persona-Library uses a private **Candidate Application Context** to bind one person's facts, standing decisions, preferences, and validation overlays to reusable Templates and the job-search application workflow.

The canonical reusable context rules live in `rickvang/operating-packs/packs/candidate-application-context` with `AGENTS.md` as the stable entrypoint. The pack is verified on `main` at merge revision `c216052321c683830333bda4c1928bb98e12b3f7`.

Persona-Library does not store candidate instances. Candidate values and private links remain in the authorized private workspace.

## Existing pieces folded into the candidate context

The candidate context does not replace these existing concepts; it gives them one explicit boundary:

- candidate identity and approved contact data;
- goals, constraints, and search boundaries;
- evidence ledger / candidate source evidence;
- candidate standing decisions;
- voice and writing preferences;
- candidate-specific Template preferences or exclusions;
- candidate-specific validation overlays;
- unresolved conflicts, assumptions, unknowns, and confirmations.

A candidate context may reference several private files. One monolithic candidate file is not required.

## Application composition sequence

For candidate-specific application work:

```text
identify active candidate context
→ load only that candidate's private sources and decisions
→ resolve and verify reusable Templates in rickvang/template-library
→ map candidate evidence and decisions into Template semantic slots
→ tailor for the target role
→ run generic composition/integrity checks
→ enforce current role/application requirements
→ run candidate-specific validation overlays within those requirements
→ run cross-candidate isolation check
→ package separate role-specific artifacts
```

Do not draft from a private master as though it were the reusable Template. Do not use another candidate's prior application as source material unless the requester explicitly provides it as a reference and it contains no candidate-conflicting facts.

## Ownership boundaries

| Concern | Owner |
| --- | --- |
| Reusable artifact starter | `rickvang/template-library` |
| Candidate-context rules and validation layering | Candidate Application Context Operating Pack |
| Candidate facts, standing decisions, voice, private links | private candidate workspace |
| Reusable job-search expertise and review judgment | Persona-Library Personas and Skills |
| End-to-end application/search stages and gates | Evidence-led Job Search Playbook operated by Priya Desai |
| Current candidate × role work state | application Work Order / private role folder |

Avery Brooks remains a reusable synthetic candidate-role Persona and never substitutes for the actual candidate's private context.

## Candidate isolation gate

Before an application packet can be `ready-for-review`, verify that:

- the active candidate is explicit;
- names and contact details belong to that candidate;
- evidence sources belong to that candidate;
- standing decisions and voice rules belong to that candidate;
- candidate-specific validation overlays were applied only to that candidate;
- no facts, links, employers, metrics, decisions, or prose assumptions leaked from another candidate context.

If candidate identity or source ownership is ambiguous, block only the affected candidate-specific composition until it is resolved.

## Precedence and conflict handling

Use the Candidate Application Context Operating Pack precedence unless a stricter consuming-project rule applies:

1. current task and mandatory role/application requirements;
2. verified correction to candidate source evidence;
3. current explicit candidate instruction within those task/channel bounds;
4. active candidate standing decision;
5. Operating Pack domain guidance;
6. generic best practice and Template defaults.

A candidate preference or standing decision cannot override a mandatory employer/submission requirement or contradictory factual evidence. Record the conflict and block or route only the affected decision instead of silently flattening either side.

## Validation layering

Keep validation responsibilities separate:

1. **Template structure** — starter shape and placeholders are valid.
2. **Persona-Library composition/integrity** — evidence, chronology, attribution, ATS/readability/accessibility rules as applicable.
3. **Role/application requirements** — current employer and target-role constraints are enforced where supported by evidence.
4. **Candidate-specific overlays** — private candidate-confirmed rules and preferences apply within the task/channel constraints above.
5. **Isolation** — no cross-candidate contamination.

A candidate overlay may make a rule stricter, but it cannot create evidence, weaken a material-truth/integrity rule, or override a mandatory role/application requirement.

## Multi-candidate behavior

The same reusable system should support, for example:

```text
Candidate A context + shared Templates + shared Persona-Library process
→ Candidate A application packet

Candidate B context + shared Templates + shared Persona-Library process
→ Candidate B application packet
```

Only the private candidate context and role-specific inputs change. Reusable Templates, Personas, Skills, Playbook stages, and generic validators remain shared unless the work justifies a different reusable artifact or method.

## Non-goals

This contract does not add:

- a candidate database or registry;
- a new Persona or Playbook;
- a new application tracker;
- private candidate records to Persona-Library;
- synchronization between private candidate files and reusable Templates;
- submission authorization or employer-contact capability.
