import path from 'path';
import dotenv from 'dotenv';
import { createConnections, Connection } from 'typeorm';

dotenv.config();

export default async (isTesting = false): Promise<Connection[]> => {
    if (isTesting) {
        const connections = await createConnections([
            {
                name: 'default',
                type: 'sqlite',
                database: ':memory:',
                migrationsRun: isTesting,
                synchronize: isTesting,
                entities: [`${path.resolve(__dirname, './entities')}/*.{ts,js}`],
            },
        ]);

        for (let index = 0; index < connections.length; index += 1) {
            await connections[index].runMigrations();
        }

        return connections;
    }

    return createConnections([
        {
            name: 'default',
            type: 'postgres',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT!,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [`${path.resolve(__dirname, './entities')}/*.{ts,js}`],
        },
    ]);
};
