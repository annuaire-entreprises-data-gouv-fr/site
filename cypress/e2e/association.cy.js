describe('Association', () => {
    beforeEach(() => {
        cy.visit('/annonces/338365059');
    });
    it(('Should display dépôts de compte section (JOAFE)'), () => {
        cy.contains(/Cette structure possède [\d]+ comptes publiés au Journal Officiel des Associations/)
        // Displays compte number
        cy.contains('338365059_31122022')
    });
    it(('Should display annonces section (JOAFE)'), () => {
        cy.contains(/Cette structure possède [\d] annonces publiées au Journal Officiel des Associations/)
    });

})
