import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Player {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    team: string

    @Column()
    player: string

    @Column()
    num: number

    @Column()
    pos: string

    @Column()
    age: number

    @Column()
    years: number

    @Column()
    games_played: number

    @Column()
    games_started: number

    @Column()
    status: string

    @Column()
    height: number

    @Column()
    weight: number

    @Column()
    birth: string

    @Column()
    college: string

    @Column()
    draft_team: string

    @Column()
    draft_year: number

    @Column()
    round: number

    @Column()
    pick: number

}