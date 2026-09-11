const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'e2e/**/*.cy.js',
    supportFile: 'support/e2e.js',
  },
  fixturesFolder: false,
  videosFolder: 'videos',
  screenshotsFolder: 'screenshots',
  downloadsFolder: 'downloads',
});
