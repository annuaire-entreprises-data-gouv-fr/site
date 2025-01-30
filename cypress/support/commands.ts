// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
import { comptesAgents } from '#cypress/fixtures/comptes-agents';
import { IAgentScope } from '#models/user/agent-scopes/parse';
import { ISession } from '#models/user/session';
import { sessionOptions } from '#utils/session';
import { sealData } from 'iron-session';

declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string): Chainable<void>;
    }
  }
}

const generateSessionCookie = async (inputEmail?: string) => {
  const email = inputEmail || 'user@yopmail.com';
  const user = comptesAgents.find((agent) => agent.email === email);

  if (!user) {
    throw new Error(`User ${email} not found in comptesAgents`);
  }

  const session: ISession = {
    user: {
      idpId: '123456789',
      userId: '123456789',
      domain: 'yopmail.com',
      siret: '12345678912345',
      isMCP: false,
      isPrestataire: false,
      familyName: 'John Doe',
      firstName: 'John Doe',
      fullName: 'John Doe',
      email: user.email,
      scopes: user.scopes.split(' ') as IAgentScope[],
      userType: 'Super-agent connecté',
      hasHabilitation: true,
    },
  };

  return sealData(session, {
    password:
      Cypress.env('IRON_SESSION_PWD') || 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  });
};

Cypress.Commands.add('login', (email?: string) => {
  cy.then(() => {
    return generateSessionCookie(email);
  }).then((validSessionCookie) => {
    cy.setCookie(sessionOptions.cookieName, validSessionCookie);
  });
});
