@echo off
title Gestor de Socios - Iniciador
color 0A

echo ===================================================
echo      Iniciando el Sistema de Gestion de Socios
echo ===================================================
echo.

:: 1. VERIFICAR NODE.JS
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Node.js no detectado. Intentando instalacion automatica...
    
    :: Descarga el instalador oficial de Node.js (LTS) silenciosamente
    powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi' -OutFile 'node_installer.msi'"
    
    echo [!] Ejecutando instalador. Por favor, completa los pasos en pantalla.
    msiexec /i node_installer.msi /passive /norestart
    
    echo.
    echo [OK] Node.js instalado. 
    echo [!] REINICIA este script para aplicar los cambios de PATH.
    del node_installer.msi
    pause
    exit
)

:: 2. VERIFICAR DEPENDENCIAS BACKEND (Raiz)
echo Revisando dependencias del Backend...
if not exist "node_modules\" (
    echo [!] Carpeta node_modules no encontrada. Instalando...
    call npm install
)

:: 3. INICIAR BACKEND
echo Iniciando servidor Backend...
start "NestJS_Backend" cmd /k "npm run start:dev"

:: 4. VERIFICAR DEPENDENCIAS FRONTEND
echo Revisando dependencias del Frontend...
cd socios-frontend
if not exist "node_modules\" (
    echo [!] Carpeta node_modules no encontrada en Frontend. Instalando...
    call npm install
)

:: 5. INICIAR FRONTEND
echo Iniciando servidor Frontend...
start "Angular_Frontend" cmd /k "npm start"
cd ..

:: 6. ESPERA Y LANZAMIENTO
echo.
echo ===================================================
echo   Esperando a que los servidores se estabilicen...
echo ===================================================
:: Usamos ping como alternativa a timeout por si falla la redireccion
ping 127.0.0.1 -n 15 >nul

echo.
echo Abriendo navegador en http://localhost:4200...
start http://localhost:4200

echo.
echo [LISTO] El sistema esta corriendo.
ping 127.0.0.1 -n 5 >nul
exit