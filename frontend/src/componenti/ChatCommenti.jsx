import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../contesto/AuthContext.jsx";
import { fetchCommentsByPost, createComment, deleteComment } from "../api/comments";
import { API_BASE_URL } from "../utility/costanti";
import "./ChatCommenti.css";

export function ChatCommenti({ postId }) {
    const [commenti, setCommenti] = useState([]);
    const [inserito, setInserito] = useState("");
    const [errore, setErrore] = useState(null);

    const { token, isAdmin } = useAuth();

    useEffect(() => {
        if (!postId) return;

        let attivo = true;
        const caricaCommenti = async () => {
            try {
                const lista = await fetchCommentsByPost(postId);
                if (attivo) {
                    setCommenti(lista);
                }
            } catch (err) {
                console.error(err);
            }
        };
        caricaCommenti();

        const socket = io(API_BASE_URL);
        socket.emit("ingresso_pagina", postId);

        const handleNuovoCommento = (nuovoCommento) => {
            setCommenti((prev) => {
                if (prev.some((c) => c._id === nuovoCommento._id)) {
                    return prev;
                }
                return [...prev, nuovoCommento];
            });
        };

        const handleEliminaCommento = (eliminato) => {
            const idEliminato = typeof eliminato === "object" ? eliminato?._id : eliminato;
            setCommenti((prev) => prev.filter((c) => c._id !== idEliminato));
        };

        socket.on("ricevi_commento", handleNuovoCommento);
        socket.on("elimina_commento", handleEliminaCommento);

        return () => {
            attivo = false;
            socket.emit("uscita_pagina", postId);
            socket.off("ricevi_commento", handleNuovoCommento);
            socket.off("elimina_commento", handleEliminaCommento);
            socket.disconnect();
        };
    }, [postId]);

    const inviaCommenti = async (e) => {
        e.preventDefault();
        setErrore(null);

        if (!inserito.trim()) return;

        try {
            const commentoPostato = await createComment({
                contenuto: inserito.trim(),
                postId,
            });
            setInserito("");
            setCommenti((prev) => {
                if (prev.some((c) => c._id === commentoPostato._id)) {
                    return prev;
                }
                return [...prev, commentoPostato];
            });
        } catch (err) {
            console.error(err);
            setErrore(err.response?.data?.message || "Errore nell'invio del commento.");
        }
    };

    const eliminaCommenti = async (id) => {
        try {
            await deleteComment(id);
            setCommenti((prev) => prev.filter((c) => c._id !== id));
        } catch (err) {
            console.error(err);
            setErrore("Impossibile eliminare il commento.");
        }
    };

    return (
        <div className="commenti-container">
            <h3 className="chat-titolo">Commenti</h3>

            <div className="commenti-lista">
                {commenti.map((commento) => (
                    <div key={commento._id} className="singolo-commento">
                        <div className="commento-header">
                            <span className="commento-autore">
                                {commento.autore?.nome || "Utente"}
                            </span>
                            <span className="commento-dati">
                                {new Date(commento.dataCreazione).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                            {isAdmin && (
                                <button
                                    className="elimina-commenti"
                                    type="button"
                                    aria-label="Elimina commento"
                                    onClick={() => eliminaCommenti(commento._id)}
                                >
                                    X
                                </button>
                            )}
                        </div>
                        <p className="commento-testo">{commento.contenuto}</p>
                    </div>
                ))}
            </div>

            {errore && <p className="messaggio-errore">{errore}</p>}

            {token ? (
                <form onSubmit={inviaCommenti} className="chat-form">
                    <div className="commenti-input">
                        <textarea
                            placeholder="Scrivi la tua opinione"
                            value={inserito}
                            rows={1}
                            maxLength={400}
                            onChange={(e) => setInserito(e.target.value)}
                            className="input-inserito"
                            required
                        />
                        <button type="submit" className="bottone-commenti">
                            INVIA
                        </button>
                    </div>
                </form>
            ) : (
                <div className="avviso-login">
                    <p>Effettua l'accesso per commentare</p>
                </div>
            )}
        </div>
    );
}