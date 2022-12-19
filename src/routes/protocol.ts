import { Router } from 'express';

const router = Router();

import requiredQueryParams from '@middlewares/query-param-required';
import ProtocolController from '../controllers/protocol';

router.get(
	'/edit',
	requiredQueryParams(['tour_id', 'place_id']),
	ProtocolController.edit,
);

router.get(
	'/view',
	requiredQueryParams(['tour_id', 'place_id']),
	ProtocolController.view,
);

router.post('/save', ProtocolController.save);

export default router;
