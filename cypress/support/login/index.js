Cypress.Commands.add("loginViaRequestAs", (email, password) =>


  cy.request({
    method: "POST",
    url: '/graphql/',
    body: [
      {
        "operationName":"TokenAuth",
        "variables":{
          "email":email,
          "password":password
      },
      "query":"fragment AccountError on AccountError {\n  code\n  field\n  message\n  __typename\n}\n\nmutation TokenAuth($email: String!, $password: String!) {\n  tokenCreate(email: $email, password: $password) {\n    csrfToken\n    refreshToken\n    token\n    errors: accountErrors {\n      ...AccountError\n      __typename\n    }\n    user {\n      id\n      __typename\n    }\n    __typename\n  }\n}\n"}]
  })
  .then((resp) => {
    expect(resp.status).to.eq(200);
    window.localStorage.setItem("token", resp.body[0].data.tokenCreate.token);
  })
);

Cypress.Commands.add("loginViaRequest", () => {
  console.log("login");
  cy.fixture('users').then((json) => {
    cy.loginViaRequestAs(json.adminUser.email, json.adminUser.password)
  });
})