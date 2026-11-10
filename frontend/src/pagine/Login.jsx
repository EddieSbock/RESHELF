import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contesto/AuthContext.jsx';
import { loginUser } from '../api/auth';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errore, setErrore] = useState(null);

    const navigate = useNavigate();
    const { crea_contesto } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrore(null);

        try {
            const risposta = await loginUser(email, password);
            crea_contesto(risposta.token, risposta.user);
            navigate("/");
        } catch (err) {
            console.error(err);
            setErrore(err.response?.data?.message || "Email o password errati");
        }
    };

    return (
        <div className="login-container">
            <h1 className="titolo-form">Login</h1>

            <form className="form-login" onSubmit={handleSubmit}>
                <div className="login-gruppo">
                    <input
                        className="login-input"
                        type="email"
                        placeholder=" "
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="email" className="login-label">
                        Email
                    </label>
                </div>

                <div className="login-gruppo">
                    <input
                        className="login-input"
                        type="password"
                        placeholder=" "
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="password" className="login-label">
                        Password
                    </label>
                </div>

                <button className="bottone-form" type="submit">Accedi</button>
            </form>
            {errore && <p className="messaggio-errore">{errore}</p>}
        </div>
    );
}