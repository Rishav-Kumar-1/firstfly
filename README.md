# 🚌 TravelGo — Travel Vehicle & Tour Booking Platform

> A full-stack web application for booking travel vehicles and tour packages.
> Built with React, Node.js, Express, and MySQL.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Auth | JWT + bcrypt |
| HTTP Client | Axios |
| Routing | React Router v7 |

---

## 📁 Project Structure

```
TravelGo/
├── frontend/       → React + Vite frontend
├── backend/        → Node.js + Express API
├── database/       → MySQL schema and seed files
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### Prerequisites
- Node.js v18+
- MySQL 8+
- Git

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd travelGo-1
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: http://localhost:5173

### 3. Setup Backend
```bash
cd backend
npm install
# Copy .env.example to .env and fill in your values
cp .env.example .env
npm run dev
```
Backend runs at: http://localhost:5000

### 4. Setup Database
- Open MySQL and run `database/schema.sql`
- Then run `database/seed.sql`
- Update backend `.env` with your MySQL credentials

---

## 🔑 Environment Variables

See `backend/.env.example` for all required variables.

---

## 📖 Development Phases

- [x] Phase 1 — Project Setup
- [ ] Phase 2 — Frontend Architecture
- [ ] Phase 3 — Homepage
- [ ] Phase 4 — Vehicle Module
- [ ] Phase 5 — Tour Packages
- [ ] Phase 6 — Backend Setup
- [ ] Phase 7 — MySQL Database
- [ ] Phase 8 — REST APIs
- [ ] Phase 9 — Integration
- [ ] Phase 10 — Authentication
- [ ] Phase 11 — Booking System
- [ ] Phase 12 — Pricing Engine
- [ ] Phase 13 — Customer Dashboard
- [ ] Phase 14 — Admin Dashboard
- [ ] ...and more

---

## 📄 License

MIT
