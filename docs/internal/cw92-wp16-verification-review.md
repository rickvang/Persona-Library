# CW-92 WP16 independent verification packet

Temporary review transport only — **DO NOT MERGE**. Canonical implementation is Notion **Verification & Evaluation**.

## Current package scope
CW-92 current package table:
- WP16: **Define explicit verification instead of named observers**
- dependencies: WP15, WP09
- exact audit rows: **A11, A25, A26**
- boundary: evidence, qualification/independence, pass/fail/blocked and repair targets; prose test case is not runtime or participant evidence.

Native audit: https://app.notion.com/p/3f3cd82535ff812b8601fed5c1facfb9

### A11
Compare actual results against an expected contract → Verification & Evaluation / Merge.
Missing observation remains unverified/blocked; remove named-observer dependency, not the gate.

### A25
Compare actual UI builds with intended behavior → Verification & Evaluation / Merge.
Inspect states, widths and input paths; screenshots alone cannot pass behavior QA.

### A26
Evaluate usability/accessibility with explicit conditions → Verification & Evaluation / Extract.
Separate automated checks, manual inspection and real participant evidence; do not simulate observations.

## Canonical owner
https://app.notion.com/p/3efcd82535ff810f91a4fe99d3ed4c15

Existing owner already compares execution against success criteria, returns passed/failed/blocked with checks/evidence/issues, prohibits missing tests silently counting as success, and requires independent fresh-session milestone verification.

New bounded section **UI behavior, usability, and accessibility evidence** adds:
- actual built behavior vs intended contract;
- representative states/transitions, viewport/reflow/zoom, keyboard/pointer/touch paths, semantic/accessibility behavior, actual implementation output;
- explicit evidence classes: automated check, manual inspection, real participant observation;
- those classes are complementary but not interchangeable;
- screenshots do not prove behavior; automated checks do not prove complete accessibility; manual inspection is not participant evidence; synthetic participant responses cannot be reported as observed evidence;
- missing required observation/conditions => unverified or blocked;
- qualification/independence comes from the verification gate/evidence, not Persona/role/activation identity.

## Pass criteria
PASS only if A11/A25/A26 are represented in the existing Verification owner without weakening gates, inventing participant evidence, creating a named-observer framework, or stealing Runtime/Policy/domain semantics. Confirm the text does not claim runtime/browser evidence that was not actually executed. Return no-major-issues or concrete findings. Review only; do not implement.
