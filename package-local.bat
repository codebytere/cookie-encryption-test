@echo off
setlocal enabledelayedexpansion

REM Path to your local Electron build (set ELECTRON_DIR env var to override)
if "%ELECTRON_DIR%"=="" (
    set "ELECTRON_DIR=C:\path\to\electron\src\out\Testing"
)

set "DIST_DIR=dist\cookie-encryption-fuse-test-win32-x64"

if not exist "%ELECTRON_DIR%\electron.exe" (
    echo Error: electron.exe not found at %ELECTRON_DIR%
    echo Set ELECTRON_DIR environment variable to your Electron build output directory
    echo Example: set ELECTRON_DIR=C:\electron\src\out\Testing
    exit /b 1
)

echo === Packaging with local Electron build ===
echo Source: %ELECTRON_DIR%
echo.

echo Creating app bundle...
call npx electron-packager . --platform=win32 --arch=x64 --out=dist --overwrite
if errorlevel 1 exit /b 1
echo.

echo Replacing Electron files with local build...

REM Copy the main executable
copy /y "%ELECTRON_DIR%\electron.exe" "%DIST_DIR%\cookie-encryption-fuse-test.exe"

REM Copy all DLLs
copy /y "%ELECTRON_DIR%\*.dll" "%DIST_DIR%\"

REM Copy all .bin files (V8 snapshots, etc.)
copy /y "%ELECTRON_DIR%\*.bin" "%DIST_DIR%\" 2>nul

REM Copy all .pak files
copy /y "%ELECTRON_DIR%\*.pak" "%DIST_DIR%\" 2>nul

REM Copy all .dat files
copy /y "%ELECTRON_DIR%\*.dat" "%DIST_DIR%\" 2>nul

REM Copy locales
if exist "%ELECTRON_DIR%\locales" (
    xcopy /y /e /i "%ELECTRON_DIR%\locales" "%DIST_DIR%\locales"
)

REM Copy resources
if exist "%ELECTRON_DIR%\resources" (
    xcopy /y /e /i "%ELECTRON_DIR%\resources\*" "%DIST_DIR%\resources\" 2>nul
)

echo.

echo Flipping cookie encryption fuse...
call node flip-fuse.js win32
if errorlevel 1 exit /b 1

echo.
echo === Done! ===
echo Run the packaged app with: npm run test-packaged-win
echo Or directly: %DIST_DIR%\cookie-encryption-fuse-test.exe
