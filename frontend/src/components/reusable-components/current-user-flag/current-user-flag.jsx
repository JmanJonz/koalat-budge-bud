import React from 'react'
import styles from "./styles.module.css";

export const CurrentUserFlag = ({username}) => {
  return (
    <div className={styles.flagStyles}>{username}</div>
  )
}
