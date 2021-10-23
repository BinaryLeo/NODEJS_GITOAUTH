import "dotenv/config";
import express, { Express } from "express";
import http from "http";
import cors from "cors";

import { Server } from "socket.io";
import { router } from "./routes";

const app = express();
app.use(cors()); // http

const serverHttp = http.createServer(app);
const io = new Server(serverHttp, {
    cors: {
        origin: "*" //Allows any origin - websocket
    }
});
io.on("connection", socket => {
    console.log(`User connected in socket: ${socket.id}`)
})// listen or sends through an event
app.use(express.json());
app.use(router);
app.get('/github', (request, response) => {

    response.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.github_client_id}`)
});
app.get('/signin/callback', (request, response) => {
    const { code } = request.query;
    return response.json(code); // Allows to receive data in body (json requests)
});
export { serverHttp, io };