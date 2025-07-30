import { Button } from './components/reusable-components/Button/Button'
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { TranzTrakr } from './components/Page-components/TranzTrakr/TranzTrakr';
import { TestPage } from './components/Page-components/TestPage/TestPage';
import { LoginPage } from './components/Page-components/LoginPage/LoginPage.jsx';
function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TranzTrakr/>}/>
        <Route path="/LoginPage" element={<LoginPage/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
