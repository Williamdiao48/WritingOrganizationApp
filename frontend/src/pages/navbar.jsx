import { useNavigate, Link } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = ({user, setUser}) =>{
    const navigate = useNavigate();

    const handleSignOut = () =>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    }

    return(
        <div className="navbar">
            <div className = "logo">
                <Link to="/" className= "nav-link">Writing App</Link>
            </div>

            <div className = "links">
                <Link to = "/dashboard" className = "nav-link">Dashboard</Link> {/*Change this to dashboard later*/}

                {user? (
                    <button onClick={handleSignOut} className="signout-button">Sign Out</button>
                ):(
                    <Link to="/login" className="auth-button">Login</Link>
                )}
            </div>

        </div>
    );
};

export default Navbar;