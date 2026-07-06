# Folder Structure — Campus Issue Management Platform

```
campus-issue-platform/
│
├── ARCHITECTURE.md              ← System design & decisions
├── FOLDER_STRUCTURE.md          ← This file
├── README.md                    ← Setup & run instructions
│
├── backend/
│   ├── run.py                   ← App entry point (gunicorn target)
│   ├── config.py                ← Config classes (Dev / Prod / Test)
│   ├── requirements.txt         ← All Python dependencies
│   ├── .env                     ← Local environment variables (gitignored)
│   ├── .env.example             ← Template for env vars
│   ├── Procfile                 ← Render deployment command
│   ├── gunicorn.conf.py         ← Gunicorn worker config
│   │
│   ├── app/
│   │   ├── __init__.py          ← Flask app factory (create_app)
│   │   ├── extensions.py        ← db, login_manager, csrf, migrate init
│   │   │
│   │   ├── models/
│   │   │   ├── __init__.py      ← Re-export all models
│   │   │   ├── student.py       ← Student ORM model
│   │   │   ├── admin.py         ← Admin ORM model
│   │   │   ├── complaint.py     ← Complaint + ComplaintHistory models
│   │   │   ├── assignment.py    ← Complaint assignment model
│   │   │   ├── notification.py  ← Notification model
│   │   │   └── duplicate.py     ← DuplicateComplaint link model
│   │   │
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── __init__.py  ← Register all v1 blueprints
│   │   │       ├── auth/
│   │   │       │   ├── __init__.py
│   │   │       │   └── routes.py    ← /auth/register, /login, /logout, /me
│   │   │       ├── complaints/
│   │   │       │   ├── __init__.py
│   │   │       │   └── routes.py    ← Complaint CRUD + duplicate check
│   │   │       ├── admin/
│   │   │       │   ├── __init__.py
│   │   │       │   └── routes.py    ← Admin-only complaint & student mgmt
│   │   │       ├── analytics/
│   │   │       │   ├── __init__.py
│   │   │       │   └── routes.py    ← Charts data + CSV export
│   │   │       └── notifications/
│   │   │           ├── __init__.py
│   │   │           └── routes.py    ← List + mark-read
│   │   │
│   │   ├── services/
│   │   │   ├── auth_service.py       ← Registration, login, password ops
│   │   │   ├── complaint_service.py  ← Create, update, delete, history
│   │   │   ├── priority_engine.py    ← Keyword scoring + level assignment
│   │   │   ├── duplicate_detector.py ← RapidFuzz similarity check
│   │   │   ├── notification_service.py← Create & deliver notifications
│   │   │   ├── analytics_service.py  ← Pandas aggregations + Plotly data
│   │   │   ├── file_service.py       ← Save, validate, delete images
│   │   │   └── escalation_service.py ← Auto-escalate stale complaints
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth_middleware.py    ← @role_required decorator
│   │   │   └── error_handlers.py     ← 400/401/403/404/500 JSON responses
│   │   │
│   │   └── utils/
│   │       ├── constants.py          ← Priority keywords, categories, locations
│   │       ├── validators.py         ← Roll number, email, mobile validators
│   │       ├── helpers.py            ← Pagination, date helpers, serializers
│   │       └── security.py           ← CSP headers, sanitize input
│   │
│   ├── migrations/                   ← Alembic auto-generated migrations
│   ├── uploads/                      ← Dev image storage (gitignored)
│   ├── tests/
│   │   ├── conftest.py               ← Pytest fixtures & test app
│   │   ├── test_auth.py
│   │   ├── test_complaints.py
│   │   ├── test_priority_engine.py
│   │   └── test_duplicate_detector.py
│   └── scripts/
│       ├── seed_db.py                ← Insert demo data
│       └── create_admin.py           ← CLI: create admin user
│
└── frontend/
    ├── index.html                    ← Vite entry HTML
    ├── vite.config.js               ← Vite + proxy config
    ├── tailwind.config.js           ← Tailwind theme extension
    ├── postcss.config.js
    ├── package.json
    ├── .env                         ← Local frontend env (gitignored)
    ├── .env.example
    ├── vercel.json                  ← SPA rewrite rules for Vercel
    │
    └── src/
        ├── main.jsx                 ← ReactDOM.createRoot entry
        ├── App.jsx                  ← Router + lazy page imports
        │
        ├── api/
        │   ├── axiosInstance.js     ← Axios with baseURL + interceptors
        │   ├── authAPI.js           ← login, register, logout, me
        │   ├── complaintAPI.js      ← complaint CRUD + duplicate check
        │   ├── adminAPI.js          ← admin routes
        │   ├── analyticsAPI.js      ← chart data endpoints
        │   └── notificationAPI.js   ← list + mark-read
        │
        ├── context/
        │   ├── AuthContext.jsx      ← user state, login/logout helpers
        │   ├── ThemeContext.jsx      ← dark/light mode toggle
        │   └── NotificationContext.jsx ← unread count, refresh
        │
        ├── hooks/
        │   ├── useAuth.js           ← consume AuthContext
        │   ├── useTheme.js          ← consume ThemeContext
        │   ├── useComplaints.js     ← fetch + cache complaint list
        │   ├── useAnalytics.js      ← fetch analytics data
        │   └── useDebounce.js       ← debounce search input
        │
        ├── routes/
        │   ├── ProtectedRoute.jsx   ← redirect if not logged in
        │   ├── AdminRoute.jsx       ← redirect if not admin
        │   └── GuestRoute.jsx       ← redirect if already logged in
        │
        ├── components/
        │   ├── common/
        │   │   ├── Button.jsx
        │   │   ├── Input.jsx
        │   │   ├── Select.jsx
        │   │   ├── Textarea.jsx
        │   │   ├── Modal.jsx
        │   │   ├── Loader.jsx
        │   │   ├── Skeleton.jsx
        │   │   ├── Pagination.jsx
        │   │   ├── SearchBar.jsx
        │   │   ├── StatusBadge.jsx
        │   │   ├── PriorityBadge.jsx
        │   │   ├── EmptyState.jsx
        │   │   └── Avatar.jsx
        │   │
        │   ├── layout/
        │   │   ├── Navbar.jsx
        │   │   ├── StudentSidebar.jsx
        │   │   ├── AdminSidebar.jsx
        │   │   ├── Footer.jsx
        │   │   └── PageWrapper.jsx
        │   │
        │   ├── student/
        │   │   ├── ComplaintCard.jsx
        │   │   ├── DashboardStats.jsx
        │   │   ├── RecentComplaints.jsx
        │   │   └── NotificationList.jsx
        │   │
        │   ├── admin/
        │   │   ├── ComplaintsTable.jsx
        │   │   ├── ComplaintFilters.jsx
        │   │   ├── AssignModal.jsx
        │   │   ├── StudentRow.jsx
        │   │   └── AdminStatsCards.jsx
        │   │
        │   ├── charts/
        │   │   ├── MonthlyChart.jsx
        │   │   ├── CategoryChart.jsx
        │   │   ├── PriorityChart.jsx
        │   │   ├── ResolutionTimeChart.jsx
        │   │   ├── LocationChart.jsx
        │   │   └── DepartmentChart.jsx
        │   │
        │   └── forms/
        │       ├── ComplaintForm.jsx
        │       ├── ImageUpload.jsx
        │       └── LocationPicker.jsx
        │
        ├── pages/
        │   ├── public/
        │   │   ├── LandingPage.jsx
        │   │   └── NotFoundPage.jsx
        │   │
        │   ├── auth/
        │   │   ├── LoginPage.jsx
        │   │   ├── RegisterPage.jsx
        │   │   └── AdminLoginPage.jsx
        │   │
        │   ├── student/
        │   │   ├── StudentDashboard.jsx
        │   │   ├── RaiseComplaint.jsx
        │   │   ├── ComplaintDetail.jsx
        │   │   ├── ComplaintHistory.jsx
        │   │   ├── NotificationsPage.jsx
        │   │   └── ProfilePage.jsx
        │   │
        │   └── admin/
        │       ├── AdminDashboard.jsx
        │       ├── ManageComplaints.jsx
        │       ├── AnalyticsPage.jsx
        │       ├── ManageStudents.jsx
        │       └── SettingsPage.jsx
        │
        ├── styles/
        │   └── index.css            ← Tailwind directives + custom CSS
        │
        └── utils/
            ├── formatters.js        ← date, priority, status formatters
            ├── validators.js        ← client-side form validators
            └── constants.js         ← categories, locations, courses
```
