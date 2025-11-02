# Framework de Testing BDD con Playwright, Cucumber y TypeScript

Este proyecto implementa un framework de testing automatizado usando **Playwright**, **Cucumber** (BDD), **Gherkin**, **TypeScript** y **Page Object Model** para probar la aplicación web de login.

## 🚀 Instalación y Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Instalar navegadores de Playwright
```bash
npm run install:browsers
```

### 3. Compilar TypeScript
```bash
npm run build
```

### 4. Preparar archivos HTML
Asegúrate de que `login.html` y `private.html` estén en la carpeta `/demo` situada dentro del proyecto.

## 🧪 Ejecutar Tests

### Ejecutar todos los tests
```bash
npm test
```

### Ejecutar tests específicos por tags
```bash
npm run test:login     # Solo tests de login
npm run test:smoke     # Solo tests de smoke
npm run test:debug     # Solo tests con tag @debug
```

### Ejecutar con navegador visible
```bash
HEADLESS=false npm test
```

### Ejecutar tests predefinidas
```bash
npm run test:chromium           # Tests en Chromium (headless por defecto)
npm run test:firefox            # Tests en Firefox
npm run test:webkit             # Tests en WebKit (Safari)
npm run test:firefox:headless   # Tests en Firefox headless
npm run test:webkit:headless    # Tests en WebKit headless
```

## 📋 Scenarios de Prueba

- ✅ Login exitoso con credenciales válidas
- ❌ Login fallido con credenciales inválidas
- ❌ Login fallido sin aceptar términos
- 🔐 Acceso directo sin autenticación

## 📊 Reportes

Los reportes se generan automáticamente en:
- HTML: `reports/cucumber-report.html`
- JSON: `reports/cucumber-report.json`
- Screenshots: `reports/screenshots/`

## 🏗️ Estructura del Proyecto

```
├── tests/
│   ├── features/           # Scenarios en Gherkin (.feature)
│   ├── pages/              # Page Object Model (TypeScript)
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   └── PrivatePage.ts
│   ├── step_definitions/   # Implementación de steps (TypeScript)
│   │   └── loginSteps.ts
│   └── support/            # Configuración y hooks (TypeScript)
│       ├── world.ts
│       └── hooks.ts
├── demo/                   # Archivos HTML para testing
│   ├── login.html
│   └── private.html
├── reports/                # Reportes y screenshots
├── dist/                   # Código compilado (JavaScript)
├── cucumber.config.ts      # Configuración de Cucumber
├── playwright.config.ts    # Configuración de Playwright
├── tsconfig.json          # Configuración de TypeScript
└── package.json           # Dependencias y scripts
```

## 🔧 Tecnologías Utilizadas

- **TypeScript**: Tipado estático para mayor robustez
- **Playwright**: Framework de automatización de navegadores
- **Cucumber**: Framework BDD para escribir tests en lenguaje natural
- **Gherkin**: Lenguaje para escribir escenarios de prueba
- **Page Object Model**: Patrón de diseño para organizar el código de tests

## 📝 Ventajas de TypeScript

- ✅ **Type Safety**: Detecta errores en tiempo de compilación
- ✅ **IntelliSense**: Autocompletado mejorado en el IDE
- ✅ **Refactoring**: Más seguro y sencillo
- ✅ **Documentación**: El código es autodocumentado con tipos
- ✅ **Mantenibilidad**: Código más limpio y fácil de mantener

## 🛠️ Scripts Disponibles

```bash
npm run build              # Compila TypeScript a JavaScript
npm test                   # Ejecuta todos los tests
npm run test:debug         # Ejecuta tests con tag @debug
npm run test:smoke         # Ejecuta tests smoke
npm run test:login         # Ejecuta tests de login
npm run lint               # Ejecuta linter (ESLint)
npm run format             # Formatea código (Prettier)
```

## 🔍 Desarrollo

### Compilar en modo watch
```bash
npx tsc --watch
```

### Ejecutar linter
```bash
npm run lint
```

### Formatear código
```bash
npm run format
```

## 📖 Guía de Migración desde JavaScript

Si estás migrando desde la versión JavaScript:

1. Instala las nuevas dependencias: `npm install`
2. Compila el código TypeScript: `npm run build`
3. Los archivos `.feature` permanecen sin cambios
4. Toda la lógica está ahora tipada en archivos `.ts`

## 🐛 Debugging

Para debuggear tests en TypeScript:

1. Usa VS Code con extensión de Cucumber
2. Añade breakpoints en archivos `.ts`
3. Ejecuta con el debugger de VS Code

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.
