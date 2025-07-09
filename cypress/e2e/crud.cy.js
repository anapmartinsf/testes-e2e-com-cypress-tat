// cypress/e2e/crud.cy.js

import { faker } from '@faker-js/faker/locale/en' //usado para gerar algumas palavras aleatorioas 

describe('CRUD', () => {
  it('CRUDs a note', () => {
    const noteDescription = faker.lorem.words(4) // faker gera 4 palavras aleatórias para o título da nota

    cy.intercept('GET', '**/notes').as('getNotes')
    cy.intercept('GET', '**/notes/**').as('getNote')
    cy.sessionLogin() //ja faz login e intercepta as requisições

    cy.visit('/notes/new')
    cy.get('#content').type(noteDescription)
    cy.contains('button', 'Create').click()

    cy.wait('@getNotes') // espera a requisição de notas ser concluída
    cy.contains('.list-group-item', noteDescription)
      .should('be.visible')
      .click()
    cy.wait('@getNote')

    const updatedNoteDescription = faker.lorem.words(4)

    cy.get('#content')
      .as('contentField')
      .clear()
    cy.get('@contentField')
      .type(updatedNoteDescription)
    cy.contains('button', 'Save').click()
    cy.wait('@getNotes')

    cy.contains('.list-group-item', noteDescription).should('not.exist')//verifica se a anotação antiga não existe mais
    cy.contains('.list-group-item', updatedNoteDescription)//verifica se a anotação atualizada existe
      .should('be.visible')
      .click()
    cy.wait('@getNote')
    cy.contains('button', 'Delete').click()
    cy.wait('@getNotes')

    cy.get('.list-group-item')
      .its('length') //pega quantidade de itens na lista
      .should('be.at.least', 1) //verifica se tem pelo menos 1 item na lista

  })
})
