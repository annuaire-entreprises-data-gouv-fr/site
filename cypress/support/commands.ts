// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
import { allAgentScopes } from '#models/user/all-agent-scopes';
import { IAgentScope } from '#models/user/scopes';
import { ISession } from '#models/user/session';
import { sessionOptions } from '#utils/session';
import { sealData } from 'iron-session';

declare global {
  namespace Cypress {
    interface Chainable {
      login(scopes?: IAgentScope[]): Chainable<void>;
    }
  }
}

const generateSessionCookie = async (inputScopes?: IAgentScope[]) => {
  const scopes = inputScopes || [...allAgentScopes];
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
      scopes,
      userType: 'Super-agent connecté',
      hasHabilitation: true,
    },
  };

  return sealData(session, {
    password:
      Cypress.env('IRON_SESSION_PWD') || 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  });
};

Cypress.Commands.add('login', (scopes?: IAgentScope[]) => {
  cy.then(() => {
    return generateSessionCookie(scopes);
  }).then((validSessionCookie) => {
    cy.setCookie(sessionOptions.cookieName, validSessionCookie);
  });
});
