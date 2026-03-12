# Technical Quiz (TQ) - Production Ready System

A real-time multiplayer technical quiz application for college competitions.

## Features
- **Real-time Synchronization**: Using WebSockets for instant quiz control.
- **QR Code Join System**: Scan and join rooms instantly.
- **Anti-Cheat System**: Detects tab switching, window blurring, and prevents copy-pasting.
- **Admin Dashboard**: Full control over players, questions, and session management.
- **Automatic Question Randomizer**: Unique question orders for every player within the round structure.
- **Excel Upload**: Bulk upload questions using the provided template.

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS, Framer Motion, Lucide Icons.
- **Backend**: Python FastAPI, WebSockets, SQLAlchemy, Pandas.
- **Database**: PostgreSQL (Neon.tech recommended) or SQLite for local dev.

## Local Setup

### Backend
1. Go to `backend` directory: `cd backend`
2. Install dependencies: `pip install -r requirements.txt`
3. Run the generator for sample questions: `python generate_questions.py`
4. Start the server: `python app/main.py`
   - Server will run at: `http://localhost:8000`

### Frontend
1. Go to `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
   - App will run at: `http://localhost:5173`

## Deployment Instructions

### Database (Neon)
1. Create a project on [Neon.tech](https://neon.tech).
2. Get the connection string.
3. Add `DATABASE_URL=your_connection_string` to your environment variables.

### Backend (Render/Railway)
1. Link your GitHub repository.
2. Set Build Command: `pip install -r backend/requirements.txt`
3. Set Start Command: `python backend/app/main.py`
4. Set Environment Variables: `DATABASE_URL`.

### Frontend (Vercel)
1. Push `frontend` to a sub-directory in Git or deploy separately.
2. Set Framework Preset: `Vite`.
3. Set Build Command: `npm run build`.
4. Set Output Directory: `dist`.
5. Set `VITE_API_URL` to your deployed backend URL.

## Admin Credentials
- **Password**: `admin@tq2026`

## Round Structure
- **Round 1 (1-20)**: Image Identification (3 clues provided).
- **Round 2 (21-40)**: Theory and Command line questions.
- **Round 3 (41-60)**: Code analysis and error detection.

---
Built for high-stakes technical competitions.
