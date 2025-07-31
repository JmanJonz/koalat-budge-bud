import { Button } from './components/reusable-components/Button/Button'
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { TranzTrakrPage } from './components/page-components/Tranz-Trakr-Page/Tranz-Trakr-Page.jsx';
import { MenuPage } from './components/page-components/menu-page/Menu-Page.jsx';
import { LoginPage } from "./components/page-components/login-page/login-page.jsx"
function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TranzTrakrPage/>}/>
        <Route path="/Menu-Page" element={<MenuPage/>}/>
        <Route path="/Login-Page" element={<LoginPage/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
