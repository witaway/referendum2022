import jwt from 'jsonwebtoken';
import process from 'process';

class AuthRepository {
	static async loginById(userId: number) {
		return jwt.sign(
			{
				id: userId,
			},
			process.env.JWTPrivateKey!,
			{
				expiresIn: 60 * 60,
			},
		);
	}
}

export default AuthRepository;
