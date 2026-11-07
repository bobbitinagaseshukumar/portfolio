# 🌌 3D Animated Interactive Portfolio

A fully responsive, production-ready 3D portfolio engineered with:
- **Frontend**: React (Vite) + Three.js + React Three Fiber + Tailwind CSS (Ready for **Vercel**)
- **Backend**: Node.js + Express REST API (Ready for **Render**)
- **Database**: PostgreSQL with Row-Level Security (RLS) on **Supabase**
- **Videos**: Dedicated folder in `frontend/public/videos/` with built-in modal player & custom ratio scaling
- **Responsive Screen Ratio Engine**: Dynamically adapts 3D WebGL cameras, FOV, and layouts across smartphones (9:16 / 9:19.5), tablets (4:3), and laptops/desktops (16:9 / 21:9).

---

## 📁 Project Architecture

```
portfolio/
├── frontend/                     # React + Vite (Deploy to Vercel)
│   ├── public/
│   │   └── videos/               # 🎬 YOUR VIDEOS GO HERE!
│   │       └── README.md         # Video specifications & tips
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/               # Three.js / React Three Fiber scenes
│   │   │   │   ├── Hero3DCanvas.jsx     # Futuristic 3D Cyber Core with Orbital Rings
│   │   │   │   └── SceneBackground.jsx  # 3D Particle Starfield & ambient meshes
│   │   │   ├── sections/         # Hero, About, Projects, Skills, Experience, Contact
│   │   │   └── ui/               # Navbar, VideoModal, Footer, Icons
│   │   ├── config/
│   │   │   └── portfolioData.js  # 🌟 Central config for your details & projects
│   │   ├── hooks/
│   │   │   └── useScreenRatio.js # 📱💻 Real-time Screen Ratio Detection Hook
│   │   └── App.jsx
│   ├── vercel.json               # Zero-config SPA routing for Vercel
│   └── .env.example
├── backend/                      # Node.js + Express API (Deploy to Render)
│   ├── src/
│   │   ├── config/supabase.js    # Supabase Client connection
│   │   ├── controllers/          # Contact submission & Visitor telemetry
│   │   ├── routes/api.js         # API Endpoints
│   │   └── server.js             # Express server with CORS
│   ├── render.yaml               # 1-Click Render Deployment blueprint
│   └── .env.example
└── database/
    └── supabase-schema.sql       # SQL script to set up tables in Supabase
```

---

## 🎬 How to Add & Modify Videos

1. **Upload your video files**:
   Place any `.mp4` or `.webm` file in:
   ```
   frontend/public/videos/
   ```
   *(For example: `frontend/public/videos/my-app-demo.mp4`)*

2. **Link in `portfolioData.js`**:
   Open [portfolioData.js](file:///d:/kumar%20projects/portfolio/frontend/src/config/portfolioData.js) and point the `video` attribute:
   ```javascript
   video: "/videos/my-app-demo.mp4"
   ```

3. **Tell me how to modify it**:
   Whenever you upload a video or want modifications, just say:
   > *"I added `my-app-demo.mp4` for project 1. Change the title to '...' and make the video autoplay with sound off."*
   
   I will immediately make the modifications for you!

---

## 📱 Multi-Screen Ratio System

This portfolio automatically tracks your screen aspect ratio in real-time via `useScreenRatio.js`:
- **Phone Mode** (e.g., 9:16, 9:19.5, 9:20):
  - 3D camera FOV adjusts to 65° to prevent 3D clipping on tall displays.
  - Particle count is optimized to save mobile battery life.
  - Video modal expands to full phone width with touch controls.
- **Tablet Mode** (e.g., 4:3, 3:4):
  - Balanced dual-column layouts with adapted camera perspective.
- **Laptop / Desktop Mode** (e.g., 16:9, 16:10, 21:9):
  - Interactive mouse parallax tracking on the 3D Cyber Core.
  - Expansive widescreen layout.

You can see your active screen ratio displayed right on the top navbar badge!

---

## 🚀 Running Locally

### 1. Start Frontend:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Start Backend:
```bash
npm run server
```
Runs at [http://localhost:5000](http://localhost:5000).

---

## 🌐 Deployment Instructions

### 1. Database (Supabase):
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** -> **New Query**.
3. Copy and run the contents of [supabase-schema.sql](file:///d:/kumar%20projects/portfolio/database/supabase-schema.sql).
4. Copy your `Project URL` and `anon key` from **Project Settings** -> **API**.

### 2. Backend (Render):
1. Push this project to your GitHub repository.
2. In [render.com](https://render.com), click **New +** -> **Web Service**.
3. Connect your repo and set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. In **Environment Variables**, add:
   - `SUPABASE_URL`: `https://your-project.supabase.co`
   - `SUPABASE_ANON_KEY`: `your-supabase-key`
   - `FRONTEND_URL`: `https://your-portfolio.vercel.app`

### 3. Frontend (Vercel):
1. In [vercel.com](https://vercel.com), click **Add New** -> **Project**.
2. Select your repository and set:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
3. Add Environment Variable:
   - `VITE_BACKEND_URL`: Your Render backend service URL (e.g. `https://portfolio-backend.onrender.com`)
4. Click **Deploy**!
