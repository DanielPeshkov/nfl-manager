import { DataSource } from "typeorm"

export const myDataSource = new DataSource({
    type: "postgres",
    host: process.env['DB_HOST'],
    port: parseInt(process.env['DB_PORT']!),
    username: process.env['DB_USER'],
    password: `${process.env['DB_PASSWORD']}`,
    database: process.env['DB_DATABASE'],
    entities: ["backend/models/*.js", "build/models/*.js"],
    logging: false,
    synchronize: false,
});
