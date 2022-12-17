import knex from '../database';
import hashPassword from '@helpers/hash-password';

enum Role {
	EDITOR = 'EDITOR',
	OBSERVER = 'OBSERVER',
}

interface UserInfo {
	username: string;
	password: string;
	FIO: string;
	role: Role;
}

class UserRepository {
	static async create(personalInfo: UserInfo) {
		return knex('user')
			.insert({
				username: personalInfo.username,
				password: hashPassword(personalInfo.password),
				role: personalInfo.role,
				FIO: personalInfo.FIO,
			})
			.returning(['username', 'role', 'FIO'])
			.first();
	}

	static async getList() {
		return knex('user').select(['id', 'username', 'FIO', 'role']);
	}

	static async updateByID(id: number, personalInfo: Partial<UserInfo>) {
		const newData = {} as Partial<UserInfo>;

		if (personalInfo.FIO) newData.FIO = personalInfo.FIO;
		if (personalInfo.role) newData.role = personalInfo.role;
		if (personalInfo.username) newData.username = personalInfo.username;
		if (personalInfo.password) {
			newData.password = hashPassword(personalInfo.password);
		}

		return knex('user')
			.where({ id })
			.update(newData)
			.returning(['id', 'username', 'FIO', 'role'])
			.first();
	}

	static async deleteByID(id: number) {
		return knex('user')
			.where({ id })
			.delete()
			.returning(['id', 'username', 'FIO', 'role'])
			.first();
	}

	static async getByID(id: number, includePassword = false) {
		const selectedColumns = ['id', 'username', 'FIO', 'role'];
		if (includePassword) selectedColumns.push('password');
		return knex('user').where({ id }).select(selectedColumns).first();
	}

	static async getByUsername(username: string, includePassword = false) {
		const selectedColumns = ['id', 'username', 'FIO', 'role'];
		if (includePassword) selectedColumns.push('password');
		return knex('user').where({ username }).select(selectedColumns).first();
	}
}

export default UserRepository;
