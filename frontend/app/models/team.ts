export class Team {
    id: number;
    code: string;
    name: string;
    coach: string;
    off_coord: string;
    def_coord: string;
    stadium: string;
    owner: string;
    gm: string;

    constructor(id: number,
        code: string,
        name: string,
        coach: string,
        off_coord: string,
        def_coord: string, 
        stadium: string,
        owner: string,
        gm: string) {
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
