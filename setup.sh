#!/bin/bash

# Script para crear automáticamente todo el framework de testing en TypeScript
# Uso: ./setup-typescript-framework.sh

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🏗️  Creando Framework de Testing BDD con TypeScript${NC}"
echo -e "${BLUE}====================================================${NC}\n"

# Crear estructura de directorios
echo -e "${YELLOW}📁 Creando estructura de directorios...${NC}"
mkdir -p tests/{features,pages,step_definitions,support}
mkdir -p reports/{screenshots,playwright-report}
mkdir -p demo

# Crear package.json
echo -e "${YELLOW}📦 Creando package.json...${NC}"
cat > package.json << 'EOF'
{
  "name": "login-webapp-test-ts",
  "version": "1.0.0",
  "description": "Framework de testing BDD con Playwright, Cucumber y TypeScript",
  "main": "index.js",
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "tsc",
    "pretest": "npm run build",
    "test": "cucumber-js",
    "test:debug": "cucumber-js --tags @debug",
    "test:smoke": "cucumber-js --tags @smoke",
    "test:login": "cucumber-js --tags @login",
    "test:chromium": "cucumber-js",
    "test:firefox": "BROWSER=firefox cucumber-js",
    "test:webkit": "BROWSER=webkit cucumber-js",
    "test:firefox:headless": "BROWSER=firefox HEADLESS=true cucumber-js",
    "test:webkit:headless": "BROWSER=webkit HEADLESS=true cucumber-js",
    "install:browsers": "npx playwright install",
    "lint": "eslint . --ext .ts",
    "format": "prettier --write \"tests/**/*.ts\" \"*.ts\""
  },
  "keywords": [
    "playwright",
    "cucumber",
    "bdd",
    "gherkin",
    "testing",
    "typescript",
    "page-object-model"
  ],
  "devDependencies": {
    "@cucumber/cucumber": "^10.0.0",
    "@playwright/test": "^1.40.0",
    "@types/node": "^20.10.0",
    "@typescript-eslint/eslint-plugin": "^6.13.0",
    "@typescript-eslint/parser": "^6.13.0",
    "eslint": "^8.55.0",
    "playwright": "^1.40.0",
    "prettier": "^3.1.0",
    "rimraf": "^5.0.5",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.3"
  },
  "dependencies": {}
}
EOF

# Crear tsconfig.json
echo -e "${YELLOW}⚙️  Creando tsconfig.json...${NC}"
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "types": ["node", "@cucumber/cucumber", "@playwright/test"],
    "typeRoots": ["./node_modules/@types", "./types"]
  },
  "include": [
    "tests/**/*.ts",
    "cucumber.config.ts",
    "playwright.config.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "reports"
  ]
}
EOF

# Crear cucumber.config.ts
echo -e "${YELLOW}🥒 Creando cucumber.config.ts...${NC}"
cat > cucumber.config.ts << 'EOF'
import { IConfiguration } from '@cucumber/cucumber';

const config: IConfiguration = {
  default: {
    require: [
      'dist/tests/support/world.js',
      'dist/tests/support/hooks.js',
      'dist/tests/step_definitions/**/*.js'
    ],
    format: [
      'progress',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json'
    ],
    paths: ['tests/features/**/*.feature'],
    parallel: 1,
    publishQuiet: true,
    dryRun: false,
    failFast: false
  }
};

export default config;
EOF

# Crear playwright.config.ts
echo -e "${YELLOW}🎭 Creando playwright.config.ts...${NC}"
cat > playwright.config.ts << 'EOF'
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  workers: 4,
  fullyParallel: true,
  expect: {
    timeout: 5000
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: process.env.HEADLESS !== 'false',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        headless: process.env.HEADLESS !== 'false',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        headless: process.env.HEADLESS !== 'false',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
  ],
  reporter: [
    ['html', { outputFolder: 'reports/playwright-report' }],
    ['json', { outputFile: 'reports/results.json' }],
    ['list']
  ],
  use: {
    baseURL: 'file://' + process.cwd(),
    trace: 'on-first-retry',
    actionTimeout: 0,
    navigationTimeout: 30000,
  },
  outputDir: 'reports/test-results/',
});
EOF

# Crear .eslintrc.json
echo -e "${YELLOW}🔍 Creando .eslintrc.json...${NC}"
cat > .eslintrc.json << 'EOF'
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-console": "off"
  },
  "env": {
    "node": true,
    "es6": true
  }
}
EOF

# Crear .prettierrc.json
echo -e "${YELLOW}💅 Creando .prettierrc.json...${NC}"
cat > .prettierrc.json << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
EOF

# Crear .gitignore
echo -e "${YELLOW}📝 Creando .gitignore...${NC}"
cat > .gitignore << 'EOF'
# Dependencias
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Código compilado
dist/

# Reportes y resultados de tests
reports/
test-results/
playwright-report/
screenshots/

# Archivos temporales de Playwright
test-results/
playwright/.cache/

# Logs
*.log

# Variables de entorno
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Archivos temporales
*.tmp
*.temp
EOF

# Crear .env.example
echo -e "${YELLOW}⚙️  Creando .env.example...${NC}"
cat > .env.example << 'EOF'
# Configuración del navegador
HEADLESS=true
BROWSER=chromium
SLOW_MO=0

# Configuración de timeouts (ms)
DEFAULT_TIMEOUT=30000
EXPECT_TIMEOUT=5000
ACTION_TIMEOUT=0
NAVIGATION_TIMEOUT=30000

# Configuración de reportes
SCREENSHOTS_ON_FAILURE=true
VIDEO_ON_FAILURE=true
TRACE_ON_RETRY=true

# Configuración de debugging
DEBUG_MODE=false
VERBOSE_LOGGING=false
EOF

# Crear login.feature
echo -e "${YELLOW}🥒 Creando login.feature...${NC}"
cat > tests/features/login.feature << 'EOF'
@login @smoke
Feature: Login de Usuario
  Como usuario del sistema
  Quiero poder iniciar sesión
  Para acceder a la zona privada

  Background:
    Given que estoy en la página de login

  @positive
  Scenario: Login exitoso con credenciales válidas
    When ingreso el usuario "user" y la contraseña "password"
    And acepto los términos de uso
    And hago clic en el botón "Entrar"
    Then debería ser redirigido a la zona privada
    And debería ver el mensaje de bienvenida "Bienvenido, user!"
    And debería ver la lista de productos
    And la URL debería contener "private.html"

  @negative
  Scenario Outline: Login fallido con credenciales inválidas
    When ingreso el usuario "<usuario>" y la contraseña "<contraseña>"
    And acepto los términos de uso
    And hago clic en el botón "Entrar"
    Then debería permanecer en la página de login
    And debería ver el mensaje de error "<mensaje_error>"
    And la URL debería contener "login.html"

    Examples:
      | usuario      | contraseña   | mensaje_error                     |
      | admin        | password     | Usuario o contraseña incorrectos  |
      | user         | 123456       | Usuario o contraseña incorrectos  |
      | incorrecto   | incorrecto   | Usuario o contraseña incorrectos  |

  @negative
  Scenario: Login fallido sin aceptar términos de uso
    When ingreso el usuario "user" y la contraseña "password"
    And NO acepto los términos de uso
    And hago clic en el botón "Entrar"
    Then debería permanecer en la página de login

  @security
  Scenario: Acceso directo a zona privada sin autenticación
    When intento acceder directamente a la zona privada
    Then debería ser redirigido automáticamente al login
    And debería ver una alerta indicando que debo iniciar sesión
EOF

# Crear BasePage.ts
echo -e "${YELLOW}📄 Creando BasePage.ts...${NC}"
cat > tests/pages/BasePage.ts << 'EOF'
import { Page } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async waitForSelector(selector: string, options: { state?: 'attached' | 'detached' | 'visible' | 'hidden'; timeout?: number } = {}): Promise<void> {
    await this.page.waitForSelector(selector, options);
  }

  async click(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  async fill(selector: string, value: string): Promise<void> {
    await this.page.fill(selector, value);
  }

  async check(selector: string): Promise<void> {
    await this.page.check(selector);
  }

  async uncheck(selector: string): Promise<void> {
    await this.page.uncheck(selector);
  }

  async getText(selector: string): Promise<string | null> {
    return await this.page.textContent(selector);
  }

  async isVisible(selector: string): Promise<boolean> {
    return await this.page.isVisible(selector);
  }

  async isChecked(selector: string): Promise<boolean> {
    return await this.page.isChecked(selector);
  }

  async waitForUrl(url: string | RegExp, options: { timeout?: number; waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' } = {}): Promise<void> {
    await this.page.waitForURL(url, options);
  }

  async waitForLoadState(state: 'load' | 'domcontentloaded' | 'networkidle' = 'load'): Promise<void> {
    await this.page.waitForLoadState(state);
  }

  async screenshot(path: string): Promise<void> {
    await this.page.screenshot({ path });
  }
}
EOF

# Crear LoginPage.ts
echo -e "${YELLOW}🔐 Creando LoginPage.ts...${NC}"
cat > tests/pages/LoginPage.ts << 'EOF'
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

interface LoginSelectors {
  usernameInput: string;
  passwordInput: string;
  termsCheckbox: string;
  loginButton: string;
  errorMessage: string;
  loginForm: string;
}

export class LoginPage extends BasePage {
  private selectors: LoginSelectors;

  constructor(page: Page) {
    super(page);
    
    this.selectors = {
      usernameInput: '#username',
      passwordInput: '#password',
      termsCheckbox: '#terms',
      loginButton: 'button[type="submit"]',
      errorMessage: '#errorMessage',
      loginForm: '#loginForm'
    };
  }

  async navigateToLogin(): Promise<void> {
    await this.navigateTo('file://' + process.cwd() + '/demo/login.html');
    await this.waitForLoadState();
  }

  async enterUsername(username: string): Promise<void> {
    await this.fill(this.selectors.usernameInput, username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.fill(this.selectors.passwordInput, password);
  }

  async acceptTerms(): Promise<void> {
    await this.check(this.selectors.termsCheckbox);
  }

  async rejectTerms(): Promise<void> {
    await this.uncheck(this.selectors.termsCheckbox);
  }

  async clickLoginButton(): Promise<void> {
    await this.click(this.selectors.loginButton);
  }

  async performLogin(username: string, password: string, acceptTerms: boolean = true): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    
    if (acceptTerms) {
      await this.acceptTerms();
    } else {
      await this.rejectTerms();
    }
    
    await this.clickLoginButton();
  }

  async getErrorMessage(): Promise<string> {
    await this.waitForSelector(this.selectors.errorMessage);
    const text = await this.getText(this.selectors.errorMessage);
    return text || '';
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isVisible(this.selectors.errorMessage);
  }

  async isOnLoginPage(): Promise<boolean> {
    const currentUrl = await this.getCurrentUrl();
    return currentUrl.includes('login.html');
  }

  async isTermsChecked(): Promise<boolean> {
    return await this.isChecked(this.selectors.termsCheckbox);
  }

  async waitForErrorMessage(): Promise<void> {
    await this.waitForSelector(this.selectors.errorMessage, { state: 'visible' });
  }

  async waitForSpecificError(expectedError: string): Promise<boolean> {
    await this.waitForErrorMessage();
    const actualError = await this.getErrorMessage();
    if (actualError !== expectedError) {
      throw new Error(`Expected error "${expectedError}" but got "${actualError}"`);
    }
    return true;
  }
}
EOF

# Crear PrivatePage.ts
echo -e "${YELLOW}🏠 Creando PrivatePage.ts...${NC}"
cat > tests/pages/PrivatePage.ts << 'EOF'
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

interface PrivateSelectors {
  welcomeMessage: string;
  logoutButton: string;
  searchInput: string;
  clubsTable: string;
  clubsTableRows: string;
  pagination: string;
  resultsInfo: string;
  header: string;
}

export class PrivatePage extends BasePage {
  private selectors: PrivateSelectors;

  constructor(page: Page) {
    super(page);
    
    this.selectors = {
      welcomeMessage: '.welcome',
      logoutButton: '#logoutBtn',
      searchInput: '#searchInput',
      clubsTable: '#clubsTable',
      clubsTableRows: '#clubsTable tr',
      pagination: '#pagination',
      resultsInfo: '#resultsInfo',
      header: '.header'
    };
  }

  async navigateToPrivate(): Promise<void> {
    await this.navigateTo('file://' + process.cwd() + '/demo/private.html');
    await this.waitForLoadState();
  }

  async navigateToPrivateDirectly(): Promise<void> {
    await this.navigateToPrivate();
  }

  async clickLogoutButton(): Promise<void> {
    await this.click(this.selectors.logoutButton);
  }

  async searchClubs(searchTerm: string): Promise<void> {
    await this.fill(this.selectors.searchInput, searchTerm);
  }

  async getWelcomeMessage(): Promise<string> {
    await this.waitForSelector(this.selectors.welcomeMessage);
    const text = await this.getText(this.selectors.welcomeMessage);
    return text || '';
  }

  async isWelcomeMessageVisible(): Promise<boolean> {
    return await this.isVisible(this.selectors.welcomeMessage);
  }

  async isClubsTableVisible(): Promise<boolean> {
    return await this.isVisible(this.selectors.clubsTable);
  }

  async getClubsCount(): Promise<number> {
    const rows = await this.page.locator(this.selectors.clubsTableRows);
    return await rows.count();
  }

  async isOnPrivatePage(): Promise<boolean> {
    const currentUrl = await this.getCurrentUrl();
    return currentUrl.includes('private.html');
  }

  async waitForWelcomeMessage(): Promise<void> {
    await this.waitForSelector(this.selectors.welcomeMessage, { state: 'visible' });
  }

  async waitForClubsTable(): Promise<void> {
    await this.waitForSelector(this.selectors.clubsTable, { state: 'visible' });
  }

  async isLogoutButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.selectors.logoutButton);
  }

  async getResultsInfo(): Promise<string> {
    await this.waitForSelector(this.selectors.resultsInfo);
    const text = await this.getText(this.selectors.resultsInfo);
    return text || '';
  }

  async waitForAlert(): Promise<string> {
    return new Promise((resolve) => {
      this.page.on('dialog', async (dialog) => {
        const message = dialog.message();
        await dialog.accept();
        resolve(message);
      });
    });
  }

  async handleAlertAndGetMessage(): Promise<string> {
    let alertMessage = '';
    
    this.page.on('dialog', async (dialog) => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    await this.page.waitForTimeout(1000);
    
    return alertMessage;
  }
}
EOF

# Crear world.ts
echo -e "${YELLOW}🌍 Creando world.ts...${NC}"
cat > tests/support/world.ts << 'EOF'
import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from 'playwright';
import { LoginPage } from '../pages/LoginPage';
import { PrivatePage } from '../pages/PrivatePage';

export interface ICustomWorld extends World {
  browser: Browser | null;
  context: BrowserContext | null;
  page: Page | null;
  loginPage: LoginPage | null;
  privatePage: PrivatePage | null;
  testData: Record<string, any>;
  alertMessage: string;
  openBrowser(browserType?: 'chromium' | 'firefox' | 'webkit'): Promise<void>;
  closeBrowser(): Promise<void>;
  takeScreenshot(name: string): Promise<void>;
  setTestData(key: string, value: any): void;
  getTestData(key: string): any;
  clearTestData(): void;
}

export class CustomWorld extends World implements ICustomWorld {
  browser: Browser | null;
  context: BrowserContext | null;
  page: Page | null;
  loginPage: LoginPage | null;
  privatePage: PrivatePage | null;
  testData: Record<string, any>;
  alertMessage: string;

  constructor(options: IWorldOptions) {
    super(options);
    
    this.browser = null;
    this.context = null;
    this.page = null;
    
    this.loginPage = null;
    this.privatePage = null;
    
    this.testData = {};
    this.alertMessage = '';
  }

  async openBrowser(browserType: 'chromium' | 'firefox' | 'webkit' = 'chromium'): Promise<void> {
    const browserOptions = {
      headless: process.env.HEADLESS !== 'false',
      slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0
    };

    switch (browserType) {
      case 'firefox':
        this.browser = await firefox.launch(browserOptions);
        break;
      case 'webkit':
        this.browser = await webkit.launch(browserOptions);
        break;
      default:
        this.browser = await chromium.launch(browserOptions);
    }

    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true
    });

    this.page = await this.context.newPage();
    
    this.page.on('dialog', async (dialog) => {
      this.alertMessage = dialog.message();
      await dialog.accept();
    });

    this.loginPage = new LoginPage(this.page);
    this.privatePage = new PrivatePage(this.page);
  }

  async closeBrowser(): Promise<void> {
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }

  async takeScreenshot(name: string): Promise<void> {
    if (this.page) {
      await this.page.screenshot({ 
        path: `reports/screenshots/${name}-${Date.now()}.png`,
        fullPage: true 
      });
    }
  }

  setTestData(key: string, value: any): void {
    this.testData[key] = value;
  }

  getTestData(key: string): any {
    return this.testData[key];
  }

  clearTestData(): void {
    this.testData = {};
    this.alertMessage = '';
  }
}

setWorldConstructor(CustomWorld);
EOF

# Crear hooks.ts
echo -e "${YELLOW}🪝 Creando hooks.ts...${NC}"
cat > tests/support/hooks.ts << 'EOF'
import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { ICustomWorld } from './world';
import * as fs from 'fs';

BeforeAll(async function() {
  const dirs = ['reports', 'reports/screenshots'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
});

Before(async function(this: ICustomWorld, scenario) {
  const browserType = (process.env.BROWSER as 'chromium' | 'firefox' | 'webkit') || 'chromium';
  await this.openBrowser(browserType);
  this.clearTestData();
  console.log(`\n🚀 Iniciando escenario: ${scenario.pickle.name} en navegador: ${browserType}`);
});

After(async function(this: ICustomWorld, scenario) {
  try {
    if (scenario.result?.status === Status.FAILED) {
      const scenarioName = scenario.pickle.name.replace(/[^a-zA-Z0-9]/g, '-');
      await this.takeScreenshot(`failed-${scenarioName}`);
      console.log(`❌ Escenario fallido: ${scenario.pickle.name}`);
    } else {
      console.log(`✅ Escenario exitoso: ${scenario.pickle.name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.log('Error al tomar screenshot:', errorMessage);
  } finally {
    await this.closeBrowser();
  }
});

AfterAll(async function() {
  console.log('\n🏁 Todos los tests han terminado');
});
EOF

# Crear loginSteps.ts
echo -e "${YELLOW}👣 Creando loginSteps.ts...${NC}"
cat > tests/step_definitions/loginSteps.ts << 'EOF'
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../support/world';

Given('que estoy en la página de login', async function(this: ICustomWorld) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  await this.loginPage.navigateToLogin();
  const isOnLoginPage = await this.loginPage.isOnLoginPage();
  expect(isOnLoginPage).toBe(true);
});

When('ingreso el usuario {string} y la contraseña {string}', async function(this: ICustomWorld, username: string, password: string) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  await this.loginPage.enterUsername(username);
  await this.loginPage.enterPassword(password);
  
  this.setTestData('username', username);
  this.setTestData('password', password);
});

When('acepto los términos de uso', async function(this: ICustomWorld) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  await this.loginPage.acceptTerms();
  const isChecked = await this.loginPage.isTermsChecked();
  expect(isChecked).toBe(true);
});

When('NO acepto los términos de uso', async function(this: ICustomWorld) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  await this.loginPage.rejectTerms();
  const isChecked = await this.loginPage.isTermsChecked();
  expect(isChecked).toBe(false);
});

When('hago clic en el botón {string}', async function(this: ICustomWorld, buttonText: string) {
  if (!this.loginPage || !this.page) throw new Error('LoginPage or Page not initialized');
  if (buttonText === 'Entrar') {
    await this.loginPage.clickLoginButton();
    await this.page.waitForTimeout(500);
  }
});

When('intento acceder directamente a la zona privada', async function(this: ICustomWorld) {
  if (!this.privatePage || !this.page) throw new Error('PrivatePage or Page not initialized');
  await this.privatePage.navigateToPrivateDirectly();
  await this.page.waitForTimeout(1000);
});

Then('debería ser redirigido a la zona privada', async function(this: ICustomWorld) {
  if (!this.privatePage || !this.page) throw new Error('PrivatePage or Page not initialized');
  await this.page.waitForTimeout(1000);
  const isOnPrivatePage = await this.privatePage.isOnPrivatePage();
  expect(isOnPrivatePage).toBe(true);
});

Then('debería permanecer en la página de login', async function(this: ICustomWorld) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  const isOnLoginPage = await this.loginPage.isOnLoginPage();
  expect(isOnLoginPage).toBe(true);
});

Then('debería ver el mensaje de bienvenida {string}', async function(this: ICustomWorld, expectedMessage: string) {
  if (!this.privatePage) throw new Error('PrivatePage not initialized');
  await this.privatePage.waitForWelcomeMessage();
  const welcomeMessage = await this.privatePage.getWelcomeMessage();
  expect(welcomeMessage).toBe(expectedMessage);
});

Then('debería ver la lista de productos', async function(this: ICustomWorld) {
  if (!this.privatePage) throw new Error('PrivatePage not initialized');
  await this.privatePage.waitForClubsTable();
});

Then('debería ver el mensaje de error {string}', async function(this: ICustomWorld, expectedError: string) {
  if (!this.loginPage) throw new Error('LoginPage not initialized');
  await this.loginPage.waitForErrorMessage();
  const errorMessage = await this.loginPage.getErrorMessage();
  expect(errorMessage.trim()).toBe(expectedError);
});

Then('la URL debería contener {string}', async function(this: ICustomWorld, expectedUrlPart: string) {
  if (!this.page) throw new Error('Page not initialized');
  const currentUrl = await this.page.url();
  expect(currentUrl).toContain(expectedUrlPart);
});

Then('debería ser redirigido automáticamente al login', async function(this: ICustomWorld) {
  if (!this.loginPage || !this.page) throw new Error('LoginPage or Page not initialized');
  await this.page.waitForTimeout(2000);
  const isOnLoginPage = await this.loginPage.isOnLoginPage();
  expect(isOnLoginPage).toBe(true);
});

Then('debería ver una alerta indicando que debo iniciar sesión', async function(this: ICustomWorld) {
  expect(this.alertMessage).toContain('Debe iniciar sesión');
});
EOF

# Crear README.md
echo -e "${YELLOW}📚 Creando README.md...${NC}"
cat > README.md << 'EOF'
# Framework de Testing BDD con Playwright, Cucumber y TypeScript

Este proyecto implementa un framework de testing automatizado usando **Playwright**, **Cucumber** (BDD), **Gherkin**, **TypeScript** y **Page Object Model** para probar la aplicación web de login.

## 🚀 Instalación y Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Instalar navegadores de Playwright
```bash
npm run install:browsers
```

### 3. Compilar TypeScript
```bash
npm run build
```

### 4. Preparar archivos HTML
Asegúrate de que `login.html` y `private.html` estén en la carpeta `/demo` situada dentro del proyecto.

## 🧪 Ejecutar Tests

### Ejecutar todos los tests
```bash
npm test
```

### Ejecutar tests específicos por tags
```bash
npm run test:login     # Solo tests de login
npm run test:smoke     # Solo tests de smoke
npm run test:debug     # Solo tests con tag @debug
```

### Ejecutar con navegador visible
```bash
HEADLESS=false npm test
```

### Ejecutar tests predefinidas
```bash
npm run test:chromium           # Tests en Chromium (headless por defecto)
npm run test:firefox            # Tests en Firefox
npm run test:webkit             # Tests en WebKit (Safari)
npm run test:firefox:headless   # Tests en Firefox headless
npm run test:webkit:headless    # Tests en WebKit headless
```

## 📋 Scenarios de Prueba

- ✅ Login exitoso con credenciales válidas
- ❌ Login fallido con credenciales inválidas
- ❌ Login fallido sin aceptar términos
- 🔐 Acceso directo sin autenticación

## 📊 Reportes

Los reportes se generan automáticamente en:
- HTML: `reports/cucumber-report.html`
- JSON: `reports/cucumber-report.json`
- Screenshots: `reports/screenshots/`

## 🏗️ Estructura del Proyecto

```
├── tests/
│   ├── features/           # Scenarios en Gherkin (.feature)
│   ├── pages/              # Page Object Model (TypeScript)
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   └── PrivatePage.ts
│   ├── step_definitions/   # Implementación de steps (TypeScript)
│   │   └── loginSteps.ts
│   └── support/            # Configuración y hooks (TypeScript)
│       ├── world.ts
│       └── hooks.ts
├── demo/                   # Archivos HTML para testing
│   ├── login.html
│   └── private.html
├── reports/                # Reportes y screenshots
├── dist/                   # Código compilado (JavaScript)
├── cucumber.config.ts      # Configuración de Cucumber
├── playwright.config.ts    # Configuración de Playwright
├── tsconfig.json          # Configuración de TypeScript
└── package.json           # Dependencias y scripts
```

## 🔧 Tecnologías Utilizadas

- **TypeScript**: Tipado estático para mayor robustez
- **Playwright**: Framework de automatización de navegadores
- **Cucumber**: Framework BDD para escribir tests en lenguaje natural
- **Gherkin**: Lenguaje para escribir escenarios de prueba
- **Page Object Model**: Patrón de diseño para organizar el código de tests

## 📝 Ventajas de TypeScript

- ✅ **Type Safety**: Detecta errores en tiempo de compilación
- ✅ **IntelliSense**: Autocompletado mejorado en el IDE
- ✅ **Refactoring**: Más seguro y sencillo
- ✅ **Documentación**: El código es autodocumentado con tipos
- ✅ **Mantenibilidad**: Código más limpio y fácil de mantener

## 🛠️ Scripts Disponibles

```bash
npm run build              # Compila TypeScript a JavaScript
npm test                   # Ejecuta todos los tests
npm run test:debug         # Ejecuta tests con tag @debug
npm run test:smoke         # Ejecuta tests smoke
npm run test:login         # Ejecuta tests de login
npm run lint               # Ejecuta linter (ESLint)
npm run format             # Formatea código (Prettier)
```

## 🔍 Desarrollo

### Compilar en modo watch
```bash
npx tsc --watch
```

### Ejecutar linter
```bash
npm run lint
```

### Formatear código
```bash
npm run format
```

## 📖 Guía de Migración desde JavaScript

Si estás migrando desde la versión JavaScript:

1. Instala las nuevas dependencias: `npm install`
2. Compila el código TypeScript: `npm run build`
3. Los archivos `.feature` permanecen sin cambios
4. Toda la lógica está ahora tipada en archivos `.ts`

## 🐛 Debugging

Para debuggear tests en TypeScript:

1. Usa VS Code con extensión de Cucumber
2. Añade breakpoints en archivos `.ts`
3. Ejecuta con el debugger de VS Code

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.
EOF

# Crear script de ejecución
echo -e "${YELLOW}🏃 Creando run-tests.sh...${NC}"
cat > run-tests.sh << 'EOFSCRIPT'
#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🎭 Framework de Testing BDD con Playwright, Cucumber y TypeScript${NC}"
echo -e "${BLUE}================================================================${NC}\n"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
    npm install
fi

if [ ! -d "node_modules/playwright/.local-browsers" ]; then
    echo -e "${YELLOW}🌐 Instalando navegadores de Playwright...${NC}"
    npx playwright install
fi

if [ ! -d "dist" ]; then
    echo -e "${YELLOW}⚙️  Compilando TypeScript...${NC}"
    npm run build
fi

mkdir -p reports/screenshots

if [ ! -f "demo/login.html" ] || [ ! -f "demo/private.html" ]; then
    echo -e "${RED}❌ No se encontraron los archivos login.html y/o private.html en la carpeta /demo${NC}"
    echo -e "${YELLOW}💡 Por favor, copia tus archivos HTML a la carpeta demo/${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Configuración verificada${NC}\n"
echo -e "${YELLOW}🧪 Ejecutando tests...${NC}"

npm test

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Todos los tests pasaron exitosamente${NC}"
    echo -e "${BLUE}📊 Reportes disponibles en: reports/cucumber-report.html${NC}"
else
    echo -e "${RED}❌ Algunos tests fallaron${NC}"
    echo -e "${YELLOW}📸 Revisa los screenshots en: reports/screenshots/${NC}"
fi
EOFSCRIPT

chmod +x run-tests.sh

echo -e "${GREEN}✅ Framework TypeScript creado exitosamente!${NC}\n"

echo -e "${BLUE}📋 Próximos pasos:${NC}"
echo -e "${YELLOW}1.${NC} Copia tus archivos login.html y private.html a la carpeta ${GREEN}demo/${NC}"
echo -e "${YELLOW}2.${NC} Instala dependencias: ${GREEN}npm install${NC}"
echo -e "${YELLOW}3.${NC} Instala navegadores: ${GREEN}npm run install:browsers${NC}"
echo -e "${YELLOW}4.${NC} Compila TypeScript: ${GREEN}npm run build${NC}"
echo -e "${YELLOW}5.${NC} Ejecuta tests: ${GREEN}npm test${NC}"
echo -e "${YELLOW}   ${NC} O usa el script: ${GREEN}./run-tests.sh${NC}"

echo -e "\n${BLUE}📁 Estructura creada:${NC}"
echo -e "📦 Configuración:"
echo -e "   ├── package.json"
echo -e "   ├── tsconfig.json"
echo -e "   ├── cucumber.config.ts"
echo -e "   ├── playwright.config.ts"
echo -e "   ├── .eslintrc.json"
echo -e "   └── .prettierrc.json"
echo -e ""
echo -e "📂 tests/"
echo -e "   ├── features/"
echo -e "   │   └── login.feature"
echo -e "   ├── pages/"
echo -e "   │   ├── BasePage.ts"
echo -e "   │   ├── LoginPage.ts"
echo -e "   │   └── PrivatePage.ts"
echo -e "   ├── step_definitions/"
echo -e "   │   └── loginSteps.ts"
echo -e "   └── support/"
echo -e "       ├── world.ts"
echo -e "       └── hooks.ts"

echo -e "\n${GREEN}🎉 ¡Framework TypeScript listo para usar!${NC}"
echo -e "${BLUE}💡 Tip: Ejecuta ${GREEN}./setup-typescript-framework.sh${BLUE} en tu directorio de proyecto${NC}"