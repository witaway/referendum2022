import AuthRepository from '../repositories/auth';
import UserRepository from '../repositories/user';

import {
	UsernameNotFoundException,
	PasswordNotMatchException,
} from '../classes/errors/auth_errors';

import bcrypt from 'bcryptjs';

class AuthService {
	static async loginWithUsernameAndPassword(
		username: string,
		password: string,
	) {
		const userWithGivenUsername = await UserRepository.getByUsername(
			username,
			true,
		);
		if (!userWithGivenUsername) {
			throw new UsernameNotFoundException();
		}

		const matchingResult = bcrypt.compareSync(
			password,
			userWithGivenUsername.password,
		);

		if (!matchingResult) {
			throw new PasswordNotMatchException();
		}

		const token = await AuthRepository.loginById(userWithGivenUsername.id);
		return token;
	}
}

export default AuthService;
