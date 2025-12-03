import React, { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { currentUserAtom } from '../../../atoms';
import { apiClient } from '../../../utils/api-client';
import { Link } from 'react-router-dom';
import { CurrentUserFlag } from '../../reusable-components/current-user-flag/current-user-flag';
import styles from './dashboard.module.css';

export const Dashboard = () => {
  const currentUser = useAtomValue(currentUserAtom);
  const [summary, setSummary] = useState(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const fetchSummary = async () => {
    setLoading(true);
    const filters = {};
    if (dateRange.startDate) filters.startDate = dateRange.startDate;
    if (dateRange.endDate) filters.endDate = dateRange.endDate;

    const result = await apiClient.getTransactionSummary(filters);
    if (result.success) {
      setSummary(result.data.summary);
      setCategoryBreakdown(result.data.categoryBreakdown);
    } else {
      console.error("Failed to fetch summary:", result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (currentUser) {
      fetchSummary();
    }
  }, [currentUser, dateRange]);

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <div className={styles.container}>
      <CurrentUserFlag username={currentUser?.username || ""} />
      <h1>Budget Dashboard</h1>
      <Link to="/menu-page" className={styles.menuLink}>
        <img className={styles.logo} src="/512ktbudgebudiconlogo.png" alt="logo" />
      </Link>

      {/* Date Range Filters */}
      <div className={styles.filters}>
        <label>
          Start Date:
          <input
            type="date"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleDateChange}
            className={styles.dateInput}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            name="endDate"
            value={dateRange.endDate}
            onChange={handleDateChange}
            className={styles.dateInput}
          />
        </label>
        <button 
          onClick={() => setDateRange({ startDate: '', endDate: '' })} 
          className={styles.clearButton}
        >
          Clear
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className={styles.summaryCards}>
          <div className={`${styles.card} ${styles.inflowCard}`}>
            <h3>Total Inflow</h3>
            <p className={styles.amount}>${summary.totalInflow.toFixed(2)}</p>
            <span className={styles.count}>{summary.inflowCount} transactions</span>
          </div>

          <div className={`${styles.card} ${styles.outflowCard}`}>
            <h3>Total Outflow</h3>
            <p className={styles.amount}>${summary.totalOutflow.toFixed(2)}</p>
            <span className={styles.count}>{summary.outflowCount} transactions</span>
          </div>

          <div className={`${styles.card} ${styles.netCard}`}>
            <h3>Net Balance</h3>
            <p className={`${styles.amount} ${summary.netBalance >= 0 ? styles.positive : styles.negative}`}>
              {summary.netBalance >= 0 ? '+' : ''}${summary.netBalance.toFixed(2)}
            </p>
            <span className={styles.count}>{summary.totalTransactions} total</span>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      <div className={styles.breakdown}>
        <h2>Spending by Category</h2>
        {categoryBreakdown.length === 0 ? (
          <p className={styles.emptyMessage}>No transaction data for this period</p>
        ) : (
          <div className={styles.categoryList}>
            {categoryBreakdown.map((item, index) => (
              <div key={index} className={styles.categoryItem}>
                <div className={styles.categoryInfo}>
                  <span className={styles.categoryName}>{item._id.category_name}</span>
                  <span className={styles.categoryType}>{item._id.type}</span>
                </div>
                <div className={styles.categoryStats}>
                  <span className={styles.categoryAmount}>
                    ${item.total.toFixed(2)}
                  </span>
                  <span className={styles.categoryCount}>
                    {item.count} transactions
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className={styles.quickLinks}>
        <Link to="/" className={styles.linkButton}>Track New Transaction</Link>
        <Link to="/transaction-list" className={styles.linkButton}>View All Transactions</Link>
      </div>
    </div>
  );
};
