import knex from '@database/index';

class ProtocolRepository {
	static async get(tourId: number, placeId: number) {
		return knex
			.select([
				'protocol.p_1',
				'protocol.p_2',
				'protocol.p_3',
				'protocol.p_3_1',
				'protocol.p_3_2',
				'protocol.p_3_3',
				'protocol.p_8',
				'protocol.p_9',
				'protocol.p_10',
				'protocol.p_11',
			])
			.from('protocol')
			.where({
				'protocol.tour_id': tourId,
				'protocol.place_id': placeId,
			})
			.first();
	}

	static async update(tourId: number, placeId: number, protocolData: object) {
		return knex('protocol')
			.insert({
				...protocolData,
				tour_id: tourId,
				place_id: placeId,
			})
			.onConflict(['tour_id', 'place_id'])
			.merge();
	}
}

export default ProtocolRepository;
