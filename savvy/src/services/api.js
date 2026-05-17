const API_URL = 'http://localhost:8000';

export const api = {
    signup: async (email, password, name) => {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name }),
        });
        return res.json();
    },

    signin: async (email, password) => {
        const res = await fetch(`${API_URL}/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return res.json();
    },

    getTransactions: async (userId) => {
        const res = await fetch(`${API_URL}/transactions/`, {
            headers: { 'user-id': userId },
        });
        return res.json();
    },

    addTransaction: async (userId, data) => {
        const res = await fetch(`${API_URL}/transactions/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'user-id': userId },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    getBudgetSummary: async (userId) => {
        const res = await fetch(`${API_URL}/budget/summary`, {
            headers: { 'user-id': userId },
        });
        return res.json();
    },

    createBudget: async (userId, category, monthly_limit) => {
        const res = await fetch(`${API_URL}/budget/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'user-id': userId },
            body: JSON.stringify({ category, monthly_limit }),
        });
        return res.json();
    },

    updateIncome: async (userId, monthly_income) => {
        const res = await fetch(`${API_URL}/budget/income`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'user-id': userId },
            body: JSON.stringify({ monthly_income }),
        });
        return res.json();
    },

    getAnomalies: async (userId) => {
        const res = await fetch(`${API_URL}/anomaly/`, {
            headers: { 'user-id': userId },
        });
        return res.json();
    },
};