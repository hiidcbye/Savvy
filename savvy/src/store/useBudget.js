import { useState } from 'react';
import { api } from '../services/api';

export function useBudget() {
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchSummary = async (userId) => {
        setIsLoading(true);
        try {
            const data = await api.getBudgetSummary(userId);
            setSummary(data);
        } catch { }
        setIsLoading(false);
    };

    const createBudget = async (userId, category, limit) => {
        await api.createBudget(userId, category, limit);
    };

    const updateIncome = async (userId, income) => {
        await api.updateIncome(userId, income);
    };

    return { summary, isLoading, fetchSummary, createBudget, updateIncome };
}