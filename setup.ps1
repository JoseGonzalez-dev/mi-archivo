<#
.SYNOPSIS
Setup para Windows del proyecto mi-archivo.

.DESCRIPTION
Verifica Node.js/npm, instala dependencias en frontend/backend, intenta aplicar el esquema SQL Server si sqlcmd está disponible,
valida el backend y sugiere cómo levantar el proyecto localmente o con Docker.
#>

Set-StrictMode -Version Latest

function Write-Header {
    param([string]$Text)
    Write-Host "" -ForegroundColor White
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host " $Text" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
}

function Command-Exists {
    param([string]$Name)
    try {
        Get-Command $Name -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

Write-Header "Verificando herramientas"
$missing = @()
foreach ($tool in @('node', 'npm')) {
    if (-not (Command-Exists $tool)) { $missing += $tool }
}

if ($missing.Count -gt 0) {
    Write-Host "Faltan herramientas obligatorias: $($missing -join ', ')" -ForegroundColor Red
    Write-Host "Instala Node.js y npm antes de continuar."
    if (Command-Exists 'docker') {
        Write-Host "Docker está instalado. Puedes usar Docker Compose si no quieres la instalación local."
        Write-Host "  docker compose up --build"
    }
    exit 1
}

Write-Host "Node: $(node --version)" -ForegroundColor Green
Write-Host "npm: $(npm --version)" -ForegroundColor Green

function Install-Dependencies {
    param([string]$path)
    if (Test-Path $path) {
        Write-Host "-> Instalando dependencias en $path" -ForegroundColor Yellow
        Push-Location $path
        npm install
        Pop-Location
    }
}

Write-Header "Instalando dependencias"
Install-Dependencies "backend"
Install-Dependencies "frontend"

if (-not (Test-Path "$root/frontend/node_modules/react")) {
    Write-Host "Error: React no se instaló correctamente en frontend/node_modules/react" -ForegroundColor Red
    exit 1
}

$sqlcmdAvailable = Command-Exists 'sqlcmd'
$dockerAvailable = Command-Exists 'docker' -and ((docker compose version) -ne $null)

Write-Header "Verificando base de datos"
if ($sqlcmdAvailable) {
    Write-Host "sqlcmd encontrado. Intentando aplicar esquema de base de datos..." -ForegroundColor Green
    $envFile = Join-Path $root 'backend\.env'
    if (Test-Path $envFile) {
        Get-Content $envFile | ForEach-Object {
            if ($_ -and ($_ -notmatch '^[#;]') -and ($_ -match '=') ) {
                $parts = $_ -split '=', 2
                $name = $parts[0].Trim()
                $value = $parts[1].Trim()
                if ($name) { Set-Item -Path Env:$name -Value $value }
            }
        }
    }
    $dbServer = $env:DB_SERVER -or 'localhost'
    $dbUser = $env:DB_USER -or 'sa'
    $dbPassword = $env:DB_PASSWORD
    if (-not $dbPassword) {
        Write-Host "Atención: no se encontró DB_PASSWORD. Crea backend\.env o exporta DB_PASSWORD antes de aplicar el esquema." -ForegroundColor Yellow
    } else {
        try {
            sqlcmd -S $dbServer -U $dbUser -P $dbPassword -i "$root\database\script.sql"
            Write-Host "Esquema aplicado correctamente." -ForegroundColor Green
        } catch {
            Write-Host "Error al aplicar el esquema SQL Server. Revisa la conexión y el archivo backend\.env." -ForegroundColor Red
            Write-Host $_.Exception.Message
        }
    }
} else {
    Write-Host "sqlcmd no está disponible." -ForegroundColor Yellow
    if ($dockerAvailable) {
        Write-Host "Docker está disponible. Puedes levantar la base de datos usando Docker Compose."
        Write-Host "  docker compose up --build"
    } else {
        Write-Host "Ni sqlcmd ni Docker están disponibles. Instala SQL Server localmente o Docker para continuar." -ForegroundColor Red
    }
}

Write-Header "Verificando backend"
$backendEnv = Join-Path $root 'backend\.env'
if (Test-Path $backendEnv) {
    Write-Host "Intentando iniciar backend temporalmente para validar la configuración..." -ForegroundColor Yellow
    Push-Location "$root/backend"
    $process = Start-Process node -ArgumentList 'index.js' -NoNewWindow -PassThru
    Start-Sleep -Seconds 6
    if (-not $process.HasExited) {
        Write-Host "Backend arrancó correctamente." -ForegroundColor Green
        $process | Stop-Process -Force
    } else {
        Write-Host "No fue posible arrancar el backend. Revisa backend\.env y la base de datos." -ForegroundColor Red
    }
    Pop-Location
} else {
    Write-Host "No existe backend\.env. Crea una copia de backend\.env.example y configura la conexión a la base de datos." -ForegroundColor Yellow
}

Write-Header "Resultado final"
Write-Host "Proyecto listo para desarrollo si las dependencias y la base de datos están configuradas correctamente." -ForegroundColor Green
Write-Host "Para iniciar el proyecto localmente, ejecuta en dos terminales:"
Write-Host "  cd backend && npm run dev"
Write-Host "  cd frontend && npm run dev"
if ($dockerAvailable) {
    Write-Host "" -ForegroundColor White
    Write-Host "Si prefieres usar Docker, puedes ejecutar:" -ForegroundColor Green
    Write-Host "  docker compose up --build"
}
