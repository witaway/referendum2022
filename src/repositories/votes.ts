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

	static async getDetails(tourId: number, editorId?: number) {
		const forSpecificEditor = `(SELECT place.* FROM place WHERE place.editor_id = :editorId)`;
		// returns option id, option name and count for option
		// sorts by option name as in other queries
		// if protocol is not processed, id and count could be null or undefined!
		const result = await knex.raw(
			`
			SELECT "option_id" as "optionId", "name" as "name", "count" as "count"
			FROM ${editorId ? knex.raw(forSpecificEditor, { editorId }) : 'place'} as pl
			CROSS JOIN (
				SELECT *
				FROM "option"
				WHERE "option".tour_id = :tourId
			) as opt
			LEFT JOIN votes 
			ON votes.option_id = "opt".id AND votes.place_id = pl."id"
			ORDER BY pl."number", "opt"."name"
		`,
			{ tourId },
		);
		return result.rows;
	}

	static async getSummary(tourId: number, editorId?: number) {
		const result = await knex.raw(
			`
			SELECT id, name, COALESCE(result, 0) as "count"
			FROM "option"
			LEFT JOIN (
				-- SELECT id and summary of count for these options
				SELECT vts.option_id, SUM(vts."count") as result
				FROM votes AS vts
				-- SELECT only votes from places where editor_id is X
				WHERE vts.place_id IN 
				-- All places where editor_id is X
				-- Or all places (editor_id > -1) 				
				(
					SELECT place.id
					FROM place
					WHERE place.editor_id ${
						editorId ? knex.raw('= :editorId', { editorId }) : '> -1'
					}
				)
				GROUP BY vts.option_id
			) AS option_results 
			ON "option".id = option_results.option_id
			WHERE option.tour_id = :tourId
			ORDER BY "option"."name"
		`,
			{ tourId },
		);
		return result.rows;
	}
}

export default VotesRepository;
