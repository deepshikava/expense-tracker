## 💸 Expense Tracker — Full-Stack Personal Finance App

Expense Tracker is a full-stack web application for managing personal finances with secure authentication and per-user data isolation.  
It helps users track income and expenses, monitor balances, visualize spending trends, and export transaction data.

[Live Demo](https://expense-tracker-frontend-roan-pi.vercel.app) · [View Backend API](https://expense-tracker-api-rust.vercel.app) · [Request Feature](https://github.com/deepshikava/expense-tracker/issues)

### 🚀 What the Project Offers

- **Secure user accounts** with JWT-based authentication (register, login, protected routes)
- **Income and expense management** with full CRUD operations
- **Dashboard insights** for total balance, savings, and category-level financial overviews
- **Filtering and analytics** by date/category for better spending visibility
- **Data export support** (Excel download endpoints for transactions)
- **Responsive UI** optimized for desktop and mobile usage

### 🧱 Architecture Overview

This repository contains two apps:

- **`frontend/`**: React-based client that handles UI, forms, charts, and user workflows
- **`backend/`**: Node.js + Express REST API that handles auth, business logic, and data persistence

Typical flow:

1. User interacts with React frontend
2. Frontend calls protected/public API endpoints
3. Express routes pass through JWT auth middleware (for protected endpoints)
4. Controllers apply business logic and user ownership checks
5. MongoDB stores user, income, and expense records

### 🛠️ Tech Stack

**Frontend**

- React 18
- Vite
- Tailwind CSS
- Recharts
- React Router (`useOutletContext`) + React hooks

**Backend**

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- `bcryptjs` for password hashing
- `dotenv`, `cors`, `morgan`, `nodemon`

### 📁 Repository Structure

```text
expense-tracker/
├── frontend/   # React app (UI, charts, dashboard, auth screens)
└── backend/    # Express API (auth, income/expense routes, dashboard, DB models)
```
