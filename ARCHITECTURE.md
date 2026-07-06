# Campus Issue Management Platform — Architecture

## Overview

A full-stack complaint management system for college campuses. Students raise
issues categorised by type and location; a priority engine scores them
automatically; admins manage resolution; analytics surfaces patterns.

---

## System Tiers

```
┌──────────────────────────────────────────────────────────────────────┐
│  CLIENT  –  React 19 + Vite  (Vercel)                                │
│  ┌──────────────┐  ┌──────────────────┐  ┌────────────────────────┐  │
│  │ Public Pages │  │  Student Portal  │  │    Admin Portal        │  │
│  │ Landing      │  │  Dashboard       │  │    Dashboard           │  │
│  │ Login/Reg    │  │  Raise Complaint │  │    Manage Complaints   │  │
│  │ 404          │  │  History/Profile │  │    Analytics/Settings  │  │
│  └──────────────┘  └──────────────────┘  └────────────────────────┘  │
│  Shared: Navbar · Sidebar · Cards · Charts · Modals · Toast          │
└────────────────────────────┬─────────────────────────────────────────┘
                             │ HTTPS / Axios (JSON)
┌────────────────────────────▼─────────────────────────────────────────┐
│  API GATEWAY  –  Flask + Flask-Login  (Render)                       │
│  CORS · CSRF · Rate-limit · Role-guard middleware                    │
│  /api/v1/{auth, complaints, admin, analytics, notifications}         │
└────────────────────────────┬─────────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────────┐
│  SERVICE LAYER  (Python)                                             │
│  AuthService · ComplaintService · PriorityEngine                     │
│  DuplicateDetector (RapidFuzz) · NotificationService                 │
│  AnalyticsService (Pandas + Plotly) · FileService                    │
└────────────────────────────┬─────────────────────────────────────────┘
                             │ SQLAlchemy ORM
┌────────────────────────────▼─────────────────────────────────────────┐
│  DATA LAYER                                                          │
│  SQLite (dev)  ·  PostgreSQL (prod, Render managed)                  │
│  Tables: students · admins · complaints · complaint_history          │
│          assignments · notifications · duplicate_complaints          │
└──────────────────────────────────────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────────┐
│  FILE STORAGE                                                        │
│  uploads/ (dev)  ·  AWS S3 / Render persistent disk (prod)           │
│  Allowed: jpg · jpeg · png   Max: 5 MB per image                     │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Security Model

| Layer           | Control                                         |
|-----------------|--------------------------------------------------|
| Passwords       | Werkzeug `generate_password_hash` (pbkdf2:sha256) |
| Sessions        | Flask-Login server-side sessions + secure cookie |
| CSRF            | Flask-WTF CSRFProtect on all mutating endpoints  |
| XSS             | React escapes output; CSP headers via Flask      |
| SQL injection   | SQLAlchemy parameterised queries only            |
| Routes          | `@login_required` + `@role_required` decorators  |
| File upload     | Extension whitelist + size check before save     |
| CORS            | Explicit origin whitelist via env variable       |

---

## Priority Engine Logic

```
score = 0
for each keyword in complaint_title + description:
    score += keyword_weight[keyword]   # see constants.py

level = "Low"      if score <=  20
level = "Medium"   if score <=  50
level = "High"     if score <=  80
level = "Critical" if score >   80
```

Auto-escalation delays:

| Level    | Escalate after |
|----------|----------------|
| Low      | 7 days         |
| Medium   | 3 days         |
| High     | 24 hours       |
| Critical | Immediate      |

---

## Duplicate Detection (RapidFuzz)

```python
from rapidfuzz import fuzz

similarity = fuzz.token_sort_ratio(new_title, existing_title)
if similarity >= 85 and same_location and same_category:
    flag_as_duplicate()
    # Student can: Continue anyway | Join existing (increments reporter_count)
```

---

## API Route Map

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/me

GET    /api/v1/complaints/              (student: own; admin: all)
POST   /api/v1/complaints/
GET    /api/v1/complaints/<id>
PUT    /api/v1/complaints/<id>/status   (admin)
DELETE /api/v1/complaints/<id>          (admin)
POST   /api/v1/complaints/<id>/join     (duplicate join)
GET    /api/v1/complaints/check-duplicate

GET    /api/v1/notifications/
PATCH  /api/v1/notifications/<id>/read

GET    /api/v1/analytics/overview
GET    /api/v1/analytics/category
GET    /api/v1/analytics/priority
GET    /api/v1/analytics/monthly
GET    /api/v1/analytics/locations
GET    /api/v1/analytics/resolution-time
GET    /api/v1/analytics/export-csv

GET    /api/v1/admin/students
GET    /api/v1/admin/students/<id>
DELETE /api/v1/admin/students/<id>
POST   /api/v1/admin/complaints/<id>/assign
```

---

## Environment Variables

### Backend (`backend/.env`)

```
FLASK_ENV=development
SECRET_KEY=<random-256-bit>
DATABASE_URL=sqlite:///complaints.db
CORS_ORIGINS=http://localhost:5173
MAX_CONTENT_LENGTH=5242880
UPLOAD_FOLDER=uploads
```

### Frontend (`frontend/.env`)

```
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_NAME=Campus Issue Management Platform
```

---

## Deployment

| Target    | Service          | Notes                                  |
|-----------|------------------|----------------------------------------|
| Frontend  | Vercel           | `vite build` → static, auto-deploy     |
| Backend   | Render Web Svc   | `gunicorn run:app`, free tier ok       |
| Database  | Render Postgres  | Set DATABASE_URL env var on Render     |
| Files     | Render Disk      | Mount at /uploads, or migrate to S3    |
