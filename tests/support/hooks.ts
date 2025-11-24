import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { ICustomWorld } from './world';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import path from 'path';

// ════════════════════════════════════════════════════════════════════════════
// 🎨 COLORES ANSI PARA CONSOLA
// ════════════════════════════════════════════════════════════════════════════
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  // Colores de texto
  violet: '\x1b[35m',
  magenta: '\x1b[95m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  
  // Backgrounds
  bgViolet: '\x1b[45m',
  bgBlack: '\x1b[40m',
};

// Variables globales para tracking
let totalScenarios = 0;
let passedScenarios = 0;
let failedScenarios = 0;
let skippedScenarios = 0;
let totalDuration = 0;
let startTime: number;

// Determinar el entorno (por defecto 'local')
const env = process.env.ENV || 'local';

// Cargar el archivo .env correspondiente
const envFilePath = path.resolve(__dirname, `../../.env.${env}`);
dotenv.config({ path: envFilePath });
const environment = process.env.NODE_ENV || process.env.ENV || 'local';

BeforeAll(async function() {
  const dirs = ['reports', 'reports/screenshots'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Iniciar contador de tiempo
  startTime = Date.now();
  console.log('\n============================================');
  console.log(` 🎬 TFM - ${colors.violet}${colors.bright}Héctor Garnacho García${colors.reset}`);
  console.log('============================================\n');
});

Before(async function(this: ICustomWorld, scenario) {
  const browserType = (process.env.BROWSER as 'chromium' | 'firefox' | 'webkit') || 'chromium';
  await this.openBrowser(browserType);
  this.clearTestData();
  totalScenarios++;
  console.log(`\n${colors.cyan}🚀 Iniciando escenario:${colors.reset} ${scenario.pickle.name} ${colors.gray}en navegador: ${browserType}${colors.reset}`);
  console.log(`${colors.violet}⚙️  Entorno:${colors.reset} ${environment}`);
  console.log(`${colors.violet}🌐 URL:${colors.reset} ${process.env.BASE_URL!}${colors.reset}`);
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
    console.log(`${colors.yellow}⚠️  Error al tomar screenshot:${colors.reset} ${errorMessage}`);
  } finally {
    await this.closeBrowser();
    
    // Log individual del escenario
    if (scenario.result?.status === Status.FAILED) {
      console.log(`${colors.red}❌ Escenario fallido:${colors.reset} ${scenario.pickle.name}\n`);
    } else if (scenario.result?.status === Status.PASSED) {
      console.log(`${colors.green}✅ Escenario exitoso:${colors.reset} ${scenario.pickle.name}\n`);
    } else {
      console.log(`${colors.gray}⊘  Escenario saltado:${colors.reset} ${scenario.pickle.name}\n`);
    }
  }
});

AfterAll(async function() {
  const endTime = Date.now();
  totalDuration = (endTime - startTime) / 1000; // en segundos
  
  const passRate = totalScenarios > 0 ? ((passedScenarios / totalScenarios) * 100).toFixed(2) : '0';
  
  console.log(`${colors.bright}${colors.cyan}-------------------------------------------------`);
  console.log(`📊 RESUMEN DE EJECUCIÓN`);
  console.log(`-------------------------------------------------${colors.reset}`);
  console.log('');
  
  // Estadísticas principales
  console.log(`${colors.blue}📈 ESTADÍSTICAS:${colors.reset}`);
  console.log(`  ├─ 📝 Total de escenarios:    ${colors.bright}${totalScenarios}${colors.reset}`);
  console.log(`  ├─ ${colors.green}✅ Escenarios exitosos:${colors.reset}    ${colors.green}${colors.bright}${passedScenarios}${colors.reset}`);
  console.log(`  ├─ ${colors.red}❌ Escenarios fallidos:${colors.reset}    ${colors.red}${colors.bright}${failedScenarios}${colors.reset}`);
  console.log(`  ├─ ${colors.gray}⊘  Escenarios saltados:${colors.reset}    ${colors.gray}${skippedScenarios}${colors.reset}`);
  console.log(`  └─ ${colors.cyan}🎯 Tasa de éxito:${colors.reset}          ${colors.bright}${passRate}%${colors.reset}`);
  console.log('');
  
  // Tiempo de ejecución
  console.log(`${colors.magenta}⏱️  TIEMPO DE EJECUCIÓN:${colors.reset}`);
  console.log(`  └─ ${colors.yellow}⏰ Duración total:${colors.reset}         ${colors.bright}${totalDuration.toFixed(2)}s${colors.reset}`);
  console.log('');
  
  // Entorno
  const browser = process.env.BROWSER || 'chromium';
  const headless = process.env.HEADLESS === 'true' ? 'Sí' : 'No';
  const env = process.env.ENV || 'local';
  
  console.log(`${colors.blue}🔧 CONFIGURACIÓN:${colors.reset}`);
  console.log(`  ├─ 🌐 Navegador:              ${colors.bright}${browser}${colors.reset}`);
  console.log(`  ├─ 👁️  Headless:               ${colors.bright}${headless}${colors.reset}`);
  console.log(`  └─ 🏷️  Entorno:                ${colors.bright}${env}${colors.reset}`);
  console.log('');
  
  // Reportes
  console.log(`${colors.cyan}📁 REPORTES GENERADOS:${colors.reset}`);
  console.log(`  ├─ 📄 HTML:                   ${colors.gray}reports/cucumber-report.html${colors.reset}`);
  console.log(`  ├─ 📋 JSON:                   ${colors.gray}reports/cucumber-report.json${colors.reset}`);
  if (failedScenarios > 0) {
    console.log(`  └─ 📸 Screenshots:            ${colors.gray}reports/screenshots/${colors.reset}`);
  }
  console.log('');
  
  // Estado final
  if (failedScenarios === 0) {
    console.log(`${colors.green}${colors.bright}-------------------------------------------------`);
    console.log(`🎉 ¡TODOS LOS TESTS PASARON! 🎉`);
    console.log(`${colors.green}${colors.bright}-------------------------------------------------${colors.reset}`);
  } else {
    console.log(`${colors.red}${colors.bright}-------------------------------------------------`);
    console.log(`⚠️  ALGUNOS TESTS FALLARON ⚠️`);
    console.log(`${colors.red}${colors.bright}-------------------------------------------------${colors.reset}`);
  }
  
  console.log(`\n${colors.white}🏁 Ejecución finalizada${colors.reset}\n`);
});