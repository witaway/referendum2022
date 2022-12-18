const acceptedRoles = (acceptedRoles: string[]) => {
	return (req: Express.Request, res: Express.Response, next: any) => {
		if (acceptedRoles.indexOf(req.user!.role) === -1) {
			res.render('error', {
				message: `Пользователь ${
					req.user!.username
				} не имеет прав для просмотра этой страницы.`,
			});
			return;
		}
		next();
	};
};

export default acceptedRoles;
