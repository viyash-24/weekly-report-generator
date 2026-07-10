# Weekly Report Generator & Team Dashboard

A production-quality full-stack web application for generating weekly reports and managing team dashboards.

---

## 📋 Project Overview

**Weekly Report Generator & Team Dashboard** is a modern SaaS-style web application that enables team members to submit weekly reports and managers to gain insights through a real-time analytics dashboard.

---

## ✨ Features

### Member Features
- 📝 Create and submit weekly reports (Draft / Submit)
- 📊 Personal dashboard with report stats
- 📁 View and edit draft reports


### Manager Features
- 📈 Analytics dashboard with charts
- 👥 View all team reports
- 📌 Submission status tracking (Draft / Submitted / Pending / Late)
- 🔍 Search & filter by week, project, member, date range
- 🏗 Full project CRUD management
- 🤖 AI Assistant powered by LLM

### Auth
- JWT-based authentication
- Role-based access control (Member / Manager)
- Secure password hashing

---

## 🛠 Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| Next.js 15 (App Router) | React framework |
| React 19 | UI library |
| Tailwind CSS | Styling |
| Axios | HTTP requests |
| React Hook Form | Form handling |
| Recharts | Data visualization |
| Lucide React | Icons |

### Backend
| Tech | Purpose |
|------|---------|
| Node.js + Express.js | Server |
| MongoDB + Mongoose | Database |
| JWT + bcryptjs | Auth |
| express-validator | Validation |
| cookie-parser | Cookie management |

---

## 📁 Folder Structure

```
weekly-report-generator/
├── frontend/                    # Next.js 15 App
│   ├── app/                     # App Router pages
│   │   ├── (auth)/              # Login, Register
│   │   ├── (dashboard)/         # Protected pages
│   │   │   ├── dashboard/
│   │   │   ├── reports/
│   │   │   ├── projects/
│   │   │   ├── profile/
│   │   │   ├── manager/
│   │   │   └── ai-assistant/
│   ├── components/
│   │   ├── layout/              # Sidebar, Navbar, Layout
│   │   ├── ui/                  # Reusable UI components
│   │   ├── charts/              # Recharts wrappers
│   │   ├── forms/               # Form components
│   │   └── modals/              # Modal components
│   ├── context/                 # React Context (Auth)
│   ├── hooks/                   # Custom hooks
│   ├── services/                # Axios API services
│   ├── lib/                     # Utilities and helpers
│   └── styles/                  # Global styles
│
├── backend/                     # Express.js API
│   ├── config/                  # DB connection
│   ├── controllers/             # Route handlers
│   ├── middleware/              # Auth, error, roles
│   ├── models/                  # Mongoose schemas
│   ├── routes/                  # API routes
│   ├── services/                # Business logic + AI
│   ├── utils/                   # Helpers
│   ├── validators/              # express-validator rules
│   └── server.js                # Entry point
│
└── README.md
```

---

## ⚙️ Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd weekly-report-generator
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your environment variables
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Fill in your environment variables
npm run dev
```

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/weekly-report-db
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:3000
NODE_ENV=development

# AI Feature (Optional)
OPENAI_API_KEY=your_openai_key
OPENAI_API_BASE=https://api.openai.com/v1
AI_MODEL=gpt-3.5-turbo
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🗄 MongoDB Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or use `0.0.0.0/0` for development)
5. Copy your connection string into `MONGO_URI`

---

## 🚀 Run the Application

### Backend
```bash
cd backend
npm run dev     # Development with nodemon
npm start       # Production
```

### Frontend
```bash
cd frontend
npm run dev     # Development on http://localhost:3000
npm run build   # Production build
npm start       # Start production server
```

---

## 📡 API Routes

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |

### Reports
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/reports` | Get my reports |
| POST | `/api/reports` | Create report |
| PUT | `/api/reports/:id` | Update report |
| DELETE | `/api/reports/:id` | Delete report |
| PATCH | `/api/reports/:id/submit` | Submit report |

### Projects
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create project (Manager) |
| PUT | `/api/projects/:id` | Update project (Manager) |
| DELETE | `/api/projects/:id` | Delete project (Manager) |

### Manager
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/manager/dashboard` | Dashboard summary |
| GET | `/api/manager/reports` | All team reports |
| GET | `/api/manager/stats` | Analytics stats |
| GET | `/api/manager/members` | Team members |

### AI Assistant
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/ai/chat` | Chat with AI assistant |

---

## 📸 Screenshots

> _Screenshots will be added after deployment_

---

## 🔒 Security

- Passwords hashed with bcryptjs
- JWT stored in httpOnly cookies
- Role-based route protection
- Input validation on all endpoints
- CORS configured

---

## 👤 Roles

| Role | Permissions |
|------|-------------|
| Member | Create/edit own reports, view projects |
| Manager | All member permissions + view all reports, manage projects, access analytics |

---


