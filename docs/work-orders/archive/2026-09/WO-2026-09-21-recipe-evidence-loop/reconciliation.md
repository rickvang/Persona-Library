# Reconciliation — Issue #171

## Expected impact

- Personas: unchanged.
- Skills: no new Skill identity; existing Tool-discovery Skill gains experimentation guidance.
- Tools: identities, permissions, and availability claims unchanged.
- Tool-use recipes: existing recipe identity/procedure remains canonical; the comparison does not mutate preference automatically.
- Operational Scenarios: no scenario body change required; #187's manifest-first retrieval is independently supported by the proof.
- Eval: extended with a comparable-run contract and one sanitized proof.
- Supabase: no schema or runtime change; current evidence does not justify an operational store.
- Decisions: no architecture boundary changed, so no new Decision is required.
- Generated Site: unchanged.

## Final status

Pass.

| Surface | Result |
| --- | --- |
| Personas | Unchanged. |
| Skills | No new identity; Tool-discovery Skill now defines the comparison/review loop. |
| Tools | Identity, permission, and availability boundaries unchanged. |
| Tool-use recipes | No automatic preference mutation; existing recipe remains canonical. |
| Operational Scenarios | No body change; manifest-first retrieval is now supported by a sanitized comparison proof. |
| Eval | Extended with schema-1.0 recipe/strategy comparison validation, documentation, focused tests, and one proof. |
| Evidence lifecycle | One run remains observation; review is explicit; contradiction/freshness rules are preserved. |
| Persistence | Git-backed sanitized evidence selected; Supabase not justified. |
| Decisions | No architectural boundary changed; no new Decision required. |
| Generated Site | Unchanged. |

Issue #171 acceptance criteria are covered without introducing a parallel taxonomy, model-specific Skill, universal Tool score, or speculative database.
