# 💸 Expense Tracker — Frontend

<div align="center">

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-Styled-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)

**A clean, interactive personal finance tracker built with React.**
Track income, expenses, and spending trends — all in one dashboard.

[Live Demo](#) · (https://expense-tracker-frontend-roan-pi.vercel.app/login) · [Request Feature](https://github.com/deepshikava/expense-tracker/issues)

---

</div>

## ✨ Features at a Glance

| Feature                   | Description                                             |
| ------------------------- | ------------------------------------------------------- |
| 📊 **Dashboard Overview** | Real-time balance, income & expense totals              |
| ➕ **Add Transactions**   | Log expenses and income with category, date, and amount |
| 🗑️ **Delete Entries**     | Remove transactions instantly with live recalculation   |
| 📈 **Visual Charts**      | Spending breakdown charts by category                   |
| 🔍 **Filter & Sort**      | Filter transactions by month, year, or category         |
| 📱 **Responsive Design**  | Works seamlessly on desktop and mobile                  |

---

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:

- **Node.js** v16 or higher — [Download](https://nodejs.org/)
- **npm** v7+ or **yarn** v1.22+

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/deepshikava/expense-tracker.git

# 2. Navigate to the frontend directory
cd expense-tracker/frontend

# 3. Install dependencies
npm install

# 4. Start the development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser — the app will hot-reload on every save.

### Other Available Scripts

```bash
# Build for production
npm run build

# Run tests
npm test

# Check for linting errors
npm run lint

# Eject from Create React App (irreversible)
npm run eject
```

---

## 🗂️ Project Structure

```
frontend/
├── public/
│   ├── index.html            # HTML entry point
│   └── favicon.ico
│
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Layout/
│   │   │   └── Layout.jsx    # App title, nav bar and side bar
│   │   ├── Login/
│   │   │   └── Login.jsx   # Logins a existing user
│   │   ├── SignUp/
│   │   │   └── Signup.jsx  # Registers a new user
│   │   ├── TransactionItem/
│   │   │   └── TransactionItem.jsx     # Single transaction item
│   │   ├── Add/
│   │   │   └── Add.jsx  # AddTransactionModal - Form to add new entry
│   │   └── Chart/
│   │       └── GaugeCard.jsx     # Category breakdown chart using recharts
│   │
│   ├── pages/           # UI containers
│   │   ├── Dashboard/
│   │   │   └── Dashboard.jsx # contains Insightful financial visualization of both income, expense & savings
│   │   ├── Income/
│   │   │   └── Income.jsx   # shows income transaction summary with CRUD functionality
│   │   ├── Expense/
│   │   │   └── Expense.jsx  # shows expense transaction summary with CRUD functionality
│   │   ├── Profile/
│   │   │   └── Profile.jsx  # shows Profile info and allows updating profile info and password
│   │
│   ├── context/
│   │   └── useOutletContext   # React Router hook- allows child routes to access parent route data/state
│   │
│   ├── App.jsx               # Root component, layout
│   ├── main.jsx              # ReactDOM entry point
│   └── index.css             # Global styles
│
├── package.json
└── README.md
```

---

## 🧩 Component Architecture

The diagram below shows how components are composed and where data flows:

```
App
├── Login
├── Signup
├── Layout
│   ├── Dashboard
│   ├── Income
│   ├── Expense
│   ├── Profile
```

### Component Responsibilities

**`App.jsx`** — Root layout. Handles authetication, storing data in localStorage and sessionStorage

**`Dashboard.jsx`** — Shows summary cards: total balane, income, expenses and saving rate with visual representations

**`Income.jsx`** — Shows income overview along with list of all stored transactions. Allows CRUD operations.

**`Expense.jsx`** — Shows expense overview along with list of all stored transactions. Allows CRUD operations.

**`TransactionList.jsx`** — A single entry row. Shows description, category, amount (colored by type), date, and a edit and delete button.

**`Add.jsx`** — A controlled form with text, amount, category, and date fields. On submit it triggers handleAddTransaction.

**`GaugeCard.jsx`** _(if present)_ — Pie or bar chart breaking down spending by category, powered by a charting library.

---

## 🔄 State Management

The app uses **React Router DOM - useOutletContext + useMemo** — no external state library needed.

**Why Context + useReducer?**

- No prop-drilling through multiple component levels
- Lightweight — no Redux boilerplate for a personal-scale app

---

## 📊 Data Flow Diagram

```
User fills AddTransaction form
         │
         ▼
  triggers(handleAddTransaction)
         │
         ▼
  updates transactions[]
         │
    ┌────┴────────────────────────┐
    ▼                             ▼
Balance re-renders          TransactionList re-renders
(new net total)             (new entry appears)
    │
    ▼
IncomeExpenses re-renders
(income/expense updated)
```

---

## 🎨 UI Preview

### Dashboard Layout

```
┌─────────────────────────────────────┐
│           Expense Tracker           │  ← Layout
├─────────────────────────────────────┤
│            Your Balance             │
│              $1,234.00              │  ← FinancialCard
├──────────────┬──────────────────────┤
│   INCOME     │      EXPENSE         │
│  +$3,000     │     -$1,766          │  ← Income & Expenses
├─────────────────────────────────────┤
│  History                            │
│  ─────────────────────────────────  │
│  ● Freelance project    +$2,000  ×  │
│  ● Groceries             -$120  ×   │  ← TransactionList
│  ● Netflix subscription   -$15  ×   │
│  ● Monthly salary       +$1,000  ×  │
├─────────────────────────────────────┤
│  Add new transaction                │
│  [Text___________] [Amount____]     │  ← handleAddTransaction
│            [Add Transaction]        │
└─────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer           | Technology                               |
| --------------- | ---------------------------------------- |
| UI Framework    | React 18 (functional components + Hooks) |
| State           | ReactRouter-useOutletContext + `useMemo` |
| Styling         | Tailwindcss                              |
| Charts          | Recharts                                 |
| Build Tool      | Vite                                     |
| Package Manager | npm                                      |

---

<div align="center">
Made with ❤️ by <a href="https://github.com/deepshikava">deepshikava</a>
</div>
