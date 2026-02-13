### Liste‑Course
### MiamListe — A Next.js (App Router) project to manage a shopping list.

### Getting started
## Prerequisites
Node.js v18+ (only required for local development)

npm / yarn / pnpm / bun (optional for local dev)

Docker (recommended for running without installing Node)

Copy env.example → .env and fill your keys before running the app in Docker or locally.

## Development
Install dependencies and start the dev server:

bash
npm install
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
Open http://localhost:3000 in your browser.
Edit src/app/page.tsx (or app/page.tsx) — the page auto‑reloads while you work.

## Local
If you want to test a production build locally:

bash
npm run build
npm run start
Using Docker (recommended)
This repository already contains a Dockerfile and an env.example. You do not need to recreate the Dockerfile.

## Create your .env

bash
cp env.example .env
# then edit .env and fill the keys (do not commit .env)
Build the Docker image

bash
docker build -t liste-course .
Run the container

bash
docker run -d -p 3000:3000 --env-file .env --name liste-course liste-course
The app will be available at: http://localhost:3000.

### Learn more
Next.js docs: https://nextjs.org/docs

Next.js tutorial: https://nextjs.org/learn

### Contributing & License
Fork the repo, create a feature branch, open a PR with a clear description and screenshots if relevant.

Check the LICENSE file in the repository for license details.

## Repository: https://github.com/AsuraMoon/liste-course
