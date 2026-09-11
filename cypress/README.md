# Cypress suite

The same scenarios as the Playwright suite, written in Cypress instead, so
the two can be compared directly: login (valid/invalid), task CRUD,
filtering, the edit/cancel-edit feature, and one API-level test against the
Spring Boot backend.

## Setup

```bash
cd cypress
npm install
```

## Running

Both the backend (`localhost:8080`) and frontend (`localhost:5173`) must
already be running first.

```bash
npx cypress open   # interactive mode to watch tests run step by step, time-travel through commands
npx cypress run    # headless, runs everything once, printing results to the terminal
```

## Notable differences from the Playwright suite

- No DB-verification test here (Playwright's `db-check.spec.js` already
  covers that pattern - no need to repeat it in a second tool).
- The "stats panel" test asserts an exact `+1` change rather than "at least
  +1". That's safe here because Cypress runs spec files sequentially in a
  single browser by default (no parallel workers locally), so nothing else
  is mutating the shared stats count mid-test the way concurrent Playwright
  workers could.
- Cypress has no built-in equivalent of Playwright's `getByTestId()`, so
  there's a small custom command for it in `support/commands.js`.
