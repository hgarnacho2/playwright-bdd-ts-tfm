# Framework de Testing BDD con Playwright, Cucumber y TypeScript

Este proyecto implementa un **framework de testing automatizado** usando **Playwright**, **Cucumber** (BDD), **Gherkin**, **TypeScript** y **Page Object Model (POM)** para probar la aplicación web de login.

---

## 🚀 Instalación y Configuración

### 1. Inicializar proyecto e instalar dependencias

```bash
npm run init
```

### 2. App Web Demo de Autenticación y Filtrado (Clubes de Fútbol)

Esta App Web está formada por dos páginas HTML estáticas diseñadas para simular un flujo básico de autenticación y acceso a contenido restringido. 

 🔗 Acceso a la app web demo

Las páginas están diseñadas para ser servidas como archivos estáticos través de GitHub Pages.

| Archivo | URL de Acceso | Descripción |
| :--- | :--- | :--- |
| **`login.html`** | `/login.html` | Página de inicio de sesión. |
| **`private.html`** | `/private.html` | Zona privada con la lista de clubes (requiere autenticación). |

> **Nota:** La URL base es la siguiente: 
* https://hgarnacho2.github.io/app-web-demo/login.html

---

#### 🔐 `login.html`: Funcionalidad de Autenticación

La página de inicio de sesión implementa una lógica de autenticación simple y completamente contenida en JavaScript.

### Credenciales de Prueba

Utiliza las siguientes credenciales y requisitos para realizar un inicio de sesión exitoso:

| Campo | Valor Requerido | Observación |
| :--- | :--- | :--- |
| **Nombre de usuario** | `user` | Sensible a mayúsculas/minúsculas. |
| **Contraseña** | `password` | Sensible a mayúsculas/minúsculas. |
| **Términos de uso** | Debe estar **marcado** | Obligatorio para el inicio de sesión. |

### Flujo de Navegación

1.  Si el inicio de sesión es exitoso, la página redirige a `private.html` después de 1 segundo.
2.  La redirección incluye parámetros de autenticación en la URL (`?auth=true&user=...`).

---

## 🛡️ `private.html`: Zona Privada y Datos

Esta página simula una zona de contenido exclusivo, ofreciendo una tabla interactiva de datos.

### Acceso Restringido

La página comprueba la existencia del parámetro `auth=true` en la URL. Si no se detecta, el usuario es **redirigido inmediatamente a `login.html`**.

### Contenido y Funcionalidades

La página carga una lista de 25 clubes de fútbol españoles.

* **Búsqueda (Filtro):** El campo de entrada con `id="searchInput"` permite filtrar la tabla en tiempo real por **nombre del club** o **ciudad**.
* **Paginación:** La tabla está paginada, mostrando **10 clubes por página**.
* **Cerrar Sesión:** El botón con `id="logoutBtn"` redirige al usuario de vuelta a `login.html`.

---

## 🧪 Notas para la Automatización (E2E)

Las siguientes propiedades se han incluido en el diseño de las páginas para facilitar la creación de tests automatizados con herramientas como Playwright:

* Todos los campos de entrada y botones clave tienen **ID's únicos** (`#username`, `#password`, `#terms`, `#logoutBtn`, `#searchInput`).
* Los mensajes de error y éxito de la autenticación se muestran en el elemento con `id="errorMessage"`.
* La tabla de resultados es fácilmente accesible mediante `id="clubsTable"`.

El código de estas páginas es estable y es un objetivo predecible para ejercicios de automatización de pruebas.

---

## 🧪 Ejecutar Tests

### Ejecutar todos los tests en modo headless

```bash
npm run test:headless
```

### Ejecutar todos los tests en modo headed (navegador visible)

```bash
npm test
```

### Ejecutar tests por tags

```bash
npm run test:debug   # Solo tests con tag @debug
npm run test:login   # Solo tests con tag @login
```

### Ejecutar tests en navegadores específicos

| Script                          | Navegador | Headless |
| ------------------------------- | --------- | -------- |
| `npm run test:chromium`         | Chromium  | true     |
| `npm run test:firefox`          | Firefox   | false    |
| `npm run test:webkit`           | WebKit    | false    |
| `npm run test:firefox:headless` | Firefox   | true     |
| `npm run test:webkit:headless`  | WebKit    | true     |

---

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

