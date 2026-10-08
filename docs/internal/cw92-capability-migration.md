# CW-92 capability source migration contract

## Status and scope

WP03 candidate contract for the audited UI and orchestration pilot. Production implementation requires independent scope/ownership acceptance of this exact revision. This document governs a one-time migration, not a new architectural space or runtime service.

Preservation baseline: `d61f850e06d266bc6d608b92b730c97e451ea745`. Accepted WP02 candidate: `717e337f6b3883dfa7957249169e62898cf00c1c`, PR294, CI37713701978, independent review6050379223. Candidate acceptance is not a main merge or publication.

The outcome is useful methods, knowledge, rules and verification criteria usable through existing V2 owners without Persona identity or activation. No Persona/profile replacement, named gatekeeper, competing authored catalog, new store, or new execution architecture is permitted. The pilot is not whole-library removal.

## One source and stable identity

Retain `content/library-data/skills-core.js` as the authored owner of the pilot method records, `content/library-model.js` as the normalizer, and `data.skillCatalog` as the single derived public capability catalog. `skillGuidance`, `skillPractice`, `skillRelations`, Tool recipes and external method packages retain their existing owners.

The existing `skillLibrary` object supports two transitional entry shapes, not two catalogs:

- Unmigrated entries retain their current array shape and source keys. The reader enumerates those source entries directly; it never enumerates `personas` to discover them.
- A migrated entry uses its existing `skill-*` semantic ID as the key and contains an array of concrete method records. Each method has an explicit `method-*` ID, a task condition, useful instructions, evidence and workflow references. A method is not a professional profile and cannot contain biography, role identity, work modes or a preferred named operator.

A semantic ID does not change when a display name changes. Preserve every existing published `skill-*` ID in the pilot. The first migrated method for each of the 16 selected capabilities uses `method-` followed by the existing Skill ID suffix; additional genuinely distinct methods require an explicit task-qualified ID and scope decision. Unmigrated legacy records receive deterministic temporary method keys from their source locator; these are migration locators, not new professional identities.

Within one semantic ID, retain different concrete methods separately. Repeated names are not evidence of equal methods. Duplicate method IDs, duplicate authored copies of a migrated method, conflicting semantic IDs and invalid references fail closed. Do not select the first record as the winner. A migrated method body is removed from its old authored bucket in the same change that adds it to the neutral entry.

## Lossless field mapping

Each migrated method contains:

- `id`: explicit stable method ID.
- `name`, `status`, `definition`, `actions`, `evidence`: original source values, unchanged during mechanical migration.
- `when`: the original trigger text, as the task applicability condition. Optional domain references are added only when supported by actual source, not inferred from the Persona's job title.
- `workflowRefs`: ordered references that preserve the original workflow reach. A resolved reference has an explicit workflow ID; an unresolved reference retains its exact original title and source locator until WP07 supplies a supported disposition.
- `provenance`: pinned original repository/file/selector references, plus the current owning source locator. Provenance may mention a historical identity but cannot be required to select or execute the method.
- `legacySourceKey`: optional transitional adapter metadata only. It carries no task meaning, authority or discovery eligibility and is removed when its consumers are retired.

The old display fields `triggers` and `workflows` are derived from `when` and ordered workflow references for existing readers. They are not separately authored. Unknown source fields block mechanical migration until classified; do not silently drop them or add speculative fields.

Useful content embedded in Persona definitions remains covered by the preservation inventory until its specific existing V2 owner is reconciled. Source-wrapper removal is not authorized by a successful method-record migration alone.

## Workflow representation

The existing `flowLibrary` remains the only authored workflow source. Keep all activities, summaries, cadence, failure conditions and handoff evidence. Each pilot workflow receives an explicit stable `workflow-*` ID based on its established title, with collision checks before assignment. An internal lookup flattens the existing source entries by workflow ID; this lookup is a derived index, not another authored workflow catalog.

Legacy title/source-key references remain readable during transition. New migrated methods select workflows by explicit ID, never by a Persona record. Exact unresolved titles remain explicit unresolved references; they must not become invented workflows or disappear. Preserve ordering and the original legacy display until a source-backed WP07 repair is accepted.

After WP04, backfill the 14 workflow IDs in two sequential owner-local batches of seven records before migrating methods that reference them. These are explicit bounded prerequisite follow-ups within the pilot, not 14 new workflows. Moving workflow storage or adapting extra readers requires an additional bounded follow-up; it is not hidden in an eight-method migration.

## Derived output and temporary compatibility

The normalizer exposes each capability's concrete `methods` in the existing `skillCatalog`. These carry task conditions and useful payloads without requiring Persona metadata. Legacy `profiles`, Persona display associations and workflow-title strings are derived compatibility views only. Existing authored legacy records are read-only migration inputs; migrated method bodies have exactly one writer and one authoritative location.

Persona names, presence, list order and biography cannot determine method discovery, method contents, effective guidance or method selection. `personas` may be omitted or empty for the neutral model path. Absence must not fabricate placeholder Persona records. Guard direct source overrides and maintenance history updates only when their corresponding historical record exists; retain all history when it does exist.

Shared effective guidance comes only from existing authored shared guidance/practice and deterministic, inspectable summaries of all relevant method payloads. Missing shared fields remain explicitly starter/partial. Keep method-specific instruction and conditions inspectable separately; never resolve contradictory methods by concatenating them into one unconditional instruction or choosing the first profile. Where a shared summary cannot express the differences, direct the caller to select a method by task conditions rather than inventing a common answer.

The existing `guidanceCoverage` distinction remains authoritative. A complete rendered card, generated fallback, source marked Synthesized, or successful migration test is not proof of method effectiveness.

## Bounded implementation changes

WP04 may change only `content/library-model.js`, `content/library-data.js`, the guarded post-definition override in `content/library-data/personas-core.js`, and the two WP02 test/helper files. Generated output must be rebuilt with the existing builder, not edited as authority. Do not rewrite method bodies, alter unrelated lifecycle history, remove wrappers, change routing or create a new authoring UI in this reader packet.

WP05 and WP06 separately move eight UI and eight orchestration method bodies into the neutral entries under the accepted mapping. Preserve source payloads and validate that the old authored bodies are absent. Do not import an entire Persona into a giant neutral Skill. WP07 resolves only evidenced workflow defects and any explicitly allocated relationship follow-ups.

WP19–WP21 adapt bounded reader/writer/graph/context/activation cohorts. Authoring targets neutral method records; it cannot create a required Persona as a side effect. Display/export adapters are one-way and removable. Existing package and Notion owners are referenced, not copied into this catalog as competing semantic authority. Repository CI and local instructions remain required.

## Preservation and conflict tests

Use the WP02 immutable full-source fixture. Do not refresh it to the new implementation. Add an explicit migration projection that maps old material fields to the new shape and compares every field, condition, evidence value, activity and relationship, including all peer variants and nonpilot survivors.

Keep historical failure characterizations executable against the immutable baseline. For the candidate, replace only the corresponding known-failure expectation with positive no-identity/order/name independence assertions. A change to generated field order, new `methods` view, or fallback presentation needs an explicit expected transformation and independent checks; do not disable whole snapshot sections or treat counts as preservation.

Test absent individual pilot identities, both absent, an empty/omitted Persona metadata collection, shuffled/renamed metadata, duplicate method IDs, duplicate authored bodies, unresolved workflow references, and nonpilot survival. Test neutral method inputs directly as well as actual loaded source. Invalid collision/reference cases must fail for the specified reason. Preserve valid source provenance and authored-versus-partial distinctions.

## Acceptance, rollback and retirement

Independent WP03 scope review precedes WP04. Each package records its exact accepted inputs, diff, checks, remaining limits and next action. Main currently triggers deployment; use accepted non-deploying candidate commits and do not merge to main without publication authorization.

Before a neutral-only data migration, the reader commit can be reverted independently. After migration, restore the matched source bodies and compatible reader together; never restore a competing second authored copy. Preserve the original Git baseline and source-to-method mapping for rollback.

Remove an adapter or wrapper only after all relevant readers, writers, routes, safeguards and lifecycle consumers have been checked, its active inbound dependencies are zero, and the required independent pilot acceptance passes. Preserve history separately, rerun post-removal checks, and obtain independent confirmation. VQ11, product fresh-session behavior, actual Runtime tests and method-performance evidence are separate gates; this contract does not pass them.
