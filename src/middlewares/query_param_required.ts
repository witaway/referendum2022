const requiredQueryParams = (requiredQueryParameters: string[]) => {
	return (req: Express.Request, res: Express.Response, next: any) => {
		for (const param of requiredQueryParameters) {
			if (!req.query[param]) {
				res.render('error', {
					message: `Отсутствует обязательный параметр ${param}`,
				});
				return;
			}
		}
		next();
	};
};

export default requiredQueryParams;
