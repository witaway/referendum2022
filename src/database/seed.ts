import { PrismaClient, Role } from '@prisma/client';
import { execSync } from 'child_process';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
	const fix_sequence = async (sequence: string, value: number) => {
		await prisma.$queryRawUnsafe(
			`ALTER SEQUENCE "${sequence}" RESTART WITH ${value}`,
		);
	};

	const password = (password: string): string => {
		const salt = bcrypt.genSaltSync(3);
		const hash = bcrypt.hashSync(password, salt);
		return hash;
	};

	// -----------------------------------------------------------------------------
	// Flush all tables

	await prisma.$queryRaw`DROP SCHEMA public CASCADE`;
	await prisma.$queryRaw`CREATE SCHEMA public`;

	// -----------------------------------------------------------------------------
	// Running prisma db push

	execSync('npx prisma db push', { stdio: 'inherit' });

	// -----------------------------------------------------------------------------
	// INSERT initial data

	const tours = await prisma.tour.createMany({
		data: [
			{ id: 1, number: 1, name: 'Первый тур референдума' },
			{ id: 2, number: 2, name: 'Второй тур референдума' },
		],
		skipDuplicates: true,
	});
	await fix_sequence('Tour_id_seq', 3);

	const options = await prisma.option.createMany({
		data: [
			{ id: 1, tourId: 1, name: 'за одобрение' },
			{ id: 2, tourId: 1, name: 'против одобрения' },
			{ id: 3, tourId: 2, name: 'за одобрение' },
			{ id: 4, tourId: 2, name: 'против одобрения' },
		],
	});
	await fix_sequence('Option_id_seq', 5);

	const users = await prisma.user.createMany({
		data: [
			{
				id: 1,
				role: Role.EDITOR,
				login: 'editor1',
				password: password('editor1'),
				FIO: 'Баглай Т.И.',
			},
			{
				id: 2,
				role: Role.EDITOR,
				login: 'editor2',
				password: password('editor2'),
				FIO: 'Артамонов Е.С.',
			},
			{
				id: 3,
				role: Role.EDITOR,
				login: 'editor3',
				password: password('editor3'),
				FIO: 'Новицкая М.В.',
			},
			{
				id: 4,
				role: Role.OBSERVER,
				login: 'observer1',
				password: password('observer1'),
				FIO: 'Орлов Н.В.',
			},
			{
				id: 5,
				role: Role.OBSERVER,
				login: 'observer2',
				password: password('observer2'),
				FIO: 'Лазуркина Т.Э.',
			},
		],
	});
	await fix_sequence('User_id_seq', 6);

	const places = await prisma.place.createMany({
		data: [
			{ number: 1, editorId: 1, address: 'ул. 1-я Набережная, 2' },
			{ number: 2, editorId: 1, address: 'ул. 7-я Лучёская, 21' },
			{ number: 3, editorId: 1, address: 'ул. Шмырёва, 30' },
			{ number: 4, editorId: 1, address: 'ул. Воинов-Интернационалистов, 10а' },
			{ number: 5, editorId: 1, address: 'пр-т Черняховского, 26-1' },
			{ number: 6, editorId: 1, address: 'пр-т Черняховского, 14' },
			{ number: 7, editorId: 1, address: 'ул. Чкалова 19а' },
			{ number: 8, editorId: 1, address: 'ул. Чкалова 19а' },
			{ number: 9, editorId: 1, address: 'ул. Чкалова 19а' },
			{ number: 10, editorId: 1, address: 'пр-т Черняховского, 14-5' },
			{ number: 11, editorId: 1, address: 'пр-т Черняховского, 14-5' },
			{ number: 12, editorId: 1, address: 'ул. Чкалова, 22' },
			{ number: 13, editorId: 1, address: 'ул. Чкалова, 22' },
			{ number: 14, editorId: 1, address: 'ул. Чкалова, 22' },
			{ number: 15, editorId: 1, address: 'пр-т Московский, 15' },
			{ number: 16, editorId: 1, address: 'пр-т Московский, 15' },
			{ number: 17, editorId: 1, address: 'пр-т Московский, 15' },
			{ number: 18, editorId: 1, address: 'пр-т Победы, 7' },
			{ number: 19, editorId: 1, address: 'пр-т Московский, 33' },
			{ number: 20, editorId: 1, address: 'ул. Гончарная, 17' },
			{ number: 21, editorId: 1, address: 'ул. Гражданская, 2' },
			{ number: 22, editorId: 1, address: 'ул. Ломоносова, 23' },
			{ number: 23, editorId: 1, address: 'ул. Ломоносова, 23' },
			{ number: 24, editorId: 1, address: 'ул. Максима Горького, 59в' },
			{ number: 25, editorId: 1, address: 'ул. Максима Горького, 61а' },
			{ number: 26, editorId: 1, address: 'ул. Золотогорская, 30' },
			{ number: 27, editorId: 1, address: 'ул. Максима Горького, 113' },
			{ number: 28, editorId: 2, address: 'ул. Максима Горького, 120' },
			{ number: 29, editorId: 2, address: 'ул. Максима Горького, 120' },
			{ number: 30, editorId: 2, address: 'ул. 11-я Социалистическая, 1' },
			{ number: 31, editorId: 2, address: 'ул. 11-я Социалистическая, 1' },
			{ number: 32, editorId: 2, address: 'ул. Максима Горького, 163б' },
			{ number: 33, editorId: 2, address: 'ул. Богатырёва, 17' },
			{
				number: 34,
				editorId: 2,
				address: 'ул. Воинов-Интернационалистов, 10а',
			},
			{ number: 35, editorId: 2, address: 'ул. Чкалова, 25в' },
			{
				number: 36,
				editorId: 2,
				address: 'ул. Воинов-Интернационалистов, 10а',
			},
			{
				number: 37,
				editorId: 2,
				address: 'ул. Воинов-Интернационалистов, 10а',
			},
			{ number: 38, editorId: 2, address: 'пр-т Московский, 41а' },
			{ number: 39, editorId: 2, address: 'ул. Петруся Бровки, 7' },
			{ number: 40, editorId: 2, address: 'ул. Петруся Бровки, 7' },
			{ number: 41, editorId: 2, address: 'пр-т Московский, 45а' },
			{ number: 42, editorId: 2, address: 'пр-т Московский, 45а' },
			{ number: 43, editorId: 2, address: 'ул. Петруся Бровки, 17' },
			{ number: 44, editorId: 2, address: 'ул. Петруся Бровки, 23а' },
			{ number: 45, editorId: 2, address: 'ул. Петруся Бровки, 23а' },
			{ number: 46, editorId: 2, address: 'ул. Чкалова, 32-7' },
			{ number: 47, editorId: 2, address: 'ул. Чкалова, 32-7' },
			{ number: 48, editorId: 2, address: 'ул. Чкалова, 32-7' },
			{ number: 49, editorId: 3, address: 'пр-т Победы, 29а' },
			{ number: 50, editorId: 3, address: 'пр-т Победы, 29а' },
			{ number: 51, editorId: 3, address: 'пр-т Победы, 29а' },
			{ number: 52, editorId: 3, address: 'ул. Воинов-Интернационалистов, 19' },
			{ number: 53, editorId: 3, address: 'ул. Воинов-Интернационалистов, 19' },
			{ number: 54, editorId: 3, address: 'ул. Чкалова, 47а' },
			{ number: 55, editorId: 3, address: 'ул. Чкалова, 47а' },
			{ number: 56, editorId: 3, address: 'ул. Чкалова, 47а' },
			{ number: 57, editorId: 3, address: 'пр-т Московский, 33' },
			{ number: 58, editorId: 3, address: 'пр-т Московский, 33' },
			{ number: 59, editorId: 3, address: 'пр-т Московский, 41а' },
			{ number: 60, editorId: 3, address: 'пр-т Московский, 41а' },
			{ number: 61, editorId: 3, address: 'ул. Короткевича, 3' },
			{ number: 62, editorId: 3, address: 'ул. Петруся Бровки, 33' },
			{ number: 63, editorId: 3, address: 'ул. Воинов-Интернационалистов, 37' },
			{ number: 64, editorId: 3, address: 'ул. Богатырёва, 17' },
			{ number: 65, editorId: 3, address: 'ул. Чкалова, 47а' },
			{ number: 66, editorId: 3, address: 'ул. Богатырёва, 5' },
			{ number: 67, editorId: 3, address: 'ул. Короткевича, 3' },
			{ number: 68, editorId: 3, address: 'ул. Богатырёва, 5' },
			{ number: 69, editorId: 3, address: 'ул. Богатырёва, 5' },
			{ number: 70, editorId: 3, address: 'ул. Чкалова, 47а' },
			{ number: 71, editorId: 3, address: 'ул. Богатырёва, 17' },
			{ number: 72, editorId: 3, address: 'ул. Богатырёва, 17' },
		],
	});
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
