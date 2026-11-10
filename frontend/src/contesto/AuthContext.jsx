import { useState, createContext, useEffect, useContext, useCallback } from "react";
import { fetchProfile } from "../api/auth";

export const Contesto = createContext();

export const Esporta_contesto = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [caricamentoAuth, setCaricamentoAuth] = useState(() => Boolean(localStorage.getItem("token")));

    const elimina_contesto = useCallback(() => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setCaricamentoAuth(false);
    }, []);

    const crea_contesto = useCallback((login_token, userData = null) => {
        localStorage.setItem("token", login_token);
        setToken(login_token);
        if (userData) {
            setUser(userData);
            setCaricamentoAuth(false);
        } else {
            setCaricamentoAuth(true);
        }
    }, []);

    const aggiorna_utente = useCallback((nuoviDati) => {
        setUser((prev) => (prev ? { ...prev, ...nuoviDati } : nuoviDati));
    }, []);

    useEffect(() => {
        const handleUnauthorized = () => {
            elimina_contesto();
        };
        window.addEventListener("auth:unauthorized", handleUnauthorized);
        return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
    }, [elimina_contesto]);

    useEffect(() => {
        if (!token) return;

        let attivo = true;
        const caricaProfilo = async () => {
            try {
                const profilo = await fetchProfile();
                if (attivo) {
                    setUser(profilo);
                }
            } catch (errore) {
                console.error("Errore nel caricamento del profilo utente:", errore);
                if (attivo) {
                    elimina_contesto();
                }
            } finally {
                if (attivo) {
                    setCaricamentoAuth(false);
                }
            }
        };

        caricaProfilo();
        return () => {
            attivo = false;
        };
    }, [token, elimina_contesto]);

    const isAuthenticated = Boolean(token);
    const isAdmin = user?.ruolo === "admin";

    return (
        <Contesto.Provider
            value={{
                token,
                user,
                isAuthenticated,
                isAdmin,
                caricamentoAuth,
                crea_contesto,
                elimina_contesto,
                aggiorna_utente,
            }}
        >
            {children}
        </Contesto.Provider>
    );
};

export const useAuth = () => useContext(Contesto);