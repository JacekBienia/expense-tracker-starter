import { useState } from 'react'
import { formatCurrency, formatDate } from './format';

const typeFilters = [
  { value: "all", label: "All" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expenses" },
];

function TransactionList({ transactions, categories, onDelete }) {
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  let filteredTransactions = transactions;
  if (filterType !== "all") {
    filteredTransactions = filteredTransactions.filter(t => t.type === filterType);
  }
  if (filterCategory !== "all") {
    filteredTransactions = filteredTransactions.filter(t => t.category === filterCategory);
  }
  const sortedTransactions = [...filteredTransactions].sort((a, b) => b.date.localeCompare(a.date));

  const handleDeleteClick = (t) => {
    if (window.confirm(`Delete "${t.description}" (${formatCurrency(t.amount)})?`)) {
      onDelete(t.id);
    }
  };

  const clearFilters = () => {
    setFilterType("all");
    setFilterCategory("all");
  };

  return (
    <section className="panel transactions" aria-labelledby="transactions-heading">
      <div className="transactions-header">
        <h2 id="transactions-heading">Transactions</h2>
        <span className="count">{sortedTransactions.length} of {transactions.length}</span>
      </div>

      <div className="filters">
        <fieldset className="segmented">
          <legend className="visually-hidden">Show</legend>
          {typeFilters.map(({ value, label }) => (
            <label key={value} className={filterType === value ? "is-selected" : undefined}>
              <input
                type="radio"
                name="filter-type"
                value={value}
                checked={filterType === value}
                onChange={(e) => setFilterType(e.target.value)}
              />
              {label}
            </label>
          ))}
        </fieldset>
        <label className="visually-hidden" htmlFor="filter-category">Category</label>
        <select
          id="filter-category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat[0].toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>
      </div>

      {sortedTransactions.length === 0 ? (
        <div className="empty-state">
          <p>
            {transactions.length === 0
              ? "No transactions yet. Add one to start tracking."
              : "No transactions match these filters."}
          </p>
          {transactions.length > 0 && (
            <button type="button" className="text-btn" onClick={clearFilters}>Clear filters</button>
          )}
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Description</th>
              <th scope="col" className="col-category">Category</th>
              <th scope="col" className="col-amount">Amount</th>
              <th scope="col"><span className="visually-hidden">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map(t => (
              <tr key={t.id}>
                <td className="cell-date">{formatDate(t.date)}</td>
                <td>
                  <span className="cell-description">{t.description}</span>
                  <span className="cell-meta">{t.category}</span>
                </td>
                <td className="col-category cell-category">{t.category}</td>
                <td className={`col-amount ${t.type === "income" ? "amount-income" : "amount-expense"}`}>
                  {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
                </td>
                <td className="cell-action">
                  <button
                    type="button"
                    className="delete-btn"
                    aria-label={`Delete ${t.description}`}
                    onClick={() => handleDeleteClick(t)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default TransactionList
