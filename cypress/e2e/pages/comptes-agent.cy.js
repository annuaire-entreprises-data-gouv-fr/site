describe('Agent login', () => {
  it('Should not be able to login without a siret', () => {
    cy.login();
    cy.visit('/documents/487444697');
  });

  it('Should not be able to login as betagouv', () => {});
  it('Should not be able to login as datagouv', () => {});
  it('Should not be able to login as prestataire', () => {});
  it('Should not be able to login as RATP', () => {});
  it('Should not be able to login as ADEME', () => {});
  it('Should be able to login as DINUM', () => {});
  it('Should be able to login as DINUM', () => {});
});
