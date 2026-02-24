/// <reference types="cypress" />

context ('first scenario',() => {
    beforeEach(() => {
        cy.visit('../../src/Caesar/index.html')
    })

    it('encrypts text correctly', () => {

        
        cy.get('#key').clear().type('1')

        
        cy.get('#text').type('hello world')

        
        cy.get('#btn').click()

        
        cy.get('#result')
          .should('have.text', 'ifmmp xpsme')
    })
})