import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contesto/AuthContext.jsx";
import './Navbar.css';

export default function Navbar() {
    const { token, isAdmin, elimina_contesto } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        elimina_contesto();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-gruppo">
                <Link className="navbar-link" to="/">Home</Link>
                {isAdmin && (
                    <Link className="navbar-link" to="/modifica-post">Crea Post</Link>
                )}
            </div>
            <div>
                <Link className="navbar-titolo" to="/">REFILM</Link>
            </div>
            <div>
                {token ? (
                    <>
                        <Link className="navbar-link" to="/profile">Profilo</Link>
                        <button type="button" className="bottone-navbar" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link className="navbar-link" to="/login">Login</Link>
                        <Link className="navbar-link" to="/registrazione">Registrati</Link>
                    </>
                )}
            </div>
        </nav>
    );
}