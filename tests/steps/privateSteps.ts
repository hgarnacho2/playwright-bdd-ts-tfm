import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from 'tests/support/world';

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
  if (!this.privatePage) throw new Error('privatePage no ha sido inicializada');
  await this.privatePage.clickLogoutButton();
  await this.privatePage.sleep(500);
});

When('Intento acceder directamente a la zona privada', async function(this: ICustomWorld) {
  if (!this.privatePage || !this.page) throw new Error('PrivatePage no ha sido inicializada');
  await this.privatePage.navigateToPrivateDirectly();
  await this.page.waitForTimeout(1000);
});


Then('Deberia ver la tabla de clubes', async function (this: ICustomWorld) {
  if (!this.privatePage || !this.page) throw new Error('PrivatePage no ha sido inicializada');
  const isVisible = await this.privatePage.isVisible(this.privatePage.Selectors.clubsTable);
  expect(isVisible).toBeTruthy();
});

Then('El boton de cerrar sesion debe estar visible', async function () {
  if (!this.privatePage || !this.page) throw new Error('PrivatePage no ha sido inicializada');  
  const isVisible = await this.privatePage.isLogoutButtonVisible();
  expect(isVisible).toBeTruthy();
});

Then('La tabla debe mostrar {int} resultado(s)', async function (expectedCount: number) {
  if (!this.privatePage || !this.page) throw new Error('PrivatePage no ha sido inicializada');
  const clubsCount = await this.privatePage.getClubsCount();
  expect(clubsCount).toBe(expectedCount);
});

Then('Deberia ver {string} en el texto de resultados', async function (expectedText: string) {
  if (!this.privatePage || !this.page) throw new Error('PrivatePage no ha sido inicializada');
  const resultsInfo = await this.privatePage.getResultsInfo();
  expect(resultsInfo).toBe(expectedText);
});

Then('La tabla debe contener {string}', async function (clubName: string) {
  if (!this.privatePage || !this.page) throw new Error('PrivatePage no ha sido inicializada');
  const tableContent = await this.privatePage.getText('#clubsTable');
  expect(tableContent).toContain(clubName);
});

Then('El usuario debe ser redirigido a la pagina de login', async function () {
  if (!this.privatePage || !this.page) throw new Error('PrivatePage no ha sido inicializada');
  const currentUrl = await this.privatePage.getCurrentUrl();
  expect(currentUrl).toContain('login.html');
});

Then('Debe aparecer una alerta con el mensaje {string}', async function (expectedMessage: string) {
  expect(this.alertMessage).toBe(expectedMessage);
});

Then('Debe aparecer una alerta de acceso denegado', async function () {
  expect(this.alertMessage).toContain('Debe iniciar sesión');
});