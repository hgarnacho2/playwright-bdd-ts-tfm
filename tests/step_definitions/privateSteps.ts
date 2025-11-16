import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect, selectors } from '@playwright/test';
import { chromium, Browser, Page, BrowserContext } from '@playwright/test';
import { PrivatePage } from '../pages/PrivatePage';

let browser: Browser;
let context: BrowserContext;
let page: Page;
let privatePage: PrivatePage;
let username: string;

Before(async function () {
  browser = await chromium.launch({ headless: false });
  context = await browser.newContext();
  page = await context.newPage();
  privatePage = new PrivatePage(page);
});

After(async function () {
  await context.close();
  await browser.close();
});

// ============================================
// GIVEN Steps
// ============================================

Given('Me autentico autenticado como {string}', async function (user: string) {
  username = user;
});

Given('Navego a la página privada', async function () {
  const user = username || 'Usuario';
  const privateUrl = `file://${process.cwd()}/demo/private.html?auth=true&user=${user}`;
  await page.goto(privateUrl);
  await privatePage.waitForLoadState();
  await privatePage.waitForWelcomeMessage();
});

Given('No estoy autenticado', async function () {
  username = '';
});

Given('Tengo parámetros de autenticación inválidos', async function () {
  username = 'InvalidUser';
});

// ============================================
// WHEN Steps
// ============================================

When('Busco {string}', async function (searchTerm: string) {
  await privatePage.searchClubs(searchTerm);
  await page.waitForTimeout(500);
});

When('Hago click en el boton de cerrar sesion', async function () {
  await privatePage.clickLogoutButton();
  await page.waitForTimeout(500);
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