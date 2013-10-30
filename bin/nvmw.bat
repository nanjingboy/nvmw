@echo off

setlocal
for /f "tokens=2*" %%a in ('reg query HKEY_CURRENT_USER\Software\Node.js /v InstallPath') do set "node_path=%%b\node.exe"
if  exist "%node_path%" (
  "%node_path%" "%~dp0\..\lib\cli.js" %1 %2
  endlocal

  if "%1" == "use" (
    call :set_enviroment %1
  ) else if "%1" == "deactivate" (
    call :set_enviroment %1
  ) else if "%1" == "switch" (
    call :set_enviroment %1
  ) else if "%1" == "switch-deactivate" (
    call :set_enviroment %1
  )
  exit /b %ERRORLEVEL%
)
exit /b 1

:set_enviroment
  if %ERRORLEVEL% == 0 (
      if "%1" == "switch" (
        "%HOMEDRIVE%\%HOMEPATH%\cmd_auto_run.bat"
      ) else (
        "%TMP%\nvmw_env.bat"
      )
  )
exit /b 0