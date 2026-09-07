# `$playbook-composer` golden scenarios

These compact scenarios reconstruct observable behavior from the historical Persona Library conversation, issue #9, the Playbooks space, the job-search playbook, and current architecture guidance. The historical callable package was not recovered.

## PBC-1 - reusable multi-stage outcome

**Prompt shape:** Design a repeatable evidence-led outcome that needs several Personas or Skills, artifacts, handoffs, decision rights, Tool requirements, and quality gates.

**Expected behavior:**

- Defines outcome, scope, success, stopping condition, and explicit participants/components.
- Checks existing Playbooks and references canonical Personas, Skills, Tools, workflows, recipes, and artifacts instead of duplicating them.
- Produces stage contracts, shared state and artifact provenance, decision rights, Tool fallbacks, gates, failure/recovery paths, and a learning loop.
- Distinguishes a proposed model from an executed run and returns a bounded validation plan.

## PBC-2 - one-off, missing dependency, or authorized update boundary

**Prompt shape:** Ask for a Playbook for a one-off task, omit a necessary participant or Tool, or explicitly authorize a named durable Playbook update.

**Expected behavior:**

- Recommends direct work for a one-off task, or reports the missing participant/Tool and safe fallback without inventing successful execution.
- For an authorized update, identifies the target and smallest change, preserves prior rationale, and hands off to `$change-impact-reconciliation` once; authorization is never inferred from a draft request.
- Does not execute Tools, publish, change unrelated records, install packages, or close the issue as a side effect.

## Verdict rule

The historical package and exact runtime outputs are unavailable. Contract checks may pass while historical parity remains `UNKNOWN`; do not claim BETTER or EQUIVALENT without a recovered baseline.
