import { Player } from "../models/player"
import { myDataSource } from "../app-data-source"

module.exports = async (socket, io) => {
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
            playerData = JSON.parse(data);
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
            playerData = JSON.parse(data);
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
            io.emit('putPlayer', results);
        }
    });

    socket.on('deletePlayer', async (data) => {
        const id = parseInt(data);
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