import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contesto/AuthContext';
import { fetchProfile, updateProfile, updatePassword } from '../api/auth';
import './Login.css';

export default function Profilo() {
    const { user, aggiorna_utente } = useAuth();

    const [nome, setNome] = useState(user?.nome || "");
    const [email, setEmail] = useState(user?.email || "");
    const [password, setPassword] = useState("");
    const [nuovaPassword, setNuovaPassword] = useState("");
    const [mostraPassword, setMostraPassword] = useState(false);
    const [errore, setErrore] = useState(null);
    const [successo, setSuccesso] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        let attivo = true;
        const recuperaProfilo = async () => {
            try {
                const profilo = await fetchProfile();
                if (attivo && profilo) {
                    setNome(profilo.nome || "");
                    setEmail(profilo.email || "");
                    aggiorna_utente(profilo);
                }
            } catch (err) {
                console.error(err);
                if (attivo) {
                    setErrore("Impossibile caricare il profilo.");
                }
            }
        };
        recuperaProfilo();
        return () => {
            attivo = false;
        };
    }, [aggiorna_utente]);

    const inviaForm = async (e) => {
        e.preventDefault();
        setErrore(null);
        setSuccesso(null);

        try {
            if (nuovaPassword.trim() !== "") {
                if (!password) {
                    setErrore("Inserisci la password attuale per poterla modificare.");
                    return;
                }
                await updatePassword({ password, nuovaPassword });
            }

            const utenteAggiornato = await updateProfile({
                nome: nome.trim(),
                email: email.trim(),
            });
            aggiorna_utente(utenteAggiornato);
            setSuccesso("Profilo aggiornato con successo!");
            navigate("/");
        } catch (err) {
            console.error(err);
            setErrore(err.response?.data?.message || "Errore durante l'aggiornamento del profilo.");
        }
    };

    return (
        <div className="login-container">
            <h1 className="titolo-form">Profilo</h1>

            <form className="form-login" onSubmit={inviaForm}>
                <div className="login-gruppo">
                    <input
                        className="login-input"
                        type="text"
                        placeholder=" "
                        id="profilo-nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                    <label htmlFor="profilo-nome" className="login-label">
                        Username
                    </label>
                </div>

                <div className="login-gruppo">
                    <input
                        className="login-input"
                        type="email"
                        placeholder=" "
                        id="profilo-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="profilo-email" className="login-label">
                        Email
                    </label>
                </div>

                <div className="login-gruppo">
                    <input
                        className="login-input"
                        type={mostraPassword ? "text" : "password"}
                        placeholder=" "
                        id="password-attuale"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="password-attuale" className="login-label">
                        Password
                    </label>
                </div>

                <div className="login-gruppo">
                    <input
                        className="login-input"
                        type={mostraPassword ? "text" : "password"}
                        placeholder=" "
                        id="nuova-password"
                        value={nuovaPassword}
                        onChange={(e) => setNuovaPassword(e.target.value)}
                    />
                    <label htmlFor="nuova-password" className="login-label">
                        Nuova Password
                    </label>
                </div>

                <button
                    type="button"
                    className="occhio-password"
                    onClick={() => setMostraPassword(!mostraPassword)}
                >
                    {mostraPassword ? "Nascondi" : "Mostra"}
                </button>
                <button className="bottone-form" type="submit">Modifica</button>
            </form>

            {errore && <p className="messaggio-errore">{errore}</p>}
            {successo && <p className="messaggio-successo">{successo}</p>}
        </div>
    );
}