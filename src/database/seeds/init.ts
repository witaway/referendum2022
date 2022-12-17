import { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
	const fix_sequence = async (sequence: string, value: number) => {
		knex.raw('ALTER SEQUENCE ?? RESTART WITH ?', [sequence, value]);
	};

	const hashPassword = (password: string): string => {
		const salt = bcrypt.genSaltSync(3);
		return bcrypt.hashSync(password, salt);
	};

	// Delete all entries in all databases
	await knex('option').del();
	await knex('place').del();
	await knex('protocol').del();
	await knex('tour').del();
	await knex('user').del();
	await knex('votes').del();

	// Insert initial data

	await knex('tour').insert([
		{ id: 1, number: 1, name: 'Первый тур референдума' },
		{ id: 2, number: 2, name: 'Второй тур референдума' },
	]);
	await fix_sequence('tour_id_seq', 3);

	await knex('option').insert([
		{ id: 1, tour_id: 1, name: 'за одобрение' },
		{ id: 2, tour_id: 1, name: 'против одобрения' },
		{ id: 3, tour_id: 2, name: 'за одобрение' },
		{ id: 4, tour_id: 2, name: 'против одобрения' },
	]);
	await fix_sequence('option_id_seq', 5);

	await knex('user').insert([
		{
			id: 1,
			role: 'EDITOR',
			username: 'editor1',
			password: hashPassword('editor1'),
			FIO: 'Баглай Т.И.',
		},
		{
			id: 2,
			role: 'EDITOR',
			username: 'editor2',
			password: hashPassword('editor2'),
			FIO: 'Артамонов Е.С.',
		},
		{
			id: 3,
			role: 'EDITOR',
			username: 'editor3',
			password: hashPassword('editor3'),
			FIO: 'Новицкая М.В.',
		},
		{
			id: 4,
			role: 'OBSERVER',
			username: 'observer1',
			password: hashPassword('observer1'),
			FIO: 'Орлов Н.В.',
		},
		{
			id: 5,
			role: 'OBSERVER',
			username: 'observer2',
			password: hashPassword('observer2'),
			FIO: 'Лазуркина Т.Э.',
		},
	]);
	await fix_sequence('user_id_seq', 6);

	await knex('place').insert([
		{ number: 1, editor_id: 1, address: 'ул. 1-я Набережная, 2' },
		{ number: 2, editor_id: 1, address: 'ул. 7-я Лучёская, 21' },
		{ number: 3, editor_id: 1, address: 'ул. Шмырёва, 30' },
		{ number: 4, editor_id: 1, address: 'ул. Воинов-Интернационалистов, 10а' },
		{ number: 5, editor_id: 1, address: 'пр-т Черняховского, 26-1' },
		{ number: 6, editor_id: 1, address: 'пр-т Черняховского, 14' },
		{ number: 7, editor_id: 1, address: 'ул. Чкалова 19а' },
		{ number: 8, editor_id: 1, address: 'ул. Чкалова 19а' },
		{ number: 9, editor_id: 1, address: 'ул. Чкалова 19а' },
		{ number: 10, editor_id: 1, address: 'пр-т Черняховского, 14-5' },
		{ number: 11, editor_id: 1, address: 'пр-т Черняховского, 14-5' },
		{ number: 12, editor_id: 1, address: 'ул. Чкалова, 22' },
		{ number: 13, editor_id: 1, address: 'ул. Чкалова, 22' },
		{ number: 14, editor_id: 1, address: 'ул. Чкалова, 22' },
		{ number: 15, editor_id: 1, address: 'пр-т Московский, 15' },
		{ number: 16, editor_id: 1, address: 'пр-т Московский, 15' },
		{ number: 17, editor_id: 1, address: 'пр-т Московский, 15' },
		{ number: 18, editor_id: 1, address: 'пр-т Победы, 7' },
		{ number: 19, editor_id: 1, address: 'пр-т Московский, 33' },
		{ number: 20, editor_id: 1, address: 'ул. Гончарная, 17' },
		{ number: 21, editor_id: 1, address: 'ул. Гражданская, 2' },
		{ number: 22, editor_id: 1, address: 'ул. Ломоносова, 23' },
		{ number: 23, editor_id: 1, address: 'ул. Ломоносова, 23' },
		{ number: 24, editor_id: 1, address: 'ул. Максима Горького, 59в' },
		{ number: 25, editor_id: 1, address: 'ул. Максима Горького, 61а' },
		{ number: 26, editor_id: 1, address: 'ул. Золотогорская, 30' },
		{ number: 27, editor_id: 1, address: 'ул. Максима Горького, 113' },
		{ number: 28, editor_id: 2, address: 'ул. Максима Горького, 120' },
		{ number: 29, editor_id: 2, address: 'ул. Максима Горького, 120' },
		{ number: 30, editor_id: 2, address: 'ул. 11-я Социалистическая, 1' },
		{ number: 31, editor_id: 2, address: 'ул. 11-я Социалистическая, 1' },
		{ number: 32, editor_id: 2, address: 'ул. Максима Горького, 163б' },
		{ number: 33, editor_id: 2, address: 'ул. Богатырёва, 17' },
		{
			number: 34,
			editor_id: 2,
			address: 'ул. Воинов-Интернационалистов, 10а',
		},
		{ number: 35, editor_id: 2, address: 'ул. Чкалова, 25в' },
		{
			number: 36,
			editor_id: 2,
			address: 'ул. Воинов-Интернационалистов, 10а',
		},
		{
			number: 37,
			editor_id: 2,
			address: 'ул. Воинов-Интернационалистов, 10а',
		},
		{ number: 38, editor_id: 2, address: 'пр-т Московский, 41а' },
		{ number: 39, editor_id: 2, address: 'ул. Петруся Бровки, 7' },
		{ number: 40, editor_id: 2, address: 'ул. Петруся Бровки, 7' },
		{ number: 41, editor_id: 2, address: 'пр-т Московский, 45а' },
		{ number: 42, editor_id: 2, address: 'пр-т Московский, 45а' },
		{ number: 43, editor_id: 2, address: 'ул. Петруся Бровки, 17' },
		{ number: 44, editor_id: 2, address: 'ул. Петруся Бровки, 23а' },
		{ number: 45, editor_id: 2, address: 'ул. Петруся Бровки, 23а' },
		{ number: 46, editor_id: 2, address: 'ул. Чкалова, 32-7' },
		{ number: 47, editor_id: 2, address: 'ул. Чкалова, 32-7' },
		{ number: 48, editor_id: 2, address: 'ул. Чкалова, 32-7' },
		{ number: 49, editor_id: 3, address: 'пр-т Победы, 29а' },
		{ number: 50, editor_id: 3, address: 'пр-т Победы, 29а' },
		{ number: 51, editor_id: 3, address: 'пр-т Победы, 29а' },
		{ number: 52, editor_id: 3, address: 'ул. Воинов-Интернационалистов, 19' },
		{ number: 53, editor_id: 3, address: 'ул. Воинов-Интернационалистов, 19' },
		{ number: 54, editor_id: 3, address: 'ул. Чкалова, 47а' },
		{ number: 55, editor_id: 3, address: 'ул. Чкалова, 47а' },
		{ number: 56, editor_id: 3, address: 'ул. Чкалова, 47а' },
		{ number: 57, editor_id: 3, address: 'пр-т Московский, 33' },
		{ number: 58, editor_id: 3, address: 'пр-т Московский, 33' },
		{ number: 59, editor_id: 3, address: 'пр-т Московский, 41а' },
		{ number: 60, editor_id: 3, address: 'пр-т Московский, 41а' },
		{ number: 61, editor_id: 3, address: 'ул. Короткевича, 3' },
		{ number: 62, editor_id: 3, address: 'ул. Петруся Бровки, 33' },
		{ number: 63, editor_id: 3, address: 'ул. Воинов-Интернационалистов, 37' },
		{ number: 64, editor_id: 3, address: 'ул. Богатырёва, 17' },
		{ number: 65, editor_id: 3, address: 'ул. Чкалова, 47а' },
		{ number: 66, editor_id: 3, address: 'ул. Богатырёва, 5' },
		{ number: 67, editor_id: 3, address: 'ул. Короткевича, 3' },
		{ number: 68, editor_id: 3, address: 'ул. Богатырёва, 5' },
		{ number: 69, editor_id: 3, address: 'ул. Богатырёва, 5' },
		{ number: 70, editor_id: 3, address: 'ул. Чкалова, 47а' },
		{ number: 71, editor_id: 3, address: 'ул. Богатырёва, 17' },
		{ number: 72, editor_id: 3, address: 'ул. Богатырёва, 17' },
	]);
}
