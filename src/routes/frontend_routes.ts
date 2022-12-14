//const Router = require('express').Router;
import { Router } from 'express';

const frontendRouter = Router();

//const auth = require('../middlewares/auth_frontend');
//router.use(auth);

// Respond with game page
frontendRouter.get('/', (req, res) => {
	res.send('Hello!');
	// if (req.user) res.render('hub', {});
	// else res.render('login');
});

// Respond with game page
frontendRouter.get('/game', (req, res, next) => {
	if (req.user) res.render('game');
	else next();
});

frontendRouter.get('*', (req, res) => {
	res.status(404);
	res.send('This page does not exist');
});

export default frontendRouter;
