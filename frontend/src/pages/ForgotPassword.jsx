import { useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../lib/api.js";
import "../styles/login.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${API}/api/users/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            // Always show the same message to prevent email enumeration
            setSubmitted(true);
        } catch (err) {
            setMessage("Server error. Please try again later.");
        }
    };

    if (submitted) {
        return (
            <div className="login-page">
                <h2>Check your email</h2>
                <p>If that email is registered, you will receive a password reset link shortly.</p>
                <p><Link to="/login">Back to Login</Link></p>
            </div>
        );
    }

    return (
        <div className="login-page">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <label>Email address:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send Reset Link</button>
            </form>
            {message && <p>{message}</p>}
            <p><Link to="/login">Back to Login</Link></p>
        </div>
    );
}
