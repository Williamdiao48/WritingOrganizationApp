import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/register.css"

function Register(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const handleSubmit = (e) => {
        e.preventDefault();
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
                    onChange = {(e) => setUsername(e.target.value)}
                    required
                />
                <br/>
                <button type = "submit">Register</button>
            </form>
            <p>Already have an account? <Link to = "/login">Login here</Link></p>
        </div>
    );   
}




export default Register;