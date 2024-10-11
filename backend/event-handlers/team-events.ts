import { Team } from "../models/team"
import { myDataSource } from "../app-data-source"
import { Socket } from "socket.io-client"
import { Server } from "socket.io"

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    getTeams: () => void;
    getTeam: (data: string) => void;
    postTeam: (data: string | Team[]) => void;
    putTeam: (id: string, data: string | Team) => void;
    deleteTeam: (id: string | Team[]) => void;
}

interface ClientToServerEvents {
    hello: () => void;
    getTeams: (teams: Team[]) => void;
    getTeam: (teams: Team | {'error':string}) => void;
    postTeam: (teams: Team[] | {'error':string}) => void;
    putTeam: (teams: Team[] | {'error':string}) => void;
    deleteTeam: (teams: Team[] | {'error':string}) => void;
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
    socket.on('getTeams', async () => {
        const teams = await myDataSource.getRepository(Team).find();
        socket.emit('getTeams', teams);
    });

    socket.on('getTeam', async (data) => {
        const id = parseInt(data);
        if (isNaN(id)) {
            socket.emit('getTeam', {'error':'Invalid Team ID'});
            return;
        }

        const team = await myDataSource.getRepository(Team).findOneBy({
                    id: id,
        });
        if (team) {
            socket.emit('getTeam', team);
            return;
        }
        socket.emit('getTeam', {'error':`Team with id ${id} not found`});
    });

    socket.on('postTeam', async (data) => {
        let teamData;
        try {
            if (typeof data == "string") {
                    teamData = JSON.parse(data);
            }
        } catch {
            socket.emit('postTeam', {'error':'Invalid data provided, expected JSON format'});
            return;
        }
        const team = await myDataSource.getRepository(Team).create(teamData);
        if (!team) {
            socket.emit('postTeam', {'error':'Team object creation failed'});
            return;
        }
        const results = await myDataSource.getRepository(Team).save(team)
                                .catch((err) => {
                                    socket.emit('postTeam', {'error':'postTeam operation failed'});
                                });
        if (results) {
            io.emit('postTeam', results);
        }
    });

    socket.on('putTeam', async (putId, data) => {
        const id = parseInt(putId);
        if (isNaN(id)) {
            socket.emit('putTeam', {'error':'Invalid Team ID'});
            return;
        }

        const team = await myDataSource.getRepository(Team).findOneBy({
            id: id,
        });
        if (!team) {
            socket.emit('putTeam', {'error':`Team ${id} not found`});
            return;
        }

        let teamData;
        try {
            if (typeof data == "string") {
                teamData = JSON.parse(data);
            }
        } catch {
            socket.emit('putTeam', {'error':'Invalid data provided, expected JSON format'});
            return;
        }
        myDataSource.getRepository(Team).merge(team, JSON.parse(teamData));
        const results = await myDataSource.getRepository(Team).save(team)
                                    .catch((err) => {
                                        socket.emit('putTeam', {'error':'putTeam operation failed'});
                                    });
        if (results) {
            io.emit('putTeam', putId, results);
        }
    });

    socket.on('deleteTeam', async (putId) => {
        let id = NaN;
        if (typeof putId == "string") {
            id = parseInt(putId);
        }
        if (isNaN(id)) {
            socket.emit('deleteTeam', {'error':'Invalid Team ID'});
            return;
        }

        const deleteResult = await myDataSource.getRepository(Team).delete(id);
        if (!deleteResult.affected) {
            socket.emit('deleteTeam', {'error':'No rows deleted'});
            return;
        }
        const teams = await myDataSource.getRepository(Team).find();
        io.emit('deleteTeam', teams);
    });
}