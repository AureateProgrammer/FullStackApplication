# Simple MERN Tasks

A small MERN task app prepared for deployment with a Render backend, Render static frontend, and MongoDB Atlas.

## Local Setup

1. Install dependencies:

```bash
npm install --prefix server
npm install --prefix client
```

2. Create `server/.env` from `server/.env.example` and add your MongoDB Atlas connection string.

3. Start the backend:

```bash
npm run dev --prefix server
```

4. In another terminal, start the frontend:

```bash
npm run dev --prefix client
```

## Render Settings

Backend Web Service:

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables:
  - `MONGODB_URI`: your MongoDB Atlas URI
  - `CLIENT_ORIGIN`: your deployed frontend URL. Use comma-separated URLs if you want to allow local and deployed frontends.

Frontend Static Site:

- Root directory: `client`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Environment variables:
  - `VITE_API_URL`: your deployed backend URL
