import React, { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { currentUserAtom } from '../../../atoms';
import { apiClient } from '../../../utils/api-client';
import { Link } from 'react-router-dom';
import styles from './transaction-list.module.css';

export const TransactionList = () => {
  const currentUser = useAtomValue(currentUserAtom);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    category_id: '',
    startDate: '',
    endDate: ''
  });
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [householdInfo, setHouseholdInfo] = useState(null);
  const [isHouseholdOwner, setIsHouseholdOwner] = useState(false);

  // Fetch household info to determine if user is owner
  useEffect(() => {
    const fetchHouseholdInfo = async () => {
      const result = await apiClient.getHouseholdInfo();
      if (result.success && result.data.household) {
        setHouseholdInfo(result.data.household);
        setIsHouseholdOwner(result.data.household.isOwner);
      }
    };
    if (currentUser) {
      fetchHouseholdInfo();
    }
  }, [currentUser]);

  // Fetch categories for filter dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      const result = await apiClient.getCategories();
      if (result.success) {
        setCategories(result.data.categories);
      }
    };
    fetchCategories();
  }, []);

  // Fetch transactions
  const fetchTransactions = async () => {
    setLoading(true);
    const queryFilters = {};
    if (filters.type) queryFilters.type = filters.type;
    if (filters.category_id) queryFilters.category_id = filters.category_id;
    if (filters.startDate) queryFilters.startDate = filters.startDate;
    if (filters.endDate) queryFilters.endDate = filters.endDate;

    const result = await apiClient.getTransactions(queryFilters);
    if (result.success) {
      setTransactions(result.data.transactions);
    } else {
      console.error("Failed to fetch transactions:", result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (currentUser) {
      fetchTransactions();
    }
  }, [currentUser, filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    const result = await apiClient.deleteTransaction(id);
    if (result.success) {
      alert("Transaction deleted successfully!");
      fetchTransactions();
    } else {
      alert("Failed to delete transaction: " + result.error);
    }
  };

  const startEdit = (transaction) => {
    setEditingId(transaction._id);
    setEditData({
      amount: transaction.amount,
      type: transaction.type,
      category_id: transaction.category_id._id,
      sub_category_id: transaction.sub_category_id._id,
      notes: transaction.notes || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async (id) => {
    const result = await apiClient.updateTransaction(id, editData);
    if (result.success) {
      alert("Transaction updated successfully!");
      setEditingId(null);
      fetchTransactions();
    } else {
      alert("Failed to update transaction: " + result.error);
    }
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  // Check if current user can edit/delete a transaction
  const canModifyTransaction = (transaction) => {
    if (!currentUser || !transaction.user_id) return false;
    
    // User owns the transaction - convert both to strings for comparison
    const ownsTransaction = String(transaction.user_id._id) === String(currentUser.userId);
    
    // User is household owner
    const isOwner = isHouseholdOwner;
    
    return ownsTransaction || isOwner;
  };

  if (loading) {
    return <div className={styles.loading}>Loading transactions...</div>;
  }

  return (
    <div className={styles.container}>
      <h2>Transaction History</h2>
      <Link to="/menu-page" className={styles.menuLink}>
        <img className={styles.logo} src="/512ktbudgebudiconlogo.png" alt="logo" />
      </Link>
      
      {/* Filters */}
      <div className={styles.filters}>
        <select name="type" value={filters.type} onChange={handleFilterChange} className={styles.filterInput}>
          <option value="">All Types</option>
          <option value="inflow">Inflow</option>
          <option value="outflow">Outflow</option>
        </select>

        <select name="category_id" value={filters.category_id} onChange={handleFilterChange} className={styles.filterInput}>
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.category_name}</option>
          ))}
        </select>

        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className={styles.filterInput}
          placeholder="Start Date"
        />

        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className={styles.filterInput}
          placeholder="End Date"
        />

        <button onClick={() => setFilters({ type: '', category_id: '', startDate: '', endDate: '' })} className={styles.clearButton}>
          Clear Filters
        </button>
      </div>

      {/* Transaction List */}
      <div className={styles.transactionList}>
        {transactions.length === 0 ? (
          <p className={styles.emptyMessage}>No transactions found. Start tracking!</p>
        ) : (
          transactions.map(transaction => (
            <div key={transaction._id} className={`${styles.transactionCard} ${styles[transaction.type]}`}>
              {editingId === transaction._id ? (
                // Edit Mode
                <div className={styles.editMode}>
                  <input
                    type="number"
                    name="amount"
                    value={editData.amount}
                    onChange={handleEditChange}
                    className={styles.editInput}
                    step="0.01"
                  />
                  <input
                    type="text"
                    name="notes"
                    value={editData.notes}
                    onChange={handleEditChange}
                    className={styles.editInput}
                    placeholder="Notes"
                  />
                  <div className={styles.editButtons}>
                    <button onClick={() => saveEdit(transaction._id)} className={styles.saveButton}>Save</button>
                    <button onClick={cancelEdit} className={styles.cancelButton}>Cancel</button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className={styles.transactionHeader}>
                    <span className={styles.amount}>
                      {transaction.type === 'inflow' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </span>
                    <span className={styles.date}>
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={styles.transactionDetails}>
                    <span className={styles.category}>
                      {transaction.category_id?.category_name} → {transaction.sub_category_id?.sub_category_name}
                    </span>
                    {transaction.notes && <span className={styles.notes}>{transaction.notes}</span>}
                    <span className={styles.user}>By: {transaction.user_id?.username}</span>
                  </div>
                  {canModifyTransaction(transaction) && (
                  <div className={styles.actions}>
                    <button onClick={() => startEdit(transaction)} className={styles.editButton}>Edit</button>
                    <button onClick={() => handleDelete(transaction._id)} className={styles.deleteButton}>Delete</button>
                  </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
