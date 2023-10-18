describe('Établissement scolaire', () => {
    it(('Should display service public and Établissement scolaire section'), () => {
        cy.visit('/entreprise/198100125');
        cy.contains('Service public')
        cy.contains('Établissements scolaires')
    });
    it(("Should display info from annuaire de l'éducation nationale"), () => {
        cy.visit('/etablissements-scolaires/198100125');
        cy.contains('Annuaire de l’Education Nationale')
        cy.contains('N° UAI')
        cy.contains('0810012Y') // UAI
    });

})
