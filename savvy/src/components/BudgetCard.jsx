export default function BudgetCard({ category }) {
    const color = category.over_budget ? '#FF6B6B' : category.alert ? '#FFB347' : '#00D4AA';
    const pct = Math.min(category.percent_used, 100);

    return (
        <div style={{ backgroundColor: '#1A1A26', borderRadius: 12, padding: 16, marginBottom: 10 }}>
            <div className="flex justify-between mb-2">
                <span className="text-white font-medium">{category.category}</span>
                <span style={{ color }} className="font-semibold">{category.percent_used}%</span>
            </div>
            <div style={{ backgroundColor: '#2A2A3A', borderRadius: 4, height: 6, marginBottom: 8 }}>
                <div style={{ width: `${pct}%`, backgroundColor: color, height: 6, borderRadius: 4 }} />
            </div>
            <div className="flex justify-between">
                <span className="text-gray-400 text-sm">₹{category.spent} spent</span>
                <span className="text-gray-400 text-sm">₹{category.remaining} left</span>
            </div>
        </div>
    );
}