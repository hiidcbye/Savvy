const catColors = {
    food: '#FF6B6B', transport: '#FFB347', shopping: '#6C63FF',
    entertainment: '#00D4AA', education: '#FF85C2', other: '#A0A0B8',
};

export default function TransactionItem({ transaction }) {
    const color = catColors[transaction.category?.toLowerCase()] || catColors.other;
    return (
        <div style={{ backgroundColor: '#1A1A26', borderRadius: 12, padding: 14, marginBottom: 8 }}
            className="flex items-center gap-3">
            <div style={{ backgroundColor: color + '22', borderRadius: 10, width: 40, height: 40 }}
                className="flex items-center justify-center flex-shrink-0">
                <span style={{ color }} className="font-bold">{transaction.category?.[0]?.toUpperCase() ?? '?'}</span>
            </div>
            <div className="flex-1">
                <p className="text-white text-sm font-medium">{transaction.description || transaction.category}</p>
                <p className="text-gray-500 text-xs mt-1">{transaction.date}</p>
            </div>
            <span style={{ color: '#FF6B6B' }} className="font-semibold">-₹{transaction.amount}</span>
        </div>
    );
}