export default function AnomalyAlert({ anomaly }) {
    return (
        <div style={{ backgroundColor: '#1A1A26', borderRadius: 12, padding: 16, marginBottom: 10, borderLeft: '3px solid #FFB347' }}
            className="flex gap-3">
            <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFB347', marginTop: 4, flexShrink: 0 }} />
            <div>
                <p style={{ color: '#FFB347' }} className="text-sm font-semibold mb-1">Spending Alert</p>
                <p className="text-gray-400 text-sm">{anomaly.reason}</p>
            </div>
        </div>
    );
}