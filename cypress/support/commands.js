// cypress/support/commands.js

Cypress.Commands.add("fillSignupFormAndSubmit", (email, password) => {
  cy.intercept("GET", "**/notes").as("getNotes"); //forma de testar APIs REST
  cy.visit("/signup");
  cy.get("#email").type(email);
  cy.get("#password").type(password, { log: false }); // log false é usado para que a senha não apareça no logn do cypress
  cy.get("#confirmPassword").type(password, { log: false });
  cy.contains("button", "Signup").click();
  cy.get("#confirmationCode").should("be.visible"); //garante que o modal de inserir código apareça logo após clicar em signup, e ese ele aparecer é disparado email pro usuário
  cy.mailosaurGetMessage(Cypress.env("MAILOSAUR_SERVER_ID"), {
    // mailosaurGetMessage vai na caixa de entrada buscar o código recebido
    sentTo: email,
  }).then((message) => {
    //quando o e-mail chegar, ele será passado como o objeto message
    const confirmationCode = message.html.body.match(/\d{6}/)[0];
    cy.get("#confirmationCode").type(`${confirmationCode}{enter}`);
  });
  cy.wait("@getNotes"); //Aguarda a resposta da requisição GET /notes que você interceptou antes com cy.intercept(), garante que a página de notas só será validada depois que a API tiver respondido.
});

Cypress.Commands.add(
  "guiLogin", // comando para logar na aplicação via interface gráfica
  (
    userName = Cypress.env("USER_EMAIL"),
    password = Cypress.env("USER_PASSWORD")
  ) => {
    cy.intercept("GET", "**/notes").as("getNotes");
    // intercepta a requisição GET para /notes e atribui um alias "getNotes"
    // Isso permite que você espere por essa requisição mais tarde no teste.      
    cy.visit("/login");
    cy.get("#email").type(userName);
    cy.get("#password").type(password, { log: false });
    cy.contains("button", "Login").click();
    cy.contains("h1", "Your Notes").should("be.visible");
  }
);

Cypress.Commands.add('sessionLogin', (
  username = Cypress.env('USER_EMAIL'),
  password = Cypress.env('USER_PASSWORD')
) => {
  const login = () => cy.guiLogin(username, password) // Define a função de login que será usada na sessão
  // Usa o comando session do Cypress para armazenar a sessão do usuário
  // Isso evita a necessidade de fazer login repetidamente em cada teste
  cy.session(username, login) // O comando session recebe o nome do usuário e a função de login
})

// cypress/support/commands.js

// Outros comands aqui ...

const attachFileHandler = () => {
  cy.get('#file').selectFile('cypress/fixtures/example.json')
}

Cypress.Commands.add('createNote', (note, attachFile = false) => {
  cy.visit('/notes/new')
  cy.get('#content').type(note)

  if (attachFile) {
    attachFileHandler()
  }

  cy.contains('button', 'Create').click()

  cy.contains('.list-group-item', note).should('be.visible')
})

Cypress.Commands.add('editNote', (note, newNoteValue, attachFile = false) => {
  cy.intercept('GET', '**/notes/**').as('getNote')

  cy.contains('.list-group-item', note).click()
  cy.wait('@getNote')

  cy.get('#content')
    .as('contentField')
    .clear()
  cy.get('@contentField')
    .type(newNoteValue)

  if (attachFile) {
    attachFileHandler()
  }

  cy.contains('button', 'Save').click()

  cy.contains('.list-group-item', newNoteValue).should('be.visible')
  cy.contains('.list-group-item', note).should('not.exist')
})

Cypress.Commands.add('deleteNote', note => {
  cy.contains('.list-group-item', note).click()
  cy.contains('button', 'Delete').click()

  cy.get('.list-group-item')
    .its('length')
    .should('be.at.least', 1)
  cy.contains('.list-group-item', note)
    .should('not.exist')
})

// cypress/support/commands.js

// Outros comandos aqui ...

Cypress.Commands.add('fillSettingsFormAndSubmit', () => {
  cy.visit('/settings')
  cy.get('#storage').type('1')
  cy.get('#name').type('Mary Doe')
  cy.iframe('.card-field iframe')
    .as('iframe')
    .find('[name="cardnumber"]')
    .type('4242424242424242')
  cy.get('@iframe')
    .find('[name="exp-date"]')
    .type('1271')
  cy.get('@iframe')
    .find('[name="cvc"]')
    .type('123')
  cy.get('@iframe')
    .find('[name="postal"]')
    .type('12345')
  cy.contains('button', 'Purchase').click()
})