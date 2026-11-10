import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';
import './Registrazione.css';

export default function Registrazione() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errore, setErrore] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrore(null);

        if (!nome.trim() || !email.trim() || !password) {
            setErrore("Compila tutti i campi obbligatori");
            return;
        }

        try {
            await registerUser({
                nome: nome.trim(),
                email: email.trim(),
                password,
            });
            navigate("/login");
        } catch (error) {
            const msg =
                error.response?.data?.message ||
                (typeof error.response?.data === "string" ? error.response.data : null) ||
                "Errore durante la registrazione. Riprova.";
            setErrore(msg);
        }
    };

    return (
        <div className="registrazione-container">
            <h1 className="titolo-form">Registrazione</h1>

            <form className="form-registrazione" onSubmit={handleSubmit}>
                <div className="registrazione-gruppo">
                    <input
                        className="registrazione-input"
                        type="text"
                        placeholder=" "
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                    <label htmlFor="nome" className="registrazione-label">
                        Nome Utente
                    </label>
                </div>

                <div className="registrazione-gruppo">
                    <input
                        className="registrazione-input"
                        type="email"
                        placeholder=" "
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="email" className="registrazione-label">
                        Email
                    </label>
                </div>

                <div className="registrazione-gruppo">
                    <input
                        className="registrazione-input"
                        type="password"
                        placeholder=" "
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="password" className="registrazione-label">
                        Password
                    </label>
                </div>

                <button className="bottone-form" type="submit">Registrati</button>
            </form>
            {errore && <p className="messaggio-errore">{errore}</p>}
        </div>
    );
}