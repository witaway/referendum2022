import UnauthorizedException from '../4xx/unauthorized_exception';

class UsernameNotFoundException extends UnauthorizedException {
	constructor() {
		super('User with this username was not found');
		Object.setPrototypeOf(this, UsernameNotFoundException.prototype);
	}
}
export default UsernameNotFoundException;
