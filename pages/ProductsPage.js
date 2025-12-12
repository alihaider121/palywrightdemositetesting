/**
 * ProductsPage - Page Object for Sauce Demo Products Catalog
 * 
 * Demonstrates POM pattern for product listing and interaction
 * Shows Playwright's approach to locators and element interactions
 */

const BasePage = require('./BasePage');

class ProductsPage extends BasePage {
  constructor(page) {
    super(page);
    // Products container
    this.productsContainer = '.inventory_container';
    
    // Individual product items
    this.productItem = '.inventory_item';
    this.productName = '.inventory_item_name';
    this.productPrice = '.inventory_item_price';
    this.addToCartButton = '[data-test*="add-to-cart"]';
    
    // Cart icon and badge
    this.cartIcon = '.shopping_cart_link';
    this.cartBadge = '.shopping_cart_badge';
    
    // Sorting dropdown
    this.sortDropdown = '[data-test="product-sort-container"]';
    
    // Logout link
    this.logoutButton = '#logout_sidebar_link';
  }

  /**
   * Wait for products to load
   */
  async waitForProductsToLoad() {
    await this.waitForElement(this.productsContainer, 10000);
  }

  /**
   * Get all product names
   * 
   * PLAYWRIGHT vs CYPRESS:
   * 
   * PLAYWRIGHT approach (using locator API - more efficient):
   * ```
   * async getProductNames() {
   *   const locators = await this.page.locator(this.productName).all();
   *   return Promise.all(locators.map(loc => loc.textContent()));
   * }
   * ```
   * 
   * CYPRESS approach:
   * ```
   * getProductNames() {
   *   return cy.get('.inventory_item_name').then($elements => {
   *     return Cypress._.map($elements, el => el.innerText);
   *   });
   * }
   * ```
   * 
   * KEY DIFFERENCES:
   * 1. Playwright: locator.all() returns array of locators, then map over them
   * 2. Cypress: cy.get() returns jQuery collection, use Cypress._.map
   * 3. Playwright: explicit async handling with Promise.all
   * 4. Cypress: implicit chaining with .then() callbacks
   * 5. Playwright approach is more performant (locators are lazy-evaluated)
   */
  async getProductNames() {
    const locators = await this.page.locator(this.productName).all();
    return Promise.all(locators.map(loc => loc.textContent()));
  }

  /**
   * Get product price by product name
   * 
   * PLAYWRIGHT ADVANTAGE: Locator Chaining & Filtering
   * Playwright's locator API is more powerful for complex element selection
   * 
   * PLAYWRIGHT approach (very efficient):
   * ```
   * async getProductPrice(productName) {
   *   const product = this.page
   *     .locator(this.productItem)
   *     .filter({ hasText: productName });
   *   return product.locator(this.productPrice).textContent();
   * }
   * ```
   * 
   * CYPRESS approach (requires more steps):
   * ```
   * getProductPrice(productName) {
   *   return cy.get('.inventory_item')
   *     .contains(productName)
   *     .closest('.inventory_item')
   *     .find('.inventory_item_price')
   *     .invoke('text');
   * }
   * ```
   * 
   * PLAYWRIGHT ADVANTAGE:
   * 1. filter({ hasText: productName }) is cleaner than .contains()
   * 2. Locators are composable and reusable
   * 3. No need to .closest() or traverse the DOM manually
   * 4. Locator chains are lazy (better performance)
   */
  async getProductPrice(productName) {
    const product = this.page
      .locator(this.productItem)
      .filter({ hasText: productName });
    return await product.locator(this.productPrice).textContent();
  }

  /**
   * Add product to cart by name
   */
  async addProductToCart(productName) {
    const product = this.page
      .locator(this.productItem)
      .filter({ hasText: productName });
    await product.locator(this.addToCartButton).click();
  }

  /**
   * Get cart item count
   */
  async getCartItemCount() {
    const badgeText = await this.getText(this.cartBadge);
    return parseInt(badgeText, 10);
  }

  /**
   * Navigate to cart
   */
  async goToCart() {
    await this.click(this.cartIcon);
    await this.page.waitForURL(/.*cart*/);
  }

  /**
   * Sort products by option
   * 
   * PLAYWRIGHT vs CYPRESS - Select/Dropdown Interaction:
   * 
   * PLAYWRIGHT approach:
   * ```
   * async sortBy(option) {
   *   await this.page.selectOption(this.sortDropdown, option);
   * }
   * ```
   * 
   * CYPRESS approach:
   * ```
   * sortBy(option) {
   *   cy.get(this.sortDropdown).select(option);
   * }
   * ```
   * 
   * Both are quite similar, but Playwright's selectOption is explicit
   * and handles edge cases better (like when options have values vs labels)
   */
  async sortBy(option) {
    // option values: 'az', 'za', 'lohi', 'hilo'
    await this.page.selectOption(this.sortDropdown, option);
  }

  /**
   * Logout
   */
  async logout() {
    // Open sidebar menu
    await this.click('.bm-burger-button');
    await this.page.waitForSelector(this.logoutButton);
    await this.click(this.logoutButton);
  }
}

module.exports = ProductsPage;
