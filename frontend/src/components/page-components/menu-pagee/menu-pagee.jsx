import React from 'react'
import { Link } from 'react-router-dom'

export const MenuPage = () => {
  return (<>
    <div>MenuPage!!!</div>
    <Link style={{fontWeight: "bold"}} to={"/"}>Tranz Trakr Link!!!!</Link>
    <p>spae between</p>
    <Link style={{fontWeight: "bold"}} to={"/Login-Page"}>Login Page Link!!!!</Link>
    </>
  )
}
