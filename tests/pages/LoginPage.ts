import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import path from 'path';

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
    const baseUrl = process.env.BASE_URL!;
    let finalUrl: string;
    if (baseUrl.startsWith('http')) {
      finalUrl = baseUrl;
    } else {
      finalUrl = 'file://' + path.join(process.cwd(), baseUrl);
    }
    console.log("URL: " + finalUrl);
    await this.navigateTo(finalUrl);
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
