import React from 'react';
import { Outlet, Router } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar';

function App() {
  return (
    
    <div className="App">
      <Outlet />
      </div>
      
  )
}

export default App
