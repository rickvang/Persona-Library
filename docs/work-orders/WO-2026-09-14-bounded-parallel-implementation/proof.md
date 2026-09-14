# Real-case proof

This is a retrospective architecture proof, not a claim that the Playbook was executed as a named run. The two lanes already existed as independently implemented `tool-repo` workstreams. They match the issue’s “two independent repository workstreams → one PR each → independent review → sequential merge” shape, with the limitation that both lanes targeted the same repository.

## Lane A

- Repository: `rickvang/tool-repo`
- Issue: [#3](https://github.com/rickvang/tool-repo/issues/3) — file-based GitHub package foundation
- Implementer runtime: Cursor cloud agent `bc-6a569944-c671-5fd6-a67c-2b62a9603c23`
- Branch: `cursor/github-package-foundation-3c23`
- Pull request: [#6](https://github.com/rickvang/tool-repo/pull/6)
- Result: merged 2026-09-14 at `c6004c7ad1e8bc2b4ed7ef88349cd388b2c599aa`
- Scope held: GitHub package split only; Figma / issue #4 stayed out of the PR

## Lane B

- Repository: `rickvang/tool-repo`
- Issue: [#4](https://github.com/rickvang/tool-repo/issues/4) — Figma Tool operating package
- Implementer runtime: Cursor cloud agent `bc-7a90a1ca-352d-5bc1-b482-d2316ad2917f`
- Branch: `cursor/figma-operating-instructions-917f`
- Pull request: [#5](https://github.com/rickvang/tool-repo/pull/5)
- Result: rebased onto merged #6, README conflict resolved, merged 2026-09-14 at `2683eea`

## What matched the Playbook

| Property | Observation |
| --- | --- |
| One workstream / one branch / one PR | Each issue produced one branch and one PR, then the implementer stopped. |
| One-level delegation | Separate implementer agents; grandchild agents were not required to finish either package. |
| No merge by implementers | Merge happened later, sequentially, under separate authorization. |
| Sequential merge after shared-file collision | #6 merged first. #5 required a README rebase because both PRs touched the root README. |
| Review from GitHub artifacts | Merge sequencing used PR identities, diffs, and the README conflict rather than child-agent transcripts as GitHub truth. |
| Runtime-neutral roles | Cursor agents filled Implementer; a later coordinator sequenced review/merge. Product names were not the contract. |

## What the coordinator still duplicated or left unproven

| Property | Observation |
| --- | --- |
| Compact handoff | Not used. Later merge work carried broader conversation context instead of the six-field packet. The Playbook exists to prevent that cost on the next run. |
| Coordinator reimplementation | The later merge pass re-inspected both PRs and resolved the README conflict. Some duplicate repository inspection happened after the implementers stopped. |
| Nested delegation | Not observed in the two implementer PRs. Not proven absent for every nested tool call inside those runs. |
| Two-repository proof | The issue sketch allowed Persona-Library + tool-repo. This proof is two workstreams in one repository. |
| Chat→Work completion callback | Not used in this case. Documented as a preferred current adapter with fallback; it remains unverified here. |
| Independent review stage | Merge authorization used GitHub PR state, but a named Reviewer stage distinct from coordinator merge sequencing was not recorded as a Playbook run. |

## Usage-containment reading

The expensive parts of this case were later full-context merge coordination and README conflict repair, not the parallel implementation itself. A compact GitHub-reference handoff would have been enough to rehydrate #5 and #6. Nested agents and giant shared prompts were not required to get two reviewable PRs.

## ChatGPT adapter status

Issue comment [5663449934](https://github.com/rickvang/Persona-Library/issues/82#issuecomment-5663449934) records Chat→Work→callback as the preferred current mapping. This proof does not verify that callback. The Playbook fallback remains: surface the same compact packet in the coordinator context and review from GitHub.

## Generalization limit

Do not treat this as proof that every parallel implementation is cheap or conflict-free. Shared files still serialize at merge. A later two-repository case would strengthen the architecture; it is not required to catalog the Playbook after this bounded proof.
