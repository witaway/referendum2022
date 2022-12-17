import { Strategy as JwtStrategy } from 'passport-jwt';
import * as process from 'process';
import express from 'express';
import passport from 'passport';
import UserRepository from '@repositories/user';

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
				const user = await UserRepository.getByID(payload.id);
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
		UserRepository.getByID(user.id).then((result) => {
			done(null, result.id);
		});
	});
};

export default setupPassportStrategies;
