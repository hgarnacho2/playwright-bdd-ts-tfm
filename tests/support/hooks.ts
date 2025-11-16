import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { ICustomWorld } from './world';
import * as fs from 'fs';

// Variables globales para tracking
let totalScenarios = 0;
let passedScenarios = 0;
let failedScenarios = 0;
let skippedScenarios = 0;
let totalDuration = 0;
let startTime: number;

BeforeAll(async function() {
  const dirs = ['reports', 'reports/screenshots'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Iniciar contador de tiempo
  startTime = Date.now();
  console.log('\n🎬 ============================================');
  console.log('   INICIANDO SUITE DE TESTS');
  console.log('============================================\n');
});

Before(async function(this: ICustomWorld, scenario) {
  const browserType = (process.env.BROWSER as 'chromium' | 'firefox' | 'webkit') || 'chromium';
  await this.openBrowser(browserType);
  this.clearTestData();
  totalScenarios++;
  console.log(`\n🚀 Iniciando escenario: ${scenario.pickle.name} en navegador: ${browserType}`);
});

After(async function(this: ICustomWorld, scenario) {
  try {
    if (scenario.result?.status === Status.FAILED) {
      const scenarioName = scenario.pickle.name.replace(/[^a-zA-Z0-9]/g, '-');
      await this.takeScreenshot(`failed-${scenarioName}`);
      failedScenarios++;
    } else if (scenario.result?.status === Status.PASSED) {
      passedScenarios++;
    } else if (scenario.result?.status === Status.SKIPPED) {
      skippedScenarios++;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.log('⚠️ Error al tomar screenshot:', errorMessage);
  } finally {
    await this.closeBrowser();
    
    // Log individual del escenario
    if (scenario.result?.status === Status.FAILED) {
      console.log(`❌ Escenario fallido: ${scenario.pickle.name}\n`);
    } else if (scenario.result?.status === Status.PASSED) {
      console.log(`✅ Escenario exitoso: ${scenario.pickle.name}\n`);
    } else {
      console.log(`⊘ Escenario saltado: ${scenario.pickle.name}\n`);
    }
  }
});

AfterAll(async function() {
  const endTime = Date.now();
  totalDuration = (endTime - startTime) / 1000; // en segundos
  
  const passRate = totalScenarios > 0 ? ((passedScenarios / totalScenarios) * 100).toFixed(2) : '0';
  
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                   📊 RESUMEN DE EJECUCIÓN                  ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  
  // Estadísticas principales
  console.log('📈 ESTADÍSTICAS:');
  console.log('  ├─ 📝 Total de escenarios:    ' + totalScenarios);
  console.log('  ├─ ✅ Escenarios exitosos:    ' + passedScenarios);
  console.log('  ├─ ❌ Escenarios fallidos:    ' + failedScenarios);
  console.log('  ├─ ⊘  Escenarios saltados:    ' + skippedScenarios);
  console.log('  └─ 🎯 Tasa de éxito:          ' + passRate + '%');
  console.log('');
  
  // Tiempo de ejecución
  console.log('⏱️  TIEMPO DE EJECUCIÓN:');
  console.log('  └─ ⏰ Duración total:         ' + totalDuration.toFixed(2) + 's');
  console.log('');
  
  // Entorno
  const browser = process.env.BROWSER || 'chromium';
  const headless = process.env.HEADLESS === 'true' ? 'Sí' : 'No';
  const env = process.env.ENV || 'local';
  
  console.log('🔧 CONFIGURACIÓN:');
  console.log('  ├─ 🌐 Navegador:              ' + browser);
  console.log('  ├─ 👁️  Headless:               ' + headless);
  console.log('  └─ 🏷️  Entorno:                ' + env);
  console.log('');
  
  // Reportes
  console.log('📁 REPORTES GENERADOS:');
  console.log('  ├─ 📄 HTML:                   reports/cucumber-report.html');
  console.log('  ├─ 📋 JSON:                   reports/cucumber-report.json');
  if (failedScenarios > 0) {
    console.log('  └─ 📸 Screenshots:            reports/screenshots/');
  }
  console.log('');
  
  // Estado final
  if (failedScenarios === 0) {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║            🎉 ¡TODOS LOS TESTS PASARON! 🎉                 ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
  } else {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║          ⚠️  ALGUNOS TESTS FALLARON ⚠️                     ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
  }
  
  console.log('\n🏁 Ejecución finalizada\n');
});
