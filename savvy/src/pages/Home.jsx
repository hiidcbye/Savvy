import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const CAT_COLORS = {
  Food: '#FF8C32', Transport: '#378ADD', Shopping: '#6C63FF',
  Entertainment: '#00D4AA', Education: '#D4537E', Other: '#A0A0B8',
};
const CAT_ICONS = {
  Food: '🍔', Transport: '🚗', Shopping: '🛍️',
  Entertainment: '🎬', Education: '📚', Other: '💰',
};

function DonutChart({ spent, total }) {
  const r = 62;
  const circ = 2 * Math.PI * r;
  const pct = total > 0 ? Math.min(spent / total, 1) : 0;
  const remaining = total - spent;
  const offset = circ * (1 - pct);

  return (
    <div style={{ backgroundColor: '#12121A', border: '1px solid #2A2A3A', borderRadius: 14, padding: '20px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 160, height: 160, margin: '4px 0 16px' }}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={r} stroke="#1A1A2E" strokeWidth="14" fill="none" />
          <circle cx="80" cy="80" r={r} stroke="#6C63FF" strokeWidth="14" fill="none"
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round" transform="rotate(-90 80 80)" />
          {pct > 1 && (
            <circle cx="80" cy="80" r={r} stroke="#FF6B6B" strokeWidth="14" fill="none"
              strokeDasharray={circ} strokeDashoffset={circ * 0.98}
              strokeLinecap="round" transform="rotate(-90 80 80)" opacity="0.4" />
          )}
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
          <div style={{ color: '#555', fontSize: 10, letterSpacing: 0.5, marginBottom: 2 }}>REMAINING</div>
          <div style={{ color: '#6C63FF', fontSize: 13 }}>₹</div>
          <div style={{ color: '#fff', fontSize: 22, fontWeight: '500' }}>
            {remaining > 0 ? remaining.toLocaleString('en-IN') : '0'}
          </div>
        </div>
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, backgroundColor: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: 20, padding: '5px 14px', color: '#00D4AA', fontSize: 12, marginBottom: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#00D4AA' }} />
        {pct > 1 ? 'Over budget' : 'On track'}
      </div>
      <div style={{ color: '#444', fontSize: 11 }}>
        ₹{spent?.toLocaleString('en-IN') ?? 0} spent of ₹{total?.toLocaleString('en-IN') ?? 0}
      </div>
    </div>
  );
}

export default function Home({ userId }) {
  const [summary, setSummary] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    Promise.all([
      api.getBudgetSummary(userId),
      api.getAnomalies(userId),
      api.getTransactions(userId),
    ]).then(([s, a, t]) => {
      setSummary(s);
      setAnomalies(Array.isArray(a) ? a : []);
      setTransactions(Array.isArray(t) ? t.slice(0, 4) : []);
      setLoading(false);
    });
  }, [userId]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
      <div style={{ color: '#6C63FF', fontSize: 16 }}>Loading...</div>
    </div>
  );

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysPassed = now.getDate();
  const daysLeft = daysInMonth - daysPassed;
  const remaining = (summary?.total_budgeted ?? 0) - (summary?.total_spent ?? 0);
  const dailySafe = daysLeft > 0 ? Math.max(remaining / daysLeft, 0).toFixed(0) : 0;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 28px 40px' }}>
      <div style={{ color: '#fff', fontSize: 19, fontWeight: '500', marginBottom: 2 }}>Budget health</div>
      <div style={{ color: '#444', fontSize: 12, marginBottom: 22 }}>
        Good day — here's your {now.toLocaleString('default', { month: 'long', year: 'numeric' })} snapshot
      </div>

      {/* Top grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14, marginBottom: 14 }}>
        <DonutChart spent={summary?.total_spent ?? 0} total={summary?.total_budgeted ?? 0} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ backgroundColor: '#12121A', border: '1px solid #2A2A3A', borderRadius: 14, padding: '18px 20px', flex: 1 }}>
            <div style={{ color: '#444', fontSize: 11, letterSpacing: 0.5, marginBottom: 4 }}>DAYS LEFT IN {now.toLocaleString('default', { month: 'long' }).toUpperCase()}</div>
            <div style={{ color: '#fff', fontSize: 24, fontWeight: '500' }}>{daysLeft} days</div>
            <div style={{ height: 3, backgroundColor: '#1A1A26', borderRadius: 2, marginTop: 10 }}>
              <div style={{ width: `${(daysPassed / daysInMonth) * 100}%`, height: '100%', backgroundColor: '#6C63FF', borderRadius: 2 }} />
            </div>
            <div style={{ display: 'inline-block', backgroundColor: 'rgba(108,99,255,0.12)', color: '#6C63FF', fontSize: 10, borderRadius: 4, padding: '2px 7px', marginTop: 6 }}>
              {daysPassed} of {daysInMonth} days passed
            </div>
          </div>
          <div style={{ backgroundColor: '#12121A', border: '1px solid #2A2A3A', borderRadius: 14, padding: '18px 20px', flex: 1 }}>
            <div style={{ color: '#444', fontSize: 11, letterSpacing: 0.5, marginBottom: 4 }}>DAILY SAFE LIMIT</div>
            <div style={{ color: '#fff', fontSize: 24, fontWeight: '500' }}>₹{Number(dailySafe).toLocaleString('en-IN')}</div>
            <div style={{ display: 'inline-block', backgroundColor: 'rgba(108,99,255,0.12)', color: '#6C63FF', fontSize: 10, borderRadius: 4, padding: '2px 7px', marginTop: 6 }}>
              Based on remaining budget
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={{ backgroundColor: '#12121A', border: '1px solid #2A2A3A', borderRadius: 14, padding: '18px 20px', marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ color: '#bbb', fontSize: 13, fontWeight: '500', display: 'flex', alignItems: 'center', gap: 6 }}>
            🗂️ Categories
          </div>
          <Link to="/budget" style={{ color: '#6C63FF', fontSize: 12, textDecoration: 'none' }}>View all</Link>
        </div>

        {!summary?.categories?.length ? (
          <p style={{ color: '#444', fontSize: 13 }}>No budget categories yet. <Link to="/budget" style={{ color: '#6C63FF' }}>Add one →</Link></p>
        ) : summary.categories.map((cat, i) => {
          const color = CAT_COLORS[cat.category] || '#A0A0B8';
          const icon = CAT_ICONS[cat.category] || '💰';
          const pct = Math.min(cat.percent_used, 100);
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 90px', alignItems: 'center', gap: 12, marginBottom: i < summary.categories.length - 1 ? 12 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#bbb', fontSize: 12 }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, backgroundColor: color + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                  {icon}
                </div>
                {cat.category}
              </div>
              <div style={{ height: 5, backgroundColor: '#1A1A26', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', backgroundColor: color, borderRadius: 3 }} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#ddd', fontSize: 12 }}>₹{cat.spent?.toLocaleString('en-IN')}</div>
                <div style={{ color: '#444', fontSize: 11 }}>of ₹{cat.limit?.toLocaleString('en-IN')}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        {/* Recent activity */}
        <div style={{ backgroundColor: '#12121A', border: '1px solid #2A2A3A', borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ color: '#bbb', fontSize: 13, fontWeight: '500' }}>🕐 Recent activity</div>
            <Link to="/transactions" style={{ color: '#6C63FF', fontSize: 12, textDecoration: 'none' }}>View all</Link>
          </div>
          {!transactions.length ? (
            <p style={{ color: '#444', fontSize: 13 }}>No transactions yet.</p>
          ) : transactions.map((t, i) => {
            const color = CAT_COLORS[t.category] || '#A0A0B8';
            const icon = CAT_ICONS[t.category] || '💰';
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 0', borderBottom: i < transactions.length - 1 ? '1px solid #1A1A26' : 'none',
              }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: color + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                  {icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#ccc', fontSize: 12, fontWeight: '500' }}>{t.description || t.category}</div>
                  <div style={{ color: '#444', fontSize: 11, marginTop: 1 }}>{t.date}</div>
                </div>
                <div style={{ color: '#FF6B6B', fontSize: 13, fontWeight: '500' }}>-₹{t.amount}</div>
              </div>
            );
          })}
        </div>

        {/* Anomaly panel */}
        <div style={{ backgroundColor: '#12121A', border: '1px solid #2A2A3A', borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: 'rgba(255,179,71,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
              ⚠️
            </div>
            <div>
              <div style={{ color: '#bbb', fontSize: 13, fontWeight: '500' }}>Anomaly detection</div>
              <div style={{ color: '#444', fontSize: 11 }}>Z-score analysis</div>
            </div>
          </div>
          <div style={{ height: 1, backgroundColor: '#1A1A26', margin: '14px 0' }} />
          <div style={{ color: '#FFB347', fontSize: 32, fontWeight: '500', marginBottom: 2 }}>{anomalies.length}</div>
          <div style={{ color: '#888', fontSize: 12, marginBottom: 12 }}>
            {anomalies.length === 1 ? 'anomaly detected' : 'anomalies detected'}
          </div>
          {!anomalies.length ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#00D4AA', flexShrink: 0 }} />
              <span style={{ color: '#888', fontSize: 12 }}>All spending looks normal 🎉</span>
            </div>
          ) : anomalies.slice(0, 3).map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 8 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#6C63FF', marginTop: 5, flexShrink: 0 }} />
              <span style={{ color: '#888', fontSize: 12, lineHeight: 1.4 }}>{a.reason}</span>
            </div>
          ))}
          <Link to="/insights" style={{
            display: 'block', textAlign: 'center', marginTop: 14,
            backgroundColor: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.25)',
            borderRadius: 8, padding: 10, color: '#6C63FF', fontSize: 13, fontWeight: '500',
            textDecoration: 'none',
          }}>
            View full insights →
          </Link>
        </div>
      </div>
    </div>
  );
}