import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
	if (!req.user) {
		res.redirect('/login');
	} else {
		const links_to = req.user.role === 'EDITOR' ? 'places' : 'results';
		res.render('tours', {
			date_formatted: '02:35:30 16/12/2022',
			links_to: links_to,
			tours: [
				{
					id: 1,
					number: 1,
					protocols: {
						processed: 9,
						total: 24,
					},
				},
				{
					id: 2,
					number: 2,
					protocols: {
						processed: 0,
						total: 24,
					},
				},
			],
		});
	}
});

export default router;
