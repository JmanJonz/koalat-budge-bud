import React from 'react'
import styles from "./EntryPage.module.css"

export const EntryPage = () => {
  return (
    <div className={styles.componentContainer}>
        <form className={styles.formcontainer}>
          <h2>Add New Transaction</h2>
            <section>
                <h4>Transaction Type</h4>
                <div className={styles.transTypeButtonsContainer}>
                  <button className={styles.transButtons}>Income</button>
                  <button className={styles.transButtons}>Expense</button>
                </div>
            </section>
            <section>
                <h4>Category</h4>
                <select name="category" id="" className={styles.categoryDropdown}>

                </select>
            </section>
            <section>
                <h4>Amount</h4>
                <input type="number" className={styles.inputAmount} />
            </section>
        </form>
    </div>
  )
}
