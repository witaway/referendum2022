import UnauthorizedException from '../4xx/unauthorized-exception';

class PasswordNotMatchException extends UnauthorizedException {
	constructor() {
		super('The entered password does not match');
		Object.setPrototypeOf(this, PasswordNotMatchException.prototype);
	}
}
export default PasswordNotMatchException;
