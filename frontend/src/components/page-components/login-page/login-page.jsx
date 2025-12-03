import React, { useState, useEffect } from 'react'
import styles from "./login-page.module.css"
import { Link, useNavigate } from 'react-router-dom';
import { currentUserAtom } from '../../../atoms';
import { useAtom } from 'jotai';
import { DropDownMessage } from '../../reusable-components/drop-down-message.jsx';
import { apiClient } from '../../../utils/api-client.js';
const BACKEND_TARGET_URL = import.meta.env.VITE_BACKEND_TARGET_URL;


export const LoginPage = () => {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [accountActionType, setaccountActionType] = useState("login"); // built code delete this comment
  const [formData, setFormData] = useState({
    "username" : "",
    "email" : "",
    "password" : "",
    "confirmPassword" : ""
  });
  const [currentUserData,setCurrentUserData] = useAtom(currentUserAtom);

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

      const result = await apiClient.createAccount(formData.userName, formData.email, formData.password);
      
      if (result.success) {
        console.log("Account created:", result.data);
        setaccountActionType("login");
        setServerMessage("Account created successfully! Please login.");
      } else {
        console.error("Account creation error:", result.error);
        setServerMessage(result.error || "Failed to create account");
      }
    } else if (accountActionType === "login") {
      setServerMessage("Logging in...");
      
      const result = await apiClient.login(formData.email, formData.password);
      
      if (result.success) {
        console.log("Login success:", result.data);
        // Fetch full user info and update global state
        const userInfo = await apiClient.getCurrentUser();
        if (userInfo.success) {
          setCurrentUserData(userInfo.data);
          setServerMessage(`Logged In As ${userInfo.data.username}`);
          // Redirect to transaction tracker after a brief delay
          setTimeout(() => navigate('/'), 1000);
        } else {
          // If we can't get user info, still redirect but without setting user data
          console.error("Failed to get user info:", userInfo.error);
          setServerMessage("Login successful, redirecting...");
          setTimeout(() => navigate('/'), 1000);
        }
      } else {
        console.error("Login error:", result.error);
        // Provide more specific error messages
        if (result.error && result.error.includes("fetch")) {
          setServerMessage("Unable to connect to server. Please ensure the backend is running.");
        } else if (result.error && result.error.includes("credentials")) {
          setServerMessage("Invalid email or password. Please try again.");
        } else {
          setServerMessage(result.error || "Login failed. Please check your credentials and try again.");
        }
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
            >{accountActionType === "login" ? "Login" : "Create"}</button>
            <DropDownMessage message={serverMessage}></DropDownMessage>
        </form>
    </div>
    
  )
}
