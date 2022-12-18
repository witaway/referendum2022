import { Router } from 'express';

function redirectRootToDefaultUrl(defaultUrl: string) {
	const redirectionRouter = Router({ strict: true });
	redirectionRouter.use(
		'/',
		(req: Express.Request, res: Express.Response, next: any) => {
			const containsOnlySlashes = new RegExp(/^[\/][\/ ]*$/gm).test(req.url);
			if (containsOnlySlashes) {
				res.redirect(defaultUrl);
				return;
			}
			next();
		},
	);
	return redirectionRouter;
}

export default redirectRootToDefaultUrl;
