# Reconciliation — Supabase opportunity persistence

- Work Order: `WO-2026-09-19-supabase-opportunity-store`
- Initiating issue: #156
- Change mode: source / architecture update
- Review date: 2026-09-19

## Change observed

The Applications tracker now has an explicit persistence adapter boundary with two implementations:

- authenticated Supabase opportunity storage when deployment config is present;
- browser-local storage only as explicit fallback/migration state.

The change supersedes the browser-local-primary conclusion in DEC-016 without deleting its history. DEC-017 records the new boundary. Canonical Persona-Library catalog authoring remains in Git.

## Impact review

| Surface | Classification | Result |
| --- | --- | --- |
| Applications tracker UI/runtime | extends | Adds auth state, remote error state, local migration, and async storage operations. |
| Application tracker contract | extends / qualifies | Remote authenticated storage becomes primary when configured; JSON portability and seen-job separation remain. |
| DEC-016 | qualifies / supersedes | Historical MVP remains valid for its period; DEC-017 supersedes its persistence conclusion. |
| Architecture | extends | Static-first canonical library remains; private operational tracker state may use authenticated Supabase storage. |
| Seen-job deduplication contract | confirms separation | No change to lightweight discovery deduplication ownership or persistence contract. |
| Candidate Application Context | confirms separation | Candidate evidence, resume baseline, answers, and packet contents remain outside opportunity rows. |
| Personas / Skills / Tools / Playbooks | unrelated | No identity, capability, orchestration, or permission record is changed by this milestone. |
| Templates / Operating Packs | unrelated | No source or applicability record changes. |
| Future catalog projection | deferred | DEC-017 preserves Git as canonical and allows only a later deterministic read-only projection. |
| Issue #153 handoff | qualifies | Not closed or superseded yet; reassess only after live Supabase persistence is proven. |
| Public/private repository boundary | confirms | No real opportunity rows or secret keys are committed. |

## Security boundary

- Browser client may use only a publishable Supabase key.
- `app.opportunities` contract requires explicit authenticated grants and RLS.
- UPDATE policy requires both `USING` and `WITH CHECK`.
- Remote errors do not silently write to local storage.
- Existing local data is retained after migration as rollback/recovery evidence.
- Live RLS/security-advisor verification remains blocked until a new project is explicitly authorized.

## Conclusion

No canonical Persona, Skill, Tool, Template, Operating Pack, or Playbook mutation is required for the first opportunity-store milestone. Architecture, Decision history, tracker Docs, build/runtime wiring, and validation are the required affected surfaces. Catalog projection remains intentionally out of scope until remote opportunity persistence is validated.
