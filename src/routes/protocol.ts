import { Router } from 'express';

const router = Router();

import requiredQueryParams from '@middlewares/query-param-required';
import ProtocolController from '../controllers/protocol';
import acceptedRoles from '@middlewares/accepted-roles';

router.get(
	'/edit',
	requiredQueryParams(['tour_id', 'place_id']),
	acceptedRoles(['EDITOR']),
	ProtocolController.edit,
);

router.get(
	'/summary',
	requiredQueryParams(['tour_id']),
	ProtocolController.summary,
);

router.get(
	'/view',
	requiredQueryParams(['tour_id', 'place_id']),
	ProtocolController.view,
);

router.post('/save', acceptedRoles(['EDITOR']), ProtocolController.save);

export default router;
