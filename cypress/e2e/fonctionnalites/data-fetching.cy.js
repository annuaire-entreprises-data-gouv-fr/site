describe("Data fetching routes", () => {
  it("Agent-only routes are forbidden", () => {
    // First call to retrieve session cookie
    cy.request({
      url: "/",
    });
    cy.request({
      url: "/api/download/espace-agent/documents/552032534",
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(403);
    });
  });
});
