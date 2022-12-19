import knex from '@database/index';

class OptionRepository {
	static async getListByTourId(tourId: number) {
		return knex('option')
			.select(['id', 'name'])
			.where({
				tour_id: tourId,
			})
			.orderBy('name');
	}
}

export default OptionRepository;
