import React, { useState } from 'react'
import styles from "./TranzTrakr.module.css"

export const TranzTrakr = () => {
  const [transType, setTransType] = useState(null);
  return (
    <div className={styles.componentContainer}>
        <form className={styles.formcontainer}>
          <h2>Tranz Trakr</h2>
          <img className={styles.logo} src="/512ktbudgebudiconlogo.png" alt="logo" />
            <section>
                <div className={styles.transTypeButtonsContainer}>
                  <button className={`${styles.transButtons} ${transType === "inflow" ? styles.buttonSelected : ""}`} onClick={()=>{setTransType("inflow")}} type='button'>Inflow</button>
                  <button className={`${styles.transButtons} ${transType === "outflow" ? styles.buttonSelected : ""}`} onClick={()=>{setTransType("outflow")}} type='button'>Outflow</button>
                </div>
            </section>
            <section>
                <h4>Cat</h4>
                <select name="category" id="" className={styles.categoryDropdown}>
                    <option value="" disabled selected hidden>-- Please select an option --</option>
                  <option value="basic-needs">Basic Needs</option>
                  <option value="serving-those-in-need">Serving Those In Need</option>
                  <option value="enjoying-life-now">Enjoying Life Now</option>
                  <option value="investing-in-a-better-future">Investing In A Better Future</option>
                </select>
            </section>
            <section>
                <h4>Sub Cat</h4>
                <select name="category" id="" className={styles.categoryDropdown}>
                    <option value="" disabled selected hidden>-- Please select an option --</option>
                  <option value="groceries">Groceries</option>
                  <option value="gas">Gas</option>
                  <option value="charity">Charity</option>
                  <option value="tithing">Tithing</option>
                  <option value="airbnb">Airbnb</option>
                  <option value="fun">Fun</option>
                  <option value="misc">Misc</option>
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
