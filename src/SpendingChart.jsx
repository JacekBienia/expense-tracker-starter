import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';

// Fixed categorical order: a category keeps its color no matter which others are present.
const PALETTE = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#4a3aa7", "#e34948"];

const formatCurrency = (value) => `$${value.toLocaleString()}`;

function SpendingTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { category, amount, share } = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <span className="chart-tooltip-label">{category}</span>
      <span className="chart-tooltip-value">{formatCurrency(amount)} ({share}%)</span>
    </div>
  );
}

function SpendingChart({ transactions, categories }) {
  const totals = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const totalSpent = Object.values(totals).reduce((sum, amount) => sum + amount, 0);

  const data = categories
    .filter(category => totals[category] > 0)
    .map(category => ({
      category,
      amount: totals[category],
      share: Math.round((totals[category] / totalSpent) * 100),
      fill: PALETTE[categories.indexOf(category) % PALETTE.length],
    }));

  return (
    <div className="spending-chart">
      <h2>Spending by Category</h2>
      {data.length === 0 ? (
        <p className="chart-empty">No expenses yet.</p>
      ) : (
        <div className="spending-chart-body">
          <div className="spending-chart-pie">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart accessibilityLayer>
                <Pie
                  data={data}
                  dataKey="amount"
                  nameKey="category"
                  outerRadius="90%"
                  stroke="#fff"
                  strokeWidth={2}
                  startAngle={90}
                  endAngle={-270}
                  isAnimationActive={false}
                />
                <Tooltip content={<SpendingTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="chart-legend">
            {data.map(({ category, amount, share, fill }) => (
              <li key={category}>
                <span className="chart-legend-swatch" style={{ background: fill }} />
                <span className="chart-legend-label">{category}</span>
                <span className="chart-legend-value">{formatCurrency(amount)}</span>
                <span className="chart-legend-share">{share}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SpendingChart
