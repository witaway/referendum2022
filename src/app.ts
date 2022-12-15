import express from 'express';
import init from './loaders';
import * as process from 'process';

(async () => {
	// Create web server
	const server = express();
	const port = +process.env['PORT']!;

	// Initialize everything else
	await init(server, port);
})();
