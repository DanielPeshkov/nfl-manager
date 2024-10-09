import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Team {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @Column()
    coach: string

    @Column()
    off_coord: string

    @Column()
    def_coord: string

    @Column()
    stadium: string

    @Column()
    owner: string

    @Column()
    gm: string

}