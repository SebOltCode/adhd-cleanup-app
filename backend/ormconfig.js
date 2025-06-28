require('dotenv').config();

module.exports = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: false,
    entities: ['src/models/**/*.ts'],
    migrations: ['src/migrations/**/*.ts'],
    cli: {
        migrationsDir: 'src/migrations'
    }
};