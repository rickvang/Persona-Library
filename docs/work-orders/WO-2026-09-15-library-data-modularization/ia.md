# Information architecture — library data modules

## Placement question

Where should the authored records previously accumulated in `content/library-data.js` live after modularization?

## Mara Okoye placement review

Classification: canonical authored library source, not documentation, generated output, prototype material, or a new first-class library space.

### Candidate destinations

| Candidate | Decision | Reason |
| --- | --- | --- |
| Keep all authored data in `content/library-data.js` | reject | Preserves the 318 KB mixed-domain maintenance problem and does not satisfy #106. |
| Add a new top-level `data/` or `catalogs/` space | reject | Creates parallel source authority outside the existing `content/` boundary. |
| Add domain modules under `content/library-data/` | select | Extends the existing canonical content owner, makes ownership visible, and does not introduce a new product concept or runtime. |
| Move data into `.agents/skills/` packages | reject | Skill packages are callable behavior packages, not canonical library record storage; their namespace must remain flat. |

## Implemented structure

```text
content/
├── library-data.js                  # small compatibility assembler only
└── library-data/
    ├── personas-core.js             # UI, operations, AI, and UX Persona records
    ├── personas-career.js           # job-search Persona records
    ├── personas-systems.js          # architecture, collaboration, document, creative, conformance, Template Personas
    ├── skills-core.js               # core Persona Skill profiles
    ├── skills-specialists.js        # specialist Persona Skill profiles
    ├── workflows-core.js            # Template, UI, AI, and initial operator workflow maps
    ├── workflows-operations.js      # operations, research, field, and UX workflow maps
    ├── workflows-career.js          # job-search and knowledge-architecture workflow maps
    ├── workflows-systems.js         # creative, collaboration, document, and conformance workflow maps
    ├── catalogs.js                  # Playbook, Operating Pack, and Template records
    ├── tool-integration.js          # Persona tool requirements, handoffs, and recipes
    ├── skill-guidance.js            # portable Skill operating/quality guidance
    ├── skill-practice.js            # deeper practice and quality overrides
    └── skill-anatomy.js             # primitive Skill units and typed Skill relationships
```

The grouping is deliberately coarse enough to avoid one-file-per-record fragmentation while making the major ownership and review boundaries visible. The directory remains an implementation/source boundary inside the existing `content/` authority, not a new first-class user-facing space.

## Compatibility boundary

`content/library-data.js` remains the stable compatibility assembler. It contains no catalog or Persona records; it verifies that every required fragment exists, reconstructs the original top-level key order, assigns `window.PersonaLibraryData`, and clears the temporary fragment namespace.

The build composes the authored modules and assembler into one generated `dist/data/library-data.js` classic-script bundle, preserving the Site contract and `window.PersonaLibraryData` shape. Validation and isolated evaluation load the same deterministic authored source sequence before the assembler.

No module is a reference-only pointer: each owns actual authored records moved out of the former monolith.

## Change-impact map

Implemented updates:

- `scripts/build-library.mjs`: composes the modular authored sources into the generated bundle rather than copying one monolith.
- `scripts/validation/context.mjs`: composes and evaluates the same authored source sequence before running validators and generated-parity checks.
- `eval/isolated-persona-skill.mjs`: defaults to the same modular authored source sequence for isolated evaluation.
- `content/library-data.js`: reduced from authored monolith to compatibility assembler.

Required before handoff:

- `ARCHITECTURE.md`: describe the modular canonical source and generated compatibility bundle truthfully.
- current live instructions that explicitly claim records live directly in `content/library-data.js`: update only where operationally required.
- executable build, validator, test, syntax, generated-parity, and diff checks in an environment that can execute repository commands.

Historical Work Orders remain historical evidence and are not rewritten merely because source paths evolve.
