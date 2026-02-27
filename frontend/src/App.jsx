import React, { useState } from 'react'
import Navbar from "./pages/navbar";
import { Outlet } from "react-router-dom";
import "./App.css"

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  return(
    <div className="app-container">
      <Navbar user={user} setUser={setUser}/>
      <div className="main-content">
        <Outlet context={{user, setUser}}/>
      </div>
    </div>
  )
}

export default App
