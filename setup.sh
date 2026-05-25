#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

print_header() {
  echo
  echo "========================================"
  echo " $1"
  echo "========================================"
}

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

print_header "Verificando herramientas"
MISSING=()
for tool in node npm; do
  if ! command_exists "$tool"; then
    MISSING+=("$tool")
  fi
done

if [ "${#MISSING[@]}" -ne 0 ]; then
  echo "Faltan herramientas obligatorias: ${MISSING[*]}"
  echo "Instala Node.js y npm antes de continuar."
  if command_exists docker; then
    echo "Docker está instalado, puedes usar Docker Compose para levantar el proyecto si no quieres instalación local."
    echo "  docker compose up --build"
  fi
  exit 1
fi

NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
echo "Node: $NODE_VERSION"
echo "npm: $NPM_VERSION"

print_header "Instalando dependencias"
if [ -d "$ROOT/backend" ]; then
  echo "-> backend"
  cd "$ROOT/backend"
  npm install
  cd "$ROOT"
fi

if [ -d "$ROOT/frontend" ]; then
  echo "-> frontend"
  cd "$ROOT/frontend"
  npm install
  cd "$ROOT"
fi

print_header "Verificando instalación de React"
if [ ! -d "$ROOT/frontend/node_modules/react" ]; then
  echo "Error: React no se instaló correctamente en frontend/node_modules/react"
  exit 1
fi

SQLCMD_AVAILABLE=false
if command_exists sqlcmd; then
  SQLCMD_AVAILABLE=true
fi

DOCKER_AVAILABLE=false
if command_exists docker && (docker compose version >/dev/null 2>&1 || command_exists docker-compose); then
  DOCKER_AVAILABLE=true
fi

print_header "Verificando base de datos"
if [ "$SQLCMD_AVAILABLE" = true ]; then
  echo "sqlcmd encontrado. Intentando aplicar esquema de base de datos..."
  DB_ENV_FILE="$ROOT/backend/.env"
  if [ -f "$DB_ENV_FILE" ]; then
    set -o allexport
    source "$DB_ENV_FILE"
    set +o allexport
  fi

  DB_SERVER="${DB_SERVER:-localhost}"
  DB_USER="${DB_USER:-sa}"
  DB_PASSWORD="${DB_PASSWORD:-}"

  if [ -z "$DB_PASSWORD" ]; then
    echo "Atención: no se encontró DB_PASSWORD. Crea backend/.env o exporta DB_PASSWORD antes de aplicar el esquema."
  else
    echo "Usando servidor de base de datos: $DB_SERVER"
    sqlcmd -S "$DB_SERVER" -U "$DB_USER" -P "$DB_PASSWORD" -i "$ROOT/database/script.sql"
    echo "Esquema aplicado correctamente."
  fi
else
  echo "sqlcmd no está disponible."
  if [ "$DOCKER_AVAILABLE" = true ]; then
    echo "Docker está disponible. Puedes levantar la base de datos usando Docker Compose."
    echo "  docker compose up --build"
  else
    echo "Ni sqlcmd ni Docker están disponibles. Instala SQL Server localmente o Docker para continuar."
  fi
fi

print_header "Verificando backend"
if [ -f "$ROOT/backend/.env" ]; then
  echo "Intentando iniciar backend temporalmente para validar la configuración..."
  cd "$ROOT/backend"
  node index.js >/tmp/miarchivo-backend-check.log 2>&1 &
  BACKEND_PID=$!
  sleep 6
  if kill -0 "$BACKEND_PID" >/dev/null 2>&1; then
    if grep -q "Servidor iniciado" /tmp/miarchivo-backend-check.log 2>/dev/null; then
      echo "Backend arrancó correctamente."
    else
      echo "Backend se está ejecutando, pero no se encontró el mensaje de inicio en los registros. Comprueba backend/.env y la base de datos."
    fi
    kill "$BACKEND_PID" >/dev/null 2>&1 || true
    wait "$BACKEND_PID" 2>/dev/null || true
  else
    echo "No fue posible arrancar el backend. Revisa backend/.env y la base de datos."
    cat /tmp/miarchivo-backend-check.log
    exit 1
  fi
else
  echo "No existe backend/.env. Crea una copia de backend/.env.example y configura la conexión a la base de datos."
fi

print_header "Resultado final"
echo "Proyecto listo para desarrollo si las dependencias y la base de datos están configuradas correctamente."
echo "Para iniciar el proyecto localmente, ejecuta en dos terminales:"
echo "  cd backend && npm run dev"
echo "  cd frontend && npm run dev"
if [ "$DOCKER_AVAILABLE" = true ]; then
  echo
  echo "Si prefieres usar Docker, ejecuta también:"
  echo "  docker compose up --build"
fi
