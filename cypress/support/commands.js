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