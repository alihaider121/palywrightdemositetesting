# Cypress to Playwright Migration Guide

A practical guide for Cypress users to understand and transition to Playwright.

## 🔄 Mental Model Shift

### Cypress Approach
```
Global cy object → Method chaining → Implicit waiting
cy.get('button').click().should('be.visible')
```

### Playwright Approach
```
Injected page object → Async/await → Explicit control
await page.click('button');
await expect(page.locator('button')).toBeVisible();
```

## 📝 Command Mapping

### Navigation

| Cypress | Playwright | Notes |
|---------|-----------|-------|
| `cy.visit('/')` | `await page.goto('/')` | Similar, but explicit await |
| `cy.url()` | `page.url()` | Property vs method |

### Finding Elements

| Cypress | Playwright | Notes |
|---------|-----------|-------|
| `cy.get('[data-test="btn"]')` | `page.locator('[data-test="btn"]')` | Locators are lazy (better) |
| `cy.get('.item').contains('text')` | `page.locator('.item').filter({ hasText: 'text' })` | Playwright's filter is cleaner |
| `cy.get('h1').first()` | `page.locator('h1').first()` | Same pattern |

### Clicking & Typing

| Cypress | Playwright | Notes |
|---------|-----------|-------|
| `cy.get('input').type('text')` | `await page.fill('input', 'text')` | fill() auto-clears |
| `cy.get('button').click()` | `await page.click('button')` | Similar |
| `cy.get('button').dblclick()` | `await page.dblclick('button')` | Similar |

### Assertions

| Cypress | Playwright | Notes |
|---------|-----------|-------|
| `cy.get('h1').should('be.visible')` | `await expect(page.locator('h1')).toBeVisible()` | Playwright assertions have retry logic |
| `cy.get('h1').should('contain', 'text')` | `await expect(page.locator('h1')).toContainText('text')` | Built-in retry |
| `cy.get('button').should('be.disabled')` | `await expect(page.locator('button')).toBeDisabled()` | Playwright retries by default |

### Waiting

| Cypress | Playwright | Notes |
|---------|-----------|-------|
| `cy.get('.loading')` (implicit wait) | `await page.waitForSelector('.loading')` | Explicit wait required |
| `cy.contains('Success')` | `await page.locator('text=Success')` | Text locator in Playwright |
| `cy.intercept('/api')` | `await page.waitForResponse('/api')` | Different approach |

### Handling Multiple Elements

| Cypress | Playwright | Notes |
|---------|-----------|-------|
| `cy.get('.item').then($items => {})` | `const items = await page.locator('.item').all()` | Direct array access |

## 🏗️ Structure Changes

### Cypress Project Structure
```
cypress/
  ├── e2e/
  │   └── login.cy.js
  ├── support/
  │   ├── commands.js      (custom commands)
  │   └── e2e.js
  ├── fixtures/
  └── cypress.config.js
```

### Playwright Project Structure
```
tests/
  ├── 01-login.spec.js
  ├── 02-products.spec.js
  └── ...
pages/
  ├── BasePage.js          (class, not commands)
  ├── LoginPage.js
  └── ProductsPage.js
playwright.config.js
```

## 🔧 Custom Commands → Page Objects

### Cypress Way
```javascript
// cypress/support/commands.js
Cypress.Commands.add('login', (username, password) => {
  cy.get('[data-test="username"]').type(username);
  cy.get('[data-test="password"]').type(password);
  cy.get('[data-test="login"]').click();
  cy.get('.dashboard').should('be.visible');
});

// In test
cy.login('user', 'pass');
```

### Playwright Way
```javascript
// pages/LoginPage.js
class LoginPage extends BasePage {
  async login(username, password) {
    await this.fillText('[data-test="username"]', username);
    await this.fillText('[data-test="password"]', password);
    await this.click('[data-test="login"]');
    await this.waitForElement('.dashboard');
  }
}

// In test
const loginPage = new LoginPage(page);
await loginPage.login('user', 'pass');
```

**Advantages:**
- OOP structure (inheritance, composition)
- Better for large test suites
- More maintainable
- IDE support for autocompletion

## 🎯 Test Structure

### Cypress Test
```javascript
describe('Login', () => {
  it('should login successfully', () => {
    cy.visit('/');
    cy.get('[data-test="username"]').type('user');
    cy.get('[data-test="password"]').type('pass');
    cy.get('[data-test="login"]').click();
    cy.get('h1').should('contain', 'Dashboard');
  });
});
```

### Playwright Test
```javascript
import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/');
    await page.fill('[data-test="username"]', 'user');
    await page.fill('[data-test="password"]', 'pass');
    await page.click('[data-test="login"]');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });
});
```

**Key differences:**
1. Page object injected into test
2. Explicit await everywhere
3. Use expect() for assertions (retryable)
4. No chaining (each statement is independent)

## 🚀 Features You Get "For Free" in Playwright

### 1. Multi-Tab Support
```javascript
// Open new tab and interact with it
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.click('a[target="_blank"]')
]);

// Use the new page
const title = await newPage.title();
```

**Cypress:** Impossible without workarounds

### 2. Iframe Support
```javascript
// Easy iframe interaction
const frameLocator = page.frameLocator('iframe[id="content"]');
const text = await frameLocator.locator('h1').textContent();
```

**Cypress:** Requires contentDocument hacks

### 3. Safari Testing
```javascript
// Automatic Safari testing
projects: [
  { name: 'chromium' },
  { name: 'firefox' },
  { name: 'webkit' },  // Safari!
]
```

**Cypress:** No WebKit support

### 4. Auth State Persistence
```javascript
// Save auth state once
await page.context().storageState({ path: 'auth.json' });

// Use in all tests (in config)
use: { storageState: 'auth.json' }
```

**Cypress:** cy.session() requires replaying login

### 5. Parallel Execution
```javascript
// Configured in playwright.config.js
workers: 4  // Run 4 tests simultaneously
```

**Cypress:** Requires paid Cypress Cloud

## 🔑 Important Differences to Remember

### 1. No Implicit Waits
```javascript
// ❌ DON'T DO THIS (too fast, element might not be ready)
const text = await page.locator('.result').textContent();

// ✅ DO THIS (wait explicitly)
await page.waitForSelector('.result');
const text = await page.locator('.result').textContent();

// ✅ OR USE EXPECT (has retry logic)
await expect(page.locator('.result')).toBeVisible();
```

### 2. No Global cy Object
```javascript
// ❌ DON'T DO THIS
describe('Test', () => {
  it('should work', () => {
    cy.get('button'); // cy is global in Cypress
  });
});

// ✅ DO THIS
test('should work', async ({ page }) => {
  await page.locator('button'); // page is injected
});
```

### 3. Always Await
```javascript
// ❌ DON'T DO THIS
const text = page.locator('h1').textContent();
console.log(text); // Promise, not actual text

// ✅ DO THIS
const text = await page.locator('h1').textContent();
console.log(text); // actual text value
```

### 4. Explicit Navigation Waits
```javascript
// ❌ MIGHT RACE CONDITION
page.click('link');
page.url(); // might not have changed yet

// ✅ EXPLICIT WAIT
await Promise.all([
  page.waitForURL(/.*new-page/),
  page.click('link')
]);
```

## 🎓 Migration Checklist

- [ ] Install Playwright: `npm install @playwright/test`
- [ ] Create `pages/` directory for Page Objects
- [ ] Create `tests/` directory for test files
- [ ] Convert first test using Page Object pattern
- [ ] Update playwright.config.js with your settings
- [ ] Replace cy.commands with Page Object methods
- [ ] Convert assertions to use expect()
- [ ] Add explicit waits where needed
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] Set up auth state management
- [ ] Configure CI/CD for parallel execution

## 📊 Performance Tips

### Cypress
```javascript
// Every test logs in (slow)
cy.login(); // 5 seconds
cy.test(); // 2 seconds
// Total: 7 seconds per test
```

### Playwright
```javascript
// Save auth state once
await page.context().storageState({ path: 'auth.json' });

// Tests load state (fast)
// No login replay needed: 0.5 seconds per test
```

For 100 tests:
- **Cypress:** 700+ seconds (11+ minutes)
- **Playwright:** 50+ seconds (with auth state)

## 🎯 Common Patterns

### Setup & Teardown

**Cypress**
```javascript
beforeEach(() => {
  cy.login();
});
```

**Playwright**
```javascript
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login();
});
```

### Fixtures/Test Data

**Cypress**
```javascript
// cypress/fixtures/user.json
{ "username": "user", "password": "pass" }

// Use in test
cy.fixture('user').then(user => {
  cy.login(user.username, user.password);
});
```

**Playwright**
```javascript
// Create data within test
const user = { username: 'user', password: 'pass' };
await loginPage.login(user.username, user.password);

// Or use test.beforeAll() for shared data
test.beforeAll(() => {
  user = { username: 'user', password: 'pass' };
});
```

### Skipping Tests

**Cypress**
```javascript
it.skip('should test something', () => {});
```

**Playwright**
```javascript
test.skip('should test something', async () => {});
```

## ⚠️ Common Pitfalls

### Pitfall 1: Forgetting Await
```javascript
// ❌ WRONG
const element = page.locator('h1');
const text = element.textContent();

// ✅ RIGHT
const element = page.locator('h1');
const text = await element.textContent();
```

### Pitfall 2: Chaining Instead of Awaiting
```javascript
// ❌ WRONG (Cypress style)
page.fill('input', 'text').click('button');

// ✅ RIGHT
await page.fill('input', 'text');
await page.click('button');
```

### Pitfall 3: Not Waiting for Elements
```javascript
// ❌ MIGHT FAIL
await page.click('button');
const text = await page.locator('.result').textContent();

// ✅ SAFE
await page.click('button');
await page.waitForSelector('.result');
const text = await page.locator('.result').textContent();
```

### Pitfall 4: Assuming Retries in Click/Fill
```javascript
// ❌ CAN FAIL
await page.click('button'); // element might not be ready

// ✅ SAFE
await page.locator('button').click({ timeout: 10000 });
// OR
await expect(page.locator('button')).toBeEnabled();
await page.click('button');
```

## 🔗 Useful Resources

- **Playwright Migration Guide:** https://playwright.dev/docs/from-cypress
- **Locator Guide:** https://playwright.dev/docs/locators
- **API Comparison:** https://playwright.dev/docs/api-testing
- **Best Practices:** https://playwright.dev/docs/best-practices

## ✨ Summary

| Aspect | Cypress | Playwright |
|--------|---------|-----------|
| Learning curve | Easy | Moderate |
| Syntax | Special (cy chaining) | Modern (async/await) |
| Structure | Commands | Page Objects (OOP) |
| Browsers | Limited (no Safari) | All (including Safari) |
| Multi-tab | ❌ Impossible | ✅ Native |
| Iframes | ⚠️ Difficult | ✅ Easy |
| Speed | Slower | 3-5x faster |
| Auth state | cy.session() | File-based (faster) |
| Parallelization | Paid feature | Built-in |

**The migration is worth it for projects that need:**
- Multi-tab/window testing
- Iframe-heavy applications
- Safari/cross-browser testing
- Fast feedback loops
- Complex automation scenarios

---

**Good luck with your migration! 🚀**
