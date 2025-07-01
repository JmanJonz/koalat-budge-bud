import React, { useState, useEffect } from 'react';
import styles from './EntryPage.module.css'; // Import your CSS Module

const EntryPage = () => {
    // State to manage transaction type (expense/income)
    const [transactionType, setTransactionType] = useState('expense');
    // State to manage selected category
    const [category, setCategory] = useState('');
    // State to manage the amount input value (kept as string for input control)
    const [amount, setAmount] = useState('');
    // State to manage the message box visibility and content
    const [message, setMessage] = useState({ text: '', type: 'success', visible: false });

    // Hardcoded categories
    const categoriesData = {
        expense: [
            { value: 'basic-needs', text: 'Our Basic Needs' },
            { value: 'serving-need', text: 'Serving Those In Need' },
            { value: 'enjoying-life', text: 'Enjoying Life While It Lasts' },
            { value: 'investing-future', text: 'Investing In A Better Future' }
        ],
        income: [
            { value: 'ammon-work', text: "Ammon's Work" },
            { value: 'shannon-work', text: "Shannon's Work" },
            { value: 'other-income', text: 'Other' }
        ]
    };

    /**
     * Effect to update category dropdown options and set default category
     * when `transactionType` changes.
     */
    useEffect(() => {
        const currentCategories = categoriesData[transactionType];
        if (currentCategories && currentCategories.length > 0) {
            setCategory(currentCategories[0].value); // Set default to first category
        } else {
            setCategory(''); // No categories available
        }
    }, [transactionType]); // Dependency array: re-run when transactionType changes

    /**
     * Displays a message in the message box for a short duration.
     * @param {string} msgText - The message text to display.
     * @param {string} msgType - The type of message ('success', 'error') for styling.
     */
    const showMessage = (msgText, msgType = 'success') => {
        setMessage({ text: msgText, type: msgType, visible: true });
        setTimeout(() => {
            setMessage(prev => ({ ...prev, visible: false }));
        }, 3000); // Hide after 3 seconds
    };

    /**
     * Handles the change event for transaction type radio buttons.
     * @param {Object} e - The event object.
     */
    const handleTransactionTypeChange = (e) => {
        setTransactionType(e.target.value);
    };

    /**
     * Handles the change event for the category dropdown.
     * @param {Object} e - The event object.
     */
    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    /**
     * Handles the change event for the amount input.
     * Ensures only valid non-negative numbers are stored.
     * The negative sign for expenses is handled on submission, not here.
     * @param {Object} e - The event object.
     */
    const handleAmountChange = (e) => {
        const inputValue = e.target.value;
        // Allow empty string (for user to clear input) or a valid non-negative number
        if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
            setAmount(inputValue);
        }
    };

    /**
     * Handles the form submission.
     * @param {Object} e - The event object.
     */
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default browser form submission

        let parsedAmount = parseFloat(amount);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            showMessage('Please enter a valid positive amount.', 'error');
            return;
        }

        // Apply negative sign if it's an expense
        if (transactionType === 'expense') {
            parsedAmount = -parsedAmount;
        }

        // --- Your actual logic for handling the submitted transaction goes here ---
        // For example, sending this data to a backend API or updating global state.
        console.log('Transaction Submitted:', {
            type: transactionType,
            category: category,
            amount: parsedAmount.toFixed(2) // Format to 2 decimal places
        });
        // -------------------------------------------------------------------

        // Display success message
        showMessage(
            `Transaction Added: ${parsedAmount.toFixed(2)} for ${
                categoriesData[transactionType].find(cat => cat.value === category)?.text || category
            }!`,
            'success'
        );

        // Optionally, clear the amount input after submission
        setAmount('');
    };

    return (
        // Use styles.className for CSS Module classes
        <div className={styles.formContainer}>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Add New Transaction</h2>

            <div className={styles.formGroup}>
                <label className={styles.formLabel}>Transaction Type:</label>
                <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="transactionType"
                            value="expense"
                            checked={transactionType === 'expense'}
                            onChange={handleTransactionTypeChange}
                            className={styles.radioInput}
                        />
                        Expense
                    </label>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="transactionType"
                            value="income"
                            checked={transactionType === 'income'}
                            onChange={handleTransactionTypeChange}
                            className={styles.radioInput}
                        />
                        Income
                    </label>
                </div>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="category" className={styles.formLabel}>Category:</label>
                <select
                    id="category"
                    className={styles.formSelect}
                    value={category}
                    onChange={handleCategoryChange}
                >
                    {categoriesData[transactionType].map((cat) => (
                        <option key={cat.value} value={cat.value}>
                            {cat.text}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="amount" className={styles.formLabel}>Amount:</label>
                <div className={styles.amountInputGroup}>
                    <span className={styles.amountSign}>
                        {transactionType === 'expense' ? '-' : '+'}
                    </span>
                    <input
                        type="number"
                        id="amount"
                        className={styles.amountInput}
                        placeholder="0.00"
                        min="0" // HTML5 constraint for positive numbers
                        step="0.01"
                        value={amount}
                        onChange={handleAmountChange}
                        // The user cannot remove the sign because it's a separate <span> element
                        // and the input itself only accepts positive numbers.
                    />
                </div>
            </div>

            <button
                type="submit"
                className={styles.submitButton}
                onClick={handleSubmit}
            >
                Add Transaction
            </button>

            {/* Message box, conditionally rendered based on 'visible' state */}
            {message.visible && (
                <div className={`${styles.messageBox} ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};

export {EntryPage};
