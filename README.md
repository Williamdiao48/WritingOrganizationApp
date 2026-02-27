# writing-app

A web app for authors to plan, write, and build complex stories and worlds — combining features inspired by ProWritingAid, Campfire Blaze, NaNoWriMo, and World Anvil.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router DOM 7, Vite 7 |
| State / Data fetching | TanStack React Query 5 |
| Rich text editor | TipTap 2 (ProseMirror-based) |
| Backend | Node.js, Express 5 |
| SQL Database | MySQL (via Sequelize ORM) |
| NoSQL Database | MongoDB Atlas (via Mongoose) |
| Auth | JWT (jsonwebtoken), bcrypt |
| Validation | Zod (backend schemas) |
| Security | helmet, express-rate-limit |
| Styling | CSS (custom stylesheets) |
| Linting | ESLint 9 |

---

## Project Structure

```
writing-app/
├── backend/                          # Express.js API server
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
│   │   ├── userRoutes.js             # Auth endpoints (register, login)
│   │   ├── projectRoutes.js          # Project CRUD
│   │   ├── storyRoutes.js            # Story CRUD
│   │   ├── chapterRoutes.js          # Chapter CRUD
│   │   ├── sceneRoutes.js            # Scene CRUD
│   │   ├── characterRoutes.js        # Character CRUD
│   │   └── worldRoutes.js            # World CRUD
│   ├── middleware/
│   │   ├── auth.js                   # JWT authentication middleware
│   │   └── validate.js               # Zod request body validation middleware
│   ├── validation/
│   │   └── schemas.js                # Zod schemas for all resources
│   ├── server.js                     # App entry point
│   ├── db.js                         # Sequelize/MySQL connection
│   ├── mongo.js                      # Mongoose/MongoDB connection
│   ├── .env.example                  # Required environment variables reference
│   ├── checkTables.js                # Dev utility: inspect SQL tables
│   ├── sqlReset.js                   # Dev utility: reset SQL database
│   ├── peek.js                       # Dev utility: peek at databases
│   └── resetDb.js                    # Dev utility: reset databases
├── frontend/                         # React + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   └── editor/
│   │   │       ├── RichTextEditor.jsx  # TipTap rich text editor component
│   │   │       └── editor.css
│   │   ├── lib/
│   │   │   └── api.js                # authFetch helper + React Query client
│   │   ├── pages/
│   │   │   ├── home.jsx
│   │   │   ├── login.jsx
│   │   │   ├── register.jsx
│   │   │   ├── dashboard.jsx
│   │   │   └── project/
│   │   │       ├── ProjectLayout.jsx # Project shell + sidebar
│   │   │       ├── ProjectHome.jsx   # Project overview
│   │   │       ├── CharacterRoster.jsx
│   │   │       ├── CharacterProfile.jsx
│   │   │       ├── WorldDetail.jsx
│   │   │       └── story/
│   │   │           ├── StoryLayout.jsx  # Story shell + chapter sidebar
│   │   │           ├── StoryHome.jsx
│   │   │           ├── ChapterEditor.jsx  # TipTap editor + auto-save + scene list
│   │   │           └── SceneEditor.jsx    # TipTap editor + auto-save
│   │   ├── styles/
│   │   │   ├── login.css
│   │   │   ├── register.css
│   │   │   ├── navbar.css
│   │   │   └── project-layout.css
│   │   ├── App.jsx                   # Root component, routing, user state
│   │   ├── main.jsx                  # React entry point + route tree
│   │   ├── App.css
│   │   └── index.css
│   ├── vite.config.js                # Vite config with /api dev proxy
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
DB_NAME=writing_app
DB_USER=root
DB_PASS=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
APP_PORT=5050
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
FRONTEND_URL=http://localhost:5173
```

Start the server:

```bash
npm start
```

> The server will exit immediately if either database connection fails.

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

| Package | Version | Purpose |
|---|---|---|
| `express` | ^5.2.1 | Web framework |
| `mongoose` | ^9.1.4 | MongoDB ODM |
| `mongodb` | ^7.0.0 | MongoDB driver |
| `sequelize` | ^6.37.7 | SQL ORM |
| `mysql2` | ^3.15.2 | MySQL driver |
| `jsonwebtoken` | ^9.0.3 | JWT creation & verification |
| `bcrypt` | ^6.0.0 | Password hashing |
| `cors` | ^2.8.5 | Cross-origin resource sharing |
| `helmet` | ^8.1.0 | Secure HTTP headers |
| `express-rate-limit` | ^8.2.1 | Rate limiting |
| `zod` | ^4.3.6 | Request body validation |
| `dotenv` | ^17.2.3 | Environment variable loading |
| `uuid` | ^13.0.0 | UUID generation |

### Frontend

| Package | Version | Purpose |
|---|---|---|
| `react` | ^19.1.1 | UI library |
| `react-dom` | ^19.1.1 | React DOM renderer |
| `react-router-dom` | ^7.9.4 | Client-side routing |
| `@tanstack/react-query` | ^5.x | Server state management & caching |
| `@tiptap/react` | ^2.x | Rich text editor (React bindings) |
| `@tiptap/starter-kit` | ^2.x | TipTap core extensions bundle |
| `@tiptap/pm` | ^2.x | ProseMirror peer dependency |
| `vite` | ^7.1.7 | Build tool & dev server |
| `@vitejs/plugin-react` | ^5.0.4 | Vite React plugin |
| `eslint` | ^9.36.0 | Linter |

---

## API Reference

All endpoints except `/register` and `/login` require `Authorization: Bearer <token>`.

Base URL: `http://localhost:5050/api`

### Auth — `/api/users`

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/register` | `{ username, password }` | Create a new user account |
| `POST` | `/login` | `{ username, password }` | Authenticate and receive JWT |

> Both endpoints are rate-limited to 10 requests per 15 minutes per IP.

**Login response:**
```json
{
  "message": "Login successful",
  "token": "<jwt>",
  "user": { "id": "<uuid>", "username": "string" }
}
```

### Projects — `/api/projects`

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/` | `{ title, description? }` | Create a project |
| `GET` | `/user/:userId` | — | Get all projects for the authenticated user |
| `GET` | `/:id` | — | Get a single project |
| `PATCH` | `/:id` | `{ title?, description?, cover? }` | Update a project |
| `DELETE` | `/:id` | — | Delete project and all nested resources |

### Stories — `/api/stories`

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/` | `{ projectId, title, status?, summary? }` | Create a story |
| `GET` | `/project/:projectId` | — | Get all stories for a project |
| `GET` | `/:id` | — | Get a single story |
| `PATCH` | `/:id` | `{ title?, status?, summary? }` | Update a story |
| `DELETE` | `/:id` | — | Delete story and all nested chapters/scenes |

### Chapters — `/api/chapters`

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/` | `{ storyId, title, order? }` | Create a chapter |
| `GET` | `/story/:storyId` | — | Get all chapters for a story |
| `GET` | `/:id` | — | Get a single chapter |
| `PATCH` | `/:id` | `{ title?, content?, order? }` | Update a chapter |
| `DELETE` | `/:id` | — | Delete chapter and its scenes |

### Scenes — `/api/scenes`

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/` | `{ chapterId, title, order? }` | Create a scene |
| `GET` | `/chapter/:chapterId` | — | Get all scenes for a chapter |
| `GET` | `/:id` | — | Get a single scene |
| `PATCH` | `/:id` | `{ title?, content?, order? }` | Update a scene |
| `DELETE` | `/:id` | — | Delete a scene |

### Characters — `/api/characters`

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/` | `{ projectId, name }` | Create a character |
| `GET` | `/project/:projectId` | — | Get all characters for a project |
| `GET` | `/:id` | — | Get a single character |
| `PATCH` | `/:id` | `{ name?, role?, basics?, backstory?, traits? }` | Update a character |
| `DELETE` | `/:id` | — | Delete a character |

### Worlds — `/api/worlds`

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/` | `{ projectId, name }` | Create a world |
| `GET` | `/project/:projectId` | — | Get all worlds for a project |
| `GET` | `/:id` | — | Get a single world |
| `PATCH` | `/:id` | `{ name?, description?, loreSections? }` | Update a world |
| `DELETE` | `/:id` | — | Delete a world |

---

## Database Schema

### MySQL (Sequelize)

**Users** (`models/sql/User.js`)

| Column | Type | Constraints |
|---|---|---|
| `id` | UUID | Primary Key, default `UUIDV4` |
| `username` | STRING(150) | Unique, Not Null |
| `password` | STRING(150) | Not Null (bcrypt hash) |
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
| `worldIds` | [ObjectId → World] | |
| `storyIds` | [ObjectId → Story] | |
| `characterIds` | [ObjectId → Character] | |

**Story**

| Field | Type | Notes |
|---|---|---|
| `projectId` | ObjectId → Project | Required, indexed |
| `worldId` | ObjectId → World | |
| `title` | String | Max 250, required |
| `cover` | String | Image URL |
| `summary` | String | Max 2500 |
| `chapterIds` | [ObjectId → Chapter] | |
| `sceneIds` | [ObjectId → Scene] | |
| `characterIds` | [ObjectId → Character] | |
| `status` | Enum | `Draft`, `In Progress`, `Completed` |
| `visibility` | Enum | `Private`, `Public`, `Archived` |

**Chapter**

| Field | Type | Notes |
|---|---|---|
| `storyId` | ObjectId → Story | Required, indexed |
| `title` | String | Max 300, default `Untitled Chapter` |
| `summary` | String | Max 2000 |
| `content` | String | TipTap JSON (stringified) |
| `order` | Number | Default 0 |
| `sceneIds` | [ObjectId → Scene] | |

**Scene**

| Field | Type | Notes |
|---|---|---|
| `chapterId` | ObjectId → Chapter | Required, indexed |
| `title` | String | Default `New Scene` |
| `content` | String | TipTap JSON (stringified) |
| `order` | Number | Default 0 |

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

**World**

| Field | Type | Notes |
|---|---|---|
| `projectId` | ObjectId → Project | Required, indexed |
| `name` | String | Required, max 300 |
| `description` | String | Max 3000 |
| `loreSections` | Array | `[{ header: String, body: String }]` |

---

## Authentication Flow

1. User registers via `POST /api/users/register` — password hashed with bcrypt (10 rounds)
2. User logs in via `POST /api/users/login` — receives a JWT valid for 24 hours
3. JWT stored in `localStorage` on the client
4. All protected routes use `authenticateToken` middleware — expects `Authorization: Bearer <token>`
5. Global 401 handler in React Query client automatically redirects to `/login` and clears storage on token expiry
6. User state passed app-wide via React Context (`useOutletContext`)

---

## Editor & Auto-save

Chapter and scene content is written in a TipTap rich text editor (`RichTextEditor.jsx`) supporting bold, italic, headings (H1–H3), bullet lists, numbered lists, and blockquotes.

- Content is stored as a stringified TipTap JSON document in the `content` field
- A `parseContent()` helper handles both TipTap JSON and legacy plain text for backward compatibility
- Auto-save fires 1.5 seconds after the last keystroke using a debounce pattern; the pending save is cancelled on component unmount
- A manual Save button bypasses the debounce and saves immediately

---

## Current Status

**Implemented:**
- User registration and login (MySQL + JWT)
- Full CRUD for all resources: Projects, Stories, Chapters, Scenes, Characters, Worlds
- Nested frontend routing with persistent sidebars (project → story → chapter/scene)
- TipTap rich text editor with auto-save in ChapterEditor and SceneEditor
- Scene list panel in ChapterEditor with inline scene creation
- Character profile builder (role, basics, traits, backstory)
- World detail page with dynamic lore sections
- React Query for all data fetching with cache invalidation
- Zod request validation on all POST/PATCH endpoints
- Rate limiting, helmet security headers, restricted CORS

**Planned / Not yet implemented:**
- Password reset / account recovery
- Writing analytics / ProWritingAid-style feedback
- Export functionality (PDF, DOCX, plain text)
- Collaboration / sharing features
- Public/private project visibility controls
- Search and filter across projects, characters, and worlds
- Soft delete / archive (currently all deletes are permanent)
