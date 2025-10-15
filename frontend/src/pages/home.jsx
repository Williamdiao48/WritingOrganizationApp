import { Link } from "react-router-dom";

function Home(){
    return (
        <div>
            <h1>Welcome to your Writing App</h1>
            <p>This is the homem page.</p>


            <Link to = "/login">
                <button>Login</button>
            </Link>
        </div>
    );

}

export default Home;