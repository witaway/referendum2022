import Knex from 'knex';
import options from './knexfile';
import dotNotationParser from '@helpers/dot-notation-parser';

const knex = Knex({
	client: options['development'].client,
	connection: options['development'].connection,
});

knex.client.on('query-response', (response: any, obj: any, builder: any) => {
	obj.response.rows[0].a = 1;
	//console.log(obj.response);
	//obj.response.rows = dotNotationParser(obj.response.rows);
});

export default knex;
