# Deployment Guide for Solia Web App and API

This guide covers the steps to deploy the Solia frontend (React + Vite) and backend API (Fastify) to production environments.

---

## 1. Prerequisites

- Node.js (version 18+ recommended)
- Git repository with your code pushed
- Hosting accounts for frontend and backend (e.g., Vercel, Netlify for frontend; Railway, Heroku, VPS for backend)
- Environment variables ready (API URLs, JWT secrets, database URLs, etc.)

---

## 2. Deploying the Frontend (Solia Web)

### Option A: Deploy to Vercel or Netlify

1. Push your frontend code (`apps/web`) to a Git repository (GitHub, GitLab, etc.).
2. Create a new project on Vercel or Netlify and link it to your repository.
3. Set the build command to:
   ```
   npm run build
   ```
4. Set the output directory to:
   ```
   dist
   ```
5. Configure environment variables if needed (e.g., API base URL).
6. Deploy the site. The platform will build and host your frontend automatically.

### Option B: Manual Deployment on VPS or Static Server

1. Run locally:
   ```
   npm run build
   ```
2. Upload the contents of the `dist` folder to your static file server or CDN.
3. Configure your web server to serve the static files and fallback to `index.html` for SPA routing.

---

## 3. Deploying the Backend API (Solia API)

### Option A: Deploy to Railway, Heroku, or similar PaaS

1. Push your backend code (`solia/apps/api`) to a Git repository.
2. Create a new project on Railway, Heroku, or your chosen platform.
3. Set the start command to:
   ```
   npm run start
   ```
4. Configure environment variables:
   - Database connection string
   - JWT secret keys
   - Any other secrets or API keys
5. Deploy the app. The platform will build and run your API server.

### Option B: Deploy on VPS or Custom Server

1. SSH into your server.
2. Clone your repository and navigate to the backend folder.
3. Install dependencies:
   ```
   npm install
   ```
4. Build the project if needed:
   ```
   npm run build
   ```
5. Set environment variables in your shell or `.env` file.
6. Start the server using a process manager like PM2:
   ```
   pm2 start dist/index.js --name solia-api
   ```
7. Configure your firewall and reverse proxy (e.g., Nginx) to expose the API.

---

## 4. Environment Variables

Make sure to configure the following environment variables for both frontend and backend as needed:

- `VITE_API_BASE_URL` (frontend) — URL of the deployed backend API
- `DATABASE_URL` (backend) — connection string to your database
- `JWT_SECRET` (backend) — secret key for JWT tokens
- Any third-party API keys or secrets

---

## 5. Post-Deployment

- Test the deployed frontend and backend to ensure connectivity.
- Monitor logs and errors.
- Set up backups and scaling as needed.

---

## 6. Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Railway Documentation](https://docs.railway.app/)
- [Heroku Documentation](https://devcenter.heroku.com/)
- [PM2 Process Manager](https://pm2.keymetrics.io/)

---

If you want, I can help you create deployment configuration files (e.g., GitHub Actions workflows) or scripts for these platforms.
