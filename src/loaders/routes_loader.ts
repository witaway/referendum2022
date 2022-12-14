import { Express } from 'express';
import * as express from 'express';

import path from 'path';

import frontendRouter from '../routes/frontend_routes';

const setupRoutes = (server: Express) => {
	// Mount directory with static data
	const staticFolder = path.join(__dirname, '..', '/static');
	server.use('/static', express.static(staticFolder));

	// Mount frontend router
	server.use('/', frontendRouter);
};

export default setupRoutes;
