# writing-app

A web app for authors to plan, write, and build complex stories and worlds — combining features inspired by ProWritingAid, Campfire Blaze, NaNoWriMo, and World Anvil.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router DOM 7, Vite 7 |
| State / Data Fetching | TanStack React Query v5 |
| Rich Text Editor | TipTap (ProseMirror-based) |
| Backend | Node.js, Express 5 |
| SQL Database | MySQL (via Sequelize ORM) |
| NoSQL Database | MongoDB Atlas (via Mongoose) |
| Auth | JWT (jsonwebtoken), bcrypt |
| Security | helmet, express-rate-limit, Zod validation |
| Email | nodemailer (SMTP) |
| Styling | CSS (custom stylesheets) |
| Linting | ESLint 9 |

---

## Project Structure

```
writing-app/
├── backend/                    # Express.js API server
│   ├── lib/
│   │   └── email.js            # nodemailer utility (logs to console in dev)
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication middleware
│   │   └── validate.js         # Zod schema validation middleware
│   ├── models/
│   │   ├── sql/
│   │   │   └── User.js               # Sequelize User model (MySQL)
│   │   └── mongo/
│   │       ├── projectModel.js
│   │       ├── storyModel.js
│   │       ├── chapterModel.js
│   │       ├── sceneModel.js
│   │       ├── characterModel.js
│   │       └── worldModel.js
│   ├── routes/
│   │   ├── userRoutes.js       # Auth + password reset endpoints
│   │   ├── projectRoutes.js    # Project CRUD + archive/restore/pagination
│   │   ├── storyRoutes.js
│   │   ├── chapterRoutes.js
│   │   ├── sceneRoutes.js
│   │   ├── characterRoutes.js
│   │   └── worldRoutes.js
│   ├── validation/
│   │   └── schemas.js          # Zod schemas for all request bodies
│   ├── server.js               # App entry point
│   ├── db.js                   # Sequelize/MySQL connection
│   ├── mongo.js                # Mongoose/MongoDB connection
│   ├── .env.example            # Required environment variables
│   ├── checkTables.js          # Dev utility: inspect SQL tables
│   ├── sqlReset.js             # Dev utility: reset SQL database
│   ├── peek.js                 # Dev utility: peek at databases
│   └── resetDb.js              # Dev utility: reset databases
├── frontend/                   # React + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   └── editor/
│   │   │       ├── RichTextEditor.jsx  # TipTap editor with toolbar + word count
│   │   │       └── editor.css
│   │   ├── lib/
│   │   │   └── api.js          # authFetch helper, QueryClient, global 401 handler
│   │   ├── pages/
│   │   │   ├── home.jsx
│   │   │   ├── login.jsx
│   │   │   ├── register.jsx    # Email + confirm password fields
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── dashboard.jsx   # Paginated projects + archived tab
│   │   │   ├── navbar.jsx
│   │   │   └── project/
│   │   │       ├── ProjectLayout.jsx
│   │   │       ├── ProjectHome.jsx
│   │   │       ├── CharacterRoster.jsx
│   │   │       ├── CharacterProfile.jsx
│   │   │       ├── WorldDetail.jsx
│   │   │       └── story/
│   │   │           ├── StoryLayout.jsx
│   │   │           ├── StoryHome.jsx
│   │   │           ├── ChapterEditor.jsx   # TipTap + auto-save
│   │   │           └── SceneEditor.jsx     # TipTap + auto-save
│   │   ├── styles/
│   │   │   ├── login.css
│   │   │   ├── register.css
│   │   │   ├── navbar.css
│   │   │   ├── dashboard.css
│   │   │   └── project-layout.css
│   │   ├── App.jsx             # Root component + ErrorBoundary
│   │   ├── main.jsx            # React entry point + route tree
│   │   ├── App.css
│   │   └── index.css
│   ├── vite.config.js          # Dev proxy: /api → localhost:5050
│   ├── eslint.config.js
│   └── index.html
├── package.json
└── README.md
```

---

## Setup & Installation

### Prerequisites

- Node.js
- MySQL running on `localhost:3306`
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo

```bash
git clone <repo-url>
cd writing-app
```

### 2. Backend setup

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
# MySQL
DB_NAME=writing_app
DB_USER=root
DB_PASS=your_mysql_password
DB_HOST=localhost
DB_PORT=3306

# MongoDB Atlas
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/?appName=WritingApp

# Auth
# Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=replace_with_a_long_random_secret

# Server
APP_PORT=5050

# CORS — set to your deployed frontend URL in production
FRONTEND_URL=http://localhost:5173

# Email (SMTP) — if unset, reset links are logged to the console
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_USER=your@email.com
EMAIL_PASS=your_smtp_password
EMAIL_FROM=noreply@your-domain.com

# App URL — used in password reset email links
APP_URL=http://localhost:5173
```

Start the server:

```bash
npm start
```

On first run (development), Sequelize runs `sync({ alter: true })` to automatically create/update SQL tables. In production set `NODE_ENV=production` and manage schema changes with migrations.

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server runs at `http://localhost:5173`. In development, all `/api/*` requests are proxied to `http://localhost:5050` automatically — no separate `VITE_API_URL` configuration needed.

---

## Scripts

### Backend (`backend/`)

| Script | Command | Description |
|---|---|---|
| Start server | `npm start` | Runs `node server.js` |
| Check SQL tables | `npm run checkSQL` | Inspects current MySQL table structure |
| Reset SQL database | `npm run resetSQL` | **Destructive** — drops and recreates SQL tables |
| Peek at databases | `npm run peekSQL` | Lists databases and shows current config |

### Frontend (`frontend/`)

| Script | Command | Description |
|---|---|---|
| Dev server | `npm run dev` | Starts Vite dev server with HMR |
| Build | `npm run build` | Produces optimized production build |
| Preview | `npm run preview` | Previews the production build locally |
| Lint | `npm run lint` | Runs ESLint across the frontend source |

---

## Dependencies

### Backend

| Package | Purpose |
|---|---|
| `express` | Web framework |
| `mongoose` | MongoDB ODM |
| `sequelize` / `mysql2` | SQL ORM + MySQL driver |
| `jsonwebtoken` | JWT creation & verification |
| `bcrypt` | Password hashing (10 rounds) |
| `zod` | Request body schema validation |
| `nodemailer` | SMTP email (password reset) |
| `helmet` | Secure HTTP response headers |
| `express-rate-limit` | Rate limiting on auth endpoints |
| `cors` | Cross-origin resource sharing |
| `dotenv` | Environment variable loading |

### Frontend

| Package | Purpose |
|---|---|
| `react` / `react-dom` | UI library |
| `react-router-dom` | Client-side routing |
| `@tanstack/react-query` | Server state management, caching |
| `@tiptap/react` / `@tiptap/starter-kit` | Rich text editor |
| `vite` / `@vitejs/plugin-react` | Build tool & dev server |

---

## API Reference

All endpoints except `/register` and `/login` require `Authorization: Bearer <token>`.

Base URL: `http://localhost:5050/api`

All authenticated endpoints require the header:
```
Authorization: Bearer <jwt>
```

### Auth — `/api/users`

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| `POST` | `/register` | None | `{ username, email, password }` | Create a new user account |
| `POST` | `/login` | None | `{ username, password }` | Authenticate and receive JWT |
| `POST` | `/forgot-password` | None | `{ email }` | Request a password reset link (always returns 200) |
| `POST` | `/reset-password` | None | `{ token, password }` | Reset password using token from email |

Auth endpoints are rate-limited to **10 requests / 15 minutes** per IP.

**Login response:**
```json
{
  "message": "Login successful",
  "token": "<jwt>",
  "user": { "id": "<uuid>", "username": "string" }
}
```

### Projects — `/api/projects`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/` | ✓ | Create a new project |
| `GET` | `/user/:userId?page=1&limit=12` | ✓ | Paginated active projects for a user |
| `GET` | `/user/:userId/archived?page=1&limit=12` | ✓ | Paginated archived projects |
| `GET` | `/:id` | ✓ | Get a single project |
| `PATCH` | `/:id` | ✓ | Update project title / description / cover |
| `PATCH` | `/:id/restore` | ✓ | Restore an archived project |
| `DELETE` | `/:id` | ✓ | Archive (soft-delete) a project |
| `DELETE` | `/:id/permanent` | ✓ | Permanently delete project + all content |

**Paginated list response:**
```json
{ "projects": [...], "page": 1, "totalPages": 3, "total": 34 }
```

### Stories — `/api/stories`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/` | ✓ | Create story inside a project |
| `GET` | `/project/:projectId` | ✓ | Get all stories for a project |
| `GET` | `/:id` | ✓ | Get a single story |
| `PATCH` | `/:id` | ✓ | Update story fields |
| `DELETE` | `/:id` | ✓ | Delete story + cascade chapters/scenes |

### Chapters — `/api/chapters`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/` | ✓ | Create chapter inside a story |
| `GET` | `/story/:storyId` | ✓ | Get all chapters for a story |
| `GET` | `/:id` | ✓ | Get a single chapter |
| `PATCH` | `/:id` | ✓ | Update chapter title / content / order |
| `DELETE` | `/:id` | ✓ | Delete chapter + cascade scenes |

### Scenes — `/api/scenes`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/` | ✓ | Create scene inside a chapter |
| `GET` | `/chapter/:chapterId` | ✓ | Get all scenes for a chapter |
| `GET` | `/:id` | ✓ | Get a single scene |
| `PATCH` | `/:id` | ✓ | Update scene title / content / order |
| `DELETE` | `/:id` | ✓ | Delete scene |

### Characters — `/api/characters`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/` | ✓ | Create character inside a project |
| `GET` | `/project/:projectId` | ✓ | Get all characters for a project |
| `GET` | `/:id` | ✓ | Get a single character |
| `PATCH` | `/:id` | ✓ | Update character fields |
| `DELETE` | `/:id` | ✓ | Delete character |

### Worlds — `/api/worlds`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/` | ✓ | Create world inside a project |
| `GET` | `/project/:projectId` | ✓ | Get all worlds for a project |
| `GET` | `/:id` | ✓ | Get a single world |
| `PATCH` | `/:id` | ✓ | Update world name / description / lore sections |
| `DELETE` | `/:id` | ✓ | Delete world |

---

## Database Schema

### MySQL (Sequelize)

**Users** (`models/sql/User.js`)

| Column | Type | Constraints |
|---|---|---|
| `id` | UUID | Primary Key, default `UUIDV4` |
| `username` | STRING(150) | Unique, Not Null |
| `email` | STRING(255) | Unique, Nullable (required on new registrations) |
| `password` | STRING(150) | Not Null (bcrypt hash) |
| `resetToken` | STRING(64) | Nullable — SHA-256 hash of raw reset token |
| `resetTokenExpiry` | DATE | Nullable — 1 hour from issue |
| `createdAt` | DATE | Auto |
| `updatedAt` | DATE | Auto |

### MongoDB (Mongoose)

All MongoDB models use `{ timestamps: true }` — `createdAt` and `updatedAt` are managed automatically.

**Project**

| Field | Type | Notes |
|---|---|---|
| `userId` | String | References SQL User id |
| `title` | String | Max 200, required |
| `description` | String | Max 500 |
| `cover` | String | Image URL |
| `worldIds` | [ObjectId] | References World |
| `storyIds` | [ObjectId] | References Story |
| `characterIds` | [ObjectId] | References Character |
| `archived` | Boolean | Default false |
| `archivedAt` | Date | Set when archived |
| `createdAt` / `updatedAt` | Date | Auto (timestamps) |

**Story**

| Field | Type | Notes |
|---|---|---|
| `projectId` | ObjectId → Project | Required, indexed |
| `worldId` | ObjectId → World | |
| `title` | String | Max 250, required |
| `cover` | String | Image URL |
| `summary` | String | Max 2500 |
| `chapterIds` | [ObjectId] | References Chapter |
| `characterIds` | [ObjectId] | References Character |
| `status` | Enum | `Draft`, `In Progress`, `Completed` |
| `visibility` | Enum | `Private`, `Public`, `Archived` |
| `createdAt` / `updatedAt` | Date | Auto |

**Chapter**

| Field | Type | Notes |
|---|---|---|
| `storyId` | ObjectId → Story | Required, indexed |
| `title` | String | Max 300, default `Untitled Chapter` |
| `summary` | String | Max 2000 |
| `content` | String | TipTap JSON (stringified) |
| `order` | Number | Default 0 |
| `sceneIds` | [ObjectId] | References Scene |
| `createdAt` / `updatedAt` | Date | Auto |

**Scene**

| Field | Type | Notes |
|---|---|---|
| `chapterId` | ObjectId → Chapter | Required, indexed |
| `title` | String | Default `New Scene` |
| `content` | String | TipTap JSON (stringified) |
| `order` | Number | Default 0 |
| `createdAt` / `updatedAt` | Date | Auto |

**Character**

| Field | Type | Notes |
|---|---|---|
| `projectId` | ObjectId → Project | Required, indexed |
| `name` | String | Required, max 200 |
| `role` | String | Max 200 |
| `avatar` | String | Image URL |
| `basics` | Object | `{ age, gender, species }` |
| `traits` | Array | `[{ label, value }]` |
| `backstory` | String | Max 5000 |
| `createdAt` / `updatedAt` | Date | Auto |

**World**

| Field | Type | Notes |
|---|---|---|
| `projectId` | ObjectId → Project | Required, indexed |
| `name` | String | Required, max 300 |
| `description` | String | Max 3000 |
| `loreSections` | Array | `[{ header: String, body: String }]` |
| `createdAt` / `updatedAt` | Date | Auto |

---

## Authentication & Security

### Auth flow

1. User registers via `POST /api/users/register` with `username`, `email`, and `password` — password is hashed with bcrypt (10 rounds)
2. User logs in via `POST /api/users/login` — receives a JWT valid for 24 hours
3. JWT is stored in `localStorage` on the client
4. Protected routes use the `authenticateToken` middleware — expects header `Authorization: Bearer <token>`
5. `authFetch` in `frontend/src/lib/api.js` automatically attaches the token and handles global 401 redirects to `/login`

### Password reset flow

1. User submits email to `POST /api/users/forgot-password`
2. Server always responds 200 (prevents email enumeration)
3. If the email exists: generates a 32-byte random token, stores a SHA-256 hash in the database with a 1-hour expiry, and sends an email with the raw token in the reset link
4. User clicks link → `ResetPassword` page reads `?token=` from the URL
5. `POST /api/users/reset-password` hashes the incoming token, finds a matching non-expired record, updates the password, and clears the token fields

### Security measures

- `helmet` — sets secure HTTP response headers
- `express-rate-limit` — 10 requests / 15 min on all auth endpoints
- CORS restricted to `FRONTEND_URL` env var
- `express.json({ limit: '2mb' })` — prevents oversized payload attacks
- Required env vars validated at startup — server exits with a clear error if any are missing
- `sequelize.sync({ alter: true })` only runs when `NODE_ENV !== 'production'`
- Zod schemas validate all request bodies before they reach route handlers

---

## Rich Text Editor

Chapters and scenes use [TipTap](https://tiptap.dev/) for rich text editing with:

- Formatting toolbar (bold, italic, strikethrough, headings H1–H3, blockquote, bullet/ordered lists, code)
- Live word count
- **Auto-save** (1.5s debounce after changes) — uses ref pattern to avoid stale closures; timer is cleared on component unmount

Content is stored as a stringified TipTap JSON document in MongoDB. The editor's `parseContent()` helper handles both JSON strings and legacy plain text.

---

## Current Status

**Implemented:**
- User registration (username + email + confirm password) and login (MySQL + JWT)
- Email-based password reset with secure token flow
- Project CRUD — create, read, update, archive (soft-delete), restore, permanent delete with cascade
- Paginated project dashboard with Active / Archived tabs
- Story, Chapter, Scene, Character, and World CRUD (MongoDB)
- TipTap rich text editor with auto-save for chapters and scenes
- Full frontend routing with React Router DOM 7
- React Error Boundary wrapping the route tree
- Security: helmet, rate limiting, CORS restriction, Zod validation, env var validation, request size limit

**Planned / Not yet implemented:**
- World-building tools (maps, timelines, interactive lore)
- Writing analytics / ProWritingAid-style feedback
- Export functionality (PDF, EPUB, DOCX)
- Collaboration / sharing features
- Soft-delete / archive for stories, characters, worlds
- Refresh token / token rotation
- Test suite
