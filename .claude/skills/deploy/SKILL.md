---
name: deploy
description: Deploy the app to staging - run all tests, build the production bundle, then push the current commit to the `staging` branch on origin. Use when the user asks to deploy, ship to staging, or runs /deploy.
disable-model-invocation: true
---

# Deploy to staging

Run these steps in order. **Stop at the first failure**, show the user the relevant output, and do not continue to later steps. Never skip a step or bypass hooks (`--no-verify`) to get a deploy through.

## 1. Pre-flight

- Run `git status --porcelain`. If there are uncommitted changes, stop and ask the user whether to commit them first. Staging must get exactly what is committed, so never deploy a dirty tree.
- Note the current branch and commit (`git rev-parse --abbrev-ref HEAD`, `git log -1 --oneline`) for the final report.

## 2. Run all tests

- If `package.json` has a `test` script, run `npm test` (non-interactive, e.g. `npm test -- --run` for Vitest if it would otherwise start watch mode).
- Always run `npm run lint` as well. Lint errors fail the deploy.
- This project currently has no test framework. If there is no `test` script, say so explicitly in the report ("no tests configured, lint only") rather than implying tests passed.

## 3. Build the production bundle

- Run `npm run build`. Any error fails the deploy.
- A chunk-size warning is not a failure, but mention it in the report.

## 4. Push to staging

- Fetch first: `git fetch origin`.
- Push the current commit to the `staging` branch: `git push origin HEAD:staging`. This creates the branch on origin if it doesn't exist.
- If the push is rejected as non-fast-forward, **do not force-push**. Stop and tell the user that `origin/staging` has commits not in the current branch, and let them decide (merge, rebase, or explicitly approve a force push).
- `dist/` is gitignored and is not pushed. The staging host is expected to build from the `staging` branch.

## 5. Report

Give a short summary:
- Commit deployed (hash + message) and source branch
- Tests: passed / no tests configured; lint result
- Build: success, plus any warnings
- Push: `origin/staging` updated (old → new hash, from the push output)
