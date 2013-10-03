@echo off

node "%~dp0\..\lib\cli.js" %1 %2

if "%1" == "use" (
  call :set_env %1
) else if "%1" == "deactivate" (
  call :set_env %1
)
exit /b %ERRORLEVEL%

:set_env
  if %ERRORLEVEL% == 0 (
      if "%1" == "deactivate" (
        set "NVMW="
      ) else (
        for /f "tokens=* delims=" %%i in (%TMP%\NVMW) do set "NVMW=%%i"
      )
      for /f "tokens=* delims=" %%i in (%TMP%\PATH) do set "PATH=%%i"
  )
exit /b 0