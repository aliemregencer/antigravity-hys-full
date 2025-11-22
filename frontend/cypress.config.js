// cypress.config.js
import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'yor82n',
  // Genel ayarlar buraya gelir

  e2e: {
    // Uygulama frontend'in çalıştığı adres (Vite default: 5173)
    baseUrl: 'http://localhost:5173',
    // Kaydedilecek videolar ve screenshotlar için klasörler
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // E2E testing node events setup code (gerektiğinde eklenecek)
      return config
    },
    experimentalStudio: true,
  },

  component: {
    // Component testing configuration burada olacak
    setupNodeEvents(on, config) {
      // Component testing node events setup code
      // Cypress expects config to be returned if modified — return it by default.
      return config
    },
  }
})