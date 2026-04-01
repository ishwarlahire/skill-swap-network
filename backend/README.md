# Skill Swap Network - Backend

REST API built with **Fastify + TypeScript + PostgreSQL**

## 🚀 Setup

```bash
cd backend
npm install
cp .env.example .env   # Fill in your DB credentials & JWT secret
npm run db:migrate     # Create tables
npm run dev            # Start dev server
```

## 📡 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get logged-in user profile |

### Skills
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/skills | Get all skills (filter: ?category=&type=) |
| POST | /api/skills | Add a new skill (auth required) |
| GET | /api/skills/my | Get my skills (auth required) |
| DELETE | /api/skills/:id | Delete my skill (auth required) |

### Swaps
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/swaps | Send a swap request (auth required) |
| GET | /api/swaps/my | Get my swap requests (auth required) |
| PATCH | /api/swaps/:id/status | Accept/Reject/Complete swap (auth required) |

## 🗂️ Folder Structure

```
backend/
├── src/
│   ├── config/         # DB connection
│   ├── controllers/    # Request handlers
│   ├── db/             # Migrations
│   ├── middleware/     # JWT auth middleware
│   ├── repositories/   # DB queries
│   ├── routes/         # Route definitions
│   ├── services/       # Business logic
│   ├── types/          # TypeScript interfaces
│   └── index.ts        # App entry point
├── .env.example
├── package.json
└── tsconfig.json
```
