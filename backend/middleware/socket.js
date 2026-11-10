import { Server } from "socket.io";

let SocketCommenti;

const initSocket = (server) => {
    SocketCommenti = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "DELETE"],
        }
    });

    SocketCommenti.on("connection", (socket) => {
        socket.on("ingresso_pagina", (postId) => {
            if (postId) socket.join(String(postId));
        });
        socket.on("uscita_pagina", (postId) => {
            if (postId) socket.leave(String(postId));
        });
    });

    return SocketCommenti;
};

const socketMiddleware = (req, res, next) => {
    req.SocketCommenti = SocketCommenti;
    next();
};

export { initSocket, socketMiddleware, socketMiddleware as socketMiddlewere };
