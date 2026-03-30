<div align="center">
  <img width="1200" height="auto" alt="Noir Roastery Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🌑 Noir Roastery: Database Explorer
### Premium Specialty Coffee Inventory Management System

**Noir Roastery** is a high-end database explorer designed for specialty coffee curators. Built with a focus on Swiss-minimalist aesthetics and high-impact typography, it provides a sophisticated interface for managing unique coffee batches, origin data, and sensory notes.

---

## ✨ Features

- 💎 **Discovery Index**: A visually stunning grid of specialty coffees with interactive states and smooth transitions.
- 👤 **Persona Management**: Personalized user settings for curators, including profile updates and security configurations.
- 🌓 **Dual-Surface UI**: Seamlessly switch between light and dark modes with a custom-engineered color system.
- 🌡️ **Sensory Registry**: Detailed tracking of roast levels (**Light**, **Medium**, **Dark**), origin details, and flavor profiles.
- ⚡ **Full-Stack Performance**: Powered by a unified Express + Vite architecture for low-latency interactions.

---

## 🛠️ Technical Stack

- **Frontend**: React 19, Tailwind CSS (v4), Framer Motion, Lucide Icons
- **Backend**: Express.js, Node.js (TSX runtime)
- **Database**: SQLite (File-based)
- **Dev Tooling**: Vite 6, TypeScript 5.8

---

## 🚀 Getting Started

### 📦 Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **pnpm**

### 🛠️ Local Installation

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   cd database-explorer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file in the root directory (using `.env.example` as a template):
   ```env
   GEMINI_API_KEY=your_key_here
   ```

4. **Launch Development Server:**
   ```bash
   npm run dev
   ```
   *The server will be active at `http://localhost:3000`*

---

## 📋 Project Structure

```text
a:/database-explorer/
├── .data/              # SQLite Database Storage
├── server/             # Express API & Backend Logic
│   ├── ai.ts           # Gemini Sensory Descriptions
│   ├── db.ts           # Database Initialization
│   └── routes.ts       # Modular API Endpoints
├── src/                # Frontend React Application
│   ├── lib/            # Shared Utilities & API Client
│   ├── App.tsx         # Main Discovery/Persona Interface
│   └── index.css       # Global Noir Design System
├── server.ts           # Project Entry Point
└── package.json        # Manifest & Scripts
```

---

## 🔍 Quality & Security Review

A detailed code review has been performed on this repository. Key areas for future development include:
- [ ] **Security**: Implementation of `bcrypt` for password hashing (currently in roadmap).
- [ ] **AI Integration**: Expansion of automated sensory notes generation.
- [ ] **Analytics**: Building the dedicated Curations Dashboard.

*Refer to `analysis_results.md` for a comprehensive review of the codebase.*

---

<div align="center">
  <p><i>Exploration of unique batches and roastery insights.</i></p>
  <p><b>Noir Roastery Master Index 2026</b></p>
</div>
