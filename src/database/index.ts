import { knex } from 'knex';
import options from './knexfile';

export default knex({
	client: options['development'].client,
	connection: options['development'].connection,
});
