import { Team } from "../models/team.js"
import { myDataSource } from "../app-data-source.js"
import { Socket } from "socket.io-client"
import { Server } from "socket.io"

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    getTeams: () => void;
    getTeam: (data: string) => void;
    postTeam: (data: string | Team[]) => void;
    putTeam: (data: string | Team) => void;
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

// Socket<ServerToClientEvents, ClientToServerEvents>
export const teamEvents = async(socket: any, io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >) => {
    socket.on('getTeams', async () => {
        const teams = await myDataSource.getRepository(Team).find();
        socket.emit('getTeams', teams);
    });

    socket.on('getTeam', async (data: string) => {
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

    socket.on('postTeam', async (data: string) => {
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

    socket.on('putTeam', async (putId: string, data: string) => {
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
        myDataSource.getRepository(Team).merge(team, teamData);
        const results = await myDataSource.getRepository(Team).update({id: team.id}, team)
                                    .catch((err) => {
                                        socket.emit('putTeam', {'error':'putTeam operation failed'});
                                    });
        if (results?.affected) {
            io.emit('putTeam', team);
        }
    });

    socket.on('deleteTeam', async (putId: string) => {
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
        // const teams = await myDataSource.getRepository(Team).find();
        io.emit('deleteTeam', id.toString());
    });
}