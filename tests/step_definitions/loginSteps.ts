import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../support/world';

Given('Estoy en la pagina de login', async function(this: ICustomWorld) {
  if (!this.loginPage) throw new Error('LoginPage no ha sido inicializada');
  await this.loginPage.navigateToLogin();
  const isOnLoginPage = await this.loginPage.isOnLoginPage();
  expect(isOnLoginPage).toBe(true);
});

When('Introduzco el usuario {string} y la contraseña {string}', async function(this: ICustomWorld, username: string, password: string) {
  if (!this.loginPage) throw new Error('LoginPage no ha sido inicializada');
  await this.loginPage.enterUsername(username);
  await this.loginPage.enterPassword(password);
  
  this.setTestData('username', username);
  this.setTestData('password', password);
});

When('Acepto los terminos de uso', async function(this: ICustomWorld) {
  if (!this.loginPage) throw new Error('LoginPage no ha sido inicializada');
  await this.loginPage.acceptTerms();
  const isChecked = await this.loginPage.isTermsChecked();
  expect(isChecked).toBe(true);
});

When('No acepto los terminos de uso', async function(this: ICustomWorld) {
  if (!this.loginPage) throw new Error('LoginPage no ha sido inicializada');
  await this.loginPage.rejectTerms();
  const isChecked = await this.loginPage.isTermsChecked();
  expect(isChecked).toBe(false);
});

When('Hago click en el boton {string}', async function(this: ICustomWorld, buttonText: string) {
  if (!this.loginPage || !this.page) throw new Error('LoginPage no ha sido inicializada');
  if (buttonText === 'Entrar') {
    await this.loginPage.clickLoginButton();
    await this.page.waitForTimeout(500);
  }
});

When('Intento acceder directamente a la zona privada', async function(this: ICustomWorld) {
  if (!this.privatePage || !this.page) throw new Error('PrivatePage no ha sido inicializada');
  await this.privatePage.navigateToPrivateDirectly();
  await this.page.waitForTimeout(1000);
});

Then('Deberia ser redirigido a la zona privada', async function(this: ICustomWorld) {
  if (!this.privatePage || !this.page) throw new Error('PrivatePage no ha sido inicializada');
  await this.page.waitForTimeout(1000);
  const isOnPrivatePage = await this.privatePage.isOnPrivatePage();
  expect(isOnPrivatePage).toBe(true);
});

Then('Deberia permanecer en la pagina de login', async function(this: ICustomWorld) {
  if (!this.loginPage) throw new Error('LoginPage no ha sido inicializada');
  const isOnLoginPage = await this.loginPage.isOnLoginPage();
  expect(isOnLoginPage).toBe(true);
});

Then('Deberia ver el mensaje de bienvenida {string}', async function(this: ICustomWorld, expectedMessage: string) {
  if (!this.privatePage) throw new Error('PrivatePage no ha sido inicializada');
  await this.privatePage.waitForWelcomeMessage();
  const welcomeMessage = await this.privatePage.getWelcomeMessage();
  expect(welcomeMessage).toBe(expectedMessage);
});

Then('Deberia ver la lista de productos', async function(this: ICustomWorld) {
  if (!this.privatePage) throw new Error('PrivatePage no ha sido inicializada');
  await this.privatePage.waitForClubsTable();
});

Then('Deberia ver el mensaje de error {string}', async function(this: ICustomWorld, expectedError: string) {
  if (!this.loginPage) throw new Error('LoginPage no ha sido inicializada');
  await this.loginPage.waitForErrorMessage();
  const errorMessage = await this.loginPage.getErrorMessage();
  expect(errorMessage.trim()).toBe(expectedError);
});

Then('La URL deberia contener {string}', async function(this: ICustomWorld, expectedUrlPart: string) {
  if (!this.page) throw new Error('Page no ha sido inicializada');
  const currentUrl = await this.page.url();
  expect(currentUrl).toContain(expectedUrlPart);
});

Then('Deberia ser redirigido a la pagina de login', async function(this: ICustomWorld) {
  if (!this.loginPage || !this.page) throw new Error('LoginPage no ha sido inicializada');
  await this.page.waitForTimeout(2000);
  const isOnLoginPage = await this.loginPage.isOnLoginPage();
  expect(isOnLoginPage).toBe(true);
});

Then('Deberia ver una alerta indicando que debo iniciar sesion', async function(this: ICustomWorld) {
  expect(this.alertMessage).toContain('Debe iniciar sesión');
});

Given('Inicio sesion con nombre de usuario {string} y contraseña {string}', async function(this: ICustomWorld, username: string, password: string ) {
  if (!this.loginPage) throw new Error('LoginPage no ha sido inicializada');
  await this.loginPage.navigateToLogin();
  const isOnLoginPage = await this.loginPage.isOnLoginPage();
  expect(isOnLoginPage).toBe(true);

  await this.loginPage.enterUsername(username);
  await this.loginPage.enterPassword(password);

  await this.loginPage.acceptTerms();
  const isChecked = await this.loginPage.isTermsChecked();
  expect(isChecked).toBe(true);

  await this.loginPage.clickLoginButton();
  await this.loginPage.sleep(1500);

  if (!this.privatePage || !this.page) throw new Error('PrivatePage no ha sido inicializada');
  await this.page.waitForTimeout(1000);
  const isOnPrivatePage = await this.privatePage.isOnPrivatePage();
  expect(isOnPrivatePage).toBe(true);  

});
