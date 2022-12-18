import knex from '@database/index';

class VotesRepository {
	static async get(tourId: number, placeId: number) {
		const result = await knex.raw(
			`
				SELECT opt.id as id, opt.name as name, vot.count as "votes.count"
				FROM (
					SELECT *
					FROM option
					WHERE option.tour_id = :tourId
				) as opt
				LEFT JOIN (
					SELECT *
					FROM votes
					WHERE votes.tour_id = :tourId AND votes.place_id = :placeId
				) as vot ON opt.id = vot.option_id
				ORDER BY opt.name;
			`,
			{ tourId, placeId },
		);

		return result.rows;
	}

	static async update(
		tourId: number,
		placeId: number,
		votesList: Array<{ optionId: number; count: number }>,
	) {
		for (const votes of votesList) {
			await knex('votes')
				.insert({
					tour_id: tourId,
					place_id: placeId,
					option_id: votes.optionId,
					count: votes.count,
				})
				.onConflict(['tour_id', 'place_id', 'option_id'])
				.merge(['count']);
		}
	}
}

export default VotesRepository;
