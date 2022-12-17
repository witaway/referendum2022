import bcrypt from 'bcryptjs';

function hashPassword(password: string): string {
	const salt = bcrypt.genSaltSync(3);
	return bcrypt.hashSync(password, salt);
}

export default hashPassword;
