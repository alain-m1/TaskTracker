const API_BASE_URL = 'http://localhost:8080/api';

// Matches the hardcoded credentials in AuthService.java
const VALID_USERNAME = 'tester';
const VALID_PASSWORD = 'TestPass123';

// Logs in and waits for the task list to be ready, so every test that needs
// an authenticated session can just call this instead of repeating the steps.
async function login(page) {
  await page.goto('/');
  await page.getByTestId('username-input').fill(VALID_USERNAME);
  await page.getByTestId('password-input').fill(VALID_PASSWORD);
  await page.getByTestId('login-button').click();
  await page.getByTestId('task-list').waitFor();
}

// Gives every test its own uniquely-titled task (timestamp + random suffix)
// so tests never collide with each other or with leftover data, and can run
// in any order or in parallel safely.
function uniqueTitle(label) {
  return `${label} ${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

module.exports = { API_BASE_URL, VALID_USERNAME, VALID_PASSWORD, login, uniqueTitle };
