/**
 * LoginPage - Page Object for Sauce Demo Login
 * 
 * Demonstrates the POM pattern in Playwright with class inheritance
 * In Cypress, you'd create custom commands in cypress/support/commands.js instead
 */

const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  // Selectors as class properties
  // PLAYWRIGHT vs CYPRESS: Both approaches can use selector objects, but Playwright's
  // page-scoped locators are faster (locator().click() vs cy.get().click())

  constructor(page) {
    super(page);
    // Username input field
    this.usernameInput = '[data-test="username"]';
    
    // Password input field
    this.passwordInput = '[data-test="password"]';
    
    // Login button
    this.loginButton = '[data-test="login-button"]';
    
    // Error message container
    this.errorMessage = '[data-test="error"]';
    
    // Products page title (success indicator)
    this.productsTitle = '.title';
  }

  /**
   * Login with credentials
   * 
   * PLAYWRIGHT vs CYPRESS COMPARISON:
   * 
   * PLAYWRIGHT approach (this file):
   * ```
   * async login(username, password) {
   *   await this.fillText(this.usernameInput, username);
   *   await this.fillText(this.passwordInput, password);
   *   await this.click(this.loginButton);
   *   await this.waitForElement(this.productsTitle);
   * }
   * ```
   * 
   * CYPRESS equivalent:
   * ```
   * cy.get('[data-test="username"]').clear().type(username);
   * cy.get('[data-test="password"]').clear().type(password);
   * cy.get('[data-test="login-button"]').click();
   * cy.get('.title').should('be.visible');
   * ```
   * 
   * KEY DIFFERENCES:
   * 1. Playwright is explicit about async operations (await at each step)
   * 2. Cypress chains implicitly, making async flow less obvious
   * 3. Playwright's methods complete immediately (or fail fast)
   * 4. Cypress auto-waits between commands (can hide performance issues)
   * 5. Playwright: explicit error handling with try/catch
   * 6. Cypress: relies on assertion framework for error detection
   */
  async login(username, password) {
    await this.fillText(this.usernameInput, username);
    await this.fillText(this.passwordInput, password);
    await this.click(this.loginButton);
    await this.waitForElement(this.productsTitle, 10000);
  }

  /**
   * Login and save authentication state for reuse
   * 
   * PLAYWRIGHT ADVANTAGE: Storage State Management
   * Playwright can save browser state (cookies, localStorage, sessionStorage)
   * and restore it in other tests, eliminating repeated logins.
   * 
   * This is similar to cy.session() in Cypress but more powerful:
   * - Works across test files
   * - Can be persisted to file for cross-test reuse
   * - Faster than replaying login actions
   * 
   * CYPRESS EQUIVALENT (cy.session was added in Cypress 12.0):
   * ```
   * cy.session('user-session', () => {
   *   cy.get('[data-test="username"]').type('standard_user');
   *   cy.get('[data-test="password"]').type('secret_sauce');
   *   cy.get('[data-test="login-button"]').click();
   * });
   * ```
   * 
   * PLAYWRIGHT ADVANTAGE:
   * - Saves ACTUAL browser state (cookies, localStorage)
   * - Can reuse state file across multiple test runs
   * - More reliable than replaying actions
   */
  async loginAndSaveState(username, password, statePath) {
    await this.login(username, password);
    await this.saveStorageState(statePath);
  }

  /**
   * Check if login error is displayed
   * 
   * PLAYWRIGHT vs CYPRESS:
   * - Playwright: async method returning boolean
   * - Cypress: assertion in a chain (cy.get().should('be.visible'))
   * - Playwright separates verification from actions
   * - Cypress mixes actions and assertions in one chain
   */
  async isErrorDisplayed() {
    return await this.isElementVisible(this.errorMessage);
  }

  /**
   * Get error message text
   */
  async getErrorMessage() {
    return await this.getText(this.errorMessage);
  }

  /**
   * Navigate to login page
   * Overrides parent method to show how POM inheritance works
   */
  async navigateToLogin() {
    await this.goto('/');
  }
}

module.exports = LoginPage;
