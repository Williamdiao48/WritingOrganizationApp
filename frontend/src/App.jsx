import React, { useEffect, useState } from 'react'
import Home from "./pages/home";
import Navbar from "./pages/navbar";
import { Outlet } from "react-router-dom";
import "./App.css"

function App() {
  return(
    <div className = "app-container">
      <Navbar />

      <div className = "main-content">
        <Outlet />
      </div>
    </div>

  )
}


export default App
