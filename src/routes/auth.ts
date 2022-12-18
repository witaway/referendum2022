import { Router } from 'express';
import AuthController from '../controllers/auth';

const router = Router();

router.get('/login', (req, res) => {
	if (req.user) {
		res.redirect('/');
		return;
	}
	res.render('login', {});
});

router.post('/login', AuthController.login);

router.get('/logout', AuthController.logout);

export default router;
