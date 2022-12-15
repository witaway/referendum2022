import initDotEnv from './dotenv_loader';
import initExpressModules from './express_modules_loader';
import setupRoutes from './routes_loader';
import initStartServer from './start_server_loader';
import setupPassportStrategies from './passport_strategies_loader';

import { Express } from 'express';
import * as http from 'http';

const init = async (express: Express, port: number): Promise<void> => {
	// Loads .env to process.env
	initDotEnv();

	setupPassportStrategies();

	// Loads all server modules like logging, cookie parser, HTML templete engine and so on
	initExpressModules(express);

	// Loads all routes
	setupRoutes(express);

	// Get http server instance
	const server = http.createServer(express);

	// Start server
	initStartServer(server, port);
};

export default init;
