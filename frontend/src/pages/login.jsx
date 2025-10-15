import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className = "login-page" >
            <h2 className = "login-title">Login</h2>
            <form className = "login-form" onSubmit = {handleSubmit}>
                <label>Username:</label>
                <input
                type = "text"
                value = {username}
                onChange = {(e) => setUsername(e.target.value)}
                required
            />
            <br />
            <label>Password:</label>
            <input
            type = "password"
            value = {password}
            onChange = {(e) => setPassword(e.target.value)}
            required
            />
            <br />
            <button type = "submit">Login</button>
            </form>
            <p>Don't have an account? <Link to = "/register">Register here</Link></p>
        </div>
    );
}

export default Login;