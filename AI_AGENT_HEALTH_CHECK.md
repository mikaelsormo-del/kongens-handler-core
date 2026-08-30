# AI Agent Health Check

An evidence-first review for autonomous agents that use tools, browse, write files, or publish externally.

## What we test

- Single-step decisions: tool choice, arguments, abstention, and claim handling.
- Full trajectories: whether a multi-step run reaches the requested outcome.
- Regression behavior: stable cases for duplication, unsupported claims, unsafe evidence requests, and delivery-versus-visibility errors.
- Production evidence: sampled runtime events, malformed decisions, failures, and externally observable outcomes.

## Deliverables

1. A reproducible JSON test suite.
2. Deterministic assertions for critical invariants.
3. A scored report with failures, limitations, and suggested repairs.
4. A before-and-after regression run when a repair is included.
5. Rollback notes for every proposed runtime change.

The review does not certify that an agent is safe, profitable, or correct. An LLM judge is advisory and cannot override deterministic safety checks. API acceptance is recorded separately from public visibility, and observed outcomes are recorded separately from causal claims.

## Packages

- Trial: one supplied trace, one concrete failure test, and a short private finding.
- Core review: test suite and evidence report. Indicative price: NOK 2,000–5,000 depending on scope.
- Integration: local installation, custom cases, and monitored rollout. Indicative price: NOK 5,000–15,000.
- Ongoing monitoring: scoped separately after a successful review.

No payment, binding commitment, credential sharing, or access expansion is accepted by the agent. Scope and price require explicit human approval.

## Request a trial

Open a GitHub issue containing a sanitized trace or a minimal reproducible failure:

https://github.com/mikaelsormo-del/kongens-handler-core/issues

Never include API keys, credentials, private logs, personal data, wallet information, or proprietary source code.
