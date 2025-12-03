import React from 'react'
import { Link } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../../../atoms'
import { CurrentUserFlag } from '../../reusable-components/current-user-flag/current-user-flag'
import styles from './menu-page.module.css'

export const MenuPage = () => {
  const currentUser = useAtomValue(currentUserAtom);

  return (
    <div className={styles.menuContainer}>
      <CurrentUserFlag username={currentUser?.username || ""} />
      <img 
        src="/512ktbudgebudiconlogo.png" 
        alt="logo" 
        className={styles.logo}
      />
      
      <div className={styles.linkContainer}>
        <Link className={styles.menuLink} to={"/"}>
          Track Transaction
        </Link>

        <Link className={styles.menuLink} to={"/transaction-list"}>
          Transaction History
        </Link>

        <Link className={styles.menuLink} to={"/dashboard"}>
          Dashboard & Analytics
        </Link>

        <Link className={styles.menuLink} to={"/category-manager"}>
          Manage Categories
        </Link>

        <Link className={styles.menuLink} to={"/household-manager"}>
          Household Manager
        </Link>

        <Link className={styles.menuLink} to={"/login-page"}>
          Account
        </Link>
      </div>
    </div>
  )
}
