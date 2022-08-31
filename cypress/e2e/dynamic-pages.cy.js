const siret = [
  '35600000000048', // La poste
  '88087814500015', // SASU
  '88301031600015', // EI
  '55203253400646', // cac-40
  '30021082000068', // non-diff
  '13002526500013', // administration
];

siret.forEach((siret) => {
  describe(`Siret ${siret}`, () => {
    it('/etablissement page loads', () => {
      cy.request(`/etablissement/${siret}`).then((resp) => {
        expect(resp.status).to.eq(200);
      });
    });

    ['annonces', 'entreprise', 'divers'].map((pagePrefix) => {
      const path = `/${pagePrefix}/${siret.slice(0, 9)}`;
      it(`/${pagePrefix} page loads`, () => {
        cy.request(path).then((resp) => {
          expect(resp.status).to.eq(200);
        });
      });
    });
  });
});
