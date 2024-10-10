import * as express from "express"
import { Team } from "./models/team"
import { Player } from "./models/player"
import { myDataSource } from "./app-data-source"
import * as http from 'http'
import { Server } from "socket.io"

const port = process.env.PORT || 8080;

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

    // Team Events
    socket.on('getTeams', async (data) => {
        const teams = await myDataSource.getRepository(Team).find();
        socket.emit('teams', teams);
    });

    socket.on('getTeam', async (data) => {
        const team = await myDataSource.getRepository(Team).findOneBy({
                    id: parseInt(data),
                });
        socket.emit('team', team);
    });

    socket.on('postTeam', async (data) => {
        const team = await myDataSource.getRepository(Team).create(JSON.parse(data));
        const results = await myDataSource.getRepository(Team).save(team);
        io.emit('postTeam', results);
    });

    socket.on('putTeam', async (id, data) => {
        const team = await myDataSource.getRepository(Team).findOneBy({
            id: id,
        });
        myDataSource.getRepository(Team).merge(team, JSON.parse(data));
        const results = await myDataSource.getRepository(Team).save(team);
        io.emit('putTeam', results);
    });

    socket.on('deleteTeam', async (id) => {
        const _ = await myDataSource.getRepository(Team).delete(id);
        const teams = await myDataSource.getRepository(Team).find();
        io.emit('deleteTeam', teams);
    });

    // Player Events
    socket.on('getPlayers', async (data) => {
        const players = await myDataSource.getRepository(Player).find();
        socket.emit('players', players);
    });

    socket.on('getPlayer', async (data) => {
        const player = await myDataSource.getRepository(Player).findOneBy({
                    id: parseInt(data),
                });
        socket.emit('player', player);
    });

    socket.on('postPlayer', async (data) => {
        const player = await myDataSource.getRepository(Player).create(JSON.parse(data));
        const results = await myDataSource.getRepository(Player).save(player);
        io.emit('postPlayer', results);
    });

    socket.on('putPlayer', async (id, data) => {
        const player = await myDataSource.getRepository(Player).findOneBy({
            id: id,
        });
        myDataSource.getRepository(Player).merge(player, JSON.parse(data));
        const results = await myDataSource.getRepository(Player).save(player);
        io.emit('putPlayer', results);
    });

    socket.on('deletePlayer', async (id) => {
        const _ = await myDataSource.getRepository(Player).delete(id);
        const players = await myDataSource.getRepository(Player).find();
        io.emit('deletePlayer', players);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log(`App up and listening on Port ${port}!`);
});
