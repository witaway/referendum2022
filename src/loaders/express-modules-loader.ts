import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { engine } from 'express-handlebars';
import path from 'path';
import { Express } from 'express';
import 'process';
import passport from 'passport';

// This module solves problem with unhandled promise rejection
// https://stackoverflow.com/questions/55504066/how-to-gracefully-handle-promise-rejection-in-express
import 'express-async-errors';
import * as process from 'process';
import handlebarsHelpers from '@helpers/handlebars-helpers';

const initExpressModules = (server: Express) => {
	server.engine(
		'handlebars',
		engine({
			defaultLayout: false,
			helpers: handlebarsHelpers,
		}),
	);

	server.set('views', path.join(__dirname, '..', 'views'));
	server.set('view engine', 'handlebars');

	server.use(bodyParser.json());
	server.use(bodyParser.urlencoded({ extended: true }));
	server.use(cookieParser(process.env['COOKIE_SECRET']));

	server.use(passport.initialize());
};

export default initExpressModules;
