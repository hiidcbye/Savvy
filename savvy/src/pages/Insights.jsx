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

export default function Insights({ userId }) {
    const [summary, setSummary] = useState(null);
    const [anomalies, setAnomalies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;
        Promise.all([api.getBudgetSummary(userId), api.getAnomalies(userId)])
            .then(([s, a]) => {
                setSummary(s);
                setAnomalies(Array.isArray(a) ? a : []);
                setLoading(false);
            });
    }, [userId]);

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
            <div style={{ color: '#6C63FF' }}>Loading...</div>
        </div>
    );

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 28px 40px' }}>
            <div style={{ color: '#fff', fontSize: 19, fontWeight: '500', marginBottom: 2 }}>Spending Insights</div>
            <div style={{ color: '#444', fontSize: 12, marginBottom: 22 }}>Review your financial health</div>

            {/* Top stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
                {[
                    { label: 'Total Spent', value: `₹${summary?.total_spent?.toLocaleString('en-IN') ?? 0}`, color: '#FF6B6B', icon: '💸' },
                    { label: 'Investable Surplus', value: `₹${summary?.investable_surplus?.toFixed(0) ?? 0}`, color: '#00D4AA', icon: '📈' },
                    { label: 'Anomalies Detected', value: anomalies.length, color: '#FFB347', icon: '⚠️' },
                ].map((stat, i) => (
                    <div key={i} style={{ backgroundColor: '#12121A', border: '1px solid #2A2A3A', borderRadius: 14, padding: '20px 22px' }}>
                        <div style={{ fontSize: 24, marginBottom: 10 }}>{stat.icon}</div>
                        <div style={{ color: stat.color, fontSize: 30, fontWeight: '600', marginBottom: 4 }}>{stat.value}</div>
                        <div style={{ color: '#444', fontSize: 12 }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>

                {/* Category breakdown */}
                <div style={{ backgroundColor: '#12121A', border: '1px solid #2A2A3A', borderRadius: 14, padding: '20px 22px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <div style={{ color: '#bbb', fontSize: 13, fontWeight: '500' }}>🗂️ Category breakdown</div>
                    </div>
                    <div style={{ color: '#444', fontSize: 11, marginBottom: 20 }}>Your spending by category this month</div>

                    {!summary?.categories?.length ? (
                        <p style={{ color: '#444', fontSize: 13 }}>No budget data yet.</p>
                    ) : summary.categories.map((cat, i) => {
                        const c = CATEGORIES.find(x => x.name === cat.category) || CATEGORIES[5];
                        const pct = Math.min(cat.percent_used, 100);
                        return (
                            <div key={i} style={{ marginBottom: 16 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: c.color + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                                        {c.icon}
                                    </div>
                                    <span style={{ color: '#ccc', fontSize: 13, flex: 1 }}>{cat.category}</span>
                                    <span style={{ color: '#ddd', fontSize: 12 }}>₹{cat.spent?.toLocaleString('en-IN')}</span>
                                    <span style={{ backgroundColor: c.color + '1A', color: c.color, fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: '500' }}>
                                        {cat.percent_used}%
                                    </span>
                                </div>
                                <div style={{ height: 6, backgroundColor: '#1A1A26', borderRadius: 3, overflow: 'hidden' }}>
                                    <div style={{ width: `${pct}%`, height: '100%', backgroundColor: c.color, borderRadius: 3 }} />
                                </div>
                            </div>
                        );
                    })}

                    {/* Legend */}
                    {summary?.categories?.length > 0 && (
                        <>
                            <div style={{ height: 1, backgroundColor: '#1A1A26', margin: '16px 0' }} />
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                                {summary.categories.map((cat, i) => {
                                    const c = CATEGORIES.find(x => x.name === cat.category) || CATEGORIES[5];
                                    return (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: c.color }} />
                                            <span style={{ color: '#555', fontSize: 11 }}>{cat.category}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* Anomalies */}
                <div style={{ backgroundColor: '#12121A', border: '1px solid #2A2A3A', borderRadius: 14, padding: '20px 22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(255,179,71,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            ⚠️
                        </div>
                        <div>
                            <div style={{ color: '#bbb', fontSize: 13, fontWeight: '500' }}>Anomaly detection</div>
                            <div style={{ color: '#444', fontSize: 11 }}>Z-score analysis</div>
                        </div>
                    </div>
                    <div style={{ height: 1, backgroundColor: '#1A1A26', margin: '14px 0' }} />
                    <div style={{ color: '#FFB347', fontSize: 32, fontWeight: '500', marginBottom: 2 }}>{anomalies.length}</div>
                    <div style={{ color: '#888', fontSize: 12, marginBottom: 16 }}>
                        {anomalies.length === 1 ? 'anomaly detected' : 'anomalies detected'}
                    </div>
                    {!anomalies.length ? (
                        <div style={{ backgroundColor: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.15)', borderRadius: 10, padding: '16px', textAlign: 'center' }}>
                            <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
                            <div style={{ color: '#00D4AA', fontSize: 13, fontWeight: '500' }}>All clear!</div>
                            <div style={{ color: '#444', fontSize: 12, marginTop: 4 }}>No unusual spending detected.</div>
                        </div>
                    ) : anomalies.map((a, i) => (
                        <div key={i} style={{
                            backgroundColor: '#1A1A26', borderRadius: 10, padding: '12px 14px',
                            marginBottom: 10, borderLeft: '3px solid #FFB347',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                                <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#FFB347' }} />
                                <span style={{ color: '#FFB347', fontSize: 12, fontWeight: '600' }}>Spending Alert</span>
                            </div>
                            <p style={{ color: '#888', fontSize: 12, lineHeight: 1.5 }}>{a.reason}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}