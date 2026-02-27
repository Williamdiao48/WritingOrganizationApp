import { useState } from "react";
import { useNavigate, Link, useOutletContext } from "react-router-dom";
import { API } from "../lib/api.js";
import "../styles/login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const {setUser} = useOutletContext();
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();

    try{
        const response = await fetch(`${API}/api/users/login`, {
            method: "POST",
            headers: { "Content-type": "application/json"},
            body: JSON.stringify({ username, password}),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token)
            localStorage.setItem("user", JSON.stringify(data.user));
            setMessage(data.message);
            setUser(data.user);
            navigate("/");}
        else{
            setMessage(data.message || "Login Failed");}}
        catch (err) {
            setMessage("Server error. Please try again later")
        }
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
            {message && <p>{message}</p>}
            <p><Link to="/forgot-password">Forgot password?</Link></p>
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
    );
}

export default Login;