// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//

import "@testing-library/cypress/add-commands";

import { sealData } from "iron-session";
import { comptesAgents } from "#cypress/mocks/comptes-agents";
import type { IAgentScope } from "#models/authentication/agent/scopes/constants";
import type { ISession } from "#models/authentication/user/session";
import { sessionOptions } from "#utils/session";
import {
  DATA_ACCESS_REMINDER_MODAL_ID,
  INITIAL_WELCOME_MODAL_ID,
} from "../../components/welcome-modal-agent/constants";

const generateSessionCookie = async (inputEmail?: string) => {
  const email = inputEmail || "user@yopmail.com";
  const user = comptesAgents.find((agent) => agent.email === email);

  if (!user) {
    throw new Error(`User ${email} not found in comptesAgents`);
  }

  const session: ISession = {
    user: {
      idpId: "123456789",
      proConnectSub: "123456789",
      domain: "yopmail.com",
      siret: "12345678912345",
      familyName: "John Doe",
      firstName: "John Doe",
      fullName: "John Doe",
      email: user.email,
      scopes: user.scopes.split(" ") as IAgentScope[],
      groupsScopes: {},
      userType: "Super-agent connecté",
      isSuperAgent: true,
    },
  };

  return sealData(session, {
    password:
      Cypress.env("IRON_SESSION_PWD") || "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  });
};

Cypress.Commands.add("login" as never, (email?: string) => {
  cy.then(() => generateSessionCookie(email))
    .then((validSessionCookie) => {
      cy.setCookie(sessionOptions.cookieName, validSessionCookie);
    })
    .then(() => {
      window.localStorage.setItem(INITIAL_WELCOME_MODAL_ID, "true");
      cy.setCookie(DATA_ACCESS_REMINDER_MODAL_ID, "true");
    });
});
