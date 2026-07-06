# Campus Issue Management Platform

A production-ready full-stack college complaint management system.

## Quick Start

### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
flask db init && flask db migrate -m "initial" && flask db upgrade
python scripts/create_admin.py
python scripts/seed_db.py   # optional demo data
python run.py               # http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev                 # http://localhost:5173
```

## Default Credentials
| Role    | Login            | Password   |
|---------|------------------|------------|
| Admin   | admin@campus.edu | Admin@123  |
| Student | 24HU5A0511          | Student@1  |

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Chart.js
- **Backend**: Flask, SQLAlchemy, Flask-Login
- **ML/Data**: RapidFuzz, Pandas, Plotly
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Deploy**: Vercel (frontend) / Render (backend)

## Deployment
- Frontend → Vercel: set `VITE_API_BASE_URL` env var, auto-deploy from GitHub
- Backend → Render: use `render.yaml` or manual web service setup
- See ARCHITECTURE.md for full system design
