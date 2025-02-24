/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): void
    }
  }
}

export {};

function login(email: string, password: string): void {
  cy.visit('/login')
  cy.get('[data-testid=email-input]').type(email)
  cy.get('[data-testid=password-input]').type(password)
  cy.get('[data-testid=login-button]').click()
}

Cypress.Commands.addAll({ login }) 