import ProtocolRepository from '@repositories/protocol';
import VotesRepository from '@repositories/votes';

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
}

export default ProtocolService;
