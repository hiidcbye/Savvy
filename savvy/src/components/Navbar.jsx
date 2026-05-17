import { Link, useLocation } from 'react-router-dom';

const links = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/transactions', label: 'Transactions', icon: '↕' },
    { to: '/budget', label: 'Budget', icon: '◎' },
    { to: '/insights', label: 'Insights', icon: '📈' },
];

export default function Navbar({ onSignOut }) {
    const { pathname } = useLocation();
    return (
        <nav style={{
            backgroundColor: '#0E0E18', borderBottom: '1px solid #2A2A3A',
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 32px', height: 50,
        }}>
            <span style={{ color: '#6C63FF', fontSize: 17, fontWeight: '600', display: 'flex', alignItems: 'center', gap: 8 }}>
                📊 Savvy
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
                {links.map(l => (
                    <Link key={l.to} to={l.to} style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        fontSize: 13, textDecoration: 'none', padding: '6px 14px', borderRadius: 8,
                        color: pathname === l.to ? '#fff' : '#555',
                        backgroundColor: pathname === l.to ? '#1A1A2E' : 'transparent',
                    }}>
                        <span>{l.icon}</span><span>{l.label}</span>
                    </Link>
                ))}
            </div>
            <button onClick={onSignOut} style={{
                color: '#555', fontSize: 12, background: 'none',
                border: '1px solid #2A2A3A', borderRadius: 6,
                padding: '5px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
            }}>
                🚪 Sign out
            </button>
        </nav>
    );
}