#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🎭 Framework de Testing BDD con Playwright, Cucumber y TypeScript${NC}"
echo -e "${BLUE}================================================================${NC}\n"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
    npm install
fi

if [ ! -d "node_modules/playwright/.local-browsers" ]; then
    echo -e "${YELLOW}🌐 Instalando navegadores de Playwright...${NC}"
    npx playwright install
fi

if [ ! -d "dist" ]; then
    echo -e "${YELLOW}⚙️  Compilando TypeScript...${NC}"
    npm run build
fi

mkdir -p reports/screenshots

if [ ! -f "demo/login.html" ] || [ ! -f "demo/private.html" ]; then
    echo -e "${RED}❌ No se encontraron los archivos login.html y/o private.html en la carpeta /demo${NC}"
    echo -e "${YELLOW}💡 Por favor, copia tus archivos HTML a la carpeta demo/${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Configuración verificada${NC}\n"
echo -e "${YELLOW}🧪 Ejecutando tests...${NC}"

npm test

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Todos los tests pasaron exitosamente${NC}"
    echo -e "${BLUE}📊 Reportes disponibles en: reports/cucumber-report.html${NC}"
else
    echo -e "${RED}❌ Algunos tests fallaron${NC}"
    echo -e "${YELLOW}📸 Revisa los screenshots en: reports/screenshots/${NC}"
fi
