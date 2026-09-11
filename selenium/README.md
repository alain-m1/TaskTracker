# Selenium suite

A smaller, deliberately different suite from the Playwright and Cypress
ones - four tests, in Java on top of JUnit 5, chosen to explore what's
actually different about Selenium rather than re-proving coverage the
other two suites already have:

- `LoginTest` - valid login (task list appears) and invalid login (error
  message appears).
- `TaskCrudTest` - add a task, then delete it. Written with an explicit
  `WebDriverWait` standing in for the auto-retrying assertions Playwright
  and Cypress give you for free.
- `TaskEditTest` - edit a task's title, including waiting for the title
  span to be swapped out for an input and back again.
- `ApiTest` - hits the Spring Boot API directly with Java's built-in
  `HttpClient`, no browser involved at all.

The tests themselves live under `pages/`-backed Page Objects
(`LoginPage`, `TaskListPage`) instead of calling `driver.findElement(...)`
directly (see "Notable differences" below).

## Setup

You'll need:

- JDK
- Maven
- Google Chrome installed. Selenium 4.6+ ships with **Selenium Manager**,
  which automatically downloads the matching ChromeDriver binary the first
  time you run the tests - no separate driver download or PATH setup
  needed, just an internet connection on first run.

```bash
cd selenium
mvn test
```

In IntelliJ: open the `selenium` folder as a Maven project (or open the
whole `task-tracker` folder - IntelliJ will detect `selenium/pom.xml` as
its own Maven module alongside `backend/pom.xml`), let it import, then
right-click any test class or method and choose **Run**. You can also
right-click the `selenium` module and choose **Run 'All Tests'** to run
everything at once.

## Running

Both the backend (`localhost:8080`) and frontend (`localhost:5173`) must
already be running first, same as the other two suites.

By default a real Chrome window will open and you'll see each test click
through the app. To run headless (no visible window - useful for a quick
full-suite run), uncomment the `--headless=new` line in
`support/BaseSeleniumTest.java`.

## Notable differences from the Playwright and Cypress suites

- **No auto-waiting.** Playwright's `expect(locator).toBeVisible()` and
  Cypress's `.should(...)` both retry automatically until they pass or
  time out. Selenium has nothing built in - every wait here
  (`waitForTaskWithTitle`, `waitForErrorMessage`, etc.) is an explicit
  `WebDriverWait` written by hand in the page objects. This is the exact
  class of bug the Playwright suite hit with the checkbox test earlier
  (asserting before the UI had actually updated) - Selenium just makes you
  confront that on every single interaction instead of only when something
  goes wrong.
- **Page Object Model.** `LoginPage` and `TaskListPage` wrap the raw
  `WebDriver`/`By` calls behind methods like `login(...)` and
  `addTask(...)`, so the test classes read like a script of user actions
  rather than a list of locators. Playwright and Cypress specs in this
  project put locators inline in the test file - fine at this size, but
  POM is the standard structure for any real-world Selenium codebase,
  specifically because Selenium has no equivalent of Cypress's custom
  commands or Playwright's fixtures to share that logic another way.
- **No built-in test runner or reporter.** Playwright and Cypress each
  ship their own runner, parallelization, and HTML report out of the box.
  Selenium is just a browser-automation library - JUnit 5 (via Maven's
  Surefire plugin) is what actually runs these tests and reports
  pass/fail. There's no equivalent of `npx playwright show-report` here.
