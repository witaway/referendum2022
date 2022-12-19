import ProtocolRepository from '@repositories/protocol';
import VotesRepository from '@repositories/votes';
import OptionRepository from '@repositories/option';

class ProtocolService {
	static async getData(tourId: number, placeId: number) {
		const protocolData = await ProtocolRepository.get(tourId, placeId);
		const votesData = await VotesRepository.get(tourId, placeId);
		return {
			protocol: protocolData,
			options: votesData,
		};
	}

	static async update(
		tourId: number,
		placeId: number,
		protocol: object,
		votes: Array<{ optionId: number; count: number }>,
	) {
		await ProtocolRepository.update(tourId, placeId, protocol);
		await VotesRepository.update(tourId, placeId, votes);
	}

	static async getResultsOfTour(tourId: number, editorId?: number) {
		// Load all needed data
		const options = await OptionRepository.getListByTourId(tourId);
		const protocolSummary = await ProtocolRepository.getSummary(
			tourId,
			editorId,
		);
		const protocolDetails = await ProtocolRepository.getDetails(
			tourId,
			editorId,
		);
		const votesSummary = await VotesRepository.getSummary(tourId, editorId);
		const votesDetails = await VotesRepository.getDetails(tourId, editorId);

		// Object with result
		const result: any = {};
		result.options = [];
		result.summary = {};
		result.details = {};

		// Processed and total protocols
		result.protocolsCount = protocolSummary.protocolsCount;
		result.protocolsProcessed = protocolSummary.protocolsProcessed;

		// Load list of options
		for (const option of options) {
			result.options.push(option.name);
		}

		// Load summary by protocol data
		result.summary.voters = protocolSummary.voters;
		result.summary.votingType = protocolSummary.votingType;

		// Load summary count by votes
		result.summary.options = [];
		let totalVotes = 0;
		for (const votes of votesSummary) {
			result.summary.options.push({
				count: votes.count,
			});
			totalVotes += votes.count;
		}

		// Load summary percent by votes
		result.summary.options = result.summary.options.map(
			(vote: { count: number }) => {
				const percents = (100 * vote.count) / totalVotes;
				return {
					count: vote.count,
					percents: Number.isNaN(percents) ? undefined : percents.toFixed(2),
				};
			},
		);

		// Information for table generating
		result.details.colspan = 9 + result.options.length * 2;

		// Load details

		// Index because we need to iterate over votes details
		// and each option and those votes are in separate rows
		// But in order of places first and in order of names second.
		let votesDetailsIdx = 0;

		result.details.rows = [];
		for (const protocol of protocolDetails) {
			const row: any = {};

			// Load info about processed or not protocol
			row.isProtocolProcessed = protocol.isProtocolProcessed;

			// Load place of protocol
			row.place = protocol.place;

			// If protocol is not processed, next info does not make any sense
			if (!row.isProtocolProcessed) {
				result.details.rows.push(row);
				votesDetailsIdx += result.options.length; // We're skipping whole row!
				continue;
			}

			// Voters and voting type
			row.voters = protocol.voters;
			row.votingType = protocol.votingType;

			// Load detailed count by votes
			row.options = [];
			let totalVotes = 0;
			for (let i = 0; i < result.options.length; i++) {
				row.options.push({
					count: votesDetails[votesDetailsIdx++].count,
				});
				totalVotes += row.options[i].count;
			}

			// Load summary percent by votes
			row.options = row.options.map((vote: { count: number }) => {
				return {
					count: vote.count,
					percents: ((100 * vote.count) / totalVotes).toFixed(2),
				};
			});

			// Push row
			result.details.rows.push(row);
		}

		return result;
	}
}

export default ProtocolService;
