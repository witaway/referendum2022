import AuthService from '@services/auth';
import {
	PasswordNotMatchException,
	UsernameNotFoundException,
} from '@classes/errors';

class AuthController {
	static async login(req: Express.Request, res: Express.Response) {
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
	}

	static async logout(req: Express.Request, res: Express.Response) {
		res.clearCookie('jwt');
		res.redirect('/');
	}
}

export default AuthController;
