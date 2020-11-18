/// <reference types="cypress" />

import { HEADER_SELECTORS } from "../../selectors/header";
import { LOGIN_FORM_SELECTORS } from "../../selectors/loginForm"

function login() {
    cy.get(HEADER_SELECTORS.loginButton).click()
    cy.get(LOGIN_FORM_SELECTORS.logInButton).click()
}

function loginAs(login, password) {
    cy.get(HEADER_SELECTORS.loginButton).click()
    cy.get(LOGIN_FORM_SELECTORS.emailInput).clear().type(login)
    cy.get(LOGIN_FORM_SELECTORS.passwordInput).clear().type(password)
    cy.get(LOGIN_FORM_SELECTORS.logInButton).click()
}

describe('Login', () =>{
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.clearCookies();
        cy.visit("/");
    })

    it('should succesfully log in', () => {
        login()
        cy.get(LOGIN_FORM_SELECTORS.loginAlert).should('be.visible').and('contain', "You are now logged in");
        cy.get(HEADER_SELECTORS.userAccountButton).should('be.visible');
    })

    it('should display warning message if password is incorrect', () => {
        cy.fixture('users').then((json) => {
            loginAs(json.adminUser.email, "IncorrectPassword")
        });
        
        cy.get(LOGIN_FORM_SELECTORS.validationErrorMessage)
        .should('contain', "Please, enter valid credentials");
    })

    it('should display warning message if user does not exsist', () => {
        cy.fixture('users').then((json) => {
            loginAs("notExisting@email.com", json.adminUser.password)
        });
        cy.get(LOGIN_FORM_SELECTORS.validationErrorMessage)
        .should('contain', "Please, enter valid credentials");
    })
})

describe('Logout', () => {
    it('should log out', () => {
        cy.server();
        cy.loginViaRequest();
        cy.visit("/");
        cy.get(HEADER_SELECTORS.userAccountButton).trigger('mouseover');
        cy.get(HEADER_SELECTORS.logoutButton).should('be.visible').click();
        cy.get(LOGIN_FORM_SELECTORS.loginAlert).should('be.visible').and('contain', "You are now logged out");
        cy.get(HEADER_SELECTORS.loginButton).should('be.visible');
    })
})
