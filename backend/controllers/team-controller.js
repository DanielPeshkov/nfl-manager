const express = require('express');
const router = express.Router();

const repo = require('../repositories/team-repo');

router.get('/', async (req, res) => {
    res.status(200).send(await repo.getAllTeams());
});

router.get('/:id', async (req, res) => {
    let response = await repo.getTeamById(req.params.id);
    if (response)
        res.status(200).send(response);
    else
        res.status(404).send(`No Team with ID ${req.params.id} exists!`);
});

router.post('/', async (req, res) => {
    res.status(201).send(await repo.createTeam(req.body));
})

router.put('/:id', async (req, res) => {
    res.status(200).send(await repo.updateTeam(req.body, req.params.id));
});

router.delete('/:id', async (req, res) => {
    await repo.deleteTeam(req.params.id);
    res.status(204).send();
});

module.exports = router;