import { Button } from './components/reusable-components/Button/Button'
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { TranzTrakrPage } from './components/page-components/tranz-trakr-pagee/tranz-trakr-pagee.jsx';
import { MenuPage } from './components/page-components/menu-pagee/menu-pagee.jsx';
import { LoginPage } from "./components/page-components/login-pagee/login-pagee.jsx"
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
