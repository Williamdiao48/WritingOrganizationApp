import { useNavigate, Link } from "react-router-dom";

const Navbar = () =>{
    const navigate = useNavigate();

    const handleSignOut = () =>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    }

    return(
        <div className="navbar">
            <div className = "logo">
                <Link to="/" className= "nav-link">Writing App</Link>
            </div>

            <div className = "links">
                <Link to = "/home" className = "nav-link">Home</Link> {/*Change this to dashboard later*/}
                <button onClick={handleSignOut} className="signout-button">Sign Out</button>
            </div>

        </div>
    );
};

export default Navbar;