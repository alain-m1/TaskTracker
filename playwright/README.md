# Playwright suite

Covers login (valid/invalid), task CRUD, filtering, one API-level test
against the Spring Boot backend directly, and one test that verifies
completing a task in the UI is actually reflected in MySQL.

## Setup

```bash
cd playwright
npm install
npx playwright install
```

## Running

Both the backend (`localhost:8080`) and frontend (`localhost:5173`) must
already be running.

```bash
npx playwright test          # headless, runs once
npx playwright test --ui     # interactive UI mode, for learning/debugging
npx playwright show-report   # opens the HTML report from the last run
```

By default the app connects as root / password. Edit playwright/tests/db.js 
if your local MySQL uses different credentials, same as the backend.

## Test isolation

Every test that creates a task gives it a unique title (timestamp + random
suffix) and deletes it before finishing, rather than assuming a fixed
starting count. That means these tests can run in any
order, be re-run without a fresh database, or run in parallel without
interfering with each other or with the 3 seeded rows already in the table.
