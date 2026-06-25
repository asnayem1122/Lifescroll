<div align="center">

# ⛩️ Lifescroll — Personal Life OS

**A dark, focused life-management application built with the _Midnight Sumi-e_ design philosophy —**  
**Japanese ink wash art fused with game UI.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47a248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-d4af37?style=flat-square)](LICENSE)

</div>

---

## ✨ What is Lifescroll?

Lifescroll is a personal life OS that helps you:

- 📊 **Track every taka** — income, expenses, budgets, monthly reports
- 🔥 **Build daily habits** — seal-stamp checkboxes, streak tracking, analytics
- 🌑 **Stay immersed** — cold-black dark mode, gold accents, floating ink particles, mountain silhouettes

Everything is denominated in **৳ BDT** with proper lakh formatting (`৳1,20,000`).

---

## 🖥️ Screenshots

> _Dark mode default. Light mode available via the hanko-stamp toggle in the navbar._

| Dashboard | Habits | Budget |
|---|---|---|
| Stat cards + donut chart | Seal-stamp tracker + completion ring | Per-category progress bars |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + TypeScript (Vite 8) |
| **Styling** | Tailwind CSS 4 + CSS custom properties |
| **Animations** | Framer Motion 12 |
| **Charts** | Recharts 3 |
| **Drag & Drop** | @dnd-kit |
| **Icons** | Lucide React |
| **Count-up** | react-countup |
| **Notifications** | react-hot-toast |
| **HTTP Client** | Axios |
| **Backend** | Node.js + Express 5 + TypeScript |
| **Database** | MongoDB + Mongoose 9 |
| **Auth** | JWT + bcrypt |
| **Fonts** | Google Fonts — Noto Serif + Inter |

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | 18 or later |
| npm | 9 or later |
| MongoDB | Local **or** [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier) |

---

### 1 — Clone the repository

```bash
git clone https://github.com/asnayem1122/Lifescroll.git
cd Lifescroll
```

---

### 2 — Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
# MongoDB — local or Atlas connection string
MONGODB_URI=mongodb://localhost:27017/lifescroll

# Generate a strong random secret:
#   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your-super-secret-key-here

PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> **Using MongoDB Atlas?**  
> Replace `MONGODB_URI` with your Atlas connection string:  
> `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/lifescroll`

---

### 3 — Install dependencies

```bash
# Server
cd server && npm install

# Client
cd ../client && npm install
```

---

### 4 — Run the app

Open **two** terminal windows:

```bash
# Terminal 1 — API server (http://localhost:5000)
cd server
npm run dev

# Terminal 2 — Vite dev server (http://localhost:5173)
cd client
npm run dev
```

Open **http://localhost:5173** in your browser, register an account, and start scrolling your life. 🖊️

---

## 📁 Project Structure

```
Lifescroll/
├── .env.example          ← Copy to .env and fill in secrets
├── client/               ← React + Vite frontend
│   ├── src/
│   │   ├── api/          ← Axios API wrappers
│   │   ├── components/   ← Reusable UI components
│   │   │   ├── budget/
│   │   │   ├── habits/
│   │   │   ├── layout/   ← Navbar, Sidebar, Ink particles, Mist…
│   │   │   └── ui/
│   │   ├── context/      ← AuthContext, ThemeContext
│   │   ├── hooks/        ← Custom React hooks
│   │   ├── pages/        ← Dashboard, Transactions, Budget, Habits, Reports, Settings
│   │   ├── types/        ← TypeScript interfaces
│   │   └── utils/        ← Date & currency helpers
│   └── public/
│       └── favicon.svg
└── server/               ← Express + TypeScript backend
    └── src/
        ├── middleware/   ← JWT auth middleware
        ├── models/       ← Mongoose schemas (User, Transaction, Budget, Habit, HabitLog)
        ├── routes/       ← REST API routes
        └── server.ts     ← Entry point
```

---

## 🔌 API Endpoints

### Auth
| Method | Path | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Login, returns JWT |
| `GET`  | `/api/auth/me` | Get current user |

### Transactions
| Method | Path | Description |
|---|---|---|
| `GET`  | `/api/transactions` | List (paginated, filterable) |
| `POST` | `/api/transactions` | Create transaction |
| `PUT`  | `/api/transactions/:id` | Update transaction |
| `DELETE` | `/api/transactions/:id` | Delete transaction |
| `GET`  | `/api/transactions/summary` | Monthly + yearly summary |

### Budget
| Method | Path | Description |
|---|---|---|
| `GET`  | `/api/budget` | Get budget with spending |
| `PUT`  | `/api/budget` | Set budget limits |
| `GET`  | `/api/budget/heatmap` | Daily spending heatmap |

### Habits
| Method | Path | Description |
|---|---|---|
| `GET`  | `/api/habits` | List habits |
| `POST` | `/api/habits` | Create habit |
| `PUT`  | `/api/habits/reorder` | Reorder habits (drag & drop) |
| `PUT`  | `/api/habits/:id` | Update habit |
| `DELETE` | `/api/habits/:id` | Delete habit |

### Habit Logs
| Method | Path | Description |
|---|---|---|
| `POST` | `/api/habit-logs` | Toggle daily completion |
| `GET`  | `/api/habit-logs` | Get logs by date |
| `GET`  | `/api/habit-logs/stats` | Overall stats, streaks, trends |
| `GET`  | `/api/habit-logs/stats/:habitId` | Per-habit consistency |

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#080808` | Page background |
| `--surface` | `#0f0f0f` | Card surface |
| `--border` | `#ffffff08` | Card border |
| `--accent-gold` | `#d4af37` | Primary accent — headings, active states |
| `--accent-crimson` | `#8b0000` | Secondary accent — seals, warnings |
| `--text-primary` | `#e8e8e8` | Body text |
| `--text-secondary` | `#444444` | Muted text |

Light mode swaps in cold ash greys (`#f0f0f0` / `#e4e4e4`).

**Global effects:**
- 🌊 **Floating ink particles** — canvas-based cold white specks that drift and fade
- ⛰️ **Mountain silhouettes** — layered SVG at viewport bottom
- 🌫️ **Mist layers** — animated gradient strips that drift horizontally
- 🌲 **Pine tree sway** — slow ±1° oscillation on the dashboard
- ✒️ **Ink-bleed SVG filter** — applied to completion rings and dividers

---

## 🏗️ Building for Production

```bash
# Build the frontend (outputs to client/dist/)
cd client && npm run build

# Build the server (outputs to server/dist/)
cd server && npm run build

# Run compiled server
cd server && npm start
```

Serve `client/dist/` from any static host (Vercel, Netlify, Cloudflare Pages, etc.) and point `VITE_API_URL` (or the Vite proxy) to your deployed API.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch — `git checkout -b feat/your-feature`
3. Commit with conventional commits — `git commit -m "feat: add xyz"`
4. Push and open a Pull Request

---

## 📜 License

MIT © [asnayem1122](https://github.com/asnayem1122)
