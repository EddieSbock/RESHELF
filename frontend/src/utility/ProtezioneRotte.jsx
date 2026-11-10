import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contesto/AuthContext";

export function ProtezioneRotte({ ruoloRichiesto }) {
    const { token, user, caricamentoAuth } = useAuth();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (caricamentoAuth) {
        return null;
    }

    if (ruoloRichiesto && user?.ruolo !== ruoloRichiesto) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}