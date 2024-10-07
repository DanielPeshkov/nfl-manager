const express = require('express');
const router = express.Router();

const repo = require('../repositories/player-repo');

router.get('/', async (req, res) => {
    res.status(200).send(await repo.getAllPlayers());
});

router.get('/:id', async (req, res) => {
    let response = await repo.getPlayerById(req.params.id);
    if (response)
        res.status(200).send(response);
    else
        res.status(404).send(`No Player with ID ${req.params.id} exists!`);
});

router.post('/', async (req, res) => {
    res.status(201).send(await repo.createPlayer(req.body));
})

router.put('/:id', async (req, res) => {
    res.status(200).send(await repo.updatePlayer(req.body, req.params.id));
});

router.delete('/:id', async (req, res) => {
    await repo.deletePlayer(req.params.id);
    res.status(204).send();
});

module.exports = router;