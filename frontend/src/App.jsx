import React, { useState } from 'react'
import Navbar from "./pages/navbar";
import { Outlet } from "react-router-dom";
import "./App.css"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled render error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  return(
    <div className="app-container">
      <Navbar user={user} setUser={setUser}/>
      <div className="main-content">
        <ErrorBoundary>
          <Outlet context={{user, setUser}}/>
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
