# Tool execution contract

Before a probe or action, record capability, goal, target, workspace, inputs, read/write mode, side effects, scope limit, approval, expected result, fallback, rollback or recovery path, and verification method.

Prefer read-only or sandboxed work. Treat publishing, merging, sending messages, changing access, using credentials, writing shared data, exposing sensitive data, or incurring material cost as side effects requiring explicit authorization. A Tool listed in documentation is not evidence of current runtime exposure.

If any material target, scope, permission, approval, or verification value is unknown, stop at a safe plan and report the gap. Do not try another Tool or workspace merely to bypass the boundary.
