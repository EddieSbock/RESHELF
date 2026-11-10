import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swaggerFile.json" with { type: "json" };

import { connectDB } from "./config/db.js";
import { initSocket, socketMiddleware } from "./middleware/socket.js";
import { errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import richiesteRoutes from "./routes/richieste.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || process.env.port || 3000;

connectDB();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

const server = http.createServer(app);
initSocket(server);
app.use(socketMiddleware);

app.get("/api/hello", (req, res) => {
    res.json({ message: "Sono il backend" });
});

app.use("/api", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/post", postRoutes);
app.use("/api/commento", commentRoutes);
app.use("/api/richieste", richiesteRoutes);

app.use(errorHandler);

server.listen(port, () => {
    console.log(`Server in ascolto su ${port}`);
});
