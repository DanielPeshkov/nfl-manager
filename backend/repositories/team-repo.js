require('dotenv').config();

const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

const Team = require('../models/team');

// getting all teams
const getAllTeams = async () => {
    let teams;  // a holder for our eventual DB response

    connection.connect();   // this opens the connection to our DB
    // this queries the DB
    // first parameter is a string of the SQL query
    await connection.promise().query('SELECT * FROM team')
        .then(rows => {
            teams = rows[0].map(row => new Team(row.id, row.code, row.name, row.coach, row.off_coord, row.def_coord, row.stadium, row.owner, row.gm));
        }).catch(error => console.log(error.sqlMessage));

    return teams;
}

// getting one by ID
const getTeamById = async (id) => {
    let team;

    connection.connect();
    // any ? characters in the SQL string, will get filled in by values from the values array, in order
    await connection.promise().query('SELECT * FROM team WHERE id = ?', [ id ])
        .then(rows => {
            let row = rows[0][0];
            if (row)
                team = new Team(row.id, row.code, row.name, row.coach, row.off_coord, row.def_coord, row.stadium, row.owner, row.gm);
        })

    return team;
}

// creating one
const createTeam = async (body) => {
    const { code, name, coach, off_coord, def_coord, stadium, owner, gm } = body;
    let newTeam;

    connection.connect();
    await connection.promise().query('INSERT INTO team(code, name, coach, off_coord, def_coord, stadium, owner, gm) ' +
                                     'VALUES(?,?,?,?,?,?,?,?)', [ code, name, coach, off_coord, def_coord, stadium, owner, gm ])
        .then(async response => newTeam = await getTeamById(response[0].insertId));
    
    return newTeam;
}

// updating one
const updateTeam = async (body, idToUpdate) => {
    const { id, code, name, coach, off_coord, def_coord, stadium, owner, gm } = body;
    let updatedTeam;

    connection.connect();
    await connection.promise().query('UPDATE team SET id = ?, code=?, name = ?, coach = ?, off_coord = ?, def_coord = ?, stadium = ?, owner = ?, gm = ? WHERE id = ?', 
        [ id, code, name, coach, off_coord, def_coord, stadium, owner, gm, idToUpdate ])
        .then(async response => updatedTeam = await getTeamById(id));

    return updatedTeam;
}

// deleting one
const deleteTeam = async (id) => {
    connection.connect();

    await connection.promise().query('DELETE FROM team WHERE id = ?', [ id ])
        .then(response => console.log(response));
}

// we export all the methods in an object on which we can call them
module.exports = { getAllTeams, 
                   getTeamById, 
                   createTeam, 
                   updateTeam, 
                   deleteTeam };
