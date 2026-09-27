# Cold-start activation footprint

Issue: #213
Measurement: authored text character counts; token-equivalent figures are **estimates** using characters ÷ 4, not measured runtime or subscription usage.

| Activation surface | Before | After |
| --- | ---: | ---: |
| `AGENTS.md` | 11,514 chars | 5,742 chars |
| `content/site-orientation.json` | 12,899 chars | 10,350 chars |
| `content/orientation/docs.json` | 12,283 chars | 12,113 chars |
| `persona-library-orientation/SKILL.md` | 7,906 chars | 2,861 chars |
| **Combined reference path** | **44,602 chars (~11,151 estimated token-equivalent)** | **31,066 chars (~7,767 estimated token-equivalent)** |

The combined text footprint is reduced by approximately **30.3%**. This is not a claim that every request loads all four surfaces or that actual model usage falls by the same percentage.

## Structural changes

- Root instructions are a dispatcher plus minimal safety/authorization boundaries and pointers to canonical policy owners.
- The semantic bootstrap keeps space/routing metadata, placement escalation metadata, Skill metadata requirements, and contract references; detailed universal process prose moved out of the bootstrap.
- The orientation Skill assumes root activation instead of rereading/re-explaining it.
- Route `first_reads` no longer instruct agents to reread `AGENTS.md` or `content/site-orientation.json`.
- Repository plumbing continues to bypass the semantic bootstrap unless the mixed-work escalation rule fires.

## Preserved boundaries

Authorization, Current Work / Work Order / Work Graph / Verification Queue responsibilities, volatile live-system authority, semantic reconciliation, placement escalation, operational-scenario routing, and repository validation remain owned and validated through the contracts named in `docs/policy-ownership.md`.
