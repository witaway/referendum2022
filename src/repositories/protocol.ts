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

	static async getDetails(tourId: number, editorId?: number) {
		const forSpecificEditor =
			'(SELECT place.* FROM place WHERE place.editor_id = :editorId)';

		const result = await knex.raw(
			`
			SELECT 
		    
-- 		    flag is protocol processed
-- 		    if false, then all data except place is invalid, do not use it!
			"p_1" IS NOT NULL as "isProtocolProcessed",

-- 			info about place of protocol
			pl."id" as "place.id", "FIO" as "place.editorFIO", "number" as "place.number", "address" as "place.address",

-- 			info about voters in protocol
			"p_1" as "voters.count", "p_2" as "voters.gotBulletin", "p_3" as "voters.votedCount", round((("p_3" / "p_1"::FLOAT) * 100)::numeric, 2) as "voters.votedPercent", 

-- 			info about voting types in protocol
			"p_3_1" as "votingType.early", "p_3_2" as "votingType.atHome", "p_3_3" as "votingType.atPlace",

-- 			raw data section with original column names
			"p_1" as "rawProtocolData.p_1", "p_2" as "rawProtocolData.p_2", "p_3" as "rawProtocolData.p_3", "p_3_1" as "rawProtocolData.p_3_1", 
			"p_3_2" as "rawProtocolData.p_3_2", "p_3_3" as "rawProtocolData.p_3_3", "p_8" as "rawProtocolData.p_8", "p_9" as "rawProtocolData.p_9", 
			"p_10" as "rawProtocolData.p_10", "p_11" as "rawProtocolData.p_11"

			FROM ${editorId ? knex.raw(forSpecificEditor, { editorId }) : 'place'} as pl

			LEFT JOIN (
				SELECT *
				FROM protocol
				WHERE protocol.tour_id = :tourId
			) as pr
			ON pl.id = pr.place_id

			LEFT JOIN "user" on "user"."id" = pl.editor_id

			ORDER BY pl."number"
		`,
			{ tourId },
		);
		return result.rows;
	}

	static async getSummary(tourId: number, editorId?: number) {
		const forSpecificEditor = `(SELECT place."id" FROM place WHERE place.editor_id = :editorId)`;

		const result = await knex.raw(
			`
			SELECT 

-- 			quantity of processed protocols and protocols in total
			COUNT(place) as "protocolsCount", COUNT(protocol.p_1) as "protocolsProcessed", 

-- 			info about voters in protocol
			SUM(protocol.p_1) as "voters.count", SUM(protocol.p_2) as "voters.gotBulletin", SUM(protocol.p_3) as "voters.votedCount", 
			ROUND(((SUM(protocol.p_3)/SUM(protocol.p_1)::FLOAT) * 100)::numeric, 2) AS "voters.votedPercent",

-- 			info about voting types in protocol
			SUM(protocol.p_3_1) as "votingType.early", SUM(protocol.p_3_2) as "votingType.atHome", SUM(protocol.p_3_3) as "votingType.atPlace",

-- 			raw data section with original column names
			SUM(protocol.p_1) as "rawProtocolData.p_1", SUM(protocol.p_2) as "rawProtocolData.p_2", SUM(protocol.p_3) as "rawProtocolData.p_3", 
			SUM(protocol.p_3_1) as "rawProtocolData.p_3_1", SUM(protocol.p_3_2) as "rawProtocolData.p_3_2", SUM(protocol.p_3_3) as "rawProtocolData.p_3_3", 
			SUM(protocol.p_8) as "rawProtocolData.p_8", SUM(protocol.p_9) as "rawProtocolData.p_9", SUM(protocol.p_10) as "rawProtocolData.p_10", 
			SUM(protocol.p_11) as "rawProtocolData.p_11"

		FROM ${editorId ? knex.raw(forSpecificEditor, { editorId }) : 'place'} as place

		LEFT JOIN (
			SELECT * 
			FROM protocol
			WHERE protocol.tour_id = :tourId
		) as protocol on place."id" = protocol.place_id
		`,
			{ tourId },
		);
		return result.rows[0];
	}
}

export default ProtocolRepository;
