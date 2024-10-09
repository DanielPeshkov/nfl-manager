import * as express from "express"
import { Request, Response } from "express"
import { Team } from "./models/team"
import { Player } from "./models/player"
import { myDataSource } from "./app-data-source"

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

// create and setup express app
const app = express();
app.use(express.json());

// Team Routes
app.get("/team", async function (req: Request, res: Response) {
    const teams = await myDataSource.getRepository(Team).find()
    res.json(teams)
});

app.get("/team/:id", async function (req: Request, res: Response) {
    const results = await myDataSource.getRepository(Team).findOneBy({
        id: parseInt(req.params.id),
    })
    res.send(results)
});

app.post("/team", async function (req: Request, res: Response) {
    const team = await myDataSource.getRepository(Team).create(req.body)
    const results = await myDataSource.getRepository(Team).save(team)
    res.send(results)
});

app.put("/team/:id", async function (req: Request, res: Response) {
    const team = await myDataSource.getRepository(Team).findOneBy({
        id: parseInt(req.params.id),
    })
    myDataSource.getRepository(Team).merge(team, req.body)
    const results = await myDataSource.getRepository(Team).save(team)
    res.send(results)
});

app.delete("/team/:id", async function (req: Request, res: Response) {
    const results = await myDataSource.getRepository(Team).delete(req.params.id)
    res.send(results)
});

// Player Routes
app.get("/player", async function (req: Request, res: Response) {
    const players = await myDataSource.getRepository(Player).find()
    res.json(players)
});

app.get("/player/:id", async function (req: Request, res: Response) {
    const results = await myDataSource.getRepository(Player).findOneBy({
        id: parseInt(req.params.id),
    })
    res.send(results)
});

app.post("/player", async function (req: Request, res: Response) {
    const player = await myDataSource.getRepository(Player).create(req.body)
    const results = await myDataSource.getRepository(Player).save(player)
    res.send(results)
});

app.put("/player/:id", async function (req: Request, res: Response) {
    const player = await myDataSource.getRepository(Player).findOneBy({
        id: parseInt(req.params.id),
    })
    myDataSource.getRepository(Player).merge(player, req.body)
    const results = await myDataSource.getRepository(Player).save(player)
    res.send(results)
});

app.delete("/player/:id", async function (req: Request, res: Response) {
    const results = await myDataSource.getRepository(Player).delete(req.params.id)
    res.send(results)
});

app.listen(port, () => {
    console.log(`App up and listening on Port ${port}!`);
});
