import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { currentUserAtom } from '../../../atoms';
import { apiClient } from '../../../utils/api-client';
import styles from "./styles.module.css";

export const CurrentUserFlag = ({username}) => {
  const navigate = useNavigate();
  const setCurrentUser = useSetAtom(currentUserAtom);

  const handleLogout = async () => {
    const result = await apiClient.logout();
    if (result.success) {
      setCurrentUser(null);
      navigate('/login-page');
    } else {
      console.error("Logout error:", result.error);
    }
  };

  return (
    <div className={styles.flagContainer}>
      <div className={styles.flagStyles}>{username}</div>
      <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
    </div>
  )
}
