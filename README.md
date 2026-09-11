# Task Tracker

A deliberately small full-stack app (Spring Boot + MySQL + React) built as a target
for practicing test automation with Playwright, Cypress, and Selenium. It exists to give those tools something realistic to exercise:
a login screen, CRUD operations, filtering, and data to verify independently
via SQL.

## Stack

- **Backend:** Spring Boot 3.3 (Java 21), Spring Data JPA, MySQL
- **Frontend:** React 18 + Vite

## Prerequisites

- Java 21+ and Maven
- Node 18+ and npm
- A running MySQL server (8.x recommended)
- Google Chrome installed (needed for the Selenium suite - Playwright and
  Cypress each install their own browser binaries separately)

## 1. Database setup

No manual database creation step is required. Just make sure a MySQL server is running locally first.

If you'd rather create the database explicitly yourself, or the automatic
creation fails because your MySQL user lacks permission to create
databases, connect with `mysql -u root -p` in a terminal and run:

```sql
CREATE DATABASE IF NOT EXISTS task_tracker;
```

That's the only manual step. The app creates the `task` table itself on
startup (`spring.jpa.hibernate.ddl-auto=update`) and seeds it with 3 sample
rows via `backend/src/main/resources/data.sql`.

By default the app connects as `root` / `password`. Edit
`backend/src/main/resources/application.properties` if your local MySQL uses
different credentials.

## 2. Run the backend

```bash
cd backend
mvn spring-boot:run
```


## 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Starts on **http://localhost:5173**

## Login

The login screen uses hardcoded credentials (there's no real auth/session
behind it which was intentional, since the login screen exists to be tested, not to
secure anything):

- Username: `tester`
- Password: `TestPass123`

## Test suites

Three end-to-end test suites live alongside this app, each exercising the
same core scenarios (login, task CRUD, filtering, editing) in a different
tool, plus one API-level test per suite that hits the backend directly:

| Suite      | Language/tooling  | Folder                                |
|------------|-------------------|---------------------------------------|
| Playwright | JavaScript        | [`playwright/`](playwright/README.md) |
| Cypress    | JavaScript        | [`cypress/`](cypress/README.md)       |
| Selenium   | Java + JUnit 5    | [`selenium/`](selenium/README.md)     |

Each folder's own README has full setup and run instructions, plus notes on
how that tool's approach differs from the other two (auto-waiting, locator
style, Page Object Model, and so on). Both the backend and frontend need to
be running first for any of them.

## API reference

| Method | Path               | Body                        | Notes                                 |
|--------|--------------------|-----------------------------|---------------------------------------|
| POST   | `/api/login`       | `{ username, password }`    | 200 + token, or 401                   |
| GET    | `/api/tasks`       | N/A                         | optional `?status=active\|completed`  |
| GET    | `/api/tasks/stats` | N/A                         | `{ total, active, completed }`        |
| POST   | `/api/tasks`       | `{ title }`                 | 201 + created task                    |
| PUT    | `/api/tasks/{id}`  | `{ completed }`             | toggles complete                      |
| DELETE | `/api/tasks/{id}`  | N/A                         | 204                                   |

## data-testid reference (for writing selectors for tests)

| Element                                       | `data-testid`                                                      |
|-----------------------------------------------|--------------------------------------------------------------------|
| Login form                                    | `login-form`                                                       |
| Username field                                | `username-input`                                                   |
| Password field                                | `password-input`                                                   |
| Login submit button                           | `login-button`                                                     |
| Login error message                           | `login-error`                                                      |
| New task input                                | `new-task-input`                                                   |
| Add task button                               | `add-task-button`                                                  |
| Filter: all / active / completed              | `filter-all` / `filter-active` / `filter-completed`                |
| Task list container                           | `task-list`                                                        |
| Each task row                                 | `task-item` (also has `data-task-id`)                              |
| Task checkbox                                 | `task-checkbox`                                                    |
| Task title text                               | `task-title`                                                       |
| Task title edit input (shown while editing)   | `task-edit-input`                                                  |
| Edit button                                   | `task-edit-button`                                                 |
| Save edit button                              | `task-save-button`                                                 |
| Cancel edit button                            | `task-cancel-button`                                               |
| Task delete button                            | `task-delete-button`                                               |
| Stats panel                                   | `stats-panel` (`stats-total` / `stats-active` / `stats-completed`) |