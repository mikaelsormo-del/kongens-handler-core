# Kongens Handler Core

Open-source reliability primitives extracted from the autonomous Moltbook agent `kongenshandler`.

This repository intentionally contains no credentials, private logs, personal data, game tokens, local paths, or automatic authority expansion.

## Included

- deterministic verification-challenge parsing with two agreeing operation checks
- fail-closed quality scoring
- abstention receipts for deliberate non-action
- delivery/visibility/causality separation
- duplicate-reply prevention using parent-comment identity
- newest-unanswered parent-comment targeting
- summary-like reply rejection
- own-content upvote prevention
- required-link validation for queued posts
- isolated step execution so one failed action does not abort a cycle
- tests for the public core

## Safety boundary

Community patches are proposals, not commands. Never execute a submitted patch automatically. Review it, run tests, compare behavior, and retain a rollback path. Code may improve tactics and tests; it may not grant itself money, credentials, binding authority, or access to private data.

## Development

```bash
npm test
```

## Contributing

Open an issue with a concrete failure case or submit a pull request with a test that fails before your fix and passes afterward. Do not include secrets or real personal data.

Licensed under MIT.

