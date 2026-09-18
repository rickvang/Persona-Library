# Candidate Context Contract

## Purpose

Define the reusable boundary between a person-specific job-search context, canonical Templates, and one role-specific application instance.

Persona-Library owns this contract and the composition/review process. `rickvang/template-library` owns reusable starter artifacts and Template-specific semantic slot manifests. The authorized private candidate workspace owns the candidate's facts, decisions, preferences, any designated Candidate Baseline Resume, normalized candidate content, and evidence. A role-specific application folder owns the instantiated outputs for one candidate and one opportunity.

This contract lets multiple candidates use the same Persona-Library process and the same Templates without mixing their private context or encoding one person's preferences into reusable artifacts.

## System boundary

```text
Persona-Library
process + semantic contracts + mapping + review + validation
        │
        ├───────────────┐
        ▼               ▼
private candidate    template-library
context              canonical reusable starters + slot manifests
        │               │
        └───────┬───────┘
                ▼
      role-specific application instance
      private candidate × one opportunity
```

### Persona-Library owns

- the Candidate Context contract;
- the presentation-neutral Resume Content Model contract;
- semantic Resume-to-Template mapping rules and Skill behavior;
- when candidate context must be loaded;
- precedence among current task/channel requirements, candidate instructions, source corrections, standing decisions, generic guidance, and Template defaults;
- evidence-to-artifact mapping rules;
- composition, integrity, ATS, human, and candidate-overlay review contracts;
- Work Order fields and gates that prove the correct candidate context was used.

### `rickvang/template-library` owns

- reusable starter files and structure;
- Template-specific placeholders and copy boundaries;
- Template-specific semantic slot manifests when a Template consumes a reusable semantic content model;
- generic structural expectations that apply to every consumer of that Template;
- Template provenance, entrypoint, lifecycle, and revision history.

Templates must not contain candidate facts, candidate-specific standing decisions, private workspace identifiers, role-specific employer claims, one person's validation overrides, or private Resume Content Model instances.

### Private candidate context owns

- candidate identity and contact facts;
- goals, constraints, and search preferences;
- source resumes, work-history evidence, portfolio evidence, and other candidate evidence;
- an optional Candidate Baseline Resume / explicitly promoted private master when current standing decisions designate one;
- an optional normalized Resume Content Model instance for repeatable resume composition;
- candidate-confirmed standing decisions;
- voice and writing preferences;
- candidate-specific Template preferences when they exist;
- candidate-specific validation overlays;
- provenance and revision state for the context.

The private context may be implemented as one record or a small set of linked private files. Persona-Library does not require a specific storage provider or copy the private contents into the public repository.

The Resume Content Model instance is a normalized, evidence-traceable projection for composition. It is not the evidence ledger and does not become a factual source merely because a field exists in it.

### Role-specific application instance owns

- the job posting and researched employer context;
- the requirement-to-evidence map for that role;
- role-specific selection and emphasis applied to normalized candidate content;
- the instantiated resume, cover letter, application notes, and optional outputs;
- role/channel-specific constraints and validation findings;
- the submission selection and submission evidence when separately authorized.

## Candidate Context minimum contract

Before role alignment or drafting, resolve one candidate context and record its status in the active Work Order.

A usable candidate context should provide or explicitly mark unknown:

| Context area | Minimum contents | Notes |
| --- | --- | --- |
| Identity | candidate reference, display name, contact-source reference | Keep private values in the authorized workspace. |
| Goals and constraints | target families, level, geography/work mode, timing, compensation or other candidate constraints when relevant | These guide search and application decisions; they are not Template content. |
| Evidence sources | source resume/work history, portfolio/work samples, metrics, project evidence, credentials, supporting records | Material claims must remain traceable to evidence. |
| Candidate baseline resume | optional explicitly promoted private master/baseline designated by current standing decisions | Resolve the exact artifact before resume composition; preserve its protected career spine unless evidence or a later candidate instruction changes it. |
| Normalized resume content | optional private instance conforming to [`resume-content-model.md`](resume-content-model.md) and its schema | A repeatable semantic projection for composition; it does not replace evidence. |
| Standing decisions | candidate-confirmed rules about chronology, employer/client attribution, section placement, naming, omissions, or other repeatable choices | Decisions guide composition but do not create evidence. |
| Voice and writing preferences | recognizable tone, terminology preferences, recurring wording constraints, approved abstractions | Voice preferences cannot upgrade facts or scope. |
| Template preferences | candidate-specific default or prohibited Template choices, when any | A preference selects among verified Templates; it does not make a private master canonical. |
| Validation overlays | candidate-specific checks derived from confirmed decisions or source facts | Examples: required employer/client attribution or a candidate-approved chronology treatment. |
| Revision/provenance | last reviewed date, source basis, active/superseded/conflicted state | Stale or conflicted context blocks affected decisions until resolved. |

A Candidate Context is **not** a Persona, Template, evidence ledger, application tracker, or Work Order. It is the private person-specific input contract consumed by the job-search process.

## Candidate Baseline Resume binding

When current standing decisions designate a Candidate Baseline Resume or active private master:

- resolve that exact private artifact and record its source/revision before role alignment or resume drafting;
- treat it as the default composition baseline for the approved candidate career spine, not as factual evidence and not as the reusable Template source;
- protect identity/contact, employer and role identity, separate periods, dates, locations, employer/client hierarchy, recent-employer presence, education, certifications, and candidate-confirmed historical grouping;
- allow role-specific emphasis, supported summary/skill changes, and achievement selection without silently reconstructing protected fields;
- record every material protected-field difference with its evidence/decision basis and use `omitted_with_reason` for intentional material omissions;
- block the affected composition step if the designated baseline cannot be resolved instead of substituting a secondary profile store, stale summary, or prior application.

A Candidate Baseline Resume may coexist with a normalized Resume Content Model and verified reusable Template. Evidence governs truth; the baseline governs the current candidate-specific composed career spine; the normalized model supports semantic portability; the Template supplies reusable structure.

## Resume Content Model binding

When the candidate context exposes normalized resume content:

- validate or inspect it against the current `resume-content-model.schema.json` contract when tooling is available;
- record the model reference, model revision, and schema version in the active application Work Order;
- keep material nodes traceable to evidence and applicable standing decisions;
- preserve employer-of-record, separate employment periods, and nested client engagements where the sources require them;
- keep role-specific target selection, target-employer terminology, Template slot IDs, and layout choices out of canonical candidate data;
- mark conflicted or unknown material nodes rather than polishing them into certainty;
- reconcile affected normalized nodes after a source correction or standing-decision change.

The same private Resume Content Model instance should be reusable across multiple verified resume Templates. A new Template should not require the candidate's factual history to be rewritten into a new Template-specific data model.

## Candidate isolation

Every application run must bind to exactly one candidate context before candidate evidence or normalized candidate content is used.

- Do not infer that a prior application's candidate is the candidate for the current run.
- Do not reuse standing decisions, voice preferences, contact details, Candidate Baseline Resume artifacts, validation overlays, normalized Resume Content Model nodes, or private evidence across candidates.
- Do not copy candidate-specific content into `template-library` or Persona-Library.
- Do not treat the synthetic Job Seeker Persona as the actual candidate. The candidate remains the source of truth for their own facts, goals, constraints, and voice.
- If the candidate context is missing or ambiguous, stop the affected composition step and resolve the candidate boundary before drafting.

## Decision precedence

When candidate context, source evidence, current task/channel requirements, generic guidance, and Template defaults disagree, apply the Candidate Application Context Operating Pack order unless a stricter consuming-project rule applies:

1. current task and mandatory role/application requirements;
2. verified correction to the candidate's source evidence;
3. current explicit candidate instruction within those task/channel bounds;
4. active candidate standing decision;
5. Operating Pack or generic job-search/application guidance;
6. Template default or placeholder behavior.

Mandatory employer or submission requirements do not lose to a candidate preference. When a candidate instruction conflicts with a mandatory role/application requirement or factual evidence, record the conflict and block or route the affected decision instead of silently overriding either side.

Evidence still governs material claims. A higher-precedence instruction may change structure or wording, but it cannot create an unsupported fact, metric, title, employer, date, tool, responsibility, or outcome. A normalized Resume Content Model node cannot override contradictory evidence or a current standing decision. Record conflicts and superseded decisions rather than silently flattening them.

## Template binding

For each reusable application artifact, verify reusable Template state separately from candidate-baseline state. A Candidate Baseline Resume never becomes the canonical Template merely because it is the composition baseline.

1. identify the artifact required by the application run;
2. resolve the Template through the Persona-Library Template catalog;
3. verify the canonical `rickvang/template-library` path, `README.md` entrypoint, starter copy boundary, and Git revision;
4. for a resume Template that declares semantic mapping, verify `slot-map.json`, its revision, and its declared Resume Content Model version;
5. when no Candidate Baseline Resume is designated, copy/adapt the starter into the role-specific private application folder; when a baseline is designated, use the baseline as the role-specific composition starting artifact while keeping the verified Template reference as the reusable-structure contract;
6. bind the active candidate context, baseline when designated, and role evidence to the instantiated artifact;
7. map normalized candidate content or source evidence/decisions into Template semantic slots when needed without changing material meaning or forcing reconstruction of a designated baseline;
8. record material mapping results, including `unmapped`, `blocked`, and `omitted_with_reason` content;
9. run the applicable validation layers;
10. keep the resulting role-specific artifact private unless external sharing is separately authorized.

When cross-Template semantic mapping is actually needed and a normalized candidate model is available, use [`resume-template-mapping.md`](resume-template-mapping.md) and the `resume-template-semantic-mapping` Skill. Do not treat an arbitrary prior rendered resume as the data model, and do not use the mapping layer to bypass or reconstruct a standing-decision-designated Candidate Baseline Resume.

If the needed reusable Template does not exist or cannot be verified, route to Template research/composition and create or repair the reusable Template in `rickvang/template-library`. Do not use a private candidate master as a silent substitute for a missing canonical Template.

## Content mapping record

The active application Work Order or private application notes should make important mappings inspectable.

| Mapping ID | Candidate source / normalized node | Template / semantic slot | Role requirement | Validation applied | Status |
| --- | --- | --- | --- | --- | --- |
| MAP-001 | evidence, standing-decision, or Resume Content Model node reference | Template ID + semantic slot | requirement ID or not applicable | generic / candidate overlay / role-channel | mapped / blocked / unmapped / omitted_with_reason / not_applicable |

Use mapping records for material claims, candidate-specific structural decisions, and any field where an incorrect candidate binding would materially change the artifact. Do not create exhaustive bookkeeping for trivial prose.

For a resume semantic-mapping run, also record:

- Resume Content Model reference, revision, and schema version;
- Template `slot-map.json` path and verified revision;
- material `unmapped`, `blocked`, or `omitted_with_reason` content and disposition;
- semantic-mapping validation result;
- downstream checks that were and were not run.

## Validation layers

Validation is deliberately split so reusable Templates remain candidate-neutral. Use the Candidate Application Context Operating Pack order; semantic-model checks extend the existing layers rather than replacing or reordering them.

### 1. Template structural validation

Owned by the Template artifact/repository boundary. Verify reusable structure such as:

- required starter files exist;
- documented placeholders and sections are present;
- when semantic mapping is used, the required slot manifest exists, its revision is recorded, and it targets a compatible Resume Content Model version;
- the starter is non-empty and internally coherent;
- reusable files do not contain unresolved candidate-specific content;
- the documented copy boundary is usable.

Template structural validation does not determine whether a candidate claim is true or whether a role-specific application is persuasive.

### 2. Persona-Library composition validation

Owned by the job-search process and relevant specialists. Verify, as applicable:

- the active candidate/model binding is unambiguous and the model revision/schema version are recorded when used;
- any standing-decision-designated Candidate Baseline Resume was resolved, recorded, and compared against the final artifact's protected career spine;
- material normalized nodes remain traceable to current evidence/decisions;
- semantic mapping completeness and explicit loss handling;
- evidence integrity and claim traceability;
- chronology and employer/client attribution;
- ATS-safe structure and extraction;
- role-to-evidence coverage;
- cover-letter role relevance and truthful synthesis;
- artifact packaging, parity, accessibility, and document-production checks.

A successful semantic mapping does not prove ATS compatibility, accessibility, visual quality, parser behavior, or export fidelity.

### 3. Candidate-specific validation overlays

Loaded from the active private Candidate Context. These checks apply only to that candidate and must trace to a candidate-confirmed decision or source fact.

Examples include:

- preserve a confirmed employer-of-record/client-engagement hierarchy;
- keep separate employment periods separate;
- enforce a candidate-approved naming or section-placement decision;
- preserve a confirmed voice or terminology constraint;
- prohibit a candidate-specific omission or unsupported abstraction.

Candidate overlays may strengthen or specialize a generic check but must not weaken evidence integrity or create unsupported facts.

### 4. Role/channel validation

Apply current employer, application-channel, or role-specific constraints when supported by current evidence. A portal label alone is not proof of parser behavior. Mandatory role/application requirements govern the deliverable when they conflict with candidate preferences or overlays; record the conflict rather than silently flattening it.

### 5. Cross-candidate isolation

Verify that candidate identity, contact data, evidence, normalized resume content, standing decisions, voice rules, Template preferences, and validation overlays all belong to the active candidate context and that no values leaked from another candidate.

A later validation layer may add a stricter constraint but must not silently weaken an earlier factual or integrity rule.

## Work Order binding

A full application Work Order should record at minimum:

- Candidate Context reference or private location name;
- Candidate Context status: `not checked | located | read | missing | stale | conflicted | not applicable`;
- Candidate Context revision or last-reviewed date when available;
- evidence sources used from that context;
- Candidate Baseline Resume designation, source/revision, resolution status, protected-field differences, material omissions, and baseline-to-output integrity result when applicable;
- Resume Content Model reference/revision and schema version when used;
- standing decisions applied or explicitly not applicable;
- voice/writing preferences applied when relevant;
- candidate-specific Template preferences applied when relevant;
- candidate-specific validation overlays applied;
- unresolved context conflicts or candidate questions;
- whether the Candidate Context itself was updated during the run;
- Template IDs and verified revisions used for each instantiated artifact;
- for mapped resumes, Template slot-manifest path/revision and declared model version;
- material `unmapped`, `blocked`, or `omitted_with_reason` semantic content;
- semantic-mapping validation result and downstream validation results.

Before `ready-for-review`, the Work Order must show that the candidate boundary is unambiguous, required context has been loaded, any designated Candidate Baseline Resume was resolved and passed baseline-to-output career-spine integrity or has explicit supported dispositions, material mappings are traceable, mapping loss is explicit, and applicable candidate overlays have passed or have an explicit blocker/disposition.

## Multi-candidate use

The same reusable system should support any number of private candidate contexts:

```text
Candidate A context ─┐
                     ├─→ same Persona-Library process ─→ same verified Templates ─→ Candidate A application
Candidate B context ─┘                                      │
                                                            └─→ Candidate B application
```

The reusable process, Resume Content Model contract, mapping Skill, and Templates stay shared. Candidate contexts, private normalized content instances, and application instances stay isolated. A new candidate should be able to enter the system by creating their private Candidate Context, normalizing resume content when useful, resolving verified Templates, and running the same mapping and validation gates without inheriting another candidate's decisions or content.

## Non-goals

This contract does not create:

- a public candidate registry;
- a new Persona;
- a new job-search Playbook;
- treating Candidate Application Context itself as a candidate CRM or application tracker; the separate Applications companion surface may track lifecycle state under `application-tracker-contract.md` without moving candidate values into canonical Persona-Library records;
- a requirement to store private candidate data in Persona-Library;
- a synchronization service between private candidate files and Templates;
- a rendering/generator runtime;
- a universal candidate profile schema beyond what application work needs.

Keep the boundary small: shared semantic contracts, process, Skills, and reusable starters remain public; person-specific context and instantiated applications remain private.
