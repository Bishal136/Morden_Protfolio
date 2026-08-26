# Product Requirements Document (PRD)
## Developer Portfolio Website — Bishal Biswas

**Version:** 1.0
**Author:** Bishal Biswas
**Stack:** MongoDB, Express.js, React.js, Node.js (MERN) + Tailwind CSS + Redux Toolkit
**Status:** Draft

---

## 1. Overview

A personal developer portfolio website that showcases the owner's skills, background, and projects to recruiters, clients, and fellow developers. Unlike a static portfolio, this project is itself a MERN application — projects and skills are stored in a database and managed dynamically, and visitors can leave public comments on individual project pages, demonstrating full-stack ability (not just a rendered CV).

### 1.1 Problem Statement
A static HTML/CSS portfolio doesn't demonstrate full-stack capability and is tedious to update (every new project requires a code change and redeploy). The owner needs a portfolio that:
- Doubles as a live demonstration of MERN + Redux Toolkit skills.
- Lets content (projects, skills, about text) be updated without touching front-end code.
- Provides social proof through visible engagement (comments/feedback on projects).

### 1.2 Goals
1. Present a professional, modern, dark-themed portfolio that converts visitors into interview calls / freelance leads.
2. Showcase projects with rich detail (media, tech stack, role, duration, live/demo links).
3. Allow the owner to add/edit/delete projects and skills via a protected admin flow, backed by a real database.
4. Allow visitors to leave comments on a project (lightweight engagement/social proof loop).
5. Be fully responsive (desktop, tablet, mobile) and performant.

### 1.3 Non-Goals
- No full blogging/CMS platform.
- No user sign-up/login for visitors (comments are lightweight, name + text only, or optionally moderated).
- No e-commerce/payment functionality (this is a portfolio, not one of the showcased apps).
- No multi-tenant support — this is a single-owner portfolio.

---

## 2. Target Audience

| Persona | Need |
|---|---|
| Recruiter / HR | Quickly scan skills, experience, and see proof of real projects |
| Hiring Manager / Tech Lead | Dig into technical depth of a specific project (stack, architecture, role) |
| Potential Client (freelance) | Judge quality of past work, see live demos, leave/read feedback |
| Fellow Developer | Browse code links (GitHub), leave technical comments/praise |
| Owner (Admin) | Add new projects/skills, moderate comments, keep content fresh |

---

## 3. Information Architecture / Pages

Based on the approved wireframes, the site has 3 primary public views plus a lightweight admin surface:

1. **Home Page** (`/`)
2. **Projects Page** (`/projects`)
3. **Project Details Page** (`/projects/:slug`)
4. **Contact** (section or `/contact`)
5. **Admin Dashboard** (`/admin`, protected) — not in original wireframe visuals but required to make content dynamic

---

## 4. Functional Requirements

### 4.1 Global / Nav Bar
- Sticky top navigation with logo (left) and links: Home, Projects, Contact (right).
- Active route highlighted (as seen in mockups — "HOME" / "Projects" highlighted in blue).
- Mobile: collapses into a hamburger menu.
- Footer (site-wide) with social links: GitHub, LinkedIn, Email (icon row, per Home mockup).

### 4.2 Home Page (`/`)
**Reference:** Wireframe "Home page" + Home mockup (Image 2)

| Section | Requirement |
|---|---|
| Hero / Intro | Name, title/role (e.g. "Full-Stack MERN & C Developer"), short tagline, profile photo. Content pulled from a single `Profile` document in DB (or config) so it's editable without code changes. |
| Skills & Expertise | Grid of skill cards. Each card: icon, name, proficiency % with progress bar (per mockup: React 85%, Node.js 90%, Express 80%, MongoDB 85%, MySQL 80%, C 75%). Data-driven from `Skill` collection — order and proficiency editable via admin. |
| About Me | Circular photo + paragraph bio. Sourced from `Profile.about`. |
| CTA | Buttons/links to view Projects and Contact. |

**Acceptance Criteria**
- Skills render dynamically from API (`GET /api/skills`), not hardcoded.
- Page is responsive: hero splits to stacked layout on mobile.
- Lighthouse performance score ≥ 90 on this page.

### 4.3 Projects Page (`/projects`)
**Reference:** Wireframe "Project Page" + Projects mockup (Image 3)

- Heading: "ALL PROJECTS".
- Responsive grid (2 columns desktop / 1 column mobile) of **Project Cards**, each showing:
  - Cover image/screenshot
  - Title
  - Short description (1–2 lines)
  - Tech-stack tags/pills (e.g. React, MongoDB, Node.js, Express)
  - "View Project" CTA button → navigates to Project Details page
- Data fetched from `GET /api/projects` (paginated or fetch-all, given expected small volume).
- Optional (Phase 2): filter/sort by tech tag.

**Acceptance Criteria**
- Cards load skeleton/placeholder while fetching.
- Clicking "View Project" routes to `/projects/:slug` using React Router.
- Empty state handled gracefully if no projects exist yet.

### 4.4 Project Details Page (`/projects/:slug`)
**Reference:** Wireframe "Project Details page" + Project Details mockup (Image 4)

| Section | Requirement |
|---|---|
| Media | Embedded video/demo player or image gallery ("Project Demo Walkthrough"). |
| Project Overview panel | Title, description, Role (e.g. "Lead Developer"), Duration (e.g. "3 Months"), Live Site link, GitHub Repo link. |
| Features & Technical Specifications | List of feature blocks (icon + title + description) e.g. Authentication, Payment Integration, Admin Dashboard, Product Catalog — plus a "Tech Stack" chip list with icons. |
| Client & Peer Comments | List of existing comments (avatar, name, role/label, comment text) + a form to add a new public comment (name + text + "Post" button). |

**Acceptance Criteria**
- Page fetched via `GET /api/projects/:slug` returning full project detail including populated comments.
- New comment submission calls `POST /api/projects/:id/comments` and optimistically/immediately appends to the list on success.
- Basic comment validation: name and comment text required, max length enforced, HTML/script input sanitized on the backend (XSS prevention).
- 404 / "Project not found" state if slug is invalid.

### 4.5 Contact
- Contact section/page with email, social links, and (Phase 2) a working contact form that sends an email via a backend endpoint (e.g. Nodemailer) or opens a mailto link (Phase 1 minimum).

### 4.6 Admin (Content Management)
Not shown in wireframes but required so the "PRD" reflects the real product: content (projects, skills, profile) must be manageable without redeploying code.

- `/admin/login` — protected login (JWT-based) for the owner only. No public registration.
- `/admin/dashboard` — CRUD UI for:
  - Projects (create/edit/delete, upload cover image + media, set tech stack tags, features, role/duration/links)
  - Skills (create/edit/delete, set proficiency %)
  - Profile/About content
  - Comment moderation (view/delete inappropriate comments)
- All admin routes protected by JWT auth middleware on the backend and a protected-route wrapper on the frontend.

---

## 5. User Stories

1. As a **visitor**, I want to see the owner's top skills at a glance so I can quickly judge fit for a role.
2. As a **visitor**, I want to browse all projects in a grid so I can pick the ones relevant to me.
3. As a **visitor**, I want to open a project and see the tech stack, my role expectations, and a live demo so I can evaluate real-world quality.
4. As a **visitor**, I want to leave a comment on a project to give feedback or praise.
5. As the **owner (admin)**, I want to log in and add a new project (with images, tags, description) without writing code.
6. As the **owner (admin)**, I want to update my skill proficiency percentages as I learn new things.
7. As the **owner (admin)**, I want to delete a spam/inappropriate comment.

---

## 6. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | First Contentful Paint < 2s on 4G; images optimized/lazy-loaded. |
| Responsiveness | Fully usable at 375px, 768px, 1024px, 1440px breakpoints. |
| Accessibility | Semantic HTML, sufficient color contrast on dark theme, alt text on images, keyboard-navigable nav. |
| SEO | Server-rendered meta tags (or React Helmet) per page; project pages have unique titles/descriptions for shareability. |
| Security | JWT auth for admin; input sanitization/validation on all write endpoints (comments, admin CRUD); rate limiting on comment POST endpoint to prevent spam. |
| Reliability | Graceful error states (API failure, empty states) on every data-driven page. |
| Maintainability | Content changes (new project, new skill) require zero code deploys. |
| Browser Support | Latest 2 versions of Chrome, Firefox, Safari, Edge. |

---

## 7. Tech Stack (confirmed)

- **Frontend:** React.js (Vite), React Router, Redux Toolkit (+ RTK Query for data fetching/caching), Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JWT (admin only)
- **Media storage:** Cloudinary or similar (for project images/thumbnails); YouTube/Vimeo embed or hosted MP4 for demo video
- **Deployment:** Frontend on Vercel/Netlify, Backend on Render/Railway, MongoDB Atlas

*(Full breakdown in `Architecture.md`.)*

---

## 8. Success Metrics

- Portfolio successfully deployed and publicly accessible.
- All 4 showcased sample projects (MERN E-commerce, Task Manager, C Language File Utility, Weather Dashboard) live with full details.
- Admin can add a new project end-to-end in under 3 minutes without touching code.
- Lighthouse score ≥ 90 (Performance, Accessibility, Best Practices) on Home and Projects pages.
- At least basic anti-spam protection in place on the comments feature before public launch.

---

## 9. Milestones (suggested)

| Phase | Scope |
|---|---|
| Phase 1 — MVP | Home, Projects, Project Details (static-ish, read-only from seeded DB), basic responsive Tailwind UI, Redux store wired for projects/skills |
| Phase 2 | Comments feature (post + list), Contact form backend, admin auth |
| Phase 3 | Admin CRUD dashboard for projects/skills/profile, image upload via Cloudinary |
| Phase 4 | Polish: animations, SEO meta tags, accessibility pass, performance audit, deploy |

---

## 10. Open Questions

- Should visitor comments require moderation/approval before appearing publicly, or post instantly (with admin able to delete after)?
- Should the contact form send email directly, or just be a mailto/social links section for v1?
- Do we need multi-language support? *(Assumed: No, English only, for v1.)*