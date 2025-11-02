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
