import passport from 'passport';

const auth = (req: Express.Request, res: Express.Response, next: any) => {
	passport.authenticate(
		'jwt',
		{
			session: false,
		},
		(err: any, user: any, info: any) => {
			if (err) {
				return next(err);
			}
			if (!user) req.user = undefined;
			else req.user = user;
			next();
		},
	)(req, res, next);
};

export default auth;
