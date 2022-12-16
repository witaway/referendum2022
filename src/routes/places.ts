import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
	if (!req.user) {
		res.redirect('/login');
	} else {
		res.render('places', {
			tour_id: req.query.tour_id,
			places: [
				{
					processed: true,
					place: {
						id: 1,
						number: 1,
						address: 'ул. 1-я Набережная, 2',
					},
				},
				{
					processed: false,
					place: {
						id: 2,
						number: 2,
						address: 'ул. 7-я Лучёская, 21',
					},
				},
				{
					processed: false,
					place: {
						id: 3,
						number: 3,
						address: 'ул. Шмырёва, 30',
					},
				},
			],
		});
	}
});

export default router;
