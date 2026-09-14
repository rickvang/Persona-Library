# Focused validation

`validate-content.mjs` remains the single repository validation command. It loads the authored data, model, generated files, pages, and shared indexes once, then delegates checks to the smallest responsibility unit that owns the contract.

| Module | Owns |
| --- | --- |
| `context.mjs` | Shared source loading and validation indexes |
| `orientation.mjs` | Bootstrap, route groups, route dependencies, and Skill package metadata |
| `generated.mjs` | Generated freshness and Site/page contracts |
| `personas.mjs` | Persona identity, Persona Skill applications, and workflow maps |
| `skills.mjs` | Skill catalog profiles, guidance, and modular Skill units |
| `relationships.mjs` | Tool-use recipes, Persona Tool requirements, handoffs, and typed Skill relationships |
| `operating-packs.mjs` | Operating Pack source, revision, relationship, and isolation contracts |
| `templates.mjs` | Template source, revision, relationship, display-state, and isolation contracts |
| `maintenance.mjs` | Persona and Skill semantic revision metadata |

The modules enforce canonical contracts; they do not become a second authored source of truth. Cross-domain relationships stay in `relationships.mjs` or in the domain that owns the relationship when that ownership is explicit. The top-level script is orchestration and reporting only.

Run the focused regression cases with:

```text
node --test scripts/validation/validation.test.mjs
```
