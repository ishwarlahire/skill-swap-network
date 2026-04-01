# 🔄 SkillSwap Network

> **Teach what you know. Learn what you want. No money involved.**

SkillSwap Network is a full-stack web application that allows people to exchange skills with each other — completely free. Instead of paying for courses or tutors, you trade your expertise with someone who has what you need.

**Built by:** [Ishwar Lahire](https://github.com/ishwarlahire) — Jr. Software Developer

---

## 🌟 What Problem Does It Solve?

People want to learn new skills but can't always afford paid courses or tutors. At the same time, many people have valuable skills they'd love to share. SkillSwap bridges this gap — a platform where:

- A **React developer** teaches React in exchange for **Guitar lessons**
- A **Chef** teaches cooking in exchange for **English speaking practice**
- A **Fitness trainer** teaches workout routines in exchange for **Python programming**

Zero money. 100% value.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, React Router v6, Axios |
| **Backend** | Node.js, Fastify, TypeScript |
| **Database** | PostgreSQL (raw SQL, connection pooling) |
| **Auth** | JWT (JSON Web Tokens) + bcrypt |
| **Styling** | Custom CSS-in-JS (no external UI library) |

---

## ✨ Features

### 👤 User Features
- Register & Login with JWT authentication
- Public profile with rating, review count, and skill transfer %
- Add skills you **offer** and skills you **want** to learn
- Browse all skills with **category, type, and search filters**
- Send **Swap Requests** with preferred mode (online/offline/both)
- **In-app Chat** for every accepted swap
- **Meeting Scheduler** — schedule Google Meet, Zoom, or MS Teams sessions
- Meeting link is **automatically shared in chat** when scheduled
- **Session Notes** — add notes during/after sessions
- **Skill Transfer % tracker** (0–100%) per session
- **Rate & Review** each other after sessions (1–5 stars)
- View all your sessions with upcoming and completed tabs

### 👑 Super Admin Features
- **Platform Statistics** — users, skills, swaps, sessions, reviews count
- **User Management** — view all users, activate/deactivate, delete
- **Skill Moderation** — hide/show any skill on the platform
- **Category Management** — add new skill categories, toggle active/inactive, delete

---

## 🔄 Complete Workflow

```
1. Register / Login
       ↓
2. Add Skills (offer & want)
       ↓
3. Browse Skills → Click "Request Swap"
       ↓
4. Select your skill to offer in return + preferred mode
       ↓
5. Receiver: Accept or Reject the swap
       ↓
6. Schedule a Meeting:
   → Choose date & time
   → Pick mode: Video / Audio / Chat / Offline
   → Select platform: Google Meet / Zoom / Teams
   → Paste meeting link (auto-shared in chat)
       ↓
7. Join the session via shared link or meet in person
       ↓
8. Add session notes during/after learning
       ↓
9. Mark session as Complete + set Skill Transfer %
       ↓
10. Rate each other (1–5 stars + transfer %)
        ↓
11. Ratings appear on public profile for future swaps
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL v14+
- npm or yarn

---

### 1. Clone the repository

```bash
git clone https://github.com/ishwarlahire/skill-swap-network.git
cd skill-swap-network
```

---

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/skill_swap_db
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRES_IN=7d

SUPER_ADMIN_NAME=Super Admin
SUPER_ADMIN_EMAIL=admin@skillswap.com
SUPER_ADMIN_PASSWORD=Admin@123
```

Create the database:
```sql
psql -U postgres
CREATE DATABASE skill_swap_db;
\q
```

Run migrations (creates all tables + seeds admin + categories):
```bash
npm run db:migrate
```

Start dev server:
```bash
npm run dev
# Server running at http://localhost:5000
```

---

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm start
# App running at http://localhost:3000
```

---

### 4. Super Admin Login

| Field | Value |
|-------|-------|
| Email | `admin@skillswap.com` |
| Password | `Admin@123` |

> ⚠️ Change these in `.env` before deploying to production.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/users/:id` | Get public profile |

### Skills
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/skills` | Browse all skills |
| POST | `/api/skills` | Add a skill |
| GET | `/api/skills/my` | My skills |
| DELETE | `/api/skills/:id` | Delete a skill |

### Swaps
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/swaps` | Send swap request |
| GET | `/api/swaps/my` | My swaps |
| GET | `/api/swaps/:id` | Swap details |
| PATCH | `/api/swaps/:id/status` | Accept/Reject/Complete |

### Sessions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sessions` | Schedule a session |
| GET | `/api/sessions/my` | My sessions |
| GET | `/api/sessions/swap/:swapId` | Sessions for a swap |
| PATCH | `/api/sessions/:id` | Update notes/status/transfer% |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/messages` | Send a message |
| GET | `/api/messages/:swapId` | Get chat messages |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reviews` | Submit a review |
| GET | `/api/reviews/my` | My received reviews |

### Admin (requires admin token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Platform statistics |
| GET | `/api/admin/users` | All users |
| PATCH | `/api/admin/users/:id/toggle` | Activate/deactivate user |
| DELETE | `/api/admin/users/:id` | Delete user |
| GET | `/api/admin/skills` | All skills |
| PATCH | `/api/admin/skills/:id/toggle` | Hide/show skill |
| GET | `/api/admin/categories` | All categories |
| POST | `/api/admin/categories` | Add category |
| PATCH | `/api/admin/categories/:id/toggle` | Toggle category |
| DELETE | `/api/admin/categories/:id` | Delete category |

---

## 📁 Project Structure

```
skill-swap-network/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection
│   │   ├── controllers/     # Request handlers (all in index.ts)
│   │   ├── db/              # Migration script
│   │   ├── middleware/       # JWT auth middleware
│   │   ├── repositories/    # PostgreSQL queries
│   │   │   ├── user.repository.ts
│   │   │   ├── skill.repository.ts
│   │   │   ├── swap.repository.ts
│   │   │   ├── session.repository.ts
│   │   │   ├── message.repository.ts
│   │   │   ├── review.repository.ts
│   │   │   └── category.repository.ts
│   │   ├── routes/          # Route definitions
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript interfaces
│   │   └── index.ts         # App entry point
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/      # SkillCard
│   │   │   └── layout/      # Navbar
│   │   ├── hooks/           # useAuth context
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── AboutPage.tsx
│   │   │   ├── AuthPages.tsx
│   │   │   ├── BrowseSkillsPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── SwapsPage.tsx      # Chat + Meeting scheduler
│   │   │   ├── SessionsPage.tsx   # Sessions + Review
│   │   │   └── AdminPage.tsx      # Super Admin panel
│   │   ├── services/        # Axios API calls
│   │   ├── types/           # TypeScript interfaces
│   │   ├── App.tsx          # Routes
│   │   └── index.tsx        # Entry point
│   ├── .gitignore
│   ├── package.json
│   └── tsconfig.json
│
└── README.md                ← You are here
```

---

## 🌐 Deployment

### Deploy Backend (Railway / Render)
1. Push code to GitHub
2. Connect repo to [Railway](https://railway.app) or [Render](https://render.com)
3. Set environment variables from `.env.example`
4. Set build command: `npm run build`
5. Set start command: `npm start`

### Deploy Frontend (Vercel / Netlify)
1. Push code to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Set `REACT_APP_API_URL` env variable to your backend URL
4. Deploy!

> Update `api.ts` baseURL to use `process.env.REACT_APP_API_URL` for production.

---

## 👨‍💻 About the Developer

**Ishwar Lahire** — Jr. Software Developer from Manmad, India

- 🎓 MCA Student at University of Mysore (SGPA: 9.8)
- 💼 Jr. Software Developer at The BAAP Company, Sangamner
- 💻 Specialized in Node.js, TypeScript, Fastify, PostgreSQL, Redis
- 🔗 GitHub: [github.com/ishwarlahire](https://github.com/ishwarlahire)
- 💼 LinkedIn: [linkedin.com/in/ishwar-lahire](https://linkedin.com/in/ishwar-lahire)
- 📧 Email: ishwarlahire1@gmail.com

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

*Built with ❤️ by Ishwar Lahire*
