import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { API } from "../lib/api.js";
import "../styles/login.css";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }
        try {
            const response = await fetch(`${API}/api/users/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess(true);
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setMessage(data.message || "Reset failed. The link may have expired.");
            }
        } catch (err) {
            setMessage("Server error. Please try again later.");
        }
    };

    if (!token) {
        return (
            <div className="login-page">
                <h2>Invalid Link</h2>
                <p>This reset link is missing a token. Please request a new one.</p>
                <p><Link to="/forgot-password">Request new link</Link></p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="login-page">
                <h2>Password Reset</h2>
                <p>Your password has been reset. Redirecting to login...</p>
            </div>
        );
    }

    return (
        <div className="login-page">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <label>New Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                />
                <br />
                <label>Confirm New Password:</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                />
                <br />
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
