import React, { useEffect, useState } from 'react'
import Home from "./pages/home";
import { Outlet } from "react-router-dom";
import "./App.css"

function App() {
  return(
    <Outlet />
  )
}


export default App
