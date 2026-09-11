const VALID_USERNAME = 'tester';
const VALID_PASSWORD = 'TestPass123';

// Custom command wrapping the attribute selector, so tests read cy.getByTestId('x') 
// instead of repeating cy.get('[data-testid="x"]') everywhere.
Cypress.Commands.add('getByTestId', (testId) => {
  return cy.get(`[data-testid="${testId}"]`);
});

// Logs in and waits for the task list to be ready, so every test that just needs 
// an authenticated session can call this instead of repeating the login steps.
Cypress.Commands.add('login', () => {
  cy.visit('/');
  cy.getByTestId('username-input').type(VALID_USERNAME);
  cy.getByTestId('password-input').type(VALID_PASSWORD);
  cy.getByTestId('login-button').click();
  cy.getByTestId('task-list').should('be.visible');
});
