import { Player } from "../models/player"
import { myDataSource } from "../app-data-source"
import { Socket } from "socket.io-client"
import { Server } from "socket.io"

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    getPlayers: () => void;
    getPlayer: (data: string) => void;
    postPlayer: (data: string | Player[]) => void;
    putPlayer: (id: string, data: string | Player) => void;
    deletePlayer: (id: string | Player[]) => void;
}

interface ClientToServerEvents {
    hello: () => void;
    getPlayers: (players: Player[]) => void;
    getPlayer: (players: Player | {'error':string}) => void;
    postPlayer: (players: Player[] | {'error':string}) => void;
    putPlayer: (players: Player[] | {'error':string}) => void;
    deletePlayer: (players: Player[] | {'error':string}) => void;
}

interface InterServerEvents {
    ping: () => void;
}
  
interface SocketData {
    name: string;
    age: number;
}

module.exports = async (socket: Socket<ServerToClientEvents, ClientToServerEvents>, io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >) => {
    socket.on('getPlayers', async () => {
        const players = await myDataSource.getRepository(Player).find();
        socket.emit('getPlayers', players);
    });

    socket.on('getPlayer', async (data) => {
        const id = parseInt(data);
        if (isNaN(id)) {
            socket.emit('getPlayer', {'error':'Invalid Player ID'});
            return;
        }

        const player = await myDataSource.getRepository(Player).findOneBy({
                    id: id,
        });
        if (player) {
            socket.emit('getPlayer', player);
            return;
        }
        socket.emit('getPlayer', {'error':`Player with id ${id} not found`});
    });

    socket.on('postPlayer', async (data) => {
        let playerData;
        try {
            if (typeof data == "string") {
                playerData = JSON.parse(data);
            }
        } catch {
            socket.emit('postPlayer', {'error':'Invalid data provided, expected JSON format'});
            return;
        }
        const player = await myDataSource.getRepository(Player).create(playerData);
        if (!player) {
            socket.emit('postPlayer', {'error':'Player object creation failed'});
            return;
        }
        const results = await myDataSource.getRepository(Player).save(player)
                                .catch((err) => {
                                    socket.emit('postPlayer', {'error':'postPlayer operation failed'});
                                });
        if (results) {
            io.emit('postPlayer', results);
        }
    });

    socket.on('putPlayer', async (putId, data) => {
        const id = parseInt(putId);
        if (isNaN(id)) {
            socket.emit('putPlayer', {'error':'Invalid Player ID'});
            return;
        }

        const player = await myDataSource.getRepository(Player).findOneBy({
            id: id,
        });
        if (!player) {
            socket.emit('putPlayer', {'error':`Player ${id} not found`});
            return;
        }

        let playerData;
        try {
            if (typeof data == "string") {
                playerData = JSON.parse(data);
            }
        } catch {
            socket.emit('putPlayer', {'error':'Invalid data provided, expected JSON format'});
            return;
        }
        myDataSource.getRepository(Player).merge(player, playerData);
        const results = await myDataSource.getRepository(Player).save(player)
                                .catch((err) => {
                                    socket.emit('putPlayer', {'error':'putPlayer operation failed'});
                                });
        if (results) {
            io.emit('putPlayer', putId, results);
        }
    });

    socket.on('deletePlayer', async (data) => {
        let id = NaN;
        if (typeof data == "string") {
            id = parseInt(data);
        } 
        if (isNaN(id)) {
            socket.emit('deletePlayer', {'error':'Invalid Player ID'});
            return;
        }

        const deleteResult = await myDataSource.getRepository(Player).delete(id);
        if (!deleteResult.affected) {
            socket.emit('deletePlayer', {'error':'No rows deleted'});
            return;
        }

        const players = await myDataSource.getRepository(Player).find();
        io.emit('deletePlayer', players);
    });
}