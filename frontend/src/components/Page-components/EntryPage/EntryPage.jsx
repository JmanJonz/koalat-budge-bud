import React, { useState } from 'react'
import styles from "./EntryPage.module.css"

export const EntryPage = () => {
  const [transType, setTransType] = useState(null);
  return (
    <div className={styles.componentContainer}>
        <form className={styles.formcontainer}>
          <h2>Add New Transaction</h2>
          <img className={styles.logo} src="/logo.png" alt="logo" />
            <section>
                <h4>Transaction Type</h4>
                <div className={styles.transTypeButtonsContainer}>
                  <button className={`${styles.transButtons} ${transType === "income" ? styles.buttonSelected : ""}`} onClick={()=>{setTransType("income")}} type='button'>Income</button>
                  <button className={`${styles.transButtons} ${transType === "expense" ? styles.buttonSelected : ""}`} onClick={()=>{setTransType("expense")}} type='button'>Expense</button>
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
