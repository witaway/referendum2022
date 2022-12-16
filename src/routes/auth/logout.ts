import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
	res.clearCookie('jwt');
	res.redirect('/');
});

export default router;
