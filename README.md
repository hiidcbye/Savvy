# Savvy 📊
> Smart financial guidance for students

A full-stack personal finance web app built for students to track spending, set budgets, detect unusual transactions, and get investment recommendations — all at $0.

🔗 **Live app:** [savvy-lime.vercel.app](https://savvy-lime.vercel.app)
🔗 **API docs:** [savvy-backend-fgki.onrender.com/docs](https://savvy-backend-fgki.onrender.com/docs)

---

## Features

**Phase 1 — Budgeting + Anomaly Detection (live)**
- Set monthly income and per-category spending limits
- Track transactions across Food, Transport, Shopping, Entertainment, Education
- Real-time budget health with progress bars and surplus calculation
- Z-score based anomaly detection — flags unusual spending automatically
- Spending insights dashboard with category breakdown

**Phase 2 — AI Copilot (coming soon)**
- Gemini Flash powered financial advisor
- Context-aware advice based on your actual budget data

**Phase 3 — Investment Recommendations (coming soon)**
- Personalized fund recommendations based on investable surplus
- Risk-based filtering (Low / Medium / High)
- Integration with Investment Recommendation System

---

## Tech Stack

| Layer | Technology | Cost |
|-------|-----------|------|
| Frontend | React + Vite | Free |
| Backend | FastAPI (Python) | Free |
| Database | Supabase (PostgreSQL) | Free |
| Anomaly Engine | Pandas + NumPy (Z-score) | Free |
| Frontend Hosting | Vercel | Free |
| Backend Hosting | Render.com | Free |
| Auth | Supabase Auth | Free |

**Total cost: $0**

---

## Project Structure

```
Savvy-web/
├── savvy/                      # React frontend (Vite)
│   └── src/
│       ├── pages/
│       │   ├── SignIn.jsx
│       │   ├── Home.jsx
│       │   ├── Transactions.jsx
│       │   ├── Budget.jsx
│       │   ├── Insights.jsx
│       │   └── Investments.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── BudgetCard.jsx
│       │   ├── AnomalyAlert.jsx
│       │   └── TransactionItem.jsx
│       ├── services/
│       │   └── api.js
│       └── App.jsx
│
└── savvy-backend/              # FastAPI backend (Python)
    ├── routers/
    │   ├── auth.py
    │   ├── transactions.py
    │   ├── budget.py
    │   └── anomaly.py
    ├── services/
    │   ├── budget_engine.py
    │   └── anomaly_engine.py
    ├── main.py
    └── database.py
```

---

## Running Locally

### Prerequisites
- Node.js 18+
- Python 3.11+
- A Supabase account (free)

### Backend

```bash
cd savvy-backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
```

Create `.env` in `savvy-backend/`:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

```bash
uvicorn main:app --reload
# Runs on http://localhost:8000
# API docs at http://localhost:8000/docs
```

### Frontend

```bash
cd savvy
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## Database Schema

```sql
users (id, email, name, monthly_income, created_at)
transactions (id, user_id, amount, category, description, date, created_at)
budgets (id, user_id, category, monthly_limit, current_spend, created_at)
anomalies (id, user_id, transaction_id, z_score, reason, detected_at)
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Create account |
| POST | `/auth/signin` | Sign in |
| GET | `/transactions/` | Get all transactions |
| POST | `/transactions/` | Add transaction |
| GET | `/budget/` | Get budgets |
| POST | `/budget/` | Create budget category |
| GET | `/budget/summary` | Get full budget summary + surplus |
| PUT | `/budget/income` | Update monthly income |
| GET | `/anomaly/` | Get detected anomalies |

---

## How Anomaly Detection Works

Uses **Z-score statistical analysis** —:

1. When a transaction is added, the engine fetches the last 60 transactions in the same category
2. Calculates the mean and standard deviation of historical amounts
3. Computes Z-score: `Z = (amount - mean) / std`
4. If `|Z| >= 2.0`, the transaction is flagged as anomalous
5. A human-readable reason is stored: *"This Food transaction of ₹5000 is unusually higher than your usual ₹200 average (Z=2.3)"*

Requires at least 7 transactions in a category before flagging begins.

---

## Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | savvy-lime.vercel.app |
| Backend | Render.com | savvy-backend-fgki.onrender.com |
| Database | Supabase | Managed |

> **Note:** The free Render tier spins down after inactivity. First request after sleep may take 30-50 seconds.

---

## Roadmap

- [x] User authentication
- [x] Budget management
- [x] Transaction tracking
- [x] Z-score anomaly detection
- [x] Spending insights
- [x] Production deployment
- [ ] AI Copilot (Gemini Flash)
- [ ] Investment recommendations
- [ ] Savings goals tracker
- [ ] Export transactions to CSV

---

## Built by

Bhumika — KIIT University
