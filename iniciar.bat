@echo off
chcp 65001 >nul
cd /d "%~dp0"
title O Socio - servidor local
if not exist node_modules (
  echo Instalando dependencias, so na primeira vez...
  call npm install --no-audit --no-fund
)
if not exist .env (
  echo.
  echo  ATENCAO: arquivo .env nao encontrado.
  echo  Copie ".env.exemplo" para ".env" e cole sua chave da API.
  echo  Sem a chave, o prototipo abre em modo demonstracao.
  echo.
)
node server.mjs --abrir
pause
