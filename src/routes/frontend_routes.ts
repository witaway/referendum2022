//const Router = require('express').Router;
import { Router } from 'express';
import AuthService from '../services/auth';
import {
	PasswordNotMatchException,
	UsernameNotFoundException,
} from '../classes/errors';

const frontendRouter = Router();

import auth from '../middlewares/auth';

frontendRouter.use(auth);

frontendRouter.get('/', (req, res) => {
	console.log(req.user);
	if (!req.user) {
		res.redirect('/login');
	} else {
		res.send('Hi!');
	}
});

frontendRouter.get('/login', (req, res) => {
	if (req.user) {
		res.redirect('/');
		return;
	}
	res.render('login', {});
});

frontendRouter.post('/login', async (req, res) => {
	if (!req.body.username || !req.body.password) {
		res.render('login', {
			username: req.body.username,
			password: req.body.password,
			errorMessage: 'Необходимо заполнить все поля',
			focus: !req.body.username ? 'username' : 'password',
		});
		return;
	}

	try {
		const token = await AuthService.loginWithUsernameAndPassword(
			req.body.username,
			req.body.password,
		);

		const sec = 1000;
		const min = 60 * sec;
		const hour = 60 * min;

		res.cookie('jwt', token, {
			maxAge: 2 * hour,
		});
		res.redirect('/');
	} catch (error) {
		if (error instanceof UsernameNotFoundException) {
			res.render('login', {
				username: req.body.username,
				password: req.body.password,
				errorMessage: `Пользователь ${req.body.username} не зарегистрирован.<br>Проверьте написание`,
			});
		}
		if (error instanceof PasswordNotMatchException) {
			res.render('login', {
				username: req.body.username,
				password: req.body.password,
				errorMessage: `Пароль введён неверно`,
				focus: 'password',
			});
		}
	}
});

frontendRouter.get('*', (req, res) => {
	res.status(404);
	res.send('This page does not exist');
});

export default frontendRouter;
