# Project Explanation: devops-project

This document provides a detailed explanation of the architecture, workflow, design decisions, and challenges encountered during the development of this project, explicitly fulfilling the evaluation criteria.

## 1. Architecture

The application is structured as a modern Monorepo containing a **React Frontend** and an **Express Backend (Node.js)**.

- **Frontend (`client/`)**: 
  - Built with React + Vite (`npm create vite@latest`).
  - Implements reusable functional components like `StatusCard`.
  - Ensures a clean, modern, responsive UI using vanilla CSS (`index.css`) with CSS variables and flexbox layouts.
- **Backend (`server/`)**: 
  - An Express.js REST API providing a primary `/api/health` endpoint.
  - Serves as the system integration point, dynamically rendering real-time statuses sent to the frontend.
- **E2E Testing (`e2e/`)**:
  - Contains Playwright scripts to boot up both servers and simulate real user flows dynamically from a blank page to data population.

## 2. Playbook Workflow (CI/CD)

The workflow consists of highly automated GitHub Actions pipelines located in `.github/workflows/`:
1. **CI Pipeline (`ci.yml`)**: 
   - Triggers on `push` and `pull_request` to the `main` branch.
   - It performs strict PR checks: installing dependencies, running `eslint`, executing `prettier --check` to ensure properly formatted code, and triggering unit tests via `jest`/`vitest`.
2. **Integration & E2E**: 
   - Uses `integration.yml` to test multiple Node environments to assure backward compatibility.
   - `e2e.yml` runs full-stack tests strictly verifying End-to-End correctness bridging the frontend and backend using Playwright.
3. **Continuous Deployment (`deploy.yml`)**: 
   - Executes via AWS EC2 SSH connections automatically syncing code to production on `push`. 
   - Leverages **Idempotent Bash scripting** (checking for `.git` presence, PM2 initialization handling using conditional execution) to deploy application updates smoothly without any manual intervention.

## 3. Design Decisions

- **Idempotency**: All execution scripts (like `/scripts/setup.sh`) and deployment processes use `mkdir -p`, variable existence checking, and logical conditionally-bound triggers (`! -d .git`). This ensures running the command safely a hundred times yields the exact same state without crashing.
- **Testing Layers**: We implemented 3 full layers of testing to guarantee system reliability:
  1. *Unit*: Function-level logical assertions (`vitest` / `jest`).
  2. *Integration*: Real HTTP verification tests (`supertest`) asserting the backend API works as intended natively.
  3. *E2E*: Visual and holistic sanity check simulating an unmocked DOM user-flow bridging Frontend + Backend utilizing Playwright.
- **Prettier over Manual Formatting**: An unformatted, messy codebase degrades readability fast. By pairing ESLint with Prettier and enforcing it directly in the CI pipeline (`--check`), it forces any PR developer to format their code uniformly before merging.

## 4. Challenges Faced

1. **Idempotency in Deployment Environments**:
   - *Challenge*: The `deploy.yml` CI run initially failed randomly on pushes because `git clone` or `pm2 start` would throw errors pointing to existing entities on the AWS EC2 instance.
   - *Resolution*: Replaced raw `git clone` with a conditional git update logic wrapper referencing local states (`if [ ! -d .git ]`), allowing smooth multi-deploy patches automatically resolving into zero-downtime updates via `pm2 reload`.

---
*Created for the Devops Evaluation.*
