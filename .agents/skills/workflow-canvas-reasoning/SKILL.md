---
name: workflow-canvas-reasoning
description: Read a direct-manipulation change to a workflow canvas as a structural diff, propose ranked intent readings with named evidence, and surface the questions the canvas cannot answer before any record is changed.
metadata:
  skill_layer: persona_applied
  change_mode: prototype
  change_domain: prototyping
  reconciliation: skip
---

# Workflow Canvas Reasoning

## Status

This is an active prototype (`proto-workflow-canvas-reasoning`), not a live capability. It reads live workflow maps and writes nothing. Its output is a proposal for a person to accept, correct, or discard.

The prototype exists to answer one question: **can a structural diff of a workflow canvas support a reading of intent that is useful enough to act on?** Until that is answered with evidence and recorded in Decisions, no live record depends on this skill.

## Use this skill when

Activate when someone rearranges a workflow on the canvas and wants the change interpreted rather than merely listed, or when they ask what a set of canvas edits implies for the underlying workflow map.

Do not activate for: rendering or styling the canvas; applying a reading to a live Persona, Skill, Tool, or Playbook record; or treating an accepted reading as authorization to write. Interpretation and mutation are separate steps with separate permission.

## Required preflight

1. Read [the orientation manifest](../../../content/site-orientation.json) and [the repository contract](../../../AGENTS.md).
2. Establish the committed source graph and the current graph. A reading is always a diff of two states, never a replay of gestures — gesture order is not intent.
3. Confirm the prototype boundary: the canvas may read `flowLibrary` content, and may not write to it.

## Method

1. **Separate layout from meaning.** A card moved without changing its order or tier is layout. Record it, mark it non-semantic, and do not interpret it. This distinction is the prototype's core claim; treating a nudge as intent is the failure mode that would make the whole idea untrustworthy.
2. **Attribute a change to the gesture that caused it.** Moving one card shifts the index of every card it passes, and adding or removing one shifts everything after it. Those shifts are consequences, not separate intentions, and must not be reported as such. Measure ordering only among the nodes that stayed in place.
3. **Classify the diff.** Additions, removals, tier reclassification, reordering, connection changes, reroutes, new branches, and orphaned nodes.
4. **Rank readings by how well the canvas supports them.** A tier change or a step inserted between two connected steps is well determined. A removal that strands neighbours, an unconnected new node, or a branch without a condition is not.
5. **Name the evidence for each reading.** Every statement carries the specific structural facts that produced it, so a wrong reading can be inspected and corrected rather than argued with.
6. **State what the canvas cannot answer.** A removal cannot distinguish deletion from absorption. A branch cannot express its condition. Report these as open questions beside the reading — never resolve them by guessing.
7. **Hand off a packet, not a change.** The output records readings, evidence, open questions, and the change each would imply, with status `needs_clarification` whenever any question is open.

## Boundaries

- Read-only against live content. The prototype never writes a Persona, Skill, Tool, Playbook, or workflow record.
- A reading is a hypothesis about intent, not a decision. The person who made the gesture decides.
- Confidence describes how well the structural change determines the reading. It is not a claim that the change is a good idea.
- Inference is deterministic and rule-based so that every reading is inspectable. Do not present a reading as more certain than the gesture behind it.
- The canvas cannot express conditions, rationale, or the reason behind a move. Anything requiring those is an open question, not an inference.

## Promotion gate

Before this becomes live capability rather than a prototype:

1. Representative gestures produce readings a person recognizes as their actual intent.
2. Ambiguous gestures produce open questions instead of confident wrong answers.
3. Displacement never appears as intent.
4. A Decisions record captures the evidence and the chosen direction.
5. `change_mode` moves from `prototype` to a real mode and `reconciliation` from `skip` to `change-impact-reconciliation`, so that applying a reading runs the universal gate.

## Related

- [Layout Lab](../layout-lab/SKILL.md) — comparing interaction directions before commitment.
- [Change Impact Reconciliation](../change-impact-reconciliation/SKILL.md) — the gate this skill would invoke if promoted to a writing capability.
- [Playbook Composer](../playbook-composer/SKILL.md) — the likely downstream consumer of an accepted intent packet.
