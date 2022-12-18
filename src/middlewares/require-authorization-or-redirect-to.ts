const requireAuthorizationOrRedirectTo = function (url: string) {
	return (req: Express.Request, res: Express.Response, next: any) => {
		if (!req.user) {
			res.redirect(url);
			return;
		}
		next();
	};
};

export default requireAuthorizationOrRedirectTo;
