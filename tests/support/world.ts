import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from '@playwright/test';

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
      headless: process.env.HEADLESS === 'true',
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
