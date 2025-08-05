import React, { useState, useEffect } from 'react'
import styles from "./login-page.module.css"
import { Link } from 'react-router-dom';
const BACKEND_TARGET_URL = import.meta.env.VITE_BACKEND_TARGET_URL;


export const LoginPage = () => {
  const [formErrors, setFormErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [accountActionType, setaccountActionType] = useState("login"); // built code delete this comment
  const [formData, setFormData] = useState({
    "username" : "",
    "email" : "",
    "password" : "",
    "confirmPassword" : ""
  });

  // tempoary logs
    	// This effect runs every time the formData state changes
    useEffect(() => {
      console.log("The form data has been updated:", formData);
    }, [formData]); // The dependency array tells useEffect to run when formData changes

  const loginOrCreateAccount = async (eventData) => {
    eventData.preventDefault()
    console.log("form submitted")

    if (accountActionType === "create") {
      setFormErrors({});
      setServerMessage("");

      if (formData.password !== formData.confirmPassword) {
        setFormErrors({confirmPassword: "Passwords do not match."})
        return
      }

      try {
        const response = await fetch(`${BACKEND_TARGET_URL}/gates/user/create`, {
          method: "POST",
          headers: {
            "Content-Type" : "application/json",
          },
          body : JSON.stringify({
            username: formData.userName,
            email: formData.email,
            password: formData.password
          })
        })
        const data = await response.json();

        // check if the response was successful before processing
          if (response.ok) {
            console.log("success:", data);
            setServerMessage("Account created successfully!")
          } else {
            // handle server-side validation or other errors
              console.error("error", data)
          }
      } catch (error) {
        // catch and handle any network or unexpected errors
          console.error("fetch error:", error);
          setServerMessage("A network error occurred. Please try again.")
      }
    } else if (accountActionType === "login") {
      try {
        const response = await fetch(`${BACKEND_TARGET_URL}/gates/user/login`, {
          method: "POST",
          headers: {
            "Content-Type" : "application/json",
          },
          body : JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        })
        const data = await response.json();

        // check if the response was successful before processing
          if (response.ok) {
            console.log("success:", data);
            setServerMessage("Successfully Logged In")
          } else {
            // handle server-side validation or other errors
              console.error("error", data)
          }
      } catch (error) {
        // catch and handle any network or unexpected errors
          console.error("fetch error:", error);
          setServerMessage("A network error occurred. Please try again.")
      }
    }
  }

  const handleFormDataChange = (eventData) => {
    const { name, value } = eventData.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value
      }
    });
  }
  return (
    <div className={styles.componentContainer}>
        <form 
        onSubmit={loginOrCreateAccount}
        className={styles.formcontainer}>
          <h2>Account</h2>
          <Link to={"/menu-page"}><img className={styles.logo} src="/512ktbudgebudiconlogo.png" alt="logo" /></Link>
            <section>
                <div className={styles.accountActionTypeButtonsContainer}>
                  <button className={`${styles.transButtons} ${accountActionType === "login" ? styles.buttonSelected : ""}`} onClick={()=>{setaccountActionType("login")}} type='button'>Login</button>
                  <button className={`${styles.transButtons} ${accountActionType === "create" ? styles.buttonSelected : ""}`} onClick={()=>{setaccountActionType("create")}} type='button'>Create Account</button>
                </div>
            </section>
            {accountActionType === "create"
            ? <section>
                <h4>Username</h4>
                <input 
                onChange={handleFormDataChange}
                value={formData.userName}
                name="userName"
                type="text" />
            </section>
            : ""}
            <section>
                <h4>Email</h4>
                <input 
                onChange={handleFormDataChange}
                value={formData.email}
                name="email"
                type="email" />
            </section>
            <section>
                <h4>Password</h4>
                <input 
                onChange={handleFormDataChange}
                value={formData.password}
                name="password"
                type="password" />
            </section>
            {accountActionType === "create" ? <section>
                <h4>Confirm Password</h4>
                <input 
                onChange={handleFormDataChange}
                value={formData.confirmPassword}
                name="confirmPassword"
                type="password" />
            </section> : ""}
            <button
            className={styles.submitButton}
            type='submit'
            >Create KoalaT Tech Account</button>
        </form>
    </div>
  )
}
