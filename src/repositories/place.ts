import knex from '@database/index';

class PlaceRepository {
	static async getById(id: number) {
		return knex
			.select(['place.number as number', 'place.address as address'])
			.from('place')
			.where({
				id,
			})
			.first();
	}

	static async getListWithProcessedStatus(tourId: number, editorId?: number) {
		const forSpecificEditor = 'place.editor_id = :editorId';

		const result = await knex.raw(
			`
			SELECT place.id, place.number, place.address, prot.p_1 IS NOT NULL as processed
			FROM place
				LEFT JOIN (
					SELECT p_1, place_id
					FROM protocol
					WHERE protocol.tour_id = :tourId
				) AS prot ON prot.place_id = place.id
				WHERE ${editorId ? knex.raw(forSpecificEditor, { editorId }) : '1=1'}
				ORDER BY place.number;
		`,
			{ tourId },
		);
		return result.rows;
	}
}

export default PlaceRepository;
