@echo off
REM run.cmd - build & run with Buildx and safe cleanup (CMD)
setlocal

REM 1) quick check Docker daemon
docker info >nul 2>&1
if errorlevel 1 (
  echo Docker does not seem to be running. Start Docker Desktop and retry.
  exit /b 1
)

REM 2) ensure .env exists
if not exist ".env" (
  echo .env not found. Copy .env.example to .env and fill secrets, then rerun.
  exit /b 1
)

REM 3) force remove any existing container with this name (silent if absent)
echo Removing any existing container named liste-course...
docker rm -f liste-course >nul 2>&1

REM 4) optional: remove existing image to force clean rebuild (comment out if you want faster rebuilds)
echo Removing existing image liste-course if present...
docker rmi -f liste-course >nul 2>&1

REM 5) build with buildx (uses BuildKit)
docker buildx build --secret id=supabase_env,src=.env -t liste-course .
if errorlevel 1 (
  echo Build failed. Check output above, fix errors, then retry.
  exit /b 1
)

REM 6) run new container
docker run -d -p 3000:3000 --env-file .env --name liste-course liste-course
if errorlevel 1 (
  echo Failed to start container. Check port conflicts or docker logs.
  exit /b 1
)

echo Done. Tailing logs...
docker logs liste-course -f

endlocal
