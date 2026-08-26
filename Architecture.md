# Architecture Document
## Developer Portfolio Website — Bishal Biswas

**Stack:** MongoDB, Express.js, React.js, Node.js (MERN) + Redux Toolkit + Tailwind CSS
**Companion doc:** `PRD.md`

---

## 1. High-Level Architecture

```
┌─────────────────────────────┐        HTTPS/JSON        ┌──────────────────────────────┐
│         CLIENT (SPA)         │ ◄──────────────────────► │         SERVER (API)          │
│  React + Redux Toolkit (RTK  │                           │  Node.js + Express.js         │
│  Query) + React Router +     │                           │  JWT auth middleware          │
│  Tailwind CSS                │                           │  Mongoose ODM                 │
│  Hosted: Vercel / Netlify    │                           │  Hosted: Render / Railway     │
└───────────────┬──────────────┘                           └───────────────┬───────────────┘
                │                                                           │
                │ media (images/video)                                     │
                ▼                                                           ▼
      ┌──────────────────┐                                        ┌──────────────────┐
      │ Cloudinary / S3   │                                        │  MongoDB Atlas    │
      │ (project images,  │                                        │  (Projects,       │
      │ profile photo)    │                                        │  Skills, Profile, │
      └──────────────────┘                                        │  Comments, Admin) │
                                                                    └──────────────────┘
```

- **Client-Server split**: React SPA talks to Express REST API only via JSON over HTTPS. No server-side rendering required for v1 (React Helmet handles basic per-page SEO tags client-side).
- **Stateless API**: Auth is JWT-based (no server sessions), enabling easy horizontal scaling if ever needed.
- **Media offloaded**: Images/video are not stored in MongoDB or on the app server — they live in Cloudinary (or S3) and only the URL is persisted in the DB.

---

## 2. Repository Structure (Monorepo, two workspaces)

```
portfolio/
├── client/                      # React app
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   └── store.js         # Redux store configuration
│   │   ├── features/
│   │   │   ├── projects/
│   │   │   │   ├── projectsApiSlice.js   # RTK Query endpoints
│   │   │   │   └── projectsSlice.js      # UI-only local state (filters, etc.)
│   │   │   ├── skills/
│   │   │   │   └── skillsApiSlice.js
│   │   │   ├── comments/
│   │   │   │   └── commentsApiSlice.js
│   │   │   ├── profile/
│   │   │   │   └── profileApiSlice.js
│   │   │   └── auth/
│   │   │       ├── authApiSlice.js       # login, refresh, logout, me (RTK Query)
│   │   │       └── authSlice.js          # in-memory access token + admin profile
│   │   ├── components/
│   │   │   ├── layout/            # Navbar, Footer, ProtectedRoute
│   │   │   ├── common/            # Button, Card, Tag, Skeleton, Modal
│   │   │   └── ui/                # Tailwind primitives
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── ProjectDetails.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── admin/
│   │   │       ├── AdminLogin.jsx
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── ManageProjects.jsx
│   │   │       └── ManageSkills.jsx
│   │   ├── routes/
│   │   │   └── AppRouter.jsx      # React Router route definitions
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                      # Express API
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js             # Mongoose connection
│   │   │   └── cloudinary.js
│   │   ├── models/
│   │   │   ├── Project.js
│   │   │   ├── Skill.js
│   │   │   ├── Comment.js
│   │   │   ├── Profile.js
│   │   │   └── Admin.js
│   │   ├── controllers/
│   │   │   ├── projectController.js
│   │   │   ├── skillController.js
│   │   │   ├── commentController.js
│   │   │   ├── profileController.js
│   │   │   └── authController.js
│   │   ├── routes/
│   │   │   ├── projectRoutes.js
│   │   │   ├── skillRoutes.js
│   │   │   ├── commentRoutes.js
│   │   │   ├── profileRoutes.js
│   │   │   └── authRoutes.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js   # verifyJWT, requireAdmin
│   │   │   ├── errorHandler.js
│   │   │   ├── rateLimiter.js      # protects comment POST endpoint
│   │   │   └── validators.js       # express-validator schemas
│   │   ├── utils/
│   │   │   └── generateToken.js    # signs access + refresh JWTs
│   │   ├── scripts/
│   │   │   └── seedAdmin.js        # one-time CLI script to create the admin account
│   │   └── app.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 3. Data Models (MongoDB / Mongoose)

### 3.1 `Profile` (single document — the "Home" hero + about content)
```js
{
  name: String,               // "Bishal Biswas"
  title: String,              // "Full-Stack MERN & C Developer"
  tagline: String,            // "Crafting Robust Web Solutions with Core Logic Passion"
  photoUrl: String,
  aboutPhotoUrl: String,
  aboutText: String,
  socialLinks: {
    github: String,
    linkedin: String,
    email: String
  },
  updatedAt: Date
}
```

### 3.2 `Skill`
```js
{
  name: String,        // "React"
  icon: String,        // icon key or URL
  proficiency: Number, // 0-100
  order: Number,       // display order on Home page
}
```

### 3.3 `Project`
```js
{
  title: String,             // "MERN E-commerce Store"
  slug: String,              // unique, url-safe, generated from title
  shortDescription: String,  // used on Projects grid card
  fullDescription: String,   // used on Project Details page
  coverImageUrl: String,     // grid card thumbnail
  demoVideoUrl: String,      // embedded walkthrough video
  role: String,              // "Lead Developer"
  duration: String,          // "3 Months"
  liveSiteUrl: String,
  githubRepoUrl: String,
  techStack: [String],       // ["React", "MongoDB", "Node.js", "Express"]
  features: [
    { icon: String, title: String, description: String }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### 3.4 `Comment`
```js
{
  project: ObjectId,   // ref -> Project
  name: String,        // commenter display name
  role: String,        // optional, e.g. "Client" / "Developer Peer"
  text: String,
  approved: Boolean,   // default true or false depending on moderation decision (PRD open question)
  createdAt: Date
}
```

### 3.5 `Admin`
```js
{
  email: String,       // unique
  passwordHash: String, // bcrypt
  createdAt: Date
}
```
> Only one (or a small, fixed set of) admin account(s) — no public self-registration endpoint is exposed.

---

## 4. REST API Design

Base URL: `/api`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/profile` | Public | Fetch profile/about/hero content |
| PUT | `/profile` | Admin | Update profile content |
| GET | `/skills` | Public | List all skills (sorted by `order`) |
| POST | `/skills` | Admin | Create skill |
| PUT | `/skills/:id` | Admin | Update skill |
| DELETE | `/skills/:id` | Admin | Delete skill |
| GET | `/projects` | Public | List all projects (grid view fields) |
| GET | `/projects/:slug` | Public | Get single project full detail + comments |
| POST | `/projects` | Admin | Create project (multipart for image upload) |
| PUT | `/projects/:id` | Admin | Update project |
| DELETE | `/projects/:id` | Admin | Delete project |
| GET | `/projects/:id/comments` | Public | List comments for a project |
| POST | `/projects/:id/comments` | Public (rate-limited) | Add a comment |
| DELETE | `/comments/:id` | Admin | Moderate/delete a comment |
| POST | `/auth/login` | Public | Admin login → returns access token (+ sets refresh token cookie) |
| POST | `/auth/refresh` | Public (cookie) | Exchange valid refresh token for a new access token |
| POST | `/auth/logout` | Admin | Clears refresh token cookie / invalidates session |
| GET | `/auth/me` | Admin | Verify token / get current admin profile |

**Conventions**
- All responses: `{ success: boolean, data?: any, message?: string }`.
- Validation via `express-validator` on all POST/PUT bodies.
- Errors funneled through a centralized `errorHandler` middleware returning consistent JSON shape + correct HTTP status codes (400, 401, 403, 404, 429, 500).
- `POST /projects/:id/comments` protected by an IP-based rate limiter (e.g. `express-rate-limit`) to prevent spam.

---

## 5. Frontend Architecture

### 5.1 State Management (Redux Toolkit)
- **RTK Query** is used as the primary data-fetching layer for all server state (`projects`, `skills`, `profile`, `comments`, `auth`). This gives automatic caching, re-fetching, and loading/error states without hand-written thunks.
- A slice per feature (`projectsApiSlice`, `skillsApiSlice`, etc.) defines endpoints (`getProjects`, `getProjectBySlug`, `addComment`, `login`, ...).
- **Plain slices** (non-API) are used only for pure client/UI state, e.g.:
  - `authSlice`: holds the current JWT + admin user in memory, persisted to `localStorage` for session continuity.
  - `uiSlice` (optional): mobile nav open/closed, active theme, toast/notification state.
- Store composition (`app/store.js`) combines the RTK Query API reducer + the plain UI/auth reducers, and adds the RTK Query middleware.

### 5.2 Routing (React Router)
```
/                     → Home
/projects             → Projects (grid)
/projects/:slug       → ProjectDetails
/contact              → Contact
/admin/login          → AdminLogin
/admin                → AdminDashboard (ProtectedRoute wrapper checks JWT)
/admin/projects       → ManageProjects (ProtectedRoute)
/admin/skills         → ManageSkills (ProtectedRoute)
*                     → NotFound
```
`ProtectedRoute` is a wrapper component that reads `authSlice` state; if no valid token, redirects to `/admin/login`.

### 5.3 Component/UI Layer (Tailwind CSS)
- Dark theme by default, matching mockups (near-black backgrounds, blue accent `#3B82F6`-ish, subtle glow/border on cards).
- Tailwind config extends theme with custom color tokens (`brand`, `surface`, `surface-elevated`) and consistent spacing/typography scale so all pages stay visually consistent.
- Reusable primitives: `Card`, `Tag` (tech stack pill), `Button`, `ProgressBar` (for skill proficiency), `Avatar`, `SectionHeading`.
- Layout shell (`Navbar` + `Footer`) wraps all public pages via a `PublicLayout` component; admin pages use a separate `AdminLayout` with a sidebar.
- Responsive design via Tailwind breakpoints (`sm`, `md`, `lg`, `xl`); mobile-first utility classes.

### 5.4 Data Flow Example — Project Details Page
1. Route `/projects/:slug` renders `ProjectDetails.jsx`.
2. Component calls `useGetProjectBySlugQuery(slug)` (RTK Query hook) → fetches `GET /api/projects/:slug`.
3. While loading → skeleton UI. On error → "Project not found" state.
4. On success, renders: media block, overview panel, features/tech-stack block, and `CommentsSection` (which itself uses `useGetCommentsQuery` / `useAddCommentMutation`).
5. Submitting the comment form triggers `addComment` mutation → RTK Query invalidates the comments cache tag → list auto-refetches and re-renders with the new comment.

---

## 6. Authentication & Security

### 6.1 Overview
- **Admin auth only** — there are no visitor accounts. A single (or small, seeded) `Admin` document is the only identity that can authenticate.
- No public registration endpoint is ever exposed. Admin accounts are created via a one-time seed script (`server/src/scripts/seedAdmin.js`) run manually or during initial deploy — never through an open API route.
- Auth uses a **short-lived access token + long-lived refresh token** pattern rather than a single long-lived JWT, to balance security with a smooth login experience.

### 6.2 Admin Data Model (extended)
```js
// models/Admin.js
{
  email: String,          // unique, required
  passwordHash: String,   // bcrypt, salt rounds >= 10
  refreshTokenHash: String, // hashed current valid refresh token (or an array for multi-device)
  lastLoginAt: Date,
  failedLoginAttempts: Number,  // reset on success; used for lockout
  lockUntil: Date,               // temporary lockout after repeated failures
  createdAt: Date
}
```

### 6.3 Login Flow (sequence)
```
Admin (client)                     Express API                          MongoDB
     │  POST /auth/login                  │                                  │
     │  { email, password }               │                                  │
     ├────────────────────────────────────►                                  │
     │                                     │  find Admin by email             │
     │                                     ├──────────────────────────────────►
     │                                     │◄─────────────────────────────────┤
     │                                     │  check lockUntil / attempts      │
     │                                     │  bcrypt.compare(password, hash)  │
     │                                     │  ── if mismatch: 401, increment  │
     │                                     │      failedLoginAttempts,        │
     │                                     │      lock after N attempts       │
     │                                     │  ── if match:                    │
     │                                     │      sign accessToken (JWT,      │
     │                                     │        exp 15m, payload: adminId)│
     │                                     │      sign refreshToken (JWT,     │
     │                                     │        exp 7d, random jti)       │
     │                                     │      store bcrypt(refreshToken)  │
     │                                     │      on Admin doc                │
     │                                     ├──────────────────────────────────►
     │  200 { accessToken, admin }         │  Set-Cookie: refreshToken        │
     │  (refreshToken sent as HttpOnly,    │   (HttpOnly, Secure, SameSite=   │
     │   Secure, SameSite cookie — never   │   Strict/Lax, path=/api/auth)    │
     │   exposed to JS)                    │                                  │
     │◄────────────────────────────────────┤                                  │
```

- **Access token**: short-lived (10–15 min), returned in the JSON response body, held **in memory** (Redux `authSlice`) on the client — not written to `localStorage`, to reduce XSS token-theft risk.
- **Refresh token**: long-lived (7 days), issued as an **HttpOnly, Secure, SameSite** cookie — inaccessible to JavaScript, so it can't be exfiltrated via XSS. Its hash is stored server-side so it can be revoked.
- On app load / access-token expiry, the client silently calls `POST /auth/refresh` (browser sends the HttpOnly cookie automatically); if valid, a new access token is issued and the session continues without a re-login prompt. If the refresh call fails (expired/revoked), the client redirects to `/admin/login`.
- `POST /auth/logout` clears the refresh cookie and invalidates the stored refresh-token hash server-side (so the same token can't be replayed).

### 6.4 Brute-Force / Lockout Protection
- `failedLoginAttempts` increments on each bad password; after **5** consecutive failures, `lockUntil` is set (e.g. 15 minutes) and login attempts return `423 Locked` until it elapses.
- Counter resets to 0 on a successful login.
- Combined with IP-based rate limiting (see 6.6) as a second layer of defense.

### 6.5 Backend Middleware Chain (Admin-protected routes)
```js
// middleware/authMiddleware.js
verifyAccessToken(req, res, next)
  → reads "Authorization: Bearer <token>" header
  → jwt.verify(token, ACCESS_TOKEN_SECRET)
  → on success: attaches req.admin = { id, email }; next()
  → on failure/expiry: 401 Unauthorized (client triggers refresh flow)

requireAdmin(req, res, next)
  → confirms req.admin exists (defense-in-depth if roles are added later)
  → next()
```
Applied as: `router.post('/projects', verifyAccessToken, requireAdmin, upload.single('cover'), projectController.create)`

### 6.6 Frontend Implementation (React + Redux Toolkit)

**`authApiSlice.js` (RTK Query)**
- `login(credentials)` → `POST /auth/login` → on success, dispatch `setCredentials({ accessToken, admin })`.
- `refresh()` → `POST /auth/refresh` (`credentials: 'include'` so the cookie is sent) → refreshes access token.
- `logout()` → `POST /auth/logout` → dispatch `clearCredentials()`.

**`authSlice.js` (plain slice)**
```js
{
  admin: null,          // { id, email }
  accessToken: null,    // in-memory only
  status: 'idle'        // 'idle' | 'loading' | 'authenticated' | 'error'
}
```

**Axios/RTK Query base query with auto-refresh**
- A custom `baseQuery` wraps `fetchBaseQuery`; on a `401` response it automatically calls the refresh endpoint once, updates the token in the store, and retries the original request. If refresh also fails, it dispatches `clearCredentials()` and the app redirects to `/admin/login`.

**`ProtectedRoute` component**
- Wraps all `/admin/*` routes.
- On mount, if no `accessToken` in store, silently attempts `refresh()` (covers page reloads, since the HttpOnly cookie persists but in-memory state doesn't).
- Shows a loading spinner while verifying, renders the route on success, or `<Navigate to="/admin/login" />` on failure.

**`AdminLogin.jsx`**
- Simple Tailwind form: email + password fields, client-side validation, submit → `useLoginMutation()`.
- Displays server error messages (invalid credentials, account locked, etc.) inline.
- On success, redirects to `/admin` (dashboard).

### 6.7 General Security Hardening
- **Input sanitization**: all comment/project text fields sanitized server-side (e.g. `sanitize-html` or `xss` package) to prevent stored XSS, since comment text is rendered back to all visitors.
- **Password policy**: enforce a minimum length/complexity at seed-time (admin accounts are provisioned manually, not via public sign-up).
- **CORS**: API restricts allowed origins to the deployed client domain (and localhost in dev); `credentials: true` enabled specifically so the refresh cookie can be sent cross-origin between the client and API subdomains.
- **Rate limiting**: applied to `/auth/login` and `/auth/refresh` (brute-force protection) and `/projects/:id/comments` (spam protection), via `express-rate-limit`.
- **CSRF consideration**: since the refresh token lives in a `SameSite=Strict` (or `Lax`) cookie and state-changing admin requests also require the `Authorization: Bearer` access token (not solely cookie-based), the combination substantially mitigates CSRF risk without needing a separate CSRF token for this app's scope.
- **Secrets**: `MONGO_URI`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `CLOUDINARY_*`, `CLIENT_ORIGIN` — never committed, managed via `.env` + hosting provider's secret manager. Access and refresh tokens use **separate** secrets so one being compromised doesn't invalidate the other's trust boundary.
- **HTTPS** enforced in production on both client and API hosts (required for `Secure` cookies to function).
- **Audit logging (optional, Phase 2)**: log admin login timestamps/IPs (`lastLoginAt` already modeled) for basic visibility into account access.

---

## 7. Media Handling

- Project cover images and profile photos: uploaded from the admin dashboard via a `multipart/form-data` request → Express (using `multer`) streams the file to Cloudinary → Cloudinary URL saved on the `Project`/`Profile` document.
- Demo videos: either an external embed (YouTube/Vimeo URL stored as `demoVideoUrl`) or a hosted MP4 URL via Cloudinary — embed approach recommended for v1 to avoid large file storage/bandwidth costs.

---

## 8. Deployment Architecture

| Layer | Choice | Notes |
|---|---|---|
| Frontend | Vercel or Netlify | Auto-deploy from `client/` on push to `main`; env var for `VITE_API_BASE_URL` |
| Backend | Render or Railway | Auto-deploy from `server/`; env vars for Mongo URI, JWT secret, Cloudinary keys |
| Database | MongoDB Atlas (free tier M0 to start) | IP allowlist / VPC peering as needed |
| Media | Cloudinary free tier | Image/video CDN delivery |
| Domain/DNS | Custom domain pointed at frontend host; API on a subdomain (e.g. `api.yourdomain.com`) |

**CI/CD (minimal, recommended)**
- GitHub Actions workflow: lint + build check on PR for both `client` and `server`.
- Deployment is push-to-deploy via the hosting provider's native Git integration (no custom pipeline needed for a portfolio-scale project).

---

## 9. Scalability & Future Considerations

- Current data volume (handful of projects, skills) means no need for pagination/indexing optimization initially — but `slug` and `project` (in Comments) fields should have MongoDB indexes for lookup performance as a best practice.
- RTK Query's caching reduces redundant network calls as the visitor navigates between Home ⇄ Projects ⇄ Details.
- If traffic grows, the API is stateless (JWT, no sessions) so it can be scaled horizontally behind a load balancer with no code changes.
- Potential Phase-2 additions the architecture already accommodates: blog/articles collection, project filtering/search (text index on `Project.techStack`/`title`), analytics events, dark/light theme toggle (Tailwind `dark:` variants).

---

## 10. Summary Diagram — Page ↔ API Mapping

```
Home            → GET /api/profile, GET /api/skills
Projects        → GET /api/projects
ProjectDetails  → GET /api/projects/:slug, GET/POST /api/projects/:id/comments
Contact         → (mailto or POST /api/contact - Phase 2)
Admin Login     → POST /api/auth/login
Admin Dashboard → GET/POST/PUT/DELETE on /api/projects, /api/skills, /api/profile
                  DELETE /api/comments/:id
```