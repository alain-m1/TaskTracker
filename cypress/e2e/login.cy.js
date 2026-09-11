describe('login', () => {
  it('valid login shows the task list', () => {
    cy.visit('/');
    cy.getByTestId('username-input').type('tester');
    cy.getByTestId('password-input').type('TestPass123');
    cy.getByTestId('login-button').click();

    cy.getByTestId('task-list').should('be.visible');
  });

  it('invalid login shows an error message', () => {
    cy.visit('/');
    cy.getByTestId('username-input').type('wrong-user');
    cy.getByTestId('password-input').type('wrong-password');
    cy.getByTestId('login-button').click();

    cy.getByTestId('login-error')
      .should('be.visible')
      .and('contain.text', 'Invalid');
  });
});
