# Demoblaze Playwright Test Suite

This project contains automated tests for demoblaze.com e-commerce website, focusing on the login and shopping cart functionality.

## Features

- Login flow validation
- Add to cart functionality testing
- Multiple product handling
- Price calculation verification
- Cart management (add/remove products)

## Project Structure

```
├── tests/                 # Test files
│   ├── login.spec.ts      # Login flow tests
│   └── cart.spec.ts       # Shopping cart tests
├── pages/                 # Page Object Models
│   ├── BasePage.ts        # Base page with common functionality
│   ├── LoginPage.ts       # Login page interactions
│   ├── ProductPage.ts     # Product page interactions
│   └── CartPage.ts        # Cart page interactions
├── utils/                 # Utility files
│   └── test-data.ts       # Test data (users, products) 
    └── helpers.ts         # Helper functions
├── playwright.config.ts   # Playwright configuration
└── package.json           # Project dependencies
```

## Setup Instructions

1. **Prerequisites**
   - Node.js (v14 or higher)
   - npm or yarn

2. **Installation**
   ```bash
   # Clone this repository
   git clone https://github.com/asmita438/demo
   cd demo
   
   # Install dependencies
   npm install
   
   # Install browsers
   npx playwright install
   ```

3. **Running Tests**
   ```bash
   # Run all tests
   npm test
   
   # Run specific test files
   npm run test:login
   npm run test:cart
   
   # Run tests in headed mode (with browser visible)
   npm run test:headed
   
   # Debug tests
   npm run test:debug
   
   # View HTML report
   npm run report
   ```

## Testing Approach

This test suite utilizes the Page Object Model pattern to create a maintainable and scalable test framework. Key features include:

1. **Abstraction** - Each page has its own class that represents the UI elements and actions.
2. **Reusability** - Common methods are defined in the BasePage class.
3. **Maintainability** - UI elements are defined in a single location.
4. **Readability** - Test cases are written in a descriptive, easy-to-understand manner.

## Challenges and Solutions

1. **Alert Handling**
   - The site uses JavaScript alerts for confirmation messages which require special handling in Playwright.
   - Solution: Implemented dialog listeners to automatically accept alerts.

2. **Dynamic Content**
   - Product availability may change over time.
   - Solution: Used a flexible selector approach and implemented proper waiting strategies.

3. **Network Reliability**
   - The demo site can sometimes be slow or flaky.
   - Solution: Added proper wait mechanisms and retry logic in the config.

## Future Enhancements

1. **API Integration** - Add API tests to validate backend functionality.
2. **Visual Testing** - Implement visual regression testing.
3. **CI/CD Integration** - Set up GitHub Actions workflow.
4. **Data-driven Testing** - Extend test coverage with more varied test data.
5. **Performance Metrics** - Add performance testing capabilities.