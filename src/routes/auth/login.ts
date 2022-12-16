import { Router } from 'express';
import {
	PasswordNotMatchException,
	UsernameNotFoundException,
} from '@classes/errors';
import AuthService from '@services/auth';

const router = Router();

router.get('/', (req, res) => {
	if (req.user) {
		res.redirect('/');
		return;
	}
	res.render('login', {});
});

router.post('/', async (req, res) => {
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

export default router;
