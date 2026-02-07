import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from "./pages/home.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Dashboard from "./pages/dashboard.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<App />}>
          <Route index element = {<Home />} />
          <Route path = "/login" element = {<Login />} />
          <Route path = "/register" element ={<Register />} /> 
          <Route path = "/dashboard" element = {<Dashboard/>} />
      </Route>
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
