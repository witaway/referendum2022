import { Router } from 'express';
import loadSession from '@middlewares/load-session';

import authRouter from './auth';
import toursRouter from './tours';
import placesRouter from './places';
import protocolRouter from './protocol';

import authorized from '@middlewares/authorized';

const router = Router();
router.use(loadSession);

router.use('/', authRouter);

router.use(authorized);

router.use('/', (req: Express.Request, res: Express.Response, next) => {
	if (req.url === '/') {
		res.redirect('/tours');
		return;
	}
	next();
});

router.use('/tours', toursRouter);
router.use('/places', placesRouter);
router.use('/protocol', protocolRouter);

router.get('*', (req, res) => {
	res.status(404);
	res.render('error', {
		title: 'Ошибка 404',
		message:
			'Похоже, вы пытаетесь обратиться к странице, которой не существует.',
	});
});

export default router;
