import { Strategy as JwtStrategy } from 'passport-jwt';
import * as process from 'process';
import express from 'express';
import prisma from '../database';
import passport from 'passport';

const setupPassportStrategies = () => {
	const extractJwtFromCookiesField = (field: string) => {
		return (req: express.Request) => {
			let token = null;
			if (req && req.cookies && req.cookies[field]) {
				token = req.cookies[field];
			}
			return token;
		};
	};

	const options = {
		jwtFromRequest: extractJwtFromCookiesField('jwt'),
		secretOrKey: process.env.JWTPrivateKey,
	};

	passport.use(
		new JwtStrategy(options, async (payload, done) => {
			try {
				const user = await prisma.user.findUnique({
					select: {
						id: true,
						role: true,
						FIO: true,
						login: true,
					},
					where: {
						id: payload.id,
					},
				});
				if (user) {
					return done(null, user);
				} else {
					return done(null, false);
					// or you could create a new account
				}
			} catch (err) {
				done(err, false);
			}
		}),
	);

	passport.serializeUser(function (user: any, done: any) {
		done(null, user.id);
	});

	passport.deserializeUser(function (user: any, done: any) {
		prisma.user
			.findUnique({
				where: {
					id: user.id,
				},
				select: {
					id: true,
				},
			})
			.then((user) => {
				done(null, user!.id);
			});
	});
};

export default setupPassportStrategies;
