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

export default function Transactions({ userId }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [selected, setSelected] = useState('Food');
    const [adding, setAdding] = useState(false);
    const [success, setSuccess] = useState('');

    const load = async () => {
        const data = await api.getTransactions(userId);
        setTransactions(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    useEffect(() => { if (userId) load(); }, [userId]);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!amount) return;
        setAdding(true);
        await api.addTransaction(userId, { amount: parseFloat(amount), category: selected, description });
        setAmount(''); setDescription('');
        setSuccess('Transaction added!');
        setTimeout(() => setSuccess(''), 3000);
        await load();
        setAdding(false);
    };

    const inp = {
        backgroundColor: '#1A1A26', border: '1px solid #2A2A3A',
        borderRadius: 10, padding: '12px 16px', color: '#fff',
        fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box',
    };

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 28px 40px' }}>
            <div style={{ color: '#fff', fontSize: 19, fontWeight: '500', marginBottom: 2 }}>Transactions</div>
            <div style={{ color: '#444', fontSize: 12, marginBottom: 22 }}>Track and add your spending</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 20 }}>
                {/* Add form */}
                <div style={{ backgroundColor: '#12121A', border: '1px solid #2A2A3A', borderRadius: 14, padding: '20px 22px', alignSelf: 'start' }}>
                    <div style={{ color: '#bbb', fontSize: 13, fontWeight: '500', marginBottom: 16 }}>➕ Add transaction</div>
                    <form onSubmit={handleAdd}>
                        <input style={{ ...inp, marginBottom: 10 }} placeholder="Amount (₹)" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
                        <input style={{ ...inp, marginBottom: 14 }} placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                            {CATEGORIES.map(c => (
                                <button key={c.name} type="button" onClick={() => setSelected(c.name)} style={{
                                    padding: '6px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
                                    border: '1px solid', borderColor: selected === c.name ? c.color : '#2A2A3A',
                                    backgroundColor: selected === c.name ? c.color + '22' : '#1A1A26',
                                    color: selected === c.name ? c.color : '#555',
                                    fontWeight: selected === c.name ? '600' : '400',
                                }}>
                                    {c.icon} {c.name}
                                </button>
                            ))}
                        </div>
                        {success && <p style={{ color: '#00D4AA', fontSize: 12, marginBottom: 8 }}>{success}</p>}
                        <button type="submit" disabled={adding} style={{
                            width: '100%', padding: '12px 0', borderRadius: 10,
                            backgroundColor: '#6C63FF', color: '#fff', fontSize: 14,
                            fontWeight: '600', border: 'none', cursor: 'pointer',
                            opacity: adding ? 0.7 : 1,
                        }}>
                            {adding ? 'Adding...' : 'Add transaction'}
                        </button>
                    </form>
                </div>

                {/* Transaction list */}
                <div style={{ backgroundColor: '#12121A', border: '1px solid #2A2A3A', borderRadius: 14, padding: '20px 22px' }}>
                    <div style={{ color: '#bbb', fontSize: 13, fontWeight: '500', marginBottom: 16 }}>🕐 Recent transactions</div>
                    {loading ? <p style={{ color: '#444' }}>Loading...</p>
                        : !transactions.length ? <p style={{ color: '#444', fontSize: 13 }}>No transactions yet.</p>
                            : transactions.map((t, i) => {
                                const cat = CATEGORIES.find(c => c.name === t.category) || CATEGORIES[5];
                                return (
                                    <div key={t.id} style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '10px 0', borderBottom: i < transactions.length - 1 ? '1px solid #1A1A26' : 'none',
                                    }}>
                                        <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: cat.color + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>
                                            {cat.icon}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ color: '#ccc', fontSize: 13, fontWeight: '500' }}>{t.description || t.category}</div>
                                            <div style={{ color: '#444', fontSize: 11, marginTop: 2 }}>{t.date} · {t.category}</div>
                                        </div>
                                        <div style={{ color: '#FF6B6B', fontSize: 13, fontWeight: '600' }}>-₹{t.amount}</div>
                                    </div>
                                );
                            })
                    }
                </div>
            </div>
        </div>
    );
}