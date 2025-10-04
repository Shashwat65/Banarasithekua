# Deploying Banarasi Thekua to Render

This guide shows how to deploy the project to Render (https://render.com). The repository contains two parts:

- `server/` — Node.js + Express API (MongoDB backend, PhonePe integration)
- `client/` — React + Vite frontend (TypeScript)

We'll deploy the API as a Web Service and the frontend as a Static Site (recommended) or as a Web Service if you prefer server-side routing.

---

## 1) Prepare the repository

- Ensure both `server/` and `client/` are committed to your GitHub (or GitLab) repository and Render has access to it.
- Make sure each folder has its own `package.json` and the usual scripts:
  - `server/package.json` should have at least: `start` (e.g. `node server.js`) and `start:dev` for local dev (optional).
  - `client/package.json` already has `build` (`vite build`) and `dev` (`vite`).

If `server/package.json` doesn't have a `start` script, add one before deploying. Example `server/package.json` snippet:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

---

## 2) Environment variables (what you must set on Render)

On Render, when creating each service you'll be prompted to add environment variables.

Common server variables (set for the Web Service running the API):

- `MONGODB_URI` — your MongoDB connection string (Atlas URI or hosted DB)
- `PORT` — optional (Render sets one automatically, but you can leave default)
- `CLIENT_SECRET_KEY` — JWT secret used by the server
- `FRONTEND_URL` — the URL where the frontend will be hosted (e.g. `https://your-site.onrender.com`)
- PhonePe-related variables (if used): `PHONEPE_MERCHANT_ID`, `PHONEPE_MERCHANT_KEY`, `PHONEPE_ENV` (sandbox/live) — match the helper used in `server/helpers/phonepe.js`

Common client variables (set for the Static Site or Web Service that hosts the frontend):

- `VITE_API_URL` — the base URL of your API (including `/api` if your client expects that). Example: `https://api-yourapp.onrender.com/api`.

Notes about cookie-based auth and CORS:

- The backend uses cookies for auth (cookie name `token`). For cookies to work across two separate Render services:
  - The frontend and backend should be served over HTTPS (Render sites use HTTPS by default).
  - When the frontend calls the API, ensure requests include credentials (fetch/axios: `credentials: 'include'` or `withCredentials: true`).
  - On the server, configure CORS to allow the exact frontend origin (`FRONTEND_URL`) and set `credentials: true`. In production, the server should set cookie `secure: true` and the cookie `sameSite` should allow cross-site if the frontend and API are on different subdomains (often `sameSite: 'none'` with `secure: true`).
  - Update the server cookie settings before deploy if needed (example in `server/controllers/auth/auth-controller.js` when calling `res.cookie(...)`).

---

## 3) Create the API service on Render

1. Go to Render dashboard → New → Web Service.
2. Connect your repository and select the repo and branch.
3. In the 'Root Directory' input use `server` (so Render runs inside the `server` folder).
4. Build command: leave empty or use `npm install` (Render runs install automatically).
5. Start command: `npm start` (or your `start` script, e.g. `node server.js`).
6. Set the environment variables listed above (MONGODB_URI, CLIENT_SECRET_KEY, PHONEPE_*, FRONTEND_URL, etc.).
7. Health check path: `/` or `/api/health` if you add one.
8. Create the service. Render will install dependencies and start the server.

After creation, note the service URL (e.g. `https://api-yourapp.onrender.com`). Use this value for `VITE_API_URL` in the next step.

---

## 4) Create the frontend site on Render (Static Site — recommended)

1. In Render dashboard → New → Static Site.
2. Connect the same repository and branch.
3. In the 'Root Directory' input set `client`.
4. Build command: `npm ci && npm run build` (or `npm install && npm run build`).
5. Publish directory: `dist` (Vite outputs `dist` by default).
6. Set the environment variable `VITE_API_URL` to the API base URL from the API service (for example: `https://api-yourapp.onrender.com/api`).
7. Create the site and wait for the build to finish. The site will be available at `https://your-site.onrender.com`.

Notes:

- Because the frontend is a static site, calls from the browser go directly to the API URL you configured in `VITE_API_URL`.
- Ensure CORS on the API allows the final frontend origin.

Alternative: Deploy the frontend as a Render Web Service (Node) if your app needs to use server-side logic; the build command remains the same but the start command should serve the `dist` folder (for example you can add `serve` as a dependency and use `npx serve -s dist` or create a small Express static server in `client/server.js`). Static Site is simpler and faster.

---

## 5) Custom domain & HTTPS

- Add custom domains in Render for both services if needed (example: `www.yoursite.com` for frontend and `api.yoursite.com` for API).
- Configure DNS records as Render instructs (CNAME/ALIAS). Once DNS is set, Render will provision HTTPS certificates.

Important cookie/cors implications for custom domains:

- If frontend runs on `www.yoursite.com` and API on `api.yoursite.com`, set the cookie domain to `.yoursite.com` and cookie options `sameSite: 'none'` and `secure: true` in production.
- Ensure `FRONTEND_URL` and `VITE_API_URL` match the actual deployed origins.

---

## 6) Recommended production tweaks (server-side)

- Use strong `CLIENT_SECRET_KEY` and keep it secret in Render env.
- In production, set cookie `secure: true` and `sameSite: 'none'` when issuing auth cookies.
- Tighten CORS to explicitly allow only your frontend origin (do not use `*` when credentials are required).
- Add logging, monitoring, and error reporting (Sentry, LogDNA, etc.) if needed.

Example cookie setting (Node/Express):

```js
// when sending cookie after login
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
});
```

---

## 7) Post-deploy checks

- Visit the frontend URL and confirm the app loads.
- Use developer tools (Network tab) to confirm API requests go to `VITE_API_URL` and that cookies are being sent/received on responses.
- If you see CORS or cookie issues, verify:
  - `Access-Control-Allow-Origin` contains the exact frontend origin.
  - `Access-Control-Allow-Credentials: true` is set on the API responses.
  - The cookie flags (`secure`, `sameSite`) match your domain and protocol.

---

## 8) Troubleshooting common errors

- 401 after login: ensure the server sets the cookie and the frontend includes credentials. In fetch use:

```js
fetch("https://api-yourapp.onrender.com/api/auth/login", {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
```

- CORS blocked: make sure `FRONTEND_URL` is added to the server's allowed origins and the server responds to OPTIONS preflight with the correct headers.
- Cookie not present in requests: ensure `sameSite` and `secure` are set correctly and the browser isn't blocking third-party cookies. Using a subdomain e.g. `www` and `api` on the same root domain with `.yourdomain.com` cookie domain avoids third-party restrictions.

---

## 9) Optional: Single repository, one-click Render (monorepo)

Render supports monorepos by specifying the 'Root Directory' when creating a service — use `server` for API and `client` for frontend. For CI efficiency, you can add Render YAML (`render.yaml`) to define both services and let Render create/update them automatically. See Render docs: https://render.com/docs/deploy-using-render-yaml

Example minimal `render.yaml` (edit names, envs and build/start commands):

```yaml
services:
  - type: web
    name: banarasi-api
    env: node
    repo: <your-repo>
    branch: master
    root: server
    startCommand: "npm start"
    envVars:
      - key: MONGODB_URI
        value: $MONGODB_URI

staticSites:
  - type: static
    name: banarasi-frontend
    repo: <your-repo>
    branch: master
    root: client
    buildCommand: "npm ci && npm run build"
    publishPath: dist
    envVars:
      - key: VITE_API_URL
        value: $VITE_API_URL
```

---

If you'd like, I can also:

- Add a `start` script to `server/package.json` if it's missing.
- Add a tiny health-check endpoint `/api/health` to the server.
- Create a `render.yaml` in the repo configured for your specific service names and env var keys.

Tell me which of the above you want me to implement and I'll make the edits.

---

Good luck — once deployed, share the Render URLs and I can help verify cookies, CORS, and the PhonePe flow.
