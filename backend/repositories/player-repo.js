require('dotenv').config();

const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

const Player = require('../models/player');

// getting all players
const getAllPlayers = async () => {
    let players;  // a holder for our eventual DB response

    connection.connect();   // this opens the connection to our DB
    // this queries the DB
    // first parameter is a string of the SQL query
    await connection.promise().query('SELECT * FROM player')
        .then(rows => {
            players = rows[0].map(row => new Player(row.id, row.code, row.team, row.player, row.num, row.pos, row.age, row.years, row.games_played, row.games_started, row.height, row.weight, row.birth, row.college, row.draft_team, row.draft_year, row.round, row.pick));
        }).catch(error => console.log(error.sqlMessage));

    return players;
}

// getting one by ID
const getPlayerById = async (id) => {
    let player;

    connection.connect();
    // any ? characters in the SQL string, will get filled in by values from the values array, in order
    await connection.promise().query('SELECT * FROM player WHERE id = ?', [ id ])
        .then(rows => {
            let row = rows[0][0];
            if (row)
                player = new Player(row.id, row.code, row.team, row.player, row.num, row.pos, row.age, row.years, row.games_played, row.games_started, row.height, row.weight, row.birth, row.college, row.draft_team, row.draft_year, row.round, row.pick);
        })

    return player;
}

// creating one
const createPlayer = async (body) => {
    const { code, team, player, num, pos, age, years, games_played, games_started, status, height, weight, birth, college, draft_team, draft_year, round, pick } = body;
    let newPlayer;

    connection.connect();
    await connection.promise().query('INSERT INTO player(code, team, player, num, pos, age, years, games_played, games_started, status, height, weight, birth, college, draft_team, draft_year, round, pick) ' +
                                     'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [ code, team, player, num, pos, age, years, games_played, games_started, status, height, weight, birth, college, draft_team, draft_year, round, pick ])
        .then(async response => newPlayer = await getPlayerById(response[0].insertId));
    
    return newPlayer;
}

// updating one
const updatePlayer = async (body, idToUpdate) => {
    const { id, code, team, player, num, pos, age, years, games_played, games_started, status, height, weight, birth, college, draft_team, draft_year, round, pick } = body;
    let updatedPlayer;

    connection.connect();
    await connection.promise().query('UPDATE player SET id = ?, code=?, team = ?, player = ?, num = ?, pos = ?, age = ?, years = ?, games_played = ?, games_started = ?, status = ?, height = ?, weight = ?, birth = ?, college = ?, draft_team = ?, draft_year = ?, round = ?, pick = ? WHERE id = ?', 
        [ id, code, team, player, num, pos, age, years, games_played, games_started, status, height, weight, birth, college, draft_team, draft_year, round, pick, idToUpdate ])
        .then(async response => updatedPlayer = await getPlayerById(id));

    return updatedPlayer;
}

// deleting one
const deletePlayer = async (id) => {
    connection.connect();

    await connection.promise().query('DELETE FROM player WHERE id = ?', [ id ])
        .then(response => console.log(response));
}

// we export all the methods in an object on which we can call them
module.exports = { getAllPlayers, 
                   getPlayerById, 
                   createPlayer, 
                   updatePlayer, 
                   deletePlayer };
