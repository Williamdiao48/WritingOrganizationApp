import React, { useEffect, useState } from 'react'
import Home from "./pages/home";
import { Outlet } from "react-router-dom";
import "./App.css"

function App() {
  return(
    <div>
      <h1>This the main page</h1>
      <Outlet></Outlet>
    </div>

  )
}


export default App
