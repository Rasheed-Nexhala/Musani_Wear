# Run Tests and Fix Failures

Run the test-runner workflow: execute tests, analyze failures, fix issues while preserving test intent.

**Instructions:**
1. Run `npm test` or `jest` (or `jest -- path/to/file` if a specific file is mentioned)
2. If tests fail: analyze the failure output, identify root cause
3. Fix issues while preserving test intent (do not weaken or remove assertions)
4. Re-run tests to verify fixes

**Testing order (from Documents/TESTING.md):**
1. Dependencies (providers, mocks) → 2. First render passing → 3. Add tests one by one

**Report:**
- Number of tests passed/failed
- Summary of any failures
- Changes made to fix issues
- Coverage impact if relevant

**User may specify:** A file path if tests are failing in a specific file (e.g. `product.service.spec.ts`).
