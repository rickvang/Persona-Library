# GitHub connector troubleshooting

Status: repository-local operational troubleshooting evidence. This file records connector invocation behavior observed while executing Persona-Library work. It does **not** replace the pinned reusable GitHub operating contract in `rickvang/tool-repo`, grant mutation authority, or authorize bypassing a safety control.

## Branch creation

For a focused branch from the current default branch:

1. Refresh the live repository and `main` state.
2. Confirm the requested work authorizes a branch mutation.
3. Prefer the smallest schema-valid connector request: `create_branch(repository_full_name, branch_name, base_ref: "main")`.
4. Provide exactly one of `base_ref` or `sha`. Use `sha` when an exact non-branch revision is materially required.
5. Verify creation with the connector's branch-specific search/list action.

A slash in a branch name is normal. A generic GitHub fetch helper may reject an URL-encoded slash branch path even when the branch exists; that fetch-path error is not evidence that creation failed.

## Classify failures before escalating

- **`INVALID_ARGUMENT`:** first re-read the live action schema and check argument names, mutually exclusive fields, and the fetch/action path. In CW-92, an early `from_sha` argument was invalid; the supported fields were `base_ref` or `sha`.
- **Tool-execution safety rejection:** do not immediately diagnose GitHub permissions or a durable platform outage. After confirming authorization and repository state, retry **once** with the minimal schema-valid request and a short ordinary branch name. In CW-92, `create_branch(..., base_ref: "main")` succeeded after earlier malformed/overcomplicated attempts.
- **GitHub API permission/protection response:** inspect current repository permissions, branch protection/rulesets, and the exact GitHub response. Keep this distinct from connector schema validation and upstream safety checks.

## Never bypass a genuine safety block

If the minimal valid request is still rejected by the safety layer, preserve the exact error and stop at an execution-path blocker. Do **not** manufacture the branch through `update_ref`, force-push, a more consequential endpoint, or disguised arguments merely to evade the rejection.

## CW-92 evidence

On 2026-10-08, `chatgpt/cw92-wp09` was successfully created from refreshed `main` using `base_ref: "main"`. Branch-specific search confirmed it existed. A subsequent generic fetch using an encoded slash path returned `INVALID_ARGUMENT`, demonstrating why branch verification should use the branch-specific action rather than generic fetch-path behavior.

This evidence supports the troubleshooting sequence above; it does not prove every future safety rejection is transient.
