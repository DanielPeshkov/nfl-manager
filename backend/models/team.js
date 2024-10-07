class Team {
    id;
    code;
    name;
    coach;
    off_coord;
    def_coord;
    stadium;
    owner;
    gm;

    constructor(id,
        code, 
        name,
        coach,
        off_coord,
        def_coord,
        stadium,
        owner,
        gm,) {
            this.id = id;
            this.code = code;
            this.name = name;
            this.coach = coach;
            this.off_coord = off_coord;
            this.def_coord = def_coord;
            this.stadium = stadium;
            this.owner = owner;
            this.gm = gm;
        }
}

module.exports = Team;