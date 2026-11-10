export const errorHandler = (err, req, res, next) => {
    console.error("Errore server:", err);

    if (err.name === "ValidationError") {
        return res.status(400).json({
            error: true,
            message: "Dati non validi",
            dettagli: Object.values(err.errors).map((e) => e.message),
        });
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            error: true,
            message: "Identificativo risorsa non valido",
        });
    }

    if (err.code === 11000) {
        return res.status(400).json({
            error: true,
            message: "Valore duplicato già presente a sistema",
        });
    }

    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        error: true,
        message: err.message || "Errore interno del server",
    });
};
