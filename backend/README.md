# 🖥️ Expense Tracker — Backend API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-F7B731?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![REST](https://img.shields.io/badge/REST-API-0070CC?style=for-the-badge)

**A RESTful Express.js backend powering the personal expense tracker.**  
Handles authentication, CRUD operations, and secure per-user data access.

Track income, expenses, and spending trends — all in one dashboard.

[Live Demo](https://expense-tracker-frontend-roan-pi.vercel.app) · [View Backend API](https://expense-tracker-api-rust.vercel.app) · [Request Feature](https://github.com/deepshikava/expense-tracker/issues)

---

</div>

## ✨ What It Does

| Capability           | Details                                               |
| -------------------- | ----------------------------------------------------- |
| 🔐 **Auth**          | Register & login with JWT-based sessions              |
| 💸 **Expenses**      | Full CRUD — create, read, update, delete transactions |
| 💰 **Income**        | Track income entries with category & date             |
| 🔒 **Authorization** | Users can only access their own data                  |
| 📦 **Validation**    | Input validation on all routes                        |
| 🌐 **CORS**          | Configured for the React frontend origin              |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v16+ — [Download](https://nodejs.org/)
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier)
- **npm** v7+ or **yarn**

### 1 — Clone & install

```bash
git clone https://github.com/deepshikava/expense-tracker.git
cd expense-tracker/backend
npm install
```

### 2 — Configure environment

Create a `.env` file in `backend/`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/expense-tracker
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

> Never commit `.env` to version control. It is already in `.gitignore`.

### 3 — Run the server

```bash
# Development — auto-restarts on file changes
npm run dev

# Production
npm start
```

Server starts at → **http://localhost:5000**

### Other Scripts

```bash
npm test          # Run test suite
npm run lint      # ESLint check
npm run seed      # Seed sample data into MongoDB
```

---

## 🗂️ Project Structure

```
backend/
│
├── config/
│   └── db.js               # MongoDB connection via Mongoose
│
├── middleware/
│   └── auth.js             # JWT verification middleware
│
├── models/
│   ├── User.js             # Mongoose schema: fullname, email, password (hashed)
│   └── Expense.js          # Mongoose schema: amount, category, description, date, userId
│
├── routes/
│   ├── auth.js             # POST /api/auth/register, POST /api/auth/login
│   └── expenses.js         # GET / POST / PUT / DELETE /api/expenses
│
├── controllers/
│   ├── authController.js   # register(), login() handler logic
│   └── expenseController.js # getAll(), create(), update(), remove()
│
├── .env                    # Environment variables (gitignored)
├── .gitignore
├── package.json
└── server.js               # Express app entry point, mounts routes
```

---

## 🏗️ Architecture

### Layered Request Flow

```
HTTP Request (from React frontend)
      │
      ▼
  server.js         ← Express app, global middleware (cors, json, morgan)
      │
      ▼
  routes/           ← URL matching + method dispatch
      │
      ▼
middleware/auth.js  ← JWT token validation (protected routes only)
      │
      ▼
  controllers/      ← Business logic, calls Models
      │
      ▼
  models/           ← Mongoose schemas + DB queries
      │
      ▼
  MongoDB Atlas     ← Persisted documents
```

### Folder Responsibilities

**`server.js`** — Entry point. Creates the Express app, registers global middleware (`cors`, `express.json()`, Morgan logger), mounts route modules, and starts the HTTP server.

**`config/db.js`** — Opens and manages the Mongoose connection to MongoDB. Called once at startup.

**`middleware/auth.js`** — Intercepts every protected route. Reads the `Authorization: Bearer <token>` header, verifies the JWT using `JWT_SECRET`, and attaches `req.user` for downstream controllers.

**`models/userModel.js`** — Defines the User document schema. Passwords are hashed with `bcryptjs` before save; the model exposes a `matchPassword()` helper for login comparison.

**`models/expenseModel.js`** — Defines the Expense document schema with a `userId` foreign key (ObjectId ref → User). Includes `timestamps: true` so every document gets `createdAt` / `updatedAt`.

**`models/incomeModel.js`** — Defines the Income document schema with a `userId` foreign key (ObjectId ref → User). Includes `timestamps: true` so every document gets `createdAt` / `updatedAt`.

**`middlewear/auth.js`** — authMiddleware - `register()` hashes the password and creates a User; `login()` finds the user, compares the password, and returns a signed JWT.

**`controllers/expenseController.js`** — `getAll()` queries only the authenticated user's expenses; `create()`, `update()`, and `remove()` enforce the same ownership check.

**`controllers/incomeController.js`** — `getAll()` queries only the authenticated user's expenses; `create()`, `update()`, and `remove()` enforce the same ownership check.

**`routes/userRoute.js`** — Mounts `/api/register` and `/api/login` as public routes.

**`routes/expenseRoute.js`** — Mounts all `/api/expense` routes behind the `auth` middleware.

**`routes/incomeRoute.js`** — Mounts all `/api/income` routes behind the `auth` middleware.

**`routes/dashboardRoute.js`** — Mounts all `/api/dashboard` routes behind the `auth` middleware.

---

## 📡 API Endpoints

Base URL: `http://localhost:5000`

### User Routes — Public

| Method | Endpoint        | Body                            | Description        |
| ------ | --------------- | ------------------------------- | ------------------ |
| `POST` | `/api/register` | `{ fullname, email, password }` | Create new account |
| `POST` | `/api/login`    | `{ email, password }`           | Login, returns JWT |

### User Routes — Public — Protected (require `Authorization: Bearer <token>`)

| Method | Endpoint        | Body                               | Description                    |
| ------ | --------------- | ---------------------------------- | ------------------------------ |
| `GET`  | `/api/me`       | `{ fullname, email, password }`    | fetches profile data           |
| `PUT`  | `/api/profile`  | `{ name, email, joinDate }`        | Updates Profile name and email |
| `PUT`  | `/api/password` | `{ currentPassword, newPassword }` | Updates Password               |

### Dashboard Routes — Public — Protected (require `Authorization: Bearer <token>`)

| Method | Endpoint         | Body  | Description                     |
| ------ | ---------------- | ----- | ------------------------------- |
| `GET`  | `/api/dashboard` | `{ }` | fetches dashboard overview data |

### Expense Routes — Protected (require `Authorization: Bearer <token>`)

| Method   | Endpoint                     | Body                                      | Description                                  |
| -------- | ---------------------------- | ----------------------------------------- | -------------------------------------------- |
| `GET`    | `/api/expense/all`           | —                                         | Fetch all expenses for the logged-in user    |
| `POST`   | `/api/expense/add`           | `{ description, amount, category, date }` | Add a new expense                            |
| `PUT`    | `/api/expense/:id`           | `{ description, amount, category, date }` | Update an expense by ID                      |
| `DELETE` | `/api/expense/:id`           | —                                         | Delete an expense by ID                      |
| `GET`    | `/api/expense/downloadexcel` | —                                         | downloads expense transactions in excel file |
| `GET`    | `/api/expense/overview`      | —                                         | Fetch expense overview data                  |

### Income Routes — Protected (require `Authorization: Bearer <token>`)

| Method   | Endpoint                    | Body                                      | Description                                  |
| -------- | --------------------------- | ----------------------------------------- | -------------------------------------------- |
| `GET`    | `/api/income/all`           | —                                         | Fetch all expenses for the logged-in user    |
| `POST`   | `/api/income/add`           | `{ description, amount, category, date }` | Add a new expense                            |
| `PUT`    | `/api/income/:id`           | `{ description, amount, category, date }` | Update an expense by ID                      |
| `DELETE` | `/api/income/:id`           | —                                         | Delete an expense by ID                      |
| `GET`    | `/api/income/downloadexcel` | —                                         | downloads expense transactions in excel file |
| `GET`    | `/api/income/overview`      | —                                         | Fetch expense overview data                  |

### Example — Register

```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":"Jane Doe","email":"jane@example.com","password":"secret123"}'
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "_id": "...", "fullname": "Jane Doe", "email": "jane@example.com" }
}
```

### Example — Add Expense (authenticated)

```bash
curl -X POST http://localhost:5000/api/expense/add \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"description":"Coffee","amount":4.50,"category":"Food","date":"2025-05-01"}'
```

**Response:**

```json
{
  "_id": "663abc...",
  "description": "Coffee",
  "amount": 4.5,
  "category": "Food",
  "date": "2025-05-01T00:00:00.000Z",
  "userId": "661xyz...",
  "type": "income",
  "createdAt": "2025-05-01T08:22:11.000Z"
}
```

---

## 🗄️ Database Schemas

### User

```js
{
  fullname: String,     // required
  email:    String,     // required, unique
  password: String,     // bcryptjs hashed, never returned in responses
  createdAt: Date,      // auto via timestamps
  updatedAt: Date
}
```

### Income & Expense

```js
{
  description: String,                      // required
  amount:      Number,                      // required
  category:    String,                      // e.g. "Food", "Transport"
  date:        Date,                        // defaults to now
  userId:      ObjectId → ref: 'User',      // required
  type:        String,                      // links to owner
  createdAt:   Date,                        // auto
  updatedAt:   Date
}
```

---

## 🔐 Authentication Flow

```
Client                          Server
  │                               │
  ├── POST /api/auth/login ──────►│
  │   { email, password }         │ 1. Find user by email
  │                               │ 2. bcrypt.compare(password, hash)
  │                               │ 3. jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' })
  │◄── { token, user } ──────────┤
  │                               │
  ├── GET /api/expenses ─────────►│
  │   Authorization: Bearer <tok> │ 4. auth middleware: jwt.verify(token)
  │                               │ 5. attach req.user = { id }
  │                               │ 6. query Expense.find({ userId: req.user.id })
  │◄── [ ...expenses ] ──────────┤
```

---

## 🛠️ Tech Stack

| Layer       | Technology         | Purpose                        |
| ----------- | ------------------ | ------------------------------ |
| Runtime     | Node.js 18+        | JavaScript server environment  |
| Framework   | Express.js 4       | HTTP routing & middleware      |
| Database    | MongoDB (Mongoose) | Document storage & ODM         |
| Auth        | jsonwebtoken       | Stateless JWT tokens           |
| Passwords   | bcryptjs           | Secure password hashing        |
| Environment | dotenv             | Load `.env` config             |
| Dev Server  | nodemon            | Auto-restart on changes        |
| CORS        | cors               | Cross-origin header management |

---

## 🌍 Environment Variables

| Variable     | Required | Description                   |
| ------------ | -------- | ----------------------------- |
| `PORT`       | Yes      | HTTP port (default: 5000)     |
| `MONGO_URI`  | Yes      | MongoDB connection string     |
| `JWT_SECRET` | Yes      | Secret key for signing JWTs   |
| `NODE_ENV`   | No       | `development` or `production` |

---

<div align="center">
Made with ❤️ by <a href="https://github.com/deepshikava">deepshikava</a>
</div>
