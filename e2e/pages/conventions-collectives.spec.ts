import { cy, test } from "../support/test";

test.describe("Conventions collectives", () => {
  test("Should work for valid companies", () => {
    cy.visit("/divers/356000000");
    cy.contains("Convention d'entreprise La Poste - France Télécom");
  });

  // Need an example
  // test('Should display Inconnues ou supprimées', () => {
  //   cy.visit('/divers/592052302');
  //   cy.contains('Inconnues ou supprimées');
  //   cy.contains('et remplacée par :');
  // });
});
