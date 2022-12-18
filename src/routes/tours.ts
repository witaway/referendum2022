import { Router } from 'express';
import ToursContoller from '../controllers/tours';

const router = Router();

router.get('/', ToursContoller.viewTours);

export default router;
