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
        <Route path="/menu-page" element={<MenuPage/>}/>
        <Route path="/login-page" element={<LoginPage/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
