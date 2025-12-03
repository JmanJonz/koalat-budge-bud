
const BACKEND_TARGET_URL = import.meta.env.VITE_BACKEND_TARGET_URL;
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { TranzTrakrPage } from './components/page-components/tranz-trakr-page/tranz-trakr-page.jsx';
import { MenuPage } from './components/page-components/menu-page/menu-page';
import { LoginPage } from "./components/page-components/login-page/login-page";
import { TransactionList } from './components/page-components/transaction-list/transaction-list.jsx';
import { Dashboard } from './components/page-components/dashboard/dashboard.jsx';
import { CategoryManager } from './components/page-components/category-manager/category-manager.jsx';
import { HouseholdManager } from './components/page-components/household-manager/household-manager.jsx';
import { ProtectedRoute } from './components/reusable-components/protected-route/ProtectedRoute.jsx';
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
              const response = await fetch(`${BACKEND_TARGET_URL}/gateways/user/current-user-info`, {
                credentials: 'include' // won't send http only cookies without this!!
              });

              if (response.ok) {
                // was successful... do what you want with it after you parse the json
                  const data = await response.json();
                  // do something with the data
                    console.log("current logged in user data from app render", data)
                  // store logged in user in a global storage
                    setCurrentUserData(data);
                  // this is currentuserdata state as accessed from jotai atom
                    console.log(currentUserData, "this is the data from atom")

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
        <Route path="/login-page" element={<LoginPage/>}/>
        <Route path="/" element={
          <ProtectedRoute>
            <TranzTrakrPage/>
          </ProtectedRoute>
        }/>
        <Route path="/menu-page" element={
          <ProtectedRoute>
            <MenuPage/>
          </ProtectedRoute>
        }/>
        <Route path="/transaction-list" element={
          <ProtectedRoute>
            <TransactionList/>
          </ProtectedRoute>
        }/>
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }/>
        <Route path="/category-manager" element={
          <ProtectedRoute>
            <CategoryManager/>
          </ProtectedRoute>
        }/>
        <Route path="/household-manager" element={
          <ProtectedRoute>
            <HouseholdManager/>
          </ProtectedRoute>
        }/>
        {/* Catch-all route for invalid paths */}
        <Route path="*" element={<Navigate to="/login-page" replace />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
