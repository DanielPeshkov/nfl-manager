class Player {
    id;
    code;
    team;
    player;
    num;
    pos;
    age;
    years;
    games_played;
    games_started;
    status;
    height;
    weight;
    birth;
    college;
    draft_team;
    draft_year;
    round;
    pick;

    constructor(
        id, 
        code, 
        team, 
        player, 
        num, 
        pos, 
        age, 
        years,
        games_played,
        games_started,
        status,
        height,
        weight,
        birth,
        college,
        draft_team,
        draft_year,
        round,
        pick
    ) {
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

module.exports = Player;