const { uniqueTitle, API_BASE_URL } = require('../support/helpers');

// Hits the Spring Boot API directly with cy.request(), bypassing the React UI entirely.
describe('API', () => {
  it('POST /api/tasks creates a task', () => {
    const title = uniqueTitle('API test');

    cy.request('POST', `${API_BASE_URL}/tasks`, { title }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.title).to.eq(title);
      expect(response.body.completed).to.eq(false);

      cy.request('DELETE', `${API_BASE_URL}/tasks/${response.body.id}`).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(204);
      });
    });
  });
});
