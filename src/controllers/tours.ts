import TourRepository from '@repositories/tour';

class ToursContoller {
	static async viewTours(req: Express.Request, res: Express.Response) {
		const dateFormatted = new Date().toLocaleString();
		let linksTo, tours;

		if (req.user!.role === 'EDITOR') {
			linksTo = 'places';
			tours = await TourRepository.getListWithProtocolsCount(req.user!.id);
		} else {
			linksTo = 'results';
			tours = await TourRepository.getListWithProtocolsCount();
		}

		res.render('tours', {
			dateFormatted,
			linksTo,
			tours,
		});
	}
}

export default ToursContoller;
