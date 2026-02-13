@echo off
REM run.cmd - build & run with BuildKit (CMD)
set DOCKER_BUILDKIT=1
docker build --secret id=supabase_env,src=.env -t liste-course .
docker run -d -p 3000:3000 --env-file .env --name liste-course liste-course
