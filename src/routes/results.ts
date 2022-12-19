import { Router } from 'express';

const router = Router();

import requiredQueryParams from '@middlewares/query-param-required';
import ResultsController from '../controllers/results';

router.get('/', requiredQueryParams(['tour_id']), ResultsController.view);

export default router;
