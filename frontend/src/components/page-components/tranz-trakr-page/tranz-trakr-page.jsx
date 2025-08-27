import React, { useEffect, useState } from 'react'
import styles from "./tranz-trakr-page.module.css"
import { Link } from 'react-router-dom';
import { currentUserAtom } from '../../../atoms';
import { useAtomValue } from 'jotai';
import { CurrentUserFlag } from '../../reusable-components/current-user-flag/current-user-flag';
const BACKEND_TARGET_URL = import.meta.env.VITE_BACKEND_TARGET_URL;



export const TranzTrakrPage = () => {
  const [transType, setTransType] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    type : transType,
    category_id : null,
    sub_category_id : null,
    user_id : null,
    household_id : null,
    amount : 0

  })
  const currentUser = useAtomValue(currentUserAtom)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BACKEND_TARGET_URL}/gates/category/get-cats`, {
          method: "GET",
          credentials: "include"
        })

        // check if response was successful
          if (!response.ok) {
            throw new Error(
              "HTTP Error when getting categories on frontend"
            )
          }
        
        // await the parsed data
          const data = await response.json();
          setCategories(data.categories);
          console.log("categoriy data fetched on frontend", data)
      } catch (error) {
        console.log("fetching error", error)
      }
    }

    fetchCategories()
  }, [])



  const trackTransAction = async (event) => {
    event.preventDefault()
    console.log("Form submitted")
    for (const key in formData) {
      console.log(formData[key]);
    }
  }

  const updateFormData = (event) => {
    console.log(`event target name : ${event.target.name} & value ${event.target.value}`)
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value
    }))
  }
  return (
    <div className={styles.componentContainer}>
        <form onSubmit={trackTransAction} className={styles.formcontainer}>
          <CurrentUserFlag username={currentUser != null ? currentUser.username : "hey"}></CurrentUserFlag>
          <h2>Tranz Trakr</h2>
          <Link to={"/Menu-Page"}><img className={styles.logo} src="/512ktbudgebudiconlogo.png" alt="logo" /></Link>
            <section>
                <div className={styles.transTypeButtonsContainer}>
                  <button onChange={updateFormData} name='type' className={`${styles.transButtons} ${transType === "inflow" ? styles.buttonSelected : ""}`} onClick={()=>{setTransType("inflow")}} type='button'>Inflow</button>
                  <button onChange={updateFormData} name='type' className={`${styles.transButtons} ${transType === "outflow" ? styles.buttonSelected : ""}`} onClick={()=>{setTransType("outflow")}} type='button'>Outflow</button>
                </div>
            </section>
            <section>
                <h4>Cat</h4>
                <select onChange={updateFormData} name="category" id="" className={styles.categoryDropdown}>
                    <option value="" disabled selected hidden>-- Please select an option --</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.category_name}>{category.category_name}</option>
                    ))}
                </select>
            </section>
            <section>
                <h4>Sub Cat</h4>
                <select onChange={updateFormData} name="subCategory" id="" className={styles.categoryDropdown}>
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
                <input onChange={updateFormData} name='amount' type="number" className={styles.inputAmount} />
            </section>
            <button
              className={styles.submitButton}
              type='submit'
              >Track
            </button>
        </form>
    </div>
  )
}
