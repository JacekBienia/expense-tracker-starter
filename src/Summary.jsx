import { formatCurrency } from './format';

function Summary({ transactions }) {
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  let headline;
  if (totalIncome === 0 && totalExpenses === 0) {
    headline = "Nothing logged yet. Add your first transaction to see where your money goes.";
  } else if (balance >= 0) {
    headline = `You've kept ${formatCurrency(balance)} of the ${formatCurrency(totalIncome)} that came in.`;
  } else {
    headline = `You've spent ${formatCurrency(-balance)} more than came in.`;
  }

  const scale = Math.max(totalIncome, totalExpenses) || 1;
  const keptShare = (Math.max(balance, 0) / scale) * 100;
  const spentShare = (totalExpenses / scale) * 100;

  return (
    <section className="summary" aria-label="Summary">
      <p className="summary-headline">{headline}</p>

      <div
        className="flow-bar"
        role="img"
        aria-label={`Kept ${formatCurrency(Math.max(balance, 0))}, spent ${formatCurrency(totalExpenses)}`}
      >
        {keptShare > 0 && <span className="flow-kept" style={{ width: `${keptShare}%` }} />}
        {spentShare > 0 && <span className="flow-spent" style={{ width: `${spentShare}%` }} />}
      </div>

      <dl className="summary-figures">
        <div>
          <dt><span className="dot dot-kept" />Came in</dt>
          <dd>{formatCurrency(totalIncome)}</dd>
        </div>
        <div>
          <dt><span className="dot dot-spent" />Went out</dt>
          <dd>{formatCurrency(totalExpenses)}</dd>
        </div>
        <div>
          <dt>Balance</dt>
          <dd className={balance < 0 ? "negative" : undefined}>{formatCurrency(balance)}</dd>
        </div>
      </dl>
    </section>
  );
}

export default Summary
