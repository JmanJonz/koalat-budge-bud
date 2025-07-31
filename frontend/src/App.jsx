import { Button } from './components/reusable-components/button/button.jsx'
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { TranzTrakrPage } from './components/page-components/tranz-trakr-page/tranz-trakr-page.jsx';
import { MenuPage } from './components/page-components/menu-page/menu-page';
import { LoginPage } from "./components/page-components/login-page/login-page";
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
