// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
import { allAgentScopes } from '#models/user/all-agent-scopes';
import { ISession } from '#models/user/session';
import { sessionOptions } from '#utils/session';
import { sealData } from 'iron-session';

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
    }
  }
}

const generateSessionCookie = async () => {
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
      email: 'user@yopmail.com',
      scopes: [...allAgentScopes],
      userType: 'Super-agent connecté',
      hasHabilitation: true,
    },
  };

  return sealData(session, {
    password: Cypress.env('IRON_SESSION_PWD'),
  });
};

Cypress.Commands.add('login', () => {
  cy.then(() => {
    return generateSessionCookie();
  }).then((validSessionCookie) => {
    cy.setCookie(sessionOptions.cookieName, validSessionCookie);
  });
});
