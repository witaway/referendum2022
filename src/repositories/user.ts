import prisma from '../database';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

interface UserInfo {
	username: string;
	password: string;
	FIO: string;
	role: Role;
}

class UserRepository {
	static async create(personalInfo: UserInfo) {
		const salt = bcrypt.genSaltSync(3);
		const password = personalInfo.password;

		const user = await prisma.user.create({
			data: {
				login: personalInfo.username,
				password: bcrypt.hashSync(password, salt),
				role: personalInfo.role,
				FIO: personalInfo.FIO,
			},
		});

		return user;
	}

	static async getList() {
		const users = prisma.user.findMany({
			select: {
				id: true,
				role: true,
				FIO: true,
				login: true,
			},
		});
		return users;
	}

	static async updateByID(userID: number, personalInfo: Partial<UserInfo>) {
		const user = await prisma.user.findUnique({ where: { id: userID } });

		const newData = {} as Partial<UserInfo>;

		if (personalInfo.FIO) newData.FIO = personalInfo.FIO;
		if (personalInfo.role) newData.role = personalInfo.role;
		if (personalInfo.username) newData.username = personalInfo.username;
		if (personalInfo.password) {
			const salt = bcrypt.genSaltSync(3);
			newData.password = bcrypt.hashSync(personalInfo.password, salt);
		}

		const newUser = prisma.user.update({
			where: {
				id: userID,
			},
			data: newData,
		});

		return newUser;
	}

	static async deleteByID(userID: number) {
		await prisma.user.delete({
			where: {
				id: userID,
			},
		});
	}

	static async getByID(userId: number, includePassword = false) {
		const user = await prisma.user.findUnique({
			select: {
				id: true,
				FIO: true,
				role: true,
				login: true,
				password: includePassword,
			},
			where: {
				id: userId,
			},
		});
		return user;
	}

	static async getByUsername(username: string, includePassword = false) {
		const user = await prisma.user.findUnique({
			select: {
				id: true,
				FIO: true,
				role: true,
				login: true,
				password: includePassword,
			},
			where: {
				login: username,
			},
		});
		return user;
	}
}

export default UserRepository;
