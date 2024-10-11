import express from "express"
import { myDataSource } from "./app-data-source"
import * as http from 'http'
import { Server } from "socket.io"

const port = process.env['PORT'] || 8080;
const teamEvents = require('./event-handlers/team-events');
const playerEvents = require('./event-handlers/player-events')

// establish database connection
myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
});

// create and setup app server
const app = express();
app.use(express.json());
const server = http.createServer(app); //
const io = new Server(server); // 

io.on('connection', (socket) => {
    console.log('Client connected');

    teamEvents(socket, io);
    playerEvents(socket, io);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log(`App up and listening on Port ${port}!`);
});
