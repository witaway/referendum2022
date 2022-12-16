import { Router } from 'express';
import auth from '@middlewares/auth';

import loginRouter from './auth/login';
import logoutRouter from './auth/logout';
import toursRouter from './tours';
import placesRouter from './places';
import protocolRouter from './protocol';

import requiredQueryParams from '@middlewares/query_param_required';

const router = Router();

router.use(auth);

router.use('/login', loginRouter);
router.use('/logout', logoutRouter);
router.use('/', toursRouter);
router.use('/places', requiredQueryParams(['tour_id']), placesRouter);
router.use('/protocol', protocolRouter);

router.get('*', (req, res) => {
	res.status(404);
	res.send('This page does not exist');
});

export default router;
