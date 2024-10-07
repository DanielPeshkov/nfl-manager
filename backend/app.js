const express = require('express');
const app = express();
app.use(express.json());
const port = process.env.PORT || 8080;

const teamController = require('./controllers/team-controller');
app.use('/team', teamController);

const playerController = require('./controllers/player-controller');
app.use('/player', playerController);

app.listen(port, () => {
    console.log(`App up and listening on Port ${port}!`);
});
