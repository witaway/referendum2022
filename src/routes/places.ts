import { Router } from 'express';
import requiredQueryParams from '@middlewares/query-param-required';
import PlacesController from '../controllers/places';

const router = Router();

router.get('/', requiredQueryParams(['tour_id']), PlacesController.viewPlaces);

export default router;
