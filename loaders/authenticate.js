const fp = require("fastify-plugin")
const config = require('../config.js') // eslint-disable-line node/no-unpublished-require
const rpc = require('../middlewares/Rpc');

module.exports = fp(async (fastify, opts) => {
	fastify.register(require("@fastify/jwt"), {
		secret: config.jwt.secret,
		decoratorName: 'auth',
		cookie: {
			cookieName: 'token'
		}
	})
	fastify.decorate("authenticate", async (request, reply) => { // eslint-disable-line
		function validateScope(scope, user, err = false) {
			if (scope === Object(scope) && Boolean(scope) && scope.constructor === Object)
				for (const [key, value] of Object.entries(scope)) {
					if (key.charAt(0) === "_") continue;
					if (!user[key]) throw {"error":"SCOPE_INVALID","message":`Missing key: ${key}`,'statusCode':401,'fail':scope.fail ?? err}
					if (value === Object(value) && Boolean(value) && value.constructor === Object) {
						validateScope(value,user[key],scope.__fail ?? err)
					} else if (Array.isArray(value)) {
						if (value.some((e) => e === Object(e))) {
							for (const lValue of value) {
								validateScope(lValue,user[key]);
							}
						} else if (!value.includes(user[key])) throw {"error":"SCOPE_INVALID","message":`Unexpected value for ${key}: ${user[key]}`,'statusCode':401,'fail':scope.fail ?? err}
					} else if (user[key] !== Object(user[key]) || value !== true) if (user[key] !== value) throw {"error":"SCOPE_INVALID","message":`Unexpected value for ${key}: ${user[key]}`,'statusCode':401,'fail':scope.fail ?? err}
				}
		}
		console.log(111)
		try {
			await request.jwtVerify()
			/** check the scope of the route and see if the user has the required params  */
			if (request.routeConfig.hasScope) validateScope(request.routeConfig.hasScope,request.auth)
		} catch (err) {
			if (request.routeConfig.failAuth) {
				/** check if failAuth is just a string, we do not need action to just show the error page */
				let failAuth = request.routeConfig.failAuth;
				if (typeof request.routeConfig.failAuth === "string")
				failAuth = {action:request.routeConfig.failAuth}
				switch (failAuth.action) {
					case "redirect":
						if (request.headers['x-requested-with'] === 'XMLHttpRequest') return {
							redirect: request.routeConfig.failAuth?.url ?? '/'
						}
						reply.redirect(request.routeConfig?.failAuth?.code ?? 301, request.routeConfig.failAuth?.url ?? '/')
					break;
					case "error":
						reply.send(err)
						// falls through
					default:
						reply.send(err)
					break;
				}
			} else {
				if (request.headers['x-requested-with'] === 'XMLHttpRequest') return {
					redirect: request.routeConfig.failAuth?.url ?? '/'
				}
				reply.redirect(301, '/')
			}
		}
	})


	fastify.decorate("silentAuthenticate", async (request, reply) => {
		try {
			await request.jwtVerify()
		} catch (e) {
			// empty
		}
	})
	fastify.decorate("authorize", async (request, reply) => { // eslint-disable-line
		try {
			if (request.routeConfig.hasScope?.admin) {
				if (!request?.auth?.admin?.id) throw {"error":"USER_INVALID","message":`Missing user id`,'statusCode':401}
				/** require the admin user and check the permissions(?)  */
				const user = await rpc.gods.getAdminById(request.auth.admin.id);
				if (!user.exists) throw {"error":"USER_INVALID","message":`User not found`,'statusCode':401}
				let arrScopes = [];
				if (Array.isArray(request.routeConfig.hasScope.admin)) arrScopes = request.routeConfig.hasScope.admin
				else arrScopes = [request.routeConfig.hasScope.admin];
				for (const element of arrScopes) {
					if (typeof element !== "object") continue;
					const scope = Object.assign({ _state : [1] },element);
					for (const [key, value] of Object.entries(scope)) {
						if (key.charAt(0) !== "_") continue;
						if (key === "__fail") continue;
						const sParam = key.slice(1);
						if (user.get(sParam) === null) throw {"error":"SCOPE_INVALID","message":`Missing key: ${key}`,'statusCode':401, 'fail':scope?.__fail ?? false}
						if (Array.isArray(value)) {
							if (!value.includes(user.get(sParam))) throw {"error":"SCOPE_INVALID","message":`Unexpected value for ${key}: ${user.get(sParam)}`,'statusCode':401,'fail':scope?.__fail ?? false}
						} else if (user.get(sParam) !== value) throw {"error":"SCOPE_INVALID","message":`Unexpected value for ${key}: ${user.get(sParam)}`,'statusCode':401,'fail':scope?.__fail ?? false}
					}
				}
				if (request.sessionAuth) request.sessionAuth.admin = user;
				else request.sessionAuth = {admin: user}
			}
			if (request.routeConfig.hasScope?.user) {
				if (!request?.auth?.user?.id) throw {"error":"USER_INVALID","message":`Missing user id`,'statusCode':401}
				/** require the normal user and check the permissions(?)  */
				// const user = await rpc.call("users.getUserById",request.auth.user.id);
				const user = await rpc.users.getUserById(request.auth.user.id);
				if (!user.exists) throw {"error":"USER_INVALID","message":`User not found`,'statusCode':401}
				let arrScopes = [];
				if (Array.isArray(request.routeConfig.hasScope.user)) arrScopes = request.routeConfig.hasScope.user
				else arrScopes = [request.routeConfig.hasScope.user];
				for (const element of arrScopes) {
				if (typeof element !== "object") continue;
					const scope = Object.assign({ _state : [0,1] },element);
					for (const [key, value] of Object.entries(scope)) {
						if (key.charAt(0) !== "_") continue;
						if (key === "__fail") continue;
						const sParam = key.slice(1);
						if (user.get(sParam) === null) throw {"error":"SCOPE_INVALID","message":`Missing key: ${key}`,'statusCode':401, 'fail':scope?.__fail ?? false}
						if (Array.isArray(value)) {
							if (!value.includes(user.get(sParam))) throw {"error":"SCOPE_INVALID","message":`Unexpected value for ${key}: ${user.get(sParam)}`,'statusCode':401,'fail':scope?.__fail ?? false}
						} else if (user.get(sParam) !== value) throw {"error":"SCOPE_INVALID","message":`Unexpected value for ${key}: ${user.get(sParam)}`,'statusCode':401,'fail':scope?.__fail ?? false}
					}
				}
				if (request.sessionAuth) request.sessionAuth.user = user;
				else request.sessionAuth = {user: user}
			}
		} catch (err) {
			let failAuth = err?.fail ? err?.fail : request.routeConfig.failAuth
			if (failAuth) {
				/** check if failAuth is just a string, we do not need action to just show the error page */
				if (typeof failAuth === "string")
				failAuth = {action:failAuth}
				switch (failAuth.action) {
					case "redirect":
						if (request.headers['x-requested-with'] === 'XMLHttpRequest') return {
							redirect: failAuth?.url ?? '/'
						}
						reply.redirect(failAuth?.code ?? 301, failAuth?.url ?? '/')
					break;
					case "error":
						reply.send(err)
						// falls through
					default:
						reply.send(err)
					break;
				}
			} else {
				if (request.headers['x-requested-with'] === 'XMLHttpRequest') return {
					redirect: failAuth?.url ?? '/'
				}
				reply.redirect(301, '/')
			}
		}
	})
})
