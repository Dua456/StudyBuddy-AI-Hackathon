# StudyBuddy AI — Vercel Deployment Guide

## Step 1: Deploy Backend

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your repo, then **set Root Directory to `server`**
3. Framework Preset: **Other**
4. Build Command: _(leave empty — Vercel auto-detects)_
5. Output Directory: _(leave empty)_
6. Add these **Environment Variables**:

|
7. Click **Deploy**
8. Copy the backend URL (e.g., `https://studybuddy-server-xxx.vercel.app`)

---

## Step 2: Deploy Frontend

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import the **same repo**, then **set Root Directory to `client`**
3. Framework Preset: **Create React App**
4. Add these **Environment Variables**:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://studybuddy-server-xxx.vercel.app/api` |

> Replace `https://studybuddy-server-xxx.vercel.app` with your actual backend URL from Step 1.

5. Click **Deploy**
6. Copy the frontend URL (e.g., `https://studybuddy-client-xxx.vercel.app`)

---

## Step 3: Update Backend CLIENT_URL

1. Go to your **backend project** on Vercel
2. Go to **Settings → Environment Variables**
3. Update `CLIENT_URL` to your frontend URL (e.g., `https://studybuddy-client-xxx.vercel.app`)
4. Go to **Deployments** → click the three dots on latest deployment → **Redeploy**

---

## Important Notes

- **CORS**: The backend automatically allows any `*.vercel.app` origin, so preview deployments will work too
- **Cold Starts**: First request after idle may take 10-15 seconds (MongoDB connection)
- **File Uploads**: Max 10MB, handled via Multer → Cloudinary
- **Rate Limit**: 100 requests per 15 minutes per IP
