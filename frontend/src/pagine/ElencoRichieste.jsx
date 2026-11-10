import { useState, useEffect } from 'react';
import { fetchRichieste, approveRichiesta } from '../api/requests';
import "./ElencoRichieste.css";

export function ElencoRichieste() {
    const [richieste, setRichieste] = useState([]);
    const [errore, setErrore] = useState(null);

    useEffect(() => {
        let attivo = true;
        const handleRichieste = async () => {
            try {
                const lista = await fetchRichieste();
                if (attivo) {
                    setRichieste(lista);
                }
            } catch (err) {
                console.error(err);
                if (attivo) {
                    setErrore("Errore nel caricamento delle richieste.");
                }
            }
        };
        handleRichieste();
        return () => {
            attivo = false;
        };
    }, []);

    const handleApprova = async (richiesta) => {
        try {
            setErrore(null);
            await approveRichiesta(richiesta._id);
            setRichieste((precedenti) =>
                precedenti.filter((e) => e._id !== richiesta._id)
            );
        } catch (err) {
            console.error(err);
            setErrore("Errore durante l'approvazione della richiesta.");
        }
    };

    return (
        <div className="elenco-contenitore">
            {errore && <p className="messaggio-errore">{errore}</p>}
            {richieste.length === 0 && (
                <h2 className="richieste-vuoto">Non ci sono richieste attive</h2>
            )}
            {richieste.map((richiesta) => (
                <div key={richiesta._id}>
                    <p className="richiesta-nome richista-item">
                        Nome: {richiesta.user?.nome || "Utente"}
                    </p>
                    <p className="richiesta-email richista-item">
                        Email: {richiesta.user?.email || "N/D"}
                    </p>
                    <p className="richiesta-Motivo richista-item">
                        Motivo: {richiesta.motivo}
                    </p>

                    <button type="button" onClick={() => handleApprova(richiesta)}>
                        Approva
                    </button>
                </div>
            ))}
        </div>
    );
}