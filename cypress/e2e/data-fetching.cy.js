describe('Data fetching routes', () => {
  it('Agent-only routes are forbidden', () => {
    cy.request({
      url: '/api/download/espace-agent/documents/552032534',
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(403);
    });

    cy.request({
      url: '/api/data-fetching/espace-agent/conformite/552032534',
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(403);
    });

    cy.request({
      url: '/api/data-fetching/espace-agent/rne/documents/552032534',
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(403);
    });
  });
  it('Bot-Protected routes are unauthorized', () => {
    cy.request({
      url: '/api/data-fetching/verify-tva/552032534',
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(401);
    });

    cy.request({
      url: '/api/data-fetching/association/552032534',
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(401);
    });
  });
});
