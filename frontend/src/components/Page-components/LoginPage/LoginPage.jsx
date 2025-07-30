import React, { useState } from 'react'
import styles from "./LoginPage.module.css"
export const LoginPage = () => {
  const [accountActionType, setaccountActionType] = useState("login"); // built code delete this comment
  return (
    <div className={styles.componentContainer}>
        <form className={styles.formcontainer}>
          <h2>Account</h2>
          <img className={styles.logo} src="/512ktbudgebudiconlogo.png" alt="logo" />
            <section>
                <div className={styles.accountActionTypeButtonsContainer}>
                  <button className={`${styles.transButtons} ${accountActionType === "login" ? styles.buttonSelected : ""}`} onClick={()=>{setaccountActionType("login")}} type='button'>Login</button>
                  <button className={`${styles.transButtons} ${accountActionType === "create" ? styles.buttonSelected : ""}`} onClick={()=>{setaccountActionType("create")}} type='button'>Create Account</button>
                </div>
            </section>
            {accountActionType === "create"
            ? <section>
                <h4>Username</h4>
                <input type="text" />
            </section>
            : ""}
            <section>
                <h4>Email</h4>
                <input type="email" />
            </section>
            <section>
                <h4>Password</h4>
                <input type="password" />
            </section>
            {accountActionType === "create" ? <section>
                <h4>Confirm Password</h4>
                <input type="password" />
            </section> : ""}
        </form>
    </div>
  )
}
