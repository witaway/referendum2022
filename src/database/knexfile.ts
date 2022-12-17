import type { Knex } from 'knex';
import * as dotenv from 'dotenv';
import process from 'process';

dotenv.config({
	path: '../../.env',
});

const config: { [key: string]: Knex.Config } = {
	development: {
		client: 'pg',
		connection: {
			host: process.env.DB_HOST,
			port: +process.env.DB_PORT!,
			database: process.env.DB_NAME,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
		},
		migrations: {
			directory: './migrations',
			extension: 'ts',
			schemaName: 'public',
		},
		seeds: {
			directory: './seeds',
			extension: 'ts',
		},
	},
};

module.exports = config;
export default config;
