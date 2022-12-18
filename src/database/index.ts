import Knex from 'knex';
import options from './knexfile';
import dotNotationParser from '@helpers/dot-notation-parser';

const knex = Knex({
	client: options['development'].client,
	connection: options['development'].connection,
});

knex.client.on('query-response', (response: any, obj: any) => {
	for (let i = 0; i < obj.response.rowCount; i++) {
		obj.response.rows[i] = dotNotationParser(obj.response.rows[i]);
	}
});

export default knex;
