const { test, expect } = require('@playwright/test');
const { login, uniqueTitle } = require('./helpers');

test.describe('task management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('adding a task shows it in the list', async ({ page }) => {
    const title = uniqueTitle('Add test');

    await page.getByTestId('new-task-input').fill(title);
    await page.getByTestId('add-task-button').click();

    const task = page.getByTestId('task-item').filter({ hasText: title });
    await expect(task).toBeVisible();

    // Cleanup: delete what this test created so later tests (and reruns)
    // never inherit state from this one.
    await task.getByTestId('task-delete-button').click();
    await expect(task).toHaveCount(0);
  });

  test('completing a task updates the stats panel', async ({ page }) => {
    const title = uniqueTitle('Complete test');

    await page.getByTestId('new-task-input').fill(title);
    await page.getByTestId('add-task-button').click();
    const task = page.getByTestId('task-item').filter({ hasText: title });

    // Read the baseline before acting, then assert the relative change -
    // never a hardcoded absolute number, since other data may already exist.
    const beforeText = await page.getByTestId('stats-completed').textContent();
    const beforeCount = parseInt(beforeText, 10);

    const checkbox = task.getByTestId('task-checkbox');
    await checkbox.click();
    await expect(checkbox).toBeChecked();

    await expect
      .poll(async () => {
        const text = await page.getByTestId('stats-completed').textContent();
        return parseInt(text, 10);
      }, { message: "stats-completed should reflect at least this task's completion" })
      .toBeGreaterThanOrEqual(beforeCount + 1);

    await task.getByTestId('task-delete-button').click();
  });

  test('deleting a task removes it from the list', async ({ page }) => {
    const title = uniqueTitle('Delete test');

    await page.getByTestId('new-task-input').fill(title);
    await page.getByTestId('add-task-button').click();
    const task = page.getByTestId('task-item').filter({ hasText: title });
    await expect(task).toBeVisible();

    await task.getByTestId('task-delete-button').click();
    await expect(task).toHaveCount(0);
  });

  test('filtering by active hides completed tasks', async ({ page }) => {
    const activeTitle = uniqueTitle('Stays active');
    const completedTitle = uniqueTitle('Gets completed');

    await page.getByTestId('new-task-input').fill(activeTitle);
    await page.getByTestId('add-task-button').click();
    await expect(page.getByTestId('task-item').filter({ hasText: activeTitle })).toBeVisible();

    await page.getByTestId('new-task-input').fill(completedTitle);
    await page.getByTestId('add-task-button').click();
    await expect(page.getByTestId('task-item').filter({ hasText: completedTitle })).toBeVisible();

    const completedTask = page.getByTestId('task-item').filter({ hasText: completedTitle });
    const completedCheckbox = completedTask.getByTestId('task-checkbox');
    await completedCheckbox.click();
    await expect(completedCheckbox).toBeChecked();

    await page.getByTestId('filter-active').click();

    await expect(page.getByTestId('task-item').filter({ hasText: activeTitle })).toBeVisible();
    await expect(page.getByTestId('task-item').filter({ hasText: completedTitle })).toHaveCount(0);

    // Cleanup: switch back to "all" so both tasks are visible to delete.
    await page.getByTestId('filter-all').click();
    await page
      .getByTestId('task-item')
      .filter({ hasText: activeTitle })
      .getByTestId('task-delete-button')
      .click();
    await page
      .getByTestId('task-item')
      .filter({ hasText: completedTitle })
      .getByTestId('task-delete-button')
      .click();
  });

    test('editing a task updates its title', async ({ page }) => {
    const originalTitle = uniqueTitle('Edit test original');
    const newTitle = uniqueTitle('Edit test updated');

    await page.getByTestId('new-task-input').fill(originalTitle);
    await page.getByTestId('add-task-button').click();

    const task = page.getByTestId('task-item').filter({ hasText: originalTitle });
    await task.getByTestId('task-edit-button').click();

    // Once editing starts, the title text is replaced by an input, so the
    // old `task` locator (filtered on the now-gone title text) can no
    // longer be trusted to resolve - locate the edit input directly on the
    // page instead of chaining off it.
    await page.getByTestId('task-edit-input').fill(newTitle);
    await page.getByTestId('task-save-button').click();

    const updatedTask = page.getByTestId('task-item').filter({ hasText: newTitle });
    await expect(updatedTask).toBeVisible();
    await expect(page.getByTestId('task-item').filter({ hasText: originalTitle })).toHaveCount(0);

    await updatedTask.getByTestId('task-delete-button').click();
  });

  test('canceling an edit keeps the original title', async ({ page }) => {
    const originalTitle = uniqueTitle('Cancel edit test');

    await page.getByTestId('new-task-input').fill(originalTitle);
    await page.getByTestId('add-task-button').click();

    const task = page.getByTestId('task-item').filter({ hasText: originalTitle });
    await task.getByTestId('task-edit-button').click();

    await page.getByTestId('task-edit-input').fill('Something I will not save');
    await page.getByTestId('task-cancel-button').click();

    const unchangedTask = page.getByTestId('task-item').filter({ hasText: originalTitle });
    await expect(unchangedTask).toBeVisible();

    await unchangedTask.getByTestId('task-delete-button').click();
  });
});
