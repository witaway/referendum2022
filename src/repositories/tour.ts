import knex from '@database/index';

class TourRepository {
	static async getListWithProtocolsCount(editorId?: number) {
		const forSpecificEditor = 'place.editor_id = :editorId';

		const result = await knex.raw(
			`
				SELECT tour.id, tour.number, tour.name, COUNT(protocol.p_1) as "protocols.processed", COUNT(place) as "protocols.total"
				FROM tour
					CROSS JOIN place
					LEFT JOIN protocol
						ON protocol.tour_id = tour.id AND protocol.place_id = place.id 
				WHERE ${editorId ? knex.raw(forSpecificEditor, { editorId }) : '1=1'}
				GROUP BY tour.id, tour.number
				ORDER BY tour.number
		`,
		);

		return result.rows;
	}
}

export default TourRepository;
