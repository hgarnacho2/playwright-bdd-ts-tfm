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
