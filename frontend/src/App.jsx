
const BACKEND_TARGET_URL = import.meta.env.VITE_BACKEND_TARGET_URL;
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { TranzTrakrPage } from './components/page-components/tranz-trakr-page/tranz-trakr-page.jsx';
import { MenuPage } from './components/page-components/menu-page/menu-page';
import { LoginPage } from "./components/page-components/login-page/login-page";
import { useAtom } from 'jotai';
import { currentUserAtom } from './atoms.js';
function App() {
  // global state for the app using jotai
    let [currentUserData,setCurrentUserData] = useAtom(currentUserAtom)
  // run this when the app first loads to grab the logged in user if any data and add it to global access data to be used all over the app
    useEffect(()=> {
      // if there is a jwt it should be sent automatically with the request so try it
        // useEffect callback can't be asyn directly... wrtie asycn funcion and call it
          const fetchCurrentUserData = async () => {
            try {
              const response = await fetch(`${BACKEND_TARGET_URL}/gates/user/current-user-info`, {
                credentials: 'include' // won't send http only cookies without this!!
              });

              if (response.ok) {
                // was successful... do what you want with it after you parse the json
                  const data = await response.json();
                  // do something with the data
                    console.log("current logged in user data from app render", data)
                  // store logged in user in a global storage
                    setCurrentUserData(data);

              } else {
                console.log("No authenticated user found.")
              }
            } catch (error) {
              console.error("Network error:", error);
            }
          }
          fetchCurrentUserData();
    }, [])
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TranzTrakrPage/>}/>
        <Route path="/menu-page" element={<MenuPage/>}/>
        <Route path="/login-page" element={<LoginPage/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
