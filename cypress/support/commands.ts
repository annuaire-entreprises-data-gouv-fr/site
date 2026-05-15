// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//

import "@testing-library/cypress/add-commands";

import {
  DATA_ACCESS_REMINDER_MODAL_ID,
  INITIAL_WELCOME_MODAL_ID,
} from "../../src/components/welcome-modal-agent/constants";

Cypress.Commands.add("login" as never, (email?: string) => {
  cy.request("POST", "/api/test/session", {
    email: email || "user@yopmail.com",
  }).then(() => {
    window.localStorage.setItem(INITIAL_WELCOME_MODAL_ID, "true");
    cy.setCookie(DATA_ACCESS_REMINDER_MODAL_ID, "true");
  });
});
