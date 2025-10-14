import React, { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5050/")   // backend test route
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => console.error(err));
  }, []);

  return <div>{message}</div>;
}


export default App
