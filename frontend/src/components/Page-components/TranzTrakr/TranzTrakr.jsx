import React, { useState } from 'react'
import styles from "./TranzTrakr.module.css"

export const TranzTrakr = () => {
  const [transType, setTransType] = useState(null);
  return (
    <div className={styles.componentContainer}>
        <form className={styles.formcontainer}>
          <h2>Tranz Trakr</h2>
          <img className={styles.logo} src="/logo.png" alt="logo" />
            <section>
                <div className={styles.transTypeButtonsContainer}>
                  <button className={`${styles.transButtons} ${transType === "inflow" ? styles.buttonSelected : ""}`} onClick={()=>{setTransType("inflow")}} type='button'>Inflow</button>
                  <button className={`${styles.transButtons} ${transType === "outflow" ? styles.buttonSelected : ""}`} onClick={()=>{setTransType("outflow")}} type='button'>Outflow</button>
                </div>
            </section>
            <section>
                <h4>Cat</h4>
                <select name="category" id="" className={styles.categoryDropdown}>

                </select>
            </section>
            <section>
                <h4>Sub Cat</h4>
                <select name="category" id="" className={styles.categoryDropdown}>

                </select>
            </section>
            <section>
                <h4>Mount</h4>
                <input type="number" className={styles.inputAmount} />
            </section>
        </form>
    </div>
  )
}
