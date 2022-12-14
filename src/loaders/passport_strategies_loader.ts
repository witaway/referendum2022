// import { Strategy as JwtStrategy } from 'passport-jwt';
// import * as process from 'process';
// import passport from 'passport';
//
// const setupPassportStrategies = () => {
// 	const extractJwtFromCookiesField = (field: string) => {
// 		return (req) => {
// 			let token = null;
// 			if (req && req.cookies && req.cookies[field]) {
// 				token = req.cookies[field];
// 			}
// 			return token;
// 		};
// 	};
//
// 	const optionsJwt = {
// 		jwtFromRequest: extractJwtFromCookiesField('jwt'),
// 		secretOrKey: process.env.JWTPrivateKey,
// 	};
//
// 	passport.use(
// 		'jwt',
// 		new JwtStrategy(optionsJwt, async (payload, done) => {
// 			try {
// 				const user = (await Users.get({ uuid: payload.id }))[0];
// 				if (user) {
// 					return done(null, user);
// 				} else {
// 					return done(null, false);
// 				}
// 			} catch (err) {
// 				done(err, false);
// 			}
// 		}),
// 	);
//
// 	passport.serializeUser(function (user, done) {
// 		done(null, user.uuid);
// 	});
//
// 	passport.deserializeUser(async function (uuid, done) {
// 		const foundUser = (await Users.get({ uuid }))[0];
// 		done(null, foundUser);
// 	});
// };
//
// module.exports = setupPassportStrategies;
