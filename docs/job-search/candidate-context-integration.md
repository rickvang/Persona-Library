# Candidate context integration for application work

## Purpose

Persona-Library uses a private **Candidate Application Context** to bind one person's facts, standing decisions, preferences, normalized candidate content, and validation overlays to reusable Templates and the job-search application workflow.

The canonical reusable context rules live in `rickvang/operating-packs/packs/candidate-application-context` with `AGENTS.md` as the stable entrypoint. The current `main` pack is verified at merge revision `c216052321c683830333bda4c1928bb98e12b3f7`. A normalized-resume-content extension is under review in `rickvang/operating-packs` PR #4 and must not be treated as canonical on that repository's `main` until merged and re-verified.

Persona-Library does not store candidate instances. Candidate values, private Resume Content Model instances, and private links remain in the authorized private workspace.

## Existing pieces folded into the candidate context

The candidate context does not replace these existing concepts; it gives them one explicit boundary:

- candidate identity and approved contact data;
- goals, constraints, and search boundaries;
- evidence ledger / candidate source evidence;
- optional Candidate Baseline Resume or explicitly promoted private master for preserving the approved candidate career spine;
- optional normalized Resume Content Model instance for repeatable resume composition;
- candidate standing decisions;
- voice and writing preferences;
- candidate-specific Template preferences or exclusions;
- candidate-specific validation overlays;
- unresolved conflicts, assumptions, unknowns, and confirmations.

A candidate context may reference several private files. One monolithic candidate file is not required.

The normalized Resume Content Model is a presentation-neutral projection from evidence and decisions. It is not a replacement evidence ledger, cannot create or override facts, and must remain candidate-bound and private. Persona-Library owns the reusable model contract in [`resume-content-model.md`](resume-content-model.md) and its JSON Schema; a consuming private workspace owns the actual candidate instance.

## Application composition sequence

For candidate-specific application work:

```text
identify active candidate context
→ load only that candidate's private sources and decisions
→ resolve any standing-decision-designated Candidate Baseline Resume and record its source/revision
→ load or reconcile that candidate's normalized Resume Content Model when resume mapping uses it
→ resolve and verify reusable Templates in rickvang/template-library
→ for resume Templates, verify the Template's semantic slot manifest when present
→ map normalized candidate content or source evidence into Template semantic slots
→ tailor/select for the target role without rewriting canonical candidate truth
→ run generic composition/integrity checks
→ run candidate-specific validation overlays
→ enforce current role/application requirements
→ run cross-candidate isolation check
→ package separate role-specific artifacts
```

The validation gates still use the Candidate Application Context Operating Pack's canonical precedence and layering; the sequence above describes composition flow, not permission to reorder mandatory validation rules.

For reusable cross-Template resume mapping, use [`resume-template-mapping.md`](resume-template-mapping.md) and the `resume-template-semantic-mapping` callable Skill. Material resume mappings end as `mapped`, `omitted_with_reason`, `blocked`, `unmapped`, or `not_applicable`; material content is not silently discarded merely because the chosen Template lacks a destination.

Do not draft from a private master as though it were the reusable Template. Do not treat a prior formatted resume as the semantic data model when a normalized Resume Content Model is available. Do not use another candidate's prior application or normalized content as source material unless the requester explicitly provides it as a non-conflicting reference and the active candidate evidence remains authoritative.

## Ownership boundaries

| Concern | Owner |
| --- | --- |
| Reusable artifact starter and Template-specific semantic slot manifest | `rickvang/template-library` |
| Presentation-neutral Resume Content Model contract and semantic mapping Skill | Persona-Library |
| Candidate-context rules and validation layering | Candidate Application Context Operating Pack |
| Candidate facts, evidence, private normalized resume-content instance, standing decisions, voice, private links | private candidate workspace |
| Candidate Baseline Resume / promoted private master and its candidate-specific career-spine presentation | private candidate workspace |
| Role-specific requirement map, selection/emphasis, baseline divergence dispositions, material mapping dispositions, and instantiated artifacts | application Work Order / private role folder |
| Reusable job-search expertise and review judgment | Persona-Library Personas and Skills |
| End-to-end application/search stages and gates | Evidence-led Job Search Playbook operated by Priya Desai |

Avery Brooks remains a reusable synthetic candidate-role Persona and never substitutes for the actual candidate's private context.

**Leah Okafor / `application-editor` is the primary Persona application for `resume-template-semantic-mapping`.** Her existing requirement-to-evidence mapping, document hierarchy, ATS-aware formatting, writing, voice-preserving editing, and integrity capabilities remain authoritative. The callable Skill adds the focused cross-Template semantic-mapping procedure and quality checks; it does not transfer document-production or orchestration ownership.

## Candidate Baseline Resume boundary

A Candidate Baseline Resume is a private, candidate-owned composed artifact explicitly designated by the candidate's current standing decisions or source-of-truth record as the default resume baseline. It may be called a master resume in the consuming workspace.

It is distinct from both evidence and a reusable Template:

```text
candidate evidence + standing decisions
        ↓
Candidate Baseline Resume
→ approved candidate career spine and candidate-specific presentation

verified reusable Template
→ reusable presentation structure only
```

When a baseline is designated, role-specific resume work should begin by resolving and reading that exact baseline. Tailor by selecting, emphasizing, or carefully rewriting supported material. Do not rebuild the career spine from a secondary profile store merely because a normalized model or reusable Template exists.

The protected baseline career spine includes identity/contact, employer and role identity, separate periods, dates, locations, employer/client hierarchy, recent-employer presence, education, certifications, and candidate-confirmed historical grouping. A verified source correction or later candidate instruction may change those values; role tailoring alone may not.

A normalized Resume Content Model can coexist with the baseline. It supports semantic portability across Templates, but it does not automatically supersede an active baseline. If the normalized model and baseline disagree on a protected field, return to evidence/standing decisions and repair the conflict before composition.

## Resume semantic mapping boundary

A reusable resume mapping uses four distinct inputs/states:

```text
candidate evidence + standing decisions
        ↓
private Resume Content Model instance
        ↓
role-specific selection / emphasis
        ↓
verified Template slot-map.json + starter
        ↓
role-specific resume
```

The private normalized model may represent identity/contact, supported descriptors and profile statements, skill categories, employment relationships, separate periods, employer-of-record with nested client engagements, achievements, education, certifications, projects, and portfolio items.

The normalized model must not contain Template slot IDs, layout/style decisions, target-employer keywords as canonical facts, or role-specific selection as universal candidate truth.

A Template slot manifest describes where compatible semantic content can go. It does not decide whether the candidate claim is true, which evidence to select, or whether the final document passes ATS/accessibility/output review.

The application Work Order must record, when semantic mapping is used:

- Resume Content Model reference, revision, and schema version;
- Template `slot-map.json` path and verified revision;
- material `unmapped`, `blocked`, and `omitted_with_reason` content;
- semantic-mapping validation result;
- downstream validation that was and was not completed.

## Candidate isolation gate

Before an application packet can be `ready-for-review`, verify that:

- the active candidate is explicit;
- names and contact details belong to that candidate;
- evidence sources belong to that candidate;
- any normalized Resume Content Model instance belongs to that candidate and traces to that candidate's sources/decisions;
- standing decisions and voice rules belong to that candidate;
- any designated Candidate Baseline Resume belongs to that candidate and was resolved from the current standing decision rather than inferred from a prior application;
- candidate-specific validation overlays were applied only to that candidate;
- no facts, normalized nodes, links, employers, metrics, decisions, or prose assumptions leaked from another candidate context.

If candidate identity, source ownership, or normalized-model provenance is ambiguous, block only the affected candidate-specific composition until it is resolved.

## Precedence and conflict handling

Use the Candidate Application Context Operating Pack precedence unless a stricter consuming-project rule applies:

1. current task and mandatory role/application requirements;
2. verified correction to candidate source evidence;
3. current explicit candidate instruction within those task/channel bounds;
4. active candidate standing decision;
5. Operating Pack domain guidance;
6. generic best practice and Template defaults.

A candidate preference, standing decision, or normalized model value cannot override a mandatory employer/submission requirement or contradictory factual evidence. Record the conflict and block or route only the affected decision instead of silently flattening either side.

## Validation layering

Keep validation responsibilities separate and preserve the Candidate Application Context Operating Pack order:

1. **Template structure** — starter shape and placeholders are valid; when semantic mapping is used, the slot manifest exists, its revision is recorded, and its declared Resume Content Model version is compatible.
2. **Persona-Library composition/integrity** — evidence, chronology, attribution, baseline-to-output career-spine integrity when a Candidate Baseline Resume is active, semantic mapping completeness/loss handling, ATS/readability/accessibility rules as applicable. The candidate/model/baseline references and revisions must be recorded when used.
3. **Candidate-specific overlays** — private candidate-confirmed rules and preferences are checked without weakening factual or integrity rules.
4. **Role/application requirements** — current employer, channel, and target-role constraints are enforced where supported by evidence.
5. **Isolation** — no cross-candidate contamination, including normalized Resume Content Model nodes.

A candidate overlay may make a rule stricter, but it cannot create evidence, weaken a material-truth/integrity rule, or override a mandatory role/application requirement. A successful semantic mapping is not proof that the final artifact passes ATS, accessibility, parser, visual, or export review.

## Multi-candidate behavior

The same reusable system should support, for example:

```text
Candidate A evidence → Candidate A private Resume Content Model ─┐
                                                                ├→ same mapping Skill + same verified Template → Candidate A resume
Candidate B evidence → Candidate B private Resume Content Model ─┘
```

Only the private candidate context and role-specific inputs change. Reusable semantic contracts, Templates, Personas, Skills, Playbook stages, and generic validators remain shared unless the work justifies a different reusable artifact or method.

## Non-goals

This contract does not add:

- a candidate database or registry;
- a new Persona or Playbook;
- a new application tracker;
- private candidate records to Persona-Library;
- synchronization between private candidate files and reusable Templates;
- a resume generator/runtime or executable mapping DSL;
- submission authorization or employer-contact capability.
