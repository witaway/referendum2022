const authorized = (req: Express.Request, res: Express.Response, next: any) => {
	if (!req.user) {
		res.redirect('/login');
		return;
	}
	next();
};

export default authorized;
