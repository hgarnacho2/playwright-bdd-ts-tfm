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
