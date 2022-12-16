import 'express';
import { User as UserModel } from '@prisma/client';
import { ParsedQs } from 'qs';
import http from 'http';
import {
	CookieOptions,
	Errback,
	MediaType,
	NextFunction,
	ParamsDictionary,
	Send,
} from 'express-serve-static-core';
import {
	Options as RangeParserOptions,
	Ranges as RangeParserRanges,
	Result as RangeParserResult,
} from 'range-parser';

declare global {
	namespace Express {
		interface User extends Omit<UserModel, 'password'> {}

		interface Request<
			P = ParamsDictionary,
			ResBody = any,
			ReqBody = any,
			ReqQuery = ParsedQs,
			Locals extends Record<string, any> = Record<string, any>,
		> extends http.IncomingMessage,
				Express.Request {
			/**
			 * Return request header.
			 *
			 * The `Referrer` header field is special-cased,
			 * both `Referrer` and `Referer` are interchangeable.
			 *
			 * Examples:
			 *
			 *     req.get('Content-Type');
			 *     // => "text/plain"
			 *
			 *     req.get('content-type');
			 *     // => "text/plain"
			 *
			 *     req.get('Something');
			 *     // => undefined
			 *
			 * Aliased as `req.header()`.
			 */
			get(name: 'set-cookie'): string[] | undefined;
			get(name: string): string | undefined;

			header(name: 'set-cookie'): string[] | undefined;
			header(name: string): string | undefined;

			/**
			 * Check if the given `type(s)` is acceptable, returning
			 * the best match when true, otherwise `undefined`, in which
			 * case you should respond with 406 "Not Acceptable".
			 *
			 * The `type` value may be a single mime type string
			 * such as "application/json", the extension name
			 * such as "json", a comma-delimted list such as "json, html, text/plain",
			 * or an array `["json", "html", "text/plain"]`. When a list
			 * or array is given the _best_ match, if any is returned.
			 *
			 * Examples:
			 *
			 *     // Accept: text/html
			 *     req.accepts('html');
			 *     // => "html"
			 *
			 *     // Accept: text/*, application/json
			 *     req.accepts('html');
			 *     // => "html"
			 *     req.accepts('text/html');
			 *     // => "text/html"
			 *     req.accepts('json, text');
			 *     // => "json"
			 *     req.accepts('application/json');
			 *     // => "application/json"
			 *
			 *     // Accept: text/*, application/json
			 *     req.accepts('image/png');
			 *     req.accepts('png');
			 *     // => undefined
			 *
			 *     // Accept: text/*;q=.5, application/json
			 *     req.accepts(['html', 'json']);
			 *     req.accepts('html, json');
			 *     // => "json"
			 */
			accepts(): string[];
			accepts(type: string): string | false;
			accepts(type: string[]): string | false;
			accepts(...type: string[]): string | false;

			/**
			 * Returns the first accepted charset of the specified character sets,
			 * based on the request's Accept-Charset HTTP header field.
			 * If none of the specified charsets is accepted, returns false.
			 *
			 * For more information, or if you have issues or concerns, see accepts.
			 */
			acceptsCharsets(): string[];
			acceptsCharsets(charset: string): string | false;
			acceptsCharsets(charset: string[]): string | false;
			acceptsCharsets(...charset: string[]): string | false;

			/**
			 * Returns the first accepted encoding of the specified encodings,
			 * based on the request's Accept-Encoding HTTP header field.
			 * If none of the specified encodings is accepted, returns false.
			 *
			 * For more information, or if you have issues or concerns, see accepts.
			 */
			acceptsEncodings(): string[];
			acceptsEncodings(encoding: string): string | false;
			acceptsEncodings(encoding: string[]): string | false;
			acceptsEncodings(...encoding: string[]): string | false;

			/**
			 * Returns the first accepted language of the specified languages,
			 * based on the request's Accept-Language HTTP header field.
			 * If none of the specified languages is accepted, returns false.
			 *
			 * For more information, or if you have issues or concerns, see accepts.
			 */
			acceptsLanguages(): string[];
			acceptsLanguages(lang: string): string | false;
			acceptsLanguages(lang: string[]): string | false;
			acceptsLanguages(...lang: string[]): string | false;

			/**
			 * Parse Range header field, capping to the given `size`.
			 *
			 * Unspecified ranges such as "0-" require knowledge of your resource length. In
			 * the case of a byte range this is of course the total number of bytes.
			 * If the Range header field is not given `undefined` is returned.
			 * If the Range header field is given, return value is a result of range-parser.
			 * See more ./types/range-parser/index.d.ts
			 *
			 * NOTE: remember that ranges are inclusive, so for example "Range: users=0-3"
			 * should respond with 4 users when available, not 3.
			 *
			 */
			range(
				size: number,
				options?: RangeParserOptions,
			): RangeParserRanges | RangeParserResult | undefined;

			/**
			 * Return an array of Accepted media types
			 * ordered from highest quality to lowest.
			 */
			accepted: MediaType[];

			/**
			 * @deprecated since 4.11 Use either req.params, req.body or req.query, as applicable.
			 *
			 * Return the value of param `name` when present or `defaultValue`.
			 *
			 *  - Checks route placeholders, ex: _/user/:id_
			 *  - Checks body params, ex: id=12, {"id":12}
			 *  - Checks query string params, ex: ?id=12
			 *
			 * To utilize request bodies, `req.body`
			 * should be an object. This can be done by using
			 * the `connect.bodyParser()` middleware.
			 */
			param(name: string, defaultValue?: any): string;

			/**
			 * Check if the incoming request contains the "Content-Type"
			 * header field, and it contains the give mime `type`.
			 *
			 * Examples:
			 *
			 *      // With Content-Type: text/html; charset=utf-8
			 *      req.is('html');
			 *      req.is('text/html');
			 *      req.is('text/*');
			 *      // => true
			 *
			 *      // When Content-Type is application/json
			 *      req.is('json');
			 *      req.is('application/json');
			 *      req.is('application/*');
			 *      // => true
			 *
			 *      req.is('html');
			 *      // => false
			 */
			is(type: string | string[]): string | false | null;

			/**
			 * Return the protocol string "http" or "https"
			 * when requested with TLS. When the "trust proxy"
			 * setting is enabled the "X-Forwarded-Proto" header
			 * field will be trusted. If you're running behind
			 * a reverse proxy that supplies https for you this
			 * may be enabled.
			 */
			protocol: string;

			/**
			 * Short-hand for:
			 *
			 *    req.protocol == 'https'
			 */
			secure: boolean;

			/**
			 * Return the remote address, or when
			 * "trust proxy" is `true` return
			 * the upstream addr.
			 */
			ip: string;

			/**
			 * When "trust proxy" is `true`, parse
			 * the "X-Forwarded-For" ip address list.
			 *
			 * For example if the value were "client, proxy1, proxy2"
			 * you would receive the array `["client", "proxy1", "proxy2"]`
			 * where "proxy2" is the furthest down-stream.
			 */
			ips: string[];

			/**
			 * Return subdomains as an array.
			 *
			 * Subdomains are the dot-separated parts of the host before the main domain of
			 * the app. By default, the domain of the app is assumed to be the last two
			 * parts of the host. This can be changed by setting "subdomain offset".
			 *
			 * For example, if the domain is "tobi.ferrets.example.com":
			 * If "subdomain offset" is not set, req.subdomains is `["ferrets", "tobi"]`.
			 * If "subdomain offset" is 3, req.subdomains is `["tobi"]`.
			 */
			subdomains: string[];

			/**
			 * Short-hand for `url.parse(req.url).pathname`.
			 */
			path: string;

			/**
			 * Parse the "Host" header field hostname.
			 */
			hostname: string;

			/**
			 * @deprecated Use hostname instead.
			 */
			host: string;

			/**
			 * Check if the request is fresh, aka
			 * Last-Modified and/or the ETag
			 * still match.
			 */
			fresh: boolean;

			/**
			 * Check if the request is stale, aka
			 * "Last-Modified" and / or the "ETag" for the
			 * resource has changed.
			 */
			stale: boolean;

			/**
			 * Check if the request was an _XMLHttpRequest_.
			 */
			xhr: boolean;

			//body: { username: string; password: string; remember: boolean; title: string; };
			body: ReqBody;

			//cookies: { string; remember: boolean; };
			cookies: any;

			method: string;

			params: P;

			query: ReqQuery;

			route: any;

			signedCookies: any;

			originalUrl: string;

			url: string;

			baseUrl: string;

			app: Application;

			/**
			 * After middleware.init executed, Request will contain res and next properties
			 * See: express/lib/middleware/init.js
			 */
			res?: Response<ResBody, Locals> | undefined;
			next?: NextFunction | undefined;
		}

		interface Response<
			ResBody = any,
			Locals extends Record<string, any> = Record<string, any>,
			StatusCode extends number = number,
		> extends http.ServerResponse,
				Express.Response {
			/**
			 * Set status `code`.
			 */
			status(code: StatusCode): this;

			/**
			 * Set the response HTTP status code to `statusCode` and send its string representation as the response body.
			 * @link http://expressjs.com/4x/api.html#res.sendStatus
			 *
			 * Examples:
			 *
			 *    res.sendStatus(200); // equivalent to res.status(200).send('OK')
			 *    res.sendStatus(403); // equivalent to res.status(403).send('Forbidden')
			 *    res.sendStatus(404); // equivalent to res.status(404).send('Not Found')
			 *    res.sendStatus(500); // equivalent to res.status(500).send('Internal Server Error')
			 */
			sendStatus(code: StatusCode): this;

			/**
			 * Set Link header field with the given `links`.
			 *
			 * Examples:
			 *
			 *    res.links({
			 *      next: 'http://api.example.com/users?page=2',
			 *      last: 'http://api.example.com/users?page=5'
			 *    });
			 */
			links(links: any): this;

			/**
			 * Send a response.
			 *
			 * Examples:
			 *
			 *     res.send(new Buffer('wahoo'));
			 *     res.send({ some: 'json' });
			 *     res.send('<p>some html</p>');
			 *     res.status(404).send('Sorry, cant find that');
			 */
			send: Send<ResBody, this>;

			/**
			 * Send JSON response.
			 *
			 * Examples:
			 *
			 *     res.json(null);
			 *     res.json({ user: 'tj' });
			 *     res.status(500).json('oh noes!');
			 *     res.status(404).json('I dont have that');
			 */
			json: Send<ResBody, this>;

			/**
			 * Send JSON response with JSONP callback support.
			 *
			 * Examples:
			 *
			 *     res.jsonp(null);
			 *     res.jsonp({ user: 'tj' });
			 *     res.status(500).jsonp('oh noes!');
			 *     res.status(404).jsonp('I dont have that');
			 */
			jsonp: Send<ResBody, this>;

			/**
			 * Transfer the file at the given `path`.
			 *
			 * Automatically sets the _Content-Type_ response header field.
			 * The callback `fn(err)` is invoked when the transfer is complete
			 * or when an error occurs. Be sure to check `res.headersSent`
			 * if you wish to attempt responding, as the header and some data
			 * may have already been transferred.
			 *
			 * Options:
			 *
			 *   - `maxAge`   defaulting to 0 (can be string converted by `ms`)
			 *   - `root`     root directory for relative filenames
			 *   - `headers`  object of headers to serve with file
			 *   - `dotfiles` serve dotfiles, defaulting to false; can be `"allow"` to send them
			 *
			 * Other options are passed along to `send`.
			 *
			 * Examples:
			 *
			 *  The following example illustrates how `res.sendFile()` may
			 *  be used as an alternative for the `static()` middleware for
			 *  dynamic situations. The code backing `res.sendFile()` is actually
			 *  the same code, so HTTP cache support etc is identical.
			 *
			 *     app.get('/user/:uid/photos/:file', function(req, res){
			 *       var uid = req.params.uid
			 *         , file = req.params.file;
			 *
			 *       req.user.mayViewFilesFrom(uid, function(yes){
			 *         if (yes) {
			 *           res.sendFile('/uploads/' + uid + '/' + file);
			 *         } else {
			 *           res.send(403, 'Sorry! you cant see that.');
			 *         }
			 *       });
			 *     });
			 *
			 * @api public
			 */
			sendFile(path: string, fn?: Errback): void;
			sendFile(path: string, options: any, fn?: Errback): void;

			/**
			 * @deprecated Use sendFile instead.
			 */
			sendfile(path: string): void;
			/**
			 * @deprecated Use sendFile instead.
			 */
			sendfile(path: string, options: any): void;
			/**
			 * @deprecated Use sendFile instead.
			 */
			sendfile(path: string, fn: Errback): void;
			/**
			 * @deprecated Use sendFile instead.
			 */
			sendfile(path: string, options: any, fn: Errback): void;

			/**
			 * Transfer the file at the given `path` as an attachment.
			 *
			 * Optionally providing an alternate attachment `filename`,
			 * and optional callback `fn(err)`. The callback is invoked
			 * when the data transfer is complete, or when an error has
			 * ocurred. Be sure to check `res.headersSent` if you plan to respond.
			 *
			 * The optional options argument passes through to the underlying
			 * res.sendFile() call, and takes the exact same parameters.
			 *
			 * This method uses `res.sendfile()`.
			 */
			download(path: string, fn?: Errback): void;
			download(path: string, filename: string, fn?: Errback): void;
			download(
				path: string,
				filename: string,
				options: any,
				fn?: Errback,
			): void;

			/**
			 * Set _Content-Type_ response header with `type` through `mime.lookup()`
			 * when it does not contain "/", or set the Content-Type to `type` otherwise.
			 *
			 * Examples:
			 *
			 *     res.type('.html');
			 *     res.type('html');
			 *     res.type('json');
			 *     res.type('application/json');
			 *     res.type('png');
			 */
			contentType(type: string): this;

			/**
			 * Set _Content-Type_ response header with `type` through `mime.lookup()`
			 * when it does not contain "/", or set the Content-Type to `type` otherwise.
			 *
			 * Examples:
			 *
			 *     res.type('.html');
			 *     res.type('html');
			 *     res.type('json');
			 *     res.type('application/json');
			 *     res.type('png');
			 */
			type(type: string): this;

			/**
			 * Respond to the Acceptable formats using an `obj`
			 * of mime-type callbacks.
			 *
			 * This method uses `req.accepted`, an array of
			 * acceptable types ordered by their quality values.
			 * When "Accept" is not present the _first_ callback
			 * is invoked, otherwise the first match is used. When
			 * no match is performed the server responds with
			 * 406 "Not Acceptable".
			 *
			 * Content-Type is set for you, however if you choose
			 * you may alter this within the callback using `res.type()`
			 * or `res.set('Content-Type', ...)`.
			 *
			 *    res.format({
			 *      'text/plain': function(){
			 *        res.send('hey');
			 *      },
			 *
			 *      'text/html': function(){
			 *        res.send('<p>hey</p>');
			 *      },
			 *
			 *      'appliation/json': function(){
			 *        res.send({ message: 'hey' });
			 *      }
			 *    });
			 *
			 * In addition to canonicalized MIME types you may
			 * also use extnames mapped to these types:
			 *
			 *    res.format({
			 *      text: function(){
			 *        res.send('hey');
			 *      },
			 *
			 *      html: function(){
			 *        res.send('<p>hey</p>');
			 *      },
			 *
			 *      json: function(){
			 *        res.send({ message: 'hey' });
			 *      }
			 *    });
			 *
			 * By default Express passes an `Error`
			 * with a `.status` of 406 to `next(err)`
			 * if a match is not made. If you provide
			 * a `.default` callback it will be invoked
			 * instead.
			 */
			format(obj: any): this;

			/**
			 * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
			 */
			attachment(filename?: string): this;

			/**
			 * Set header `field` to `val`, or pass
			 * an object of header fields.
			 *
			 * Examples:
			 *
			 *    res.set('Foo', ['bar', 'baz']);
			 *    res.set('Accept', 'application/json');
			 *    res.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
			 *
			 * Aliased as `res.header()`.
			 */
			set(field: any): this;
			set(field: string, value?: string | string[]): this;

			header(field: any): this;
			header(field: string, value?: string | string[]): this;

			// Property indicating if HTTP headers has been sent for the response.
			headersSent: boolean;

			/** Get value for header `field`. */
			get(field: string): string | undefined;

			/** Clear cookie `name`. */
			clearCookie(name: string, options?: CookieOptions): this;

			/**
			 * Set cookie `name` to `val`, with the given `options`.
			 *
			 * Options:
			 *
			 *    - `maxAge`   max-age in milliseconds, converted to `expires`
			 *    - `signed`   sign the cookie
			 *    - `path`     defaults to "/"
			 *
			 * Examples:
			 *
			 *    // "Remember Me" for 15 minutes
			 *    res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
			 *
			 *    // save as above
			 *    res.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true })
			 */
			cookie(name: string, val: string, options: CookieOptions): this;
			cookie(name: string, val: any, options: CookieOptions): this;
			cookie(name: string, val: any): this;

			/**
			 * Set the location header to `url`.
			 *
			 * The given `url` can also be the name of a mapped url, for
			 * example by default express supports "back" which redirects
			 * to the _Referrer_ or _Referer_ headers or "/".
			 *
			 * Examples:
			 *
			 *    res.location('/foo/bar').;
			 *    res.location('http://example.com');
			 *    res.location('../login'); // /blog/post/1 -> /blog/login
			 *
			 * Mounting:
			 *
			 *   When an application is mounted and `res.location()`
			 *   is given a path that does _not_ lead with "/" it becomes
			 *   relative to the mount-point. For example if the application
			 *   is mounted at "/blog", the following would become "/blog/login".
			 *
			 *      res.location('login');
			 *
			 *   While the leading slash would result in a location of "/login":
			 *
			 *      res.location('/login');
			 */
			location(url: string): this;

			/**
			 * Redirect to the given `url` with optional response `status`
			 * defaulting to 302.
			 *
			 * The resulting `url` is determined by `res.location()`, so
			 * it will play nicely with mounted apps, relative paths,
			 * `"back"` etc.
			 *
			 * Examples:
			 *
			 *    res.redirect('back');
			 *    res.redirect('/foo/bar');
			 *    res.redirect('http://example.com');
			 *    res.redirect(301, 'http://example.com');
			 *    res.redirect('http://example.com', 301);
			 *    res.redirect('../login'); // /blog/post/1 -> /blog/login
			 */
			redirect(url: string): void;
			redirect(status: number, url: string): void;
			/** @deprecated use res.redirect(status, url) instead */
			redirect(url: string, status: number): void;

			/**
			 * Render `view` with the given `options` and optional callback `fn`.
			 * When a callback function is given a response will _not_ be made
			 * automatically, otherwise a response of _200_ and _text/html_ is given.
			 *
			 * Options:
			 *
			 *  - `cache`     boolean hinting to the engine it should cache
			 *  - `filename`  filename of the view being rendered
			 */
			render(
				view: string,
				options?: object,
				callback?: (err: Error, html: string) => void,
			): void;
			render(view: string, callback?: (err: Error, html: string) => void): void;

			locals: Locals;

			charset: string;

			/**
			 * Adds the field to the Vary response header, if it is not there already.
			 * Examples:
			 *
			 *     res.vary('User-Agent').render('docs');
			 *
			 */
			vary(field: string): this;

			app: Application;

			/**
			 * Appends the specified value to the HTTP response header field.
			 * If the header is not already set, it creates the header with the specified value.
			 * The value parameter can be a string or an array.
			 *
			 * Note: calling res.set() after res.append() will reset the previously-set header value.
			 *
			 * @since 4.11.0
			 */
			append(field: string, value?: string[] | string): this;

			/**
			 * After middleware.init executed, Response will contain req property
			 * See: express/lib/middleware/init.js
			 */
			req: Request;
		}
	}
}
