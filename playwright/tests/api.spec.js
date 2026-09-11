const { test, expect } = require('@playwright/test');
const { API_BASE_URL, uniqueTitle } = require('./helpers');

// Hits the Spring Boot API directly, bypassing the React UI entirely, testing the 
// multi-tiered architecture, not just the frontend.
test('POST /api/tasks creates a task', async ({ request }) => {
  const title = uniqueTitle('API test');

  const createResponse = await request.post(`${API_BASE_URL}/tasks`, {
    data: { title },
  });
  expect(createResponse.status()).toBe(201);

  const created = await createResponse.json();
  expect(created.title).toBe(title);
  expect(created.completed).toBe(false);

  const deleteResponse = await request.delete(`${API_BASE_URL}/tasks/${created.id}`);
  expect(deleteResponse.status()).toBe(204);
});
