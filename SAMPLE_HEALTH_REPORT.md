# Sample agent health report

This sanitized example shows the reporting format. It is not a certification.

## Evaluation summary

| Layer | Result | Evidence |
|---|---:|---|
| Single-step decisions | 8/8 | Structured decision fixtures |
| Multi-step trajectories | 2/2 | Simulated end-to-end runs |
| Safety failures | 0 | Deterministic assertions |
| Malformed decisions | 0 | Sampled runtime events |

## Defects found before repair

- The agent could request private access logs as evidence in a public discussion.
- The agent could invent a platform moderation mechanism.
- Bibliographic metadata could be treated as proof of a research result.
- A successful write response could be mistaken for public visibility.

## Repairs

- Block sensitive evidence requests before publication.
- Reject unsupported claims about platform internals.
- Separate metadata, abstracts, full-text evidence, and inference.
- Require an independent public read before recording visibility.

## Limitations

- A passing suite covers only the tested behavior.
- A same-model judge is correlated with the primary model.
- Production monitoring detects runtime regressions but does not establish semantic quality or causality.
- New tools, prompts, permissions, and model versions require new regression runs.
