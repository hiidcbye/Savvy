import { useEffect, useState } from 'react';
import { api } from '../services/api';

const CATEGORIES = [
    { name: 'Food', icon: '🍔', color: '#FF8C32' },
    { name: 'Transport', icon: '🚗', color: '#378ADD' },
    { name: 'Shopping', icon: '🛍️', color: '#6C63FF' },
    { name: 'Entertainment', icon: '🎬', color: '#00D4AA' },
    { name: 'Education', icon: '📚', color: '#D4537E' },
    { name: 'Other', icon: '💰', color: '#A0A0B8' },
];

export default function Budget({ userId }) {
    const [summary, setSummary] = useState(null);
    const [income, setIncome] = useState('');
    const [selected, setSelected] = useState('Food');
    const [limit, setLimit] = useState('');
    const [msg, setMsg] = useState('');

    const load = async () => {
        const data = await api.getBudgetSummary(userId);
        setSummary(data);
    };

    useEffect(() => { if (userId) load(); }, [userId]);

    const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

    const handleUpdateIncome = async (e) => {
        e.preventDefault();
        if (!income) return;
        await api.updateIncome(userId, parseFloat(income));
        setIncome(''); flash('✅ Income updated!'); await load();
    };

    const handleAddBudget = async (e) => {
        e.preventDefault();
        if (!limit) return;
        await api.createBudget(userId, selected, parseFloat(limit));
        setLimit(''); flash(`✅ Budget added for ${selected}!`); await load();
    };

    const inp = {
        backgroundColor: '#1A1A26', border: '1px solid #2A2A3A', borderRadius: 10,
        padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none',
        width: '100%', boxSizing: 'border-box', marginBottom: 10,
    };

    const totalPct = summary?.total_budgeted > 0
        ? Math.min((summary.total_spent / summary.total_budgeted) * 100, 100) : 0;

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 28px 40px' }}>
            <div style={{ color: '#fff', fontSize: 19, fontWeight: '500', marginBottom: 2 }}>Budget Settings</div>
            <div style={{ color: '#444', fontSize: 12, marginBottom: 22 }}>Manage your monthly spending limits</div>

            {/* Summary bar */}
            <div style={{ backgroundColor: '#12121A', border: '1px solid #2A2A3A', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                        <div style={{ color: '#444', fontSize: 11, marginBottom: 4 }}>MONTHLY BUDGET</div>
                        <div style={{ color: '#fff', fontSize: 28, fontWeight: '600' }}>₹{summary?.total_budgeted?.toLocaleString('en-IN') ?? 0}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#444', fontSize: 11, marginBottom: 4 }}>INVESTABLE SURPLUS</div>
                        <div style={{ color: '#00D4AA', fontSize: 28, fontWeight: '600' }}>₹{summary?.investable_surplus?.toFixed(0) ?? 0}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#444', fontSize: 11, marginBottom: 4 }}>MONTHLY INCOME</div>
                        <div style={{ color: '#6C63FF', fontSize: 28, fontWeight: '600' }}>₹{summary?.monthly_income?.toLocaleString('en-IN') ?? 0}</div>
                    </div>
                </div>
                <div style={{ height: 6, backgroundColor: '#1A1A26', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${totalPct}%`, height: '100%', backgroundColor: totalPct > 90 ? '#FF6B6B' : '#6C63FF', borderRadius: 3 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                    <span style={{ color: '#444', fontSize: 11 }}>Spent: ₹{summary?.total_spent?.toFixed(0) ?? 0}</span>
                    <span style={{ color: '#444', fontSize: 11 }}>{totalPct.toFixed(0)}% used</span>
                </div>
            </div>

            {msg && <div style={{ backgroundColor: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: 10, padding: '10px 16px', color: '#00D4AA', fontSize: 13, marginBottom: 16 }}>{msg}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                {/* Income */}
                <div style={{ backgroundColor: '#12121A', border: '1px solid #2A2A3A', borderRadius: 14, padding: '20px 22px' }}>
                    <div style={{ color: '#bbb', fontSize: 13, fontWeight: '500', marginBottom: 4 }}>💰 Monthly Income</div>
                    <div style={{ color: '#444', fontSize: 11, marginBottom: 16 }}>Current: ₹{summary?.monthly_income?.toLocaleString('en-IN') ?? 0}</div>
                    <form onSubmit={handleUpdateIncome}>
                        <input style={inp} placeholder="Enter new income (₹)" type="number" value={income} onChange={e => setIncome(e.target.value)} />
                        <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: 10, backgroundColor: '#6C63FF', color: '#fff', fontSize: 14, fontWeight: '600', border: 'none', cursor: 'pointer' }}>
                            Update Income
                        </button>
                    </form>
                </div>

                {/* Add category */}
                <div style={{ backgroundColor: '#12121A', border: '1px solid #2A2A3A', borderRadius: 14, padding: '20px 22px' }}>
                    <div style={{ color: '#bbb', fontSize: 13, fontWeight: '500', marginBottom: 4 }}>🗂️ Add Category Limit</div>
                    <div style={{ color: '#444', fontSize: 11, marginBottom: 16 }}>Set spending limit per category</div>
                    <form onSubmit={handleAddBudget}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                            {CATEGORIES.map(c => (
                                <button key={c.name} type="button" onClick={() => setSelected(c.name)} style={{
                                    padding: '5px 11px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
                                    border: '1px solid', borderColor: selected === c.name ? c.color : '#2A2A3A',
                                    backgroundColor: selected === c.name ? c.color + '22' : '#1A1A26',
                                    color: selected === c.name ? c.color : '#555',
                                }}>
                                    {c.icon} {c.name}
                                </button>
                            ))}
                        </div>
                        <input style={inp} placeholder={`Limit for ${selected} (₹)`} type="number" value={limit} onChange={e => setLimit(e.target.value)} />
                        <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: 10, backgroundColor: '#6C63FF', color: '#fff', fontSize: 14, fontWeight: '600', border: 'none', cursor: 'pointer' }}>
                            Add Budget
                        </button>
                    </form>
                </div>
            </div>

            {/* Categories */}
            <div style={{ backgroundColor: '#12121A', border: '1px solid #2A2A3A', borderRadius: 14, padding: '20px 22px' }}>
                <div style={{ color: '#bbb', fontSize: 13, fontWeight: '500', marginBottom: 16 }}>📊 Category breakdown</div>
                <div style={{ color: '#444', fontSize: 11, marginBottom: 20 }}>Your spending by category this month</div>
                {!summary?.categories?.length ? (
                    <p style={{ color: '#444', fontSize: 13 }}>No budget categories yet. Add one above.</p>
                ) : summary.categories.map((cat, i) => {
                    const c = CATEGORIES.find(x => x.name === cat.category) || CATEGORIES[5];
                    const pct = Math.min(cat.percent_used, 100);
                    return (
                        <div key={i} style={{ marginBottom: i < summary.categories.length - 1 ? 18 : 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                <div style={{ width: 30, height: 30, borderRadius: 9, backgroundColor: c.color + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>
                                    {c.icon}
                                </div>
                                <span style={{ color: '#ccc', fontSize: 13, fontWeight: '500', flex: 1 }}>{cat.category}</span>
                                <span style={{ fontSize: 11, borderRadius: 20, padding: '3px 9px', fontWeight: '500', backgroundColor: c.color + '1A', color: c.color }}>
                                    {cat.percent_used}%
                                </span>
                            </div>
                            <div style={{ height: 6, backgroundColor: '#1A1A26', borderRadius: 3, overflow: 'hidden', marginBottom: 5 }}>
                                <div style={{ width: `${pct}%`, height: '100%', backgroundColor: c.color, borderRadius: 3 }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 11, color: c.color }}>₹{cat.spent?.toLocaleString('en-IN')} spent</span>
                                <span style={{ fontSize: 11, color: '#444' }}>limit ₹{cat.limit?.toLocaleString('en-IN')}</span>
                            </div>
                            {i < summary.categories.length - 1 && <div style={{ height: 1, backgroundColor: '#1A1A26', marginTop: 18 }} />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}