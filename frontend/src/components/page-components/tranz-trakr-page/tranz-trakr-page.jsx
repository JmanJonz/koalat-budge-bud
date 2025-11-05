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
  const [subCats, setSubCats] = useState([]);
  const [formData, setFormData] = useState({
    type : transType,
    category_id : null,
    sub_category_id : null,
    user_id : null,
    household_id : null,
    amount : 0

  })
  const currentUser = useAtomValue(currentUserAtom)

  // Helper variable to check if the user is authenticated (assuming user has a unique _id)
    // This will be null/false on the first render, and true/object on the second render.
    const userIsAuthenticated = currentUser && currentUser._id;

  useEffect(() => {
    console.log("in transtrackerpage useeffect running on pre render... here is data set using jotai atom for current user", currentUser)
    if (currentUser) {
      const fetchCategories = async () => {
      try {
        const response = await fetch(`${BACKEND_TARGET_URL}/gateways/category/get-cats`, {
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
    }
  }, [userIsAuthenticated, currentUser])

  // fetch the sub categories when category selected
    useEffect(() => {
      console.log("cat id selected changed now you can fetch sub cat data")
      if (categories.length >= 1) {
      const fetchSubCats = async () => {
      try {
        console.log("cat id before sending subcat req with it", formData)
        const response = await fetch(`${BACKEND_TARGET_URL}/gateways/sub-cats/get-all?parentCatID=${formData.category_id}`, {
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
          console.log("subcat data before .subcat on it", data)
          console.log("subcat data", data.subCats)
          setSubCats(data.subCats);
      } catch (error) {
        console.log("fetching error", error)
      }
    }

    fetchSubCats()
    }
    }, [formData])



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
          <CurrentUserFlag username={currentUser != null ? currentUser.username : ""}></CurrentUserFlag>
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
                <select onChange={updateFormData} name="category_id" id="" className={styles.categoryDropdown}>
                    <option value="" disabled selected hidden>-- Please select an option --</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>{category.category_name}</option>
                    ))}
                </select>
            </section>
            <section>
                <h4>Sub Cat</h4>
                <select onChange={updateFormData} name="subCategory" id="" className={styles.categoryDropdown}>
                  <option value="" disabled selected hidden>-- Please select an option --</option>
                  {subCats.map((sCat) => {
                    return <option key={sCat._id} value={sCat.sub_category_name}>{sCat.sub_category_name}</option>
                  })}
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
