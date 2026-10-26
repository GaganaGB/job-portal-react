# Job Portal (React + Express + MongoDB)

## Run locally

Requirements: Node.js and a running local MongoDB server.

### 1. Start the backend
Open a terminal in the project root:

```bash
cd student-crud
npm install
npm start
```

The backend uses `mongodb://127.0.0.1:27017/jobPortalDB` by default. Keep this terminal open. API: `http://localhost:3000/api/jobs`.

### 2. Start the frontend
Open a second terminal in the project root:

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal (usually `http://localhost:5173`). The frontend uses `http://localhost:3000` by default.

## Job management
Use the **Manage Jobs** form to add a job. Use **Edit** or **Delete** on a job card to update/remove it. These operations call the Express API and persist to MongoDB.

## Deploy later
- Backend: deploy the `student-crud` folder to Render. Build command: `npm install`; start command: `npm start`.
- Set Render environment variable `MONGODB_URI` to your MongoDB Atlas connection string. Set `CLIENT_URL` to the Vercel frontend URL.
- Frontend: deploy the project root to Vercel. Add `VITE_API_URL` with the Render service URL (no trailing slash), then redeploy.
- Do not commit actual `.env` files or database credentials. `.env.example` files contain placeholders only.
Feature: Job registration
Feature: Job login
Feature: Job management