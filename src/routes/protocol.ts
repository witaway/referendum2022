import { Router } from 'express';

const router = Router();

import requiredQueryParams from '@middlewares/query_param_required';
router.get(
	'/edit',
	requiredQueryParams(['tour_id', 'place_id']),
	(req, res) => {
		if (!req.user) {
			res.redirect('/login');
		} else {
			res.render('protocol/edit', {
				tour_id: 1,
				place_id: 5,
				processed: true,
				place: {
					number: 12,
					address: '1-я ломоносова к. 5',
				},
				protocol: {
					p_1: 0,
					p_2: 0,
					p_3: 0,
					p_3_1: 0,
					p_3_2: 0,
					p_3_3: 0,
					p_8: 0,
					p_9: 0,
					p_10: 0,
					p_11: 0,
				},
				options: [
					{
						id: 1,
						name: 'за одобрение',
						votes: {
							count: 1,
						},
					},
					{
						id: 2,
						name: 'против одобрения',
						votes: {
							count: 2,
						},
					},
				],
			});
		}
	},
);

router.post('/save', (req, res) => {
	// Recieves something like this in req.body
	//
	// const result = {
	// 	tour_id: '1',
	// 	place_id: '5',
	// 	protocol: {
	// 		p_1: '10',
	// 		p_2: '1',
	// 		p_3: '0',
	// 		p_3_1: '0',
	// 		p_3_2: '0',
	// 		p_3_3: '0',
	// 		p_8: '0',
	// 		p_9: '0',
	// 		p_10: '0',
	// 		p_11: '0',
	// 	},
	// 	options: [
	// 		{ id: '1', votes: { count: '1' } },
	// 		{ id: '2', votes: { count: '2' } },
	// 	],
	// };
	res.render('protocol/save', {
		timer_seconds: 5,
		tour_id: 1,
	});
});

export default router;
