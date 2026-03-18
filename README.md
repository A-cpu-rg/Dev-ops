# Devops

A full-stack web application demonstrating modern DevOps practices: CI/CD pipelines, automated testing, dependency management, and cloud deployment.

## 📋 Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [CI/CD Workflows](#cicd-workflows)
- [Deployment](#deployment)
- [Design Decisions](#design-decisions)
- [Challenges](#challenges)
- [License](#license)

---

## Architecture

```
┌─────────────────────────────────────────────┐
│               GitHub Repository             │
│                                             │
│  ┌─────────┐        ┌──────────────────┐    │
│  │ client/ │        │    server/       │    │
│  │ (React) │◄──────►│  (Express API)   │    │
│  └─────────┘  HTTP  └──────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │       .github/workflows/            │    │
│  │  ci.yml  integration.yml  e2e.yml   │    │
│  │  deploy.yml                         │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
          │                    │
     (Render CDN)         (EC2 / Render)
     frontend              backend
```

### Components

| Component | Technology | Responsibility |
|-----------|-----------|---------------|
| **Frontend** | React 18 + Vite | UI, user interaction, API calls |
| **Backend** | Node.js + Express | REST API, business logic |
| **CI/CD** | GitHub Actions | Lint, test, build, deploy |
| **E2E** | Playwright | Full user-flow simulation |
| **Deployment** | Render / AWS EC2 | Hosting the production app |

---

## 🛠 Tech Stack

### Frontend
- **React 18** — component-based UI library
- **Vite** — fast build tool and dev server with HMR
- **Vitest + React Testing Library** — unit and component tests
- **Playwright** — end-to-end tests
- **ESLint** — static analysis; **Prettier** — code formatting

### Backend
- **Node.js + Express** — REST API server
- **CORS** — cross-origin request support
- **dotenv** — environment variable management
- **Jest + Supertest** — unit and integration tests
- **ESLint** — static analysis

### DevOps
- **GitHub Actions** — automated pipelines (CI, integration, E2E, deploy)
- **Dependabot** — automated dependency update PRs
- **Render** — PaaS hosting (zero-config deploys)
- **AWS EC2** — IaaS target for SSH-based deployment
- **PM2** — Node.js process manager on EC2

---

## 📁 Project Structure

```
Dev-ops/
├── .github/
│   ├── dependabot.yml          # Automated dependency update config
│   └── workflows/
│       ├── ci.yml              # Lint + test + build on every push/PR
│       ├── integration.yml     # Multi-version integration tests
│       ├── e2e.yml             # Playwright end-to-end tests
│       └── deploy.yml          # SSH-based EC2 deployment
├── client/                     # React frontend
│   ├── src/
│   │   ├── App.jsx             # Root component (health status display)
│   │   ├── App.test.jsx        # Vitest component tests
│   │   ├── main.jsx            # ReactDOM entry point
│   │   ├── index.css           # Global styles
│   │   └── setupTests.js       # @testing-library/jest-dom setup
│   ├── index.html
│   ├── vite.config.js          # Vite + Vitest configuration
│   └── package.json
├── server/                     # Express backend
│   ├── src/
│   │   ├── app.js              # Express app (routes, middleware)
│   │   └── index.js            # Server entry point (port, dotenv)
│   ├── tests/
│   │   ├── app.test.js         # Unit tests for API endpoints
│   │   └── integration.test.js # HTTP integration tests
│   ├── eslint.config.mjs
│   └── package.json
├── e2e/                        # Playwright E2E tests
│   ├── tests/
│   │   └── app.spec.js         # Full user-flow scenarios
│   ├── playwright.config.js
│   └── package.json
├── scripts/
│   └── setup.sh                # Idempotent local setup script
├── .prettierrc                 # Shared Prettier config
├── render.yaml                 # Render.com deployment spec
└── README.md
```

---

## Installation

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Quick Start (idempotent)

```bash
bash scripts/setup.sh
```

The script is **idempotent**: you can run it as many times as you like — it skips steps that are already done (e.g., it won't overwrite existing `.env` files).

### Manual Setup

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..

# Install server dependencies
cd server && npm install && cd ..
```

---

## Running the Application

```bash
# Start backend (port 5001)
cd server && npm run dev

# Start frontend (port 5173, proxies /api → backend)
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Testing

### Unit Tests

```bash
# Backend unit tests (Jest)
cd server && npm test

# Frontend component tests (Vitest)
cd client && npm test
```

### Integration Tests

The backend integration tests (`server/tests/integration.test.js`) verify:
- HTTP status codes for all endpoints
- JSON response structure and content-type headers
- CORS headers are present
- 404 handling for unknown routes

```bash
cd server && npm test
```

### End-to-End Tests (Playwright)

E2E tests simulate real user interactions across the full stack:
- Page renders with expected headings
- Backend health data loads and displays
- Direct API assertions via Playwright's `request` fixture

```bash
cd e2e
npm install
npx playwright install chromium
npm test
```

### Linting

```bash
# Frontend
cd client && npm run lint

# Backend
cd server && npm run lint
```

---

## CI/CD Workflows

| Workflow | Trigger | What it does |
|---------|---------|-------------|
| **CI Pipeline** (`ci.yml`) | push / PR to `main` | Lint → Test → Build (client & server) |
| **Integration** (`integration.yml`) | push / PR to `main` | Matrix test on Node 18, 20, 22 |
| **E2E Tests** (`e2e.yml`) | push / PR to `main` | Playwright browser tests |
| **Deploy to EC2** (`deploy.yml`) | push to `main` | SSH deploy, PM2 reload |

Every pull request must pass lint checks before it can be merged.

---

## Deployment

### Render (automatic)

Defined in `render.yaml`:
- **Backend** — Node.js web service, starts with `node src/index.js`
- **Frontend** — Static site, built with `vite build`

### AWS EC2 (via GitHub Actions)

Add the following repository secrets:

| Secret | Description |
|--------|-------------|
| `EC2_HOST` | Public IP or DNS of your EC2 instance |
| `EC2_USER` | SSH username (e.g. `ubuntu`, `ec2-user`) |
| `EC2_SSH_KEY` | Private SSH key (PEM format) |

The `deploy.yml` workflow SSH-es into the instance, pulls the latest code, installs dependencies, and performs a zero-downtime reload with PM2.

---

## Design Decisions

1. **Monorepo layout** — `client/` and `server/` in one repository to keep CI simple and changes atomic.
2. **Vite over CRA** — faster HMR, native ESM, and built-in Vitest integration.
3. **Supertest for API tests** — mounts Express in-process; no listening port needed, making tests fast and deterministic.
4. **Playwright for E2E** — cross-browser, API-testing built-in, and first-class CI support.
5. **Idempotent scripts** — `scripts/setup.sh` uses guards (`[ ! -f ]`, `mkdir -p`) so re-running never corrupts state.
6. **Dependabot** — automated weekly PRs for npm and Actions updates reduce manual maintenance burden.
7. **PM2 on EC2** — process manager with automatic restart on crash and `pm2 save` for reboot persistence.

---

## Challenges

- **ESLint version mismatch** — client uses ESLint 8 (with `--ext` flag), server uses ESLint 10 flat config. Each directory therefore carries its own config.
- **Vitest watch mode in CI** — `vitest` defaults to watch mode; the CI workflow passes `-- --run` to force a single-run exit.
- **CORS in E2E** — Playwright's `request` fixture bypasses the browser, so CORS headers are not enforced there; browser tests cover the real CORS flow.

---

## License

[MIT](LICENSE)
