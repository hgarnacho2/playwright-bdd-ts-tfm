---

TFM - CFGS DAW - Héctor Garnacho García

---

# Framework de Testing BDD con Playwright, Cucumber y TypeScript

Este proyecto implementa un **framework de testing automatizado** usando **Playwright**, **Cucumber** (BDD), **Gherkin**, **TypeScript** y **Page Object Model (POM)** para probar la aplicación web de login.

---

## 🚀 Instalación y Configuración

### 1. Inicializar proyecto e instalar dependencias

```bash
npm run init
```

### 2. Preparar archivos HTML

Asegúrate de que `login.html` y `private.html` estén en la carpeta `/docs` dentro del proyecto.

---

## 🧪 Ejecutar Tests

### Ejecutar todos los tests en modo headless (Navegador visible)

```bash
npm run test:local
```

### Ejecución ralentizada

Los test se ejecutan a gran velocidad, por lo que es posible que no de tiempo a visuablizar correctamente las interacciones del framework con el frontal de la aplicación web. Por ello, podemos ejecutarlos a una velocidad menor.

```bash
npm run test:local:slow
```

### Ejecutar todos los tests en modo headless (navegador no visible)

```bash
npm test:local:headless
```

### Ejecutar tests en navegadores específicos

| Script                          | Navegador | Headless |
| ------------------------------- | --------- | -------- |
| `npm run test:chromium`         | Chromium  | true     |
| `npm run test:firefox`          | Firefox   | false    |
| `npm run test:webkit`           | WebKit    | false    |
| `npm run test:firefox:headless` | Firefox   | true     |
| `npm run test:webkit:headless`  | WebKit    | true     |

### Ejecutar tests según etiquetado (tags)

Es posible ejecutar subconjuntos de tests, segúnb su etiquetado. Por ejemplo, podemos ejecutar solo los tests automatizados referentes al login o los de la página privada por separado.

| Script                          | Etiqueta  |
| ------------------------------- | --------- |
| `npm run test:login`            | login     |  Solo tests con tag @login
| `npm run test:private`          | private   |  Solo tests con tag @private
---

## 📋 Scenarios de Prueba

* ✅ Login exitoso con credenciales válidas
* ❌ Login fallido con credenciales inválidas
* ❌ Login fallido sin aceptar términos de uso
* 🔐 Acceso directo a zona privada sin autenticación
* ✅ Visualizar la lista de clubes correctamente
* ✅ Buscar clubes por nombre
* ✅ Buscar clubes por ciudad 
* ✅ Cerrar sesión correctamente

---

## 📊 Reportes

Los reportes se generan automáticamente en:

* HTML: `reports/cucumber-report.html`
* JSON: `reports/cucumber-report.json`
* Screenshots: `reports/screenshots/`

---

## 🏗️ Estructura del Proyecto

```
├── tests/
│   ├── features/           # Scenarios en Gherkin (.feature)
│   ├── pages/              # Page Object Model (TypeScript)
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   └── PrivatePage.ts
│   ├── steps/              # Implementación de steps (TypeScript)
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
├── tsconfig.json           # Configuración de TypeScript
└── package.json            # Dependencias y scripts
```

---

## 🔧 Tecnologías Utilizadas

* **TypeScript**: Tipado estático y robustez
* **Playwright**: Automatización de navegadores
* **Cucumber**: BDD para escribir tests en lenguaje natural
* **Gherkin**: Lenguaje para definir escenarios de prueba
* **Page Object Model**: Patrón de diseño para organizar el código

---

## 📝 Ventajas de TypeScript

* ✅ **Type Safety**
* ✅ **IntelliSense**
* ✅ **Refactoring seguro**
* ✅ **Documentación automática con tipos**
* ✅ **Mantenibilidad y limpieza del código**

---

## 🛠️ Scripts Disponibles

```bash
npm run init                    # Instala dependencias y navegadores
npm test                        # Ejecuta todos los tests en modo headed (HEADLESS=false)
npm run test:headless           # Ejecuta tests en modo headless
npm run test:debug               # Tests con tag @debug
npm run test:login               # Tests con tag @login
npm run test:chromium            # Tests en Chromium headless
npm run test:firefox             # Tests en Firefox
npm run test:webkit              # Tests en WebKit
npm run test:firefox:headless    # Tests en Firefox headless
npm run test:webkit:headless     # Tests en WebKit headless
npm run lint                     # Ejecuta ESLint
npm run format                   # Formatea código con Prettier
```

---

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

---

## 🐛 Debugging

1. Usa VS Code con extensión de Cucumber
2. Añade breakpoints en archivos `.ts`
3. Ejecuta con `npm run test`

---

