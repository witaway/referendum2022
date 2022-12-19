import ProtocolService from '@services/protocol';

class ResultsController {
	static async view(req: Express.Request, res: Express.Response) {
		const tourId = Number(req.query.tour_id);
		const userId = Number(req.user!.id);

		const role = req.user!.role;

		const data =
			role === 'EDITOR'
				? await ProtocolService.getResultsOfTour(tourId, userId)
				: await ProtocolService.getResultsOfTour(tourId);

		data.dateFormatted = new Date().toLocaleString();
		data.userRole = role;
		data.tourId = tourId;

		res.render('results', data);
	}
}

export default ResultsController;
