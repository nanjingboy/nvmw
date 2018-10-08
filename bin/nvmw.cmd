@ECHO OFF

SETLOCAL

SET "NODE_EXE=%~dp0\node.exe"
IF NOT EXIST "%NODE_EXE%" (
  SET "NODE_EXE=node"
)

"%NODE_EXE%" "%~dp0\..\lib\cli.js" %1 %2

ENDLOCAL

IF "%1" == "use" (
  CALL :set_enviroment %1
) ELSE IF "%1" == "deactivate" (
  CALL :set_enviroment %1
) ELSE IF "%1" == "switch" (
  CALL :set_enviroment %1
) ELSE IF "%1" == "switch-deactivate" (
  CALL :set_enviroment %1
)
EXIT /b %ERRORLEVEL%

:set_enviroment
  IF %ERRORLEVEL% == 0 (
      IF "%1" == "switch" (
        "%HOMEDRIVE%\%HOMEPATH%\cmd_auto_run.bat"
      ) ELSE (
        "%TMP%\nvmw_env.bat"
      )
  )
EXIT /b 0