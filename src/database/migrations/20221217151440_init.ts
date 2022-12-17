import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema
		.createTable('user', (table) => {
			table.increments('id').primary();

			table.string('FIO', 60);
			table.string('username', 60).unique();
			table.string('password');
			table.enum('role', ['EDITOR', 'OBSERVER'], {
				useNative: true,
				enumName: 'roles',
			});
		})

		.createTable('place', (table) => {
			table.increments('id').primary();

			table.integer('editor_id').references('id').inTable('user');
			table.integer('number');
			table.string('address', 200);
		})

		.createTable('tour', (table) => {
			table.increments('id').primary();

			table.integer('number');
			table.string('name', 100);
		})

		.createTable('option', (table) => {
			table.increments('id').primary();

			table.integer('tour_id').references('id').inTable('tour');
			table.string('name', 200);
		})

		.createTable('protocol', (table) => {
			table.integer('place_id').references('id').inTable('place');
			table.integer('tour_id').references('id').inTable('tour');

			table.integer('p_1');
			table.integer('p_2');
			table.integer('p_3');
			table.integer('p_3_1');
			table.integer('p_3_2');
			table.integer('p_3_3');
			table.integer('p_8');
			table.integer('p_9');
			table.integer('p_10');
			table.integer('p_11');

			table.primary(['place_id', 'tour_id']);
		})

		.createTable('votes', (table) => {
			table.integer('place_id').references('id').inTable('place');
			table.integer('tour_id').references('id').inTable('tour');

			table.integer('option_id').references('id').inTable('option');
			table.integer('count');

			table.primary(['place_id', 'tour_id']);
		});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema
		.dropTable('user')
		.dropTable('place')
		.dropTable('tour')
		.dropTable('option')
		.dropTable('protocol')
		.dropTable('votes');
}
