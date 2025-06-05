import { Button } from './components/reusable-components/Button/Button'
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { EntryPage } from './components/Page-components/EntryPage/EntryPage';
import { TestPage } from './components/Page-components/TestPage/TestPage';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EntryPage/>}/>
        <Route path="/test" element={<TestPage/>}/> 
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
