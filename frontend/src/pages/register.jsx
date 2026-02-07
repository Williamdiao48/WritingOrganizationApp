import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/register.css"

function Register(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

    try {
        const response = await fetch("http://localhost:5050/api/users/register", { 
            method: "POST", //sends new data
            headers: { "Content-Type":"application/json"}, //informs backend its json
            body: JSON.stringify({ username, password}), //modifies javascript object into json string to send it
        });
        
        const data = await response.json(); //read json body

        if (response.ok) {
            setMessage(data.message);
            navigate("/login");}
        else{
            setMessage(data.message || "Registration failed");}}
        catch (err) {
            setMessage("Server error. Please try again later");
        }
};

    return (
        <div className = "register-container"> 
            <h2>Register</h2>
            <form className = "register-form" onSubmit = {handleSubmit}>
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
                <br/>
                <button type = "submit">Register</button>
            </form>
            <p>Already have an account? <Link to = "/login">Login here</Link></p>
            {message && <p>{message}</p>}
        </div>
    );   
}
export default Register;