const { uniqueTitle } = require('../support/helpers');

describe('task management', () => {
  beforeEach(() => {
    cy.login();
  });

  it('adding a task shows it in the list', () => {
    const title = uniqueTitle('Add test');

    cy.getByTestId('new-task-input').type(title);
    cy.getByTestId('add-task-button').click();
    cy.contains('[data-testid="task-item"]', title).should('be.visible');

    // Delete what this test created so later tests (and reruns) never inherit state from this one.
    cy.contains('[data-testid="task-item"]', title)
      .find('[data-testid="task-delete-button"]')
      .click();
    cy.contains('[data-testid="task-item"]', title).should('not.exist');
  });

  it('completing a task updates the stats panel', () => {
    const title = uniqueTitle('Complete test');

    cy.getByTestId('new-task-input').type(title);
    cy.getByTestId('add-task-button').click();
    cy.contains('[data-testid="task-item"]', title).should('be.visible');

    // Read the baseline before acting, then assert the relative change.
    cy.getByTestId('stats-completed')
      .invoke('text')
      .then((beforeText) => {
        const beforeCount = parseInt(beforeText, 10);

        cy.contains('[data-testid="task-item"]', title)
          .find('[data-testid="task-checkbox"]')
          .click()
          .should('be.checked');

        cy.getByTestId('stats-completed').should('have.text', `${beforeCount + 1} completed`);
      });

    cy.contains('[data-testid="task-item"]', title)
      .find('[data-testid="task-delete-button"]')
      .click();
  });

  it('deleting a task removes it from the list', () => {
    const title = uniqueTitle('Delete test');

    cy.getByTestId('new-task-input').type(title);
    cy.getByTestId('add-task-button').click();
    cy.contains('[data-testid="task-item"]', title).should('be.visible');

    cy.contains('[data-testid="task-item"]', title)
      .find('[data-testid="task-delete-button"]')
      .click();
    cy.contains('[data-testid="task-item"]', title).should('not.exist');
  });

  it('filtering by active hides completed tasks', () => {
    const activeTitle = uniqueTitle('Stays active');
    const completedTitle = uniqueTitle('Gets completed');

    // Wait for each add to actually land before starting the next one.
    cy.getByTestId('new-task-input').type(activeTitle);
    cy.getByTestId('add-task-button').click();
    cy.contains('[data-testid="task-item"]', activeTitle).should('be.visible');

    cy.getByTestId('new-task-input').type(completedTitle);
    cy.getByTestId('add-task-button').click();
    cy.contains('[data-testid="task-item"]', completedTitle).should('be.visible');

    cy.contains('[data-testid="task-item"]', completedTitle)
      .find('[data-testid="task-checkbox"]')
      .click()
      .should('be.checked');

    cy.getByTestId('filter-active').click();

    cy.contains('[data-testid="task-item"]', activeTitle).should('be.visible');
    cy.contains('[data-testid="task-item"]', completedTitle).should('not.exist');

    // Switch back to "all" so both tasks are visible to delete.
    cy.getByTestId('filter-all').click();
    cy.contains('[data-testid="task-item"]', activeTitle)
      .find('[data-testid="task-delete-button"]')
      .click();
    cy.contains('[data-testid="task-item"]', completedTitle)
      .find('[data-testid="task-delete-button"]')
      .click();
  });

  it('editing a task updates its title', () => {
    const originalTitle = uniqueTitle('Edit test original');
    const newTitle = uniqueTitle('Edit test updated');

    cy.getByTestId('new-task-input').type(originalTitle);
    cy.getByTestId('add-task-button').click();
    cy.contains('[data-testid="task-item"]', originalTitle).should('be.visible');

    cy.contains('[data-testid="task-item"]', originalTitle)
      .find('[data-testid="task-edit-button"]')
      .click();

    cy.getByTestId('task-edit-input').clear().type(newTitle);
    cy.getByTestId('task-save-button').click();

    cy.contains('[data-testid="task-item"]', newTitle).should('be.visible');
    cy.contains('[data-testid="task-item"]', originalTitle).should('not.exist');

    cy.contains('[data-testid="task-item"]', newTitle)
      .find('[data-testid="task-delete-button"]')
      .click();
  });

  it('canceling an edit keeps the original title', () => {
    const originalTitle = uniqueTitle('Cancel edit test');

    cy.getByTestId('new-task-input').type(originalTitle);
    cy.getByTestId('add-task-button').click();
    cy.contains('[data-testid="task-item"]', originalTitle).should('be.visible');

    cy.contains('[data-testid="task-item"]', originalTitle)
      .find('[data-testid="task-edit-button"]')
      .click();

    cy.getByTestId('task-edit-input').clear().type('Something I will not save');
    cy.getByTestId('task-cancel-button').click();

    cy.contains('[data-testid="task-item"]', originalTitle).should('be.visible');

    cy.contains('[data-testid="task-item"]', originalTitle)
      .find('[data-testid="task-delete-button"]')
      .click();
  });
});
