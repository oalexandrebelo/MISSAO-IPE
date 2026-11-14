@echo off
setlocal
where node >nul 2>nul
if errorlevel 1 (
  echo Node nao encontrado. Instale Node 24 ou superior, ou abra COMECE_AQUI.html.
  pause
  exit /b 1
)
node "%~dp0ab-mission-ipe\scripts\serve-presentation-kit.mjs"
if errorlevel 1 pause
