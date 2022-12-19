import { Express } from 'express';
import * as express from 'express';

import path from 'path';

import loadSession from '@middlewares/load-session';
import authRouter from '@routes/auth';
import requireAuthorizationOrRedirectTo from '@middlewares/require-authorization-or-redirect-to';
import toursRouter from '@routes/tours';
import placesRouter from '@routes/places';
import protocolRouter from '@routes/protocol';
import resultsRouter from '@routes/results';
import redirectRootToDefaultUrl from '@middlewares/redirect-root-to-default-url';

const setupRoutes = (server: Express) => {
	// Mount directory with static data
	const staticFolder = path.join(__dirname, '..', '/static');
	server.use('/static', express.static(staticFolder));

	// Load session object req.user
	// If user is not authenticated, can be null or undefined
	server.use(loadSession);

	// Doesn't need authentication
	server.use('/', authRouter);

	// Does need authentication
	server.use(requireAuthorizationOrRedirectTo('/login'));
	server.use(redirectRootToDefaultUrl('/tours'));
	server.use('/tours', toursRouter);
	server.use('/places', placesRouter);
	server.use('/protocol', protocolRouter);
	server.use('/results', resultsRouter);

	// Page 404
	server.get('*', (req, res) => {
		res.status(404);
		res.render('error', {
			title: 'Ошибка 404',
			message:
				'Похоже, вы пытаетесь обратиться к странице, которой не существует.',
		});
	});

	// Todo: Exceptions handler
};

export default setupRoutes;
