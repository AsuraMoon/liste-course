Liste-Course

This is a Next.js project bootstrapped with create-next-app.

Getting Started
Development

To start the development server locally:

npm install
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

Open http://localhost:3000
 in your browser to see the result.
You can start editing the page by modifying app/page.tsx. The page auto-updates as you edit the file.

Using Docker (recommended)

This project is fully Dockerized. You do not need to install Node.js or npm locally.

1. Create a .env file

Create a file named .env in the project root with the following placeholders:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_publishable_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

Do not commit .env to GitHub. This file contains sensitive keys.

2. Build the Docker image
docker build --build-arg NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
             --build-arg NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY \
             --build-arg SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY \
             -t liste-course .
3. Run the container
docker run -d -p 3000:3000 \
  --env-file .env \
  liste-course

The app will be available at http://localhost:3000
.

Account Demo

Email: DEMO@demo.com

Password: DEMOmdp

Learn More

Next.js Documentation
 – Learn about Next.js features and API.

Learn Next.js
 – An interactive Next.js tutorial.

Check the Next.js GitHub repository
 for contributions and feedback.

Deploy on Vercel

The easiest way to deploy your Next.js app is to use the Vercel platform.
See the Next.js deployment documentation
 for more details.

Si tu veux, je peux aussi te réécrire ton Dockerfile pour qu’il utilise directement .env, sans jamais mettre tes clés dans le Dockerfile ou dans le README. Ça rendrait le projet totalement sûr pour GitHub.

Veux‑tu que je fasse ça ?
