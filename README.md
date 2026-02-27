# writing-app

A web app for authors to plan, write, and build complex stories and worlds — combining features inspired by ProWritingAid, Campfire Blaze, NaNoWriMo, and World Anvil.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router DOM 7, Vite 7 |
| Backend | Node.js, Express 5 |
| SQL Database | MySQL (via Sequelize ORM) |
| NoSQL Database | MongoDB Atlas (via Mongoose) |
| Auth | JWT (jsonwebtoken), bcrypt |
| Styling | CSS (custom stylesheets) |
| Linting | ESLint 9 |

---

## Project Structure

```
writing-app/
├── backend/                    # Express.js API server
│   ├── models/
│   │   ├── sql/
│   │   │   └── User.js         # Sequelize User model (MySQL)
│   │   └── mongo/
│   │       ├── projectModel.js
│   │       ├── storyModel.js
│   │       ├── chapterModel.js
│   │       ├── sceneModel.js
│   │       ├── characterModel.js
│   │       └── worldModel.js
│   ├── routes/
│   │   ├── userRoutes.js       # Auth endpoints (register, login)
│   │   └── projectRoutes.js    # Project CRUD endpoints
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   ├── server.js               # App entry point
│   ├── db.js                   # Sequelize/MySQL connection
│   ├── mongo.js                # Mongoose/MongoDB connection
│   ├── checkTables.js          # Dev utility: inspect SQL tables
│   ├── sqlReset.js             # Dev utility: reset SQL database
│   ├── peek.js                 # Dev utility: peek at databases
│   └── resetDb.js              # Dev utility: reset databases
├── frontend/                   # React + Vite SPA
│   ├── src/
│   │   ├── pages/
│   │   │   ├── home.jsx
│   │   │   ├── login.jsx
│   │   │   ├── register.jsx
│   │   │   ├── dashboard.jsx
│   │   │   └── navbar.jsx
│   │   ├── styles/
│   │   │   ├── login.css
│   │   │   ├── register.css
│   │   │   └── navbar.css
│   │   ├── App.jsx             # Root component, routing, user state
│   │   ├── main.jsx            # React entry point
│   │   ├── App.css
│   │   └── index.css
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── index.html
├── package.json                # Root (minimal)
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

Create a `.env` file in `backend/`:

```env
DB_NAME=writing_app
DB_USER=root
DB_PASS=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
APP_PORT=5050
JWT_SECRET=your_jwt_secret_here
MONGO_URI=your_mongodb_connection_string
```

Start the server:

```bash
npm start
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server runs at `http://localhost:5173` and the backend API at `http://localhost:5050`.

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
| `dotenv` | ^17.2.3 | Environment variable loading |
| `uuid` | ^13.0.0 | UUID generation |

### Frontend

| Package | Version | Purpose |
|---|---|---|
| `react` | ^19.1.1 | UI library |
| `react-dom` | ^19.1.1 | React DOM renderer |
| `react-router-dom` | ^7.9.4 | Client-side routing |
| `vite` | ^7.1.7 | Build tool & dev server |
| `@vitejs/plugin-react` | ^5.0.4 | Vite React plugin |
| `eslint` | ^9.36.0 | Linter |

---

## API Reference

Base URL: `http://localhost:5050/api`

### Auth — `/api/users`

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| `POST` | `/register` | None | `{ username, password }` | Create a new user account |
| `POST` | `/login` | None | `{ username, password }` | Authenticate and receive JWT |

**Login response:**
```json
{
  "message": "Login successful",
  "token": "<jwt>",
  "user": { "id": "<uuid>", "username": "string" }
}
```

### Projects — `/api/projects`

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| `POST` | `/` | None | `{ userId, title, description?, cover?, worldIds?, storyIds?, characterIds? }` | Create a new project |
| `GET` | `/user/:userId` | None | — | Get all projects for a user |

---

## Database Schema

### MySQL (Sequelize)

**Users** table (`models/sql/User.js`)

| Column | Type | Constraints |
|---|---|---|
| `id` | UUID | Primary Key, default `UUIDV4` |
| `username` | STRING(150) | Unique, Not Null |
| `password` | STRING(150) | Not Null (bcrypt hash) |
| `createdAt` | DATE | Auto |
| `updatedAt` | DATE | Auto |

### MongoDB (Mongoose)

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
| `createdAt` | Date | Default now |

**Story**

| Field | Type | Notes |
|---|---|---|
| `projectId` | ObjectId | Required, indexed |
| `worldId` | ObjectId | References World |
| `title` | String | Max 250, required |
| `cover` | String | Image URL |
| `summary` | String | Max 2500 |
| `chapterIds` | [ObjectId] | References Chapter |
| `sceneIds` | [ObjectId] | References Scene |
| `characterIds` | [ObjectId] | References Character |
| `status` | Enum | `Draft`, `In Progress`, `Completed` |
| `visibility` | Enum | `Private`, `Public`, `Archived` |
| `createdAt` | Date | Default now |

**Chapter**

| Field | Type | Notes |
|---|---|---|
| `storyId` | ObjectId | Required, indexed |
| `title` | String | Max 300, default `Untitled Chapter` |
| `summary` | String | Max 2000 |
| `content` | String | Default `""` |
| `order` | Number | Default 0 |
| `sceneIds` | [ObjectId] | References Scene |
| `createdAt` | Date | Auto |
| `updatedAt` | Date | Auto |

**Scene**

| Field | Type | Notes |
|---|---|---|
| `chapterId` | ObjectId | Required, indexed |
| `title` | String | Default `New Scene` |
| `content` | String | Default `""` |
| `order` | Number | Default 0 |
| `createdAt` | Date | Auto |
| `updatedAt` | Date | Auto |

**Character**

| Field | Type | Notes |
|---|---|---|
| `projectId` | ObjectId | Required, indexed |
| `name` | String | Required, max 200 |
| `role` | String | Max 200 |
| `avatar` | String | Image URL |
| `basics` | Object | `{ age, gender, species }` |
| `traits` | Array | `[{ label, value }]` |
| `backstory` | String | Max 5000 |
| `createdAt` | Date | Auto |
| `updatedAt` | Date | Auto |

**World**

| Field | Type | Notes |
|---|---|---|
| `projectId` | ObjectId | Required, indexed |
| `name` | String | Required, max 300 |
| `description` | String | Max 3000 |
| `loreSections` | Array | `[{ header: String, body: String }]` |
| `createdAt` | Date | Default now |

---

## Authentication Flow

1. User registers via `POST /api/users/register` — password is hashed with bcrypt (10 rounds)
2. User logs in via `POST /api/users/login` — receives a JWT valid for 24 hours
3. JWT is stored in `localStorage` on the client
4. Protected routes use the `authenticateToken` middleware — expects header `Authorization: Bearer <token>`
5. User state is passed app-wide via React Context (`useOutletContext`)

---

## Current Status

**Implemented:**
- User registration and login (MySQL + JWT)
- Project creation and listing (MongoDB)
- Frontend routing (`/`, `/login`, `/register`, `/dashboard`)
- Dashboard with project list and create-project modal

**Models defined (no endpoints yet):**
- Story, Chapter, Scene, Character, World

**Planned / Not yet implemented:**
- Story, Chapter, Scene, Character, and World CRUD endpoints
- Rich text editor for writing
- World-building tools (lore sections, maps, timelines)
- Character profile builder
- Writing analytics / ProWritingAid-style feedback
- Export functionality
- Collaboration features
- Public/private project visibility controls
