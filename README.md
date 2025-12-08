---

TFM - CFGS DAW - Héctor Garnacho García

---

# Framework de Testing BDD con Playwright, Cucumber y TypeScript

Este proyecto implementa un **framework de testing automatizado** usando **Playwright**, **Cucumber** (BDD), **Gherkin**, **TypeScript** y **Page Object Model (POM)** para probar la aplicación web de login.

---

## 🚀 Instalación y Configuración

### 1. Inicializar proyecto e instalar dependencias
Para poder instalar y ejecutar el proyecto, es necesario disponer de un ordenador que tenga instado:
* Node.js (recomendadad versión 24.x
* GIT

Una vez dispongamos de Node y GIT, Los pasos para la instalación son los siguientes:

1. Clonar este proyecto en la carpeta destinon que deseemos en nuestro ordenador

```git
git clone https://github.com/hgarnacho2/playwright-bdd-ts-tfm.git
```

2. Entrar a la carpeta en la que hayamos instalado nuestro proyecto y ejecutar el siguiente comando

```bash
npm run init
```

Una vez hayamos hecho esto, ya podremos ejecutar las pruebas automartizadas en nuestro ordenador de modo local.

### 2. Aplicación web de ejemplo para pruebas

La aplicación web de pruebas se encuentra en 2 sitios:

* En la carpeta **docs** del proyecto
    * login.html
    * private.html

* Desplegada en **GitHub Pages**
    * https://hgarnacho2.github.io/playwright-bdd-ts-tfm/login.html

---

## 🧪 Ejecutar Tests en nuestro ordenador (Modo local)

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
| `npm run test:login`            | login     | # Solo tests con tag @login
| `npm run test:private`          | private   | # Solo tests con tag @private
---

### Probar Integración continua (Ejecutar las pruebas automatizadas en un pipeline CI en GitHub)
Para realizar una prueba real de integración continua se pueden seguir los siguientes pasos:
1. Realizar un cambio sobre la aplicación web de prueba en la rama dev (Archivos login.html o private.html en la carpeta docs)
2. Crear una pull request desde la rama dev a la rama main
3. Automáticamente se lanzarán los checks relativos al despliegue de lqa web de ejemplo en GitHub PAges y los tests automatizados en PlayWright
4. Si los tests son incorrectos, se bloqueará la pull request. En caso de pasar correctamente, se podrá confirmar el cambio sobre la rama main.
5. Se habrán generado los informes (artifacts) sobre la ejecución de los tests.

## 📋 Scenarios de Prueba

* ✅ Login exitoso con credenciales válidas
* ❌ Login fallido con credenciales inválidas
* ❌ Login fallido sin aceptar términos
* 🔐 Acceso directo sin autenticación

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

