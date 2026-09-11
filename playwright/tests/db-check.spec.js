const { test, expect } = require('@playwright/test');
const { login, uniqueTitle } = require('./helpers');
const { getConnection } = require('./db');

// Verifying via SQL: perform a UI action, then check the database directly and 
// independently, rather than trusting the UI's own claim that the change worked.
test('completing a task in the UI is reflected in MySQL', async ({ page }) => {
  await login(page);

  const title = uniqueTitle('DB check');
  await page.getByTestId('new-task-input').fill(title);
  await page.getByTestId('add-task-button').click();

  const task = page.getByTestId('task-item').filter({ hasText: title });
  const checkbox = task.getByTestId('task-checkbox');
  await checkbox.click();
  await expect(checkbox).toBeChecked();

  const connection = await getConnection();
  try {
    const [rows] = await connection.execute('SELECT completed FROM task WHERE title = ?', [title]);
    expect(rows).toHaveLength(1);
    expect(Boolean(rows[0].completed)).toBe(true);
  } finally {
    // Cleanup directly in the DB, since we're already connected.
    await connection.execute('DELETE FROM task WHERE title = ?', [title]);
    await connection.end();
  }
});
