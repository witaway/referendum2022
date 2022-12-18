import PlaceRepository from '@repositories/place';

class PlacesController {
	static async viewPlaces(req: Express.Request, res: Express.Response) {
		const tourId = Number(req.query.tour_id);
		const editorId = Number(req.user!.id);

		const places = await PlaceRepository.getListWithProcessedStatus(
			tourId!,
			editorId,
		);

		res.render('places', {
			tour_id: req.query.tour_id,
			places,
		});
	}
}

export default PlacesController;
