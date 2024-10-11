import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Player {

    @PrimaryGeneratedColumn()
    id: number = 0;

    @Column()
    code: string = '';

    @Column()
    team: string = '';

    @Column()
    player: string = '';

    @Column()
    num: number = 0;

    @Column()
    pos: string = '';

    @Column()
    age: number = 0;

    @Column()
    years: number = 0;

    @Column()
    games_played: number = 0;

    @Column()
    games_started: number = 0;

    @Column()
    status: string = '';

    @Column()
    height: number = 0;

    @Column()
    weight: number = 0;

    @Column()
    birth: string = '';

    @Column()
    college: string = '';

    @Column()
    draft_team: string = '';

    @Column()
    draft_year: number = 0;

    @Column()
    round: number = 0;

    @Column()
    pick: number = 0;

}