import React, { useEffect, useState } from 'react'
import Home from "./pages/home";
import Navbar from "./pages/navbar";
import { Outlet } from "react-router-dom";
import "./App.css"

function App() {
  const [user, setUser] = useState(null);

  return(
    <div className = "app-container">
      <Navbar user = {user} setUser = {setUser}/>

      <div className = "main-content">
        <Outlet context = {{user, setUser}}/>
      </div>
    </div>

  )
}


export default App
