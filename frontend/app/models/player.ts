export class Player {

    id: number;
    code: string;
    team: string;
    player: string;
    num: number;
    pos: string;
    age: number;
    years: number;
    games_played: number;
    games_started: number;
    status: string;
    height: number;
    weight: number;
    birth: string;
    college: string;
    draft_team: string;
    draft_year: number;
    round: number;
    pick: number;

    constructor(id: number,
        code: string,
        team: string,
        player: string,
        num: number,
        pos: string,
        age: number,
        years: number,
        games_played: number,
        games_started: number,
        status: string,
        height: number,
        weight: number,
        birth: string,
        college: string,
        draft_team: string,
        draft_year: number,
        round: number,
        pick: number,) {
            this.id = id;
            this.code = code;
            this.team = team;
            this.player = player;
            this.num = num;
            this.pos = pos;
            this.age = age;
            this.years = years;
            this.games_played = games_played;
            this.games_started = games_started;
            this.status = status;
            this.height = height;
            this.weight = weight;
            this.birth = birth;
            this.college = college;
            this.draft_team = draft_team;
            this.draft_year = draft_year;
            this.round = round;
            this.pick = pick;
        }
}
