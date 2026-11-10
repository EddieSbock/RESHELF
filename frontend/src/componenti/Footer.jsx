import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contesto/AuthContext";
import { createRichiesta } from "../api/requests";
import "./Footer.css";
import kill_bill from "../assets/kill_bill.png";

export function Footer() {
    const { token, user, isAdmin } = useAuth();
    const [motivo, setMotivo] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [errore, setErrore] = useState(null);

    const handleForm = async (e) => {
        e.preventDefault();
        setFeedback(null);
        setErrore(null);

        if (!motivo.trim()) {
            setErrore("Inserisci una motivazione valida.");
            return;
        }

        try {
            const res = await createRichiesta(motivo.trim());
            setMotivo("");
            setFeedback(res.message || "Richiesta inviata con successo!");
        } catch (err) {
            console.error(err);
            setErrore(err.response?.data?.message || "Errore nell'invio della richiesta.");
        }
    };

    return (
        <footer className="footer-container">
            <div className="footer-gruppo">
                <img className="footer-img" src={kill_bill} alt="Kill Bill" />
                {token && (
                    <div className="sezione-autore">
                        {isAdmin ? (
                            <Link className="bottone-richieste" to="/ElencoRichieste">
                                Richieste
                            </Link>
                        ) : (
                            <div>
                                <h4>Entra a far parte dello staff</h4>
                                <form className="form-autore" onSubmit={handleForm}>
                                    <input
                                        type="text"
                                        id="footer-nome"
                                        placeholder="Nome"
                                        value={user?.nome || ""}
                                        readOnly
                                    />
                                    <input
                                        type="email"
                                        id="footer-email"
                                        placeholder="Email"
                                        value={user?.email || ""}
                                        readOnly
                                    />
                                    <textarea
                                        className="autore-motivo"
                                        id="footer-motivo"
                                        placeholder="Perchè vorresti lavorare con noi..."
                                        value={motivo}
                                        onChange={(e) => setMotivo(e.target.value)}
                                        required
                                    />
                                    {feedback && <p className="messaggio-successo">{feedback}</p>}
                                    {errore && <p className="messaggio-errore">{errore}</p>}
                                    <button type="submit" className="footer-bottone">
                                        Invia
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                )}

                <div className="Social">
                    <h4>Seguici anche qui</h4>
                </div>
            </div>
        </footer>
    );
}