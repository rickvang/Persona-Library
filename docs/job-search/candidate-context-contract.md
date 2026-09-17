# Candidate Context Contract

## Purpose

Define the reusable boundary between a person-specific job-search context, canonical Templates, and one role-specific application instance.

Persona-Library owns this contract and the composition/review process. `rickvang/template-library` owns reusable starter artifacts. The authorized private candidate workspace owns the candidate's facts, decisions, preferences, and evidence. A role-specific application folder owns the instantiated outputs for one candidate and one opportunity.

This contract lets multiple candidates use the same Persona-Library process and the same Templates without mixing their private context or encoding one person's preferences into reusable artifacts.

## System boundary

```text
Persona-Library
process + routing + mapping + review + validation contracts
        │
        ├───────────────┐
        ▼               ▼
private candidate    template-library
context              canonical reusable starters
        │               │
        └───────┬───────┘
                ▼
      role-specific application instance
      private candidate × one opportunity
```

### Persona-Library owns

- the Candidate Context contract;
- when candidate context must be loaded;
- precedence among current task/channel requirements, candidate instructions, source corrections, standing decisions, generic guidance, and Template defaults;
- evidence-to-artifact mapping rules;
- composition, integrity, ATS, human, and candidate-overlay review contracts;
- Work Order fields and gates that prove the correct candidate context was used.

### `rickvang/template-library` owns

- reusable starter files and structure;
- Template-specific placeholders and copy boundaries;
- generic structural expectations that apply to every consumer of that Template;
- Template provenance, entrypoint, lifecycle, and revision history.

Templates must not contain candidate facts, candidate-specific standing decisions, private workspace identifiers, role-specific employer claims, or one person's validation overrides.

### Private candidate context owns

- candidate identity and contact facts;
- goals, constraints, and search preferences;
- source resumes, work-history evidence, portfolio evidence, and other candidate evidence;
- candidate-confirmed standing decisions;
- voice and writing preferences;
- candidate-specific Template preferences when they exist;
- candidate-specific validation overlays;
- provenance and revision state for the context.

The private context may be implemented as one record or a small set of linked private files. Persona-Library does not require a specific storage provider or copy the private contents into the public repository.

### Role-specific application instance owns

- the job posting and researched employer context;
- the requirement-to-evidence map for that role;
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
| Standing decisions | candidate-confirmed rules about chronology, employer/client attribution, section placement, naming, omissions, or other repeatable choices | Decisions guide composition but do not create evidence. |
| Voice and writing preferences | recognizable tone, terminology preferences, recurring wording constraints, approved abstractions | Voice preferences cannot upgrade facts or scope. |
| Template preferences | candidate-specific default or prohibited Template choices, when any | A preference selects among verified Templates; it does not make a private master canonical. |
| Validation overlays | candidate-specific checks derived from confirmed decisions or source facts | Examples: required employer/client attribution or a candidate-approved chronology treatment. |
| Revision/provenance | last reviewed date, source basis, active/superseded/conflicted state | Stale or conflicted context blocks affected decisions until resolved. |

A Candidate Context is **not** a Persona, Template, evidence ledger, application tracker, or Work Order. It is the private person-specific input contract consumed by the job-search process.

## Candidate isolation

Every application run must bind to exactly one candidate context before candidate evidence is used.

- Do not infer that a prior application's candidate is the candidate for the current run.
- Do not reuse standing decisions, voice preferences, contact details, validation overlays, or private evidence across candidates.
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

Evidence still governs material claims. A higher-precedence instruction may change structure or wording, but it cannot create an unsupported fact, metric, title, employer, date, tool, responsibility, or outcome. Record conflicts and superseded decisions rather than silently flattening them.

## Template binding

For each reusable application artifact:

1. identify the artifact required by the application run;
2. resolve the Template through the Persona-Library Template catalog;
3. verify the canonical `rickvang/template-library` path, `README.md` entrypoint, starter copy boundary, and Git revision;
4. copy/adapt the starter into the role-specific private application folder;
5. bind the active candidate context and role evidence to the instantiated artifact;
6. map candidate evidence and decisions into the Template's intended semantic slots without changing the meaning of the evidence;
7. run the applicable validation layers;
8. keep the resulting role-specific artifact private unless external sharing is separately authorized.

If the needed reusable Template does not exist or cannot be verified, route to Template research/composition and create or repair the reusable Template in `rickvang/template-library`. Do not use a private candidate master as a silent substitute for a missing canonical Template.

## Content mapping record

The active application Work Order or private application notes should make important mappings inspectable.

| Mapping ID | Candidate evidence / decision | Template / slot | Role requirement | Validation applied | Status |
| --- | --- | --- | --- | --- | --- |
| MAP-001 | evidence or standing-decision reference | Template ID + section/placeholder | requirement ID or not applicable | generic / candidate overlay / role-channel | mapped / blocked / omitted with reason |

Use mapping records for material claims, candidate-specific structural decisions, and any field where an incorrect candidate binding would materially change the artifact. Do not create exhaustive bookkeeping for trivial prose.

## Validation layers

Validation is deliberately split so reusable Templates remain candidate-neutral. Use the Candidate Application Context Operating Pack order.

### 1. Template structural validation

Owned by the Template artifact/repository boundary. Verify reusable structure such as:

- required starter files exist;
- documented placeholders and sections are present;
- the starter is non-empty and internally coherent;
- reusable files do not contain unresolved candidate-specific content;
- the documented copy boundary is usable.

Template structural validation does not determine whether a candidate claim is true or whether a role-specific application is persuasive.

### 2. Persona-Library composition validation

Owned by the job-search process and relevant specialists. Verify, as applicable:

- evidence integrity and claim traceability;
- chronology and employer/client attribution;
- ATS-safe structure and extraction;
- role-to-evidence coverage;
- cover-letter role relevance and truthful synthesis;
- artifact packaging, parity, accessibility, and document-production checks.

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

Verify that candidate identity, contact data, evidence, standing decisions, voice rules, Template preferences, and validation overlays all belong to the active candidate context and that no values leaked from another candidate.

A later validation layer may add a stricter constraint but must not silently weaken an earlier factual or integrity rule.

## Work Order binding

A full application Work Order should record at minimum:

- Candidate Context reference or private location name;
- Candidate Context status: `not checked | located | read | missing | stale | conflicted | not applicable`;
- Candidate Context revision or last-reviewed date when available;
- evidence sources used from that context;
- standing decisions applied or explicitly not applicable;
- voice/writing preferences applied when relevant;
- candidate-specific Template preferences applied when relevant;
- candidate-specific validation overlays applied;
- unresolved context conflicts or candidate questions;
- whether the Candidate Context itself was updated during the run;
- Template IDs and verified revisions used for each instantiated artifact.

Before `ready-for-review`, the Work Order must show that the candidate boundary is unambiguous, required context has been loaded, material mappings are traceable, and applicable candidate overlays have passed or have an explicit blocker/disposition.

## Multi-candidate use

The same reusable system should support any number of private candidate contexts:

```text
Candidate A context ─┐
                     ├─→ same Persona-Library process ─→ same verified Templates ─→ Candidate A application
Candidate B context ─┘                                      │
                                                            └─→ Candidate B application
```

The reusable process and Templates stay shared. Candidate contexts and application instances stay isolated. A new candidate should be able to enter the system by creating their private Candidate Context, resolving verified Templates, and running the same mapping and validation gates without inheriting another candidate's decisions or content.

## Non-goals

This contract does not create:

- a public candidate registry;
- a new Persona;
- a new job-search Playbook;
- a candidate CRM or application tracker;
- a requirement to store private candidate data in Persona-Library;
- a synchronization service between private candidate files and Templates;
- a universal candidate profile schema beyond what application work needs.

Keep the boundary small: shared process and reusable starters remain public; person-specific context and instantiated applications remain private.
