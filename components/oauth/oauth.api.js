const Controller = require('./oauth.controller');
const Jwt = require('../../helpers/Jwt');

const OauthAPI = {

	postConnect: {
		handler: async (request,reply) => {

			const oAuth = await Controller.connectOauthAccount(request.body);

			if(oAuth.token){
				const sJwt = Jwt.signer({user: {id: oAuth.token}});

				reply.setCookie('token', sJwt, {path: '/'});

				return reply.redirect('/home');

			}

			return oAuth;

		},
		url:'/oauth/connect'
		
	},
	getDisconnect: {
		handler: async (request,reply) => {

			reply.clearCookie('token');

			reply.redirect('/users/login');
		},
		url:'/oauth/disconnect'
	}
}
module.exports = OauthAPI;