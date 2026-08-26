# Bishal Biswas — Modern Developer Portfolio (MERN + C)

A dynamic, full-stack personal developer portfolio website designed to showcase skills, background, and featured projects with high visual polish, real-time interactivity, and a secure administration portal.

---

## 🚀 Tech Stack

### Frontend
- **Framework:** React.js 19 + Vite
- **Routing:** React Router v7
- **State & Data Fetching:** Redux Toolkit + RTK Query (automatic caching & invalidation)
- **Styling:** Tailwind CSS v4 (Deep Slate / Dark theme, custom glow gradients, responsive)
- **Icons:** Lucide React + custom SVG brand icons

### Backend
- **Runtime:** Node.js & Express.js
- **Database:** MongoDB & Mongoose ODM
- **Security:** Helmet, CORS, Cookie-Parser, Rate Limiting (`express-rate-limit`), Express-Validator
- **Authentication:** JWT (Short-lived Access Tokens + Long-lived HttpOnly Refresh Tokens with revocation tracking) & Google OAuth 2.0 readiness
- **Password Hashing:** BcryptJS

---

## 📁 Project Structure

```
├── client/                     # React Frontend SPA
│   ├── src/
│   │   ├── app/                # Redux store configuration
│   │   ├── components/         # Layout, Navbar, Footer, Cards, Modals, Skeletons
│   │   ├── features/           # RTK Query API slices & Redux slices
│   │   │   ├── api/            # Base RTK Query API slice
│   │   │   ├── auth/           # Auth slice & auth endpoints
│   │   │   ├── profile/        # Profile & about endpoints
│   │   │   ├── skills/         # Skills endpoints & mutations
│   │   │   ├── projects/       # Projects endpoints & mutations
│   │   │   └── comments/       # Public comments & moderation
│   │   ├── pages/              # Home, Projects, ProjectDetails, Contact, 404
│   │   │   └── admin/          # AdminLogin, Dashboard, ManageProjects, ManageSkills, ManageProfile, ManageComments
│   │   ├── routes/             # AppRouter definitions
│   │   ├── index.css           # Tailwind v4 theme & glow styles
│   │   └── main.jsx
│   └── vite.config.js          # Vite dev configuration with /api proxy
│
├── server/                     # Express REST API
│   ├── src/
│   │   ├── config/             # MongoDB connection
│   │   ├── controllers/        # Profile, Skill, Project, Comment, Auth
│   │   ├── middleware/         # JWT verification, Error handling, Rate limiting, Validators
│   │   ├── models/             # Admin, Profile, Skill, Project, Comment
│   │   ├── routes/             # REST route handlers
│   │   └── scripts/            # Database seed scripts
│   ├── server.js               # Entry point
│   └── .env
│
├── wireframes/                 # Wireframe & mockup designs
├── PRD.md                      # Product Requirements Document
└── Architecture.md             # Technical Architecture Document
```

---

## ⚡ Quick Start & Development

### 1. Backend Setup

```bash
cd server
npm install

# Seed the database with sample projects, skills, profile, comments & admin user:
npm run seed

# Run the development server (port 5000):
npm run dev
```

#### Default Admin Credentials (Seeded):
- **Email:** `bishalbiswas2026@gmail.com`
- **Password:** `Admin@12345`

---

### 2. Frontend Setup

```bash
cd client
npm install

# Run the frontend dev server (port 5173):
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌟 Key Features

1. **Dynamic Home Page (`/`):**
   - Live profile details, title, and tagline pulled directly from MongoDB.
   - Dynamic **Skills & Expertise** grid with animated percentage progress bars and category filters.
   - Dynamic **About Me** section and featured project cards.

2. **All Projects Grid (`/projects`):**
   - Filter by tech stack (React, Node.js, Express, C, etc.) or search by title/description.
   - Cards with live demo and GitHub repository links.

3. **Project Details Page (`/projects/:slug`):**
   - Media showcase player / walkthrough preview.
   - Project specifications, key feature architecture, role, and duration.
   - **Interactive Comments Thread:** visitors can post public feedback with instant update.

4. **Contact Page (`/contact`):**
   - Direct contact links and simulated interactive message dispatch.

5. **Admin Portal (`/admin`):**
   - **JWT Protected Dashboard:** Overview stats of projects, skills, and comments.
   - **Manage Projects:** Full CRUD with custom slug generator, cover image URL, demo video embed, tech stack pills, and dynamic feature blocks.
   - **Manage Skills:** Full CRUD with live proficiency sliders and display order.
   - **Manage Profile:** Update bio, hero copy, avatars, and social links.
   - **Moderate Comments:** Approve, hide, or delete visitor comments.
