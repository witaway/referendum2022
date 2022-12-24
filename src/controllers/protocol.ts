import ProtocolService from '@services/protocol';
import PlaceRepository from '@repositories/place';
import ProtocolRepository from '@repositories/protocol';
import VotesRepository from '@repositories/votes';

class ProtocolController {
	static async edit(req: Express.Request, res: Express.Response) {
		const tourId = Number(req.query.tour_id);
		const placeId = Number(req.query.place_id);

		const place = await PlaceRepository.getById(placeId);

		const protocol = await ProtocolRepository.get(tourId, placeId);

		const options = await VotesRepository.get(tourId, placeId);

		const processed = protocol !== undefined;

		res.render('protocol/view', {
			editable: true,
			goBackButtonText: 'Вернуться к списку участков',
			goBackButtonLink: `/places?tour_id=${tourId}`,
			tourId,
			placeId,
			processed,
			place,
			protocol,
			options,
		});
	}

	static async view(req: Express.Request, res: Express.Response) {
		const tourId = Number(req.query.tour_id);
		const placeId = Number(req.query.place_id);

		const place = await PlaceRepository.getById(placeId);

		const protocol = await ProtocolRepository.get(tourId, placeId);

		const options = await VotesRepository.get(tourId, placeId);

		const processed = protocol !== undefined;

		res.render('protocol/view', {
			editable: false,
			goBackButtonText: 'Вернуться к сводной таблице',
			goBackButtonLink: `/results?tour_id=${tourId}`,
			tourId,
			placeId,
			processed,
			place,
			protocol,
			options,
		});
	}

	static async summary(req: Express.Request, res: Express.Response) {
		const tourId = Number(req.query.tour_id);
		const role = req.user!.role;

		let protocol, options;
		if (role === 'EDITOR') {
			const editorId = Number(req.user!.id);
			protocol = await ProtocolRepository.getSummary(tourId, editorId);
			options = await VotesRepository.getSummary(tourId, editorId);
		} else {
			protocol = await ProtocolRepository.getSummary(tourId);
			options = await VotesRepository.getSummary(tourId);
		}

		const processed = protocol.protocolsCount == protocol.protocolsProcessed;

		res.render('protocol/summary', {
			goBackButtonText: 'Вернуться к сводной таблице',
			goBackButtonLink: `/results?tour_id=${tourId}`,
			tourId,
			processed,
			protocol: protocol.rawProtocolData,
			options,
		});
	}

	static async save(req: Express.Request, res: Express.Response) {
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
		// 	votes: [
		// 		{ optionId: '1', count: '1' },
		// 		{ optionId: '2', count: '2' },
		// 	],
		// };
		ProtocolService.update(
			req.body.tourId,
			req.body.placeId,
			req.body.protocol,
			req.body.votes,
		);
		res.render('protocol/save', {
			timer_seconds: 5,
			tour_id: req.body.tourId,
		});
	}
}

export default ProtocolController;
