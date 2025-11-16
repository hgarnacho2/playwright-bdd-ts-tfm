import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect, selectors } from '@playwright/test';
import { chromium, Browser, Page, BrowserContext } from '@playwright/test';
import { PrivatePage } from '../pages/PrivatePage';
import { ICustomWorld } from 'tests/support/world';

let browser: Browser;
let context: BrowserContext;
let page: Page;
let privatePage: PrivatePage;
let username: string;


Given('Estoy en la pagina privada', async function (this: ICustomWorld) {
  const privateUrl = `file://${process.cwd()}/demo/private.html`;
  await this.privatePage?.navigateToPrivate();
  const isOnLoginPage = await this.privatePage?.isOnPrivatePage();
  expect(isOnLoginPage).toBe(true);
});


When('Busco {string}', async function (this: ICustomWorld, searchTerm: string) {
  if (!this.privatePage) throw new Error('privatePage no ha sido inicializada');
  await this.privatePage.searchClubs(searchTerm);
  await this.privatePage.sleep(500);
});

When('Hago click en el boton de cerrar sesion', async function (this: ICustomWorld) {
  await this.privatePage.clickLogoutButton();
  await this.privatePage.sleep(500);
});

When('Intento acceder a la página privada directamente', async function () {
  const privateUrl = `file://${process.cwd()}/demo/private.html`;
  
  // Configurar listener para capturar el alert antes de navegar
  page.on('dialog', async (dialog) => {
    this.alertMessage = dialog.message();
    await dialog.accept();
  });
  
  await page.goto(privateUrl);
  await page.waitForTimeout(1000);
});

When('Intento acceder a la pagina privada', async function () {
  const privateUrl = `file://${process.cwd()}/demo/private.html?auth=false&user=${username}`;
  
  page.on('dialog', async (dialog) => {
    this.alertMessage = dialog.message();
    await dialog.accept();
  });
  
  await page.goto(privateUrl);
  await page.waitForTimeout(1000);
});

// ============================================
// THEN Steps
// ============================================

Then('La tabla de clubes debe ser visible', async function () {
  const isVisible = await privatePage.isVisible(privatePage.Selectors.clubsTable);
  expect(isVisible).toBeTruthy();
});

Then('Se debe mostrar {string}', async function (expectedText: string) {
  const resultsInfo = await privatePage.getResultsInfo();
  expect(resultsInfo).toBe(expectedText);
});

Then('El boton de cerrar sesion debe estar visible', async function () {
  const isVisible = await privatePage.isLogoutButtonVisible();
  expect(isVisible).toBeTruthy();
});

Then('La tabla debe mostrar {int} resultado(s)', async function (expectedCount: number) {
  const clubsCount = await privatePage.getClubsCount();
  expect(clubsCount).toBe(expectedCount);
});

Then('Los resultados deben mostrar {string}', async function (expectedText: string) {
  const resultsInfo = await privatePage.getResultsInfo();
  expect(resultsInfo).toBe(expectedText);
});

Then('La tabla debe contener {string}', async function (clubName: string) {
  const tableContent = await privatePage.getText('#clubsTable');
  expect(tableContent).toContain(clubName);
});

Then('El usuario debe ser redirigido a la pagina de login', async function () {
  const currentUrl = await privatePage.getCurrentUrl();
  expect(currentUrl).toContain('login.html');
});

Then('Debe aparecer una alerta con el mensaje {string}', async function (expectedMessage: string) {
  expect(this.alertMessage).toBe(expectedMessage);
});

Then('Debe aparecer una alerta de acceso denegado', async function () {
  expect(this.alertMessage).toContain('Debe iniciar sesión');
});