import express from "express"
// const express = require('express');
import { myDataSource } from "./app-data-source.js"
// const myDataSource = require('./app-data-source');
import * as http from 'http'
import { Server } from "socket.io"

const port = process.env['PORT'] || 8080;
// const teamEvents = require('./event-handlers/team-events');
import {teamEvents} from './event-handlers/team-events.js'
// const playerEvents = require('./event-handlers/player-events')
import { playerEvents } from "./event-handlers/player-events.js";

// establish database connection
myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err: any) => {
        console.error("Error during Data Source initialization:", err)
});

// create and setup app server
const app = express();
app.use(express.json());
const server = http.createServer(app); //
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:4200',
        methods: ["GET"],
    }
}); // 

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
