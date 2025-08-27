import React from 'react'
import styles from "./drop-down-message.module.css";

export const DropDownMessage = ({message}) => {
  return (
    <div className={styles.messageStyles}>{message}</div>
  )
}
