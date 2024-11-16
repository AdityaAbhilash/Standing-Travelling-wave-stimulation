import React from 'react';
import { Outlet, Router } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar';

function App() {
  return (
    <Router basename="/Standing-Travelling-wave-stimulation">
    <div className="App">
      <Outlet />
      </div>
      </Router>
  )
}

export default App
