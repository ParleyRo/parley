const Controller = require('./oauth.controller');
const Jwt = require('../../helpers/Jwt')

const OauthAPI = {

	postConnect: {
		handler: async (request,reply) => {

			const response = await Controller.connectOauthAccount(request.body);

			if(response.token){
				const sJwt = Jwt.signer({user: {id: response.token}});

				reply.setCookie('token', sJwt, {path: '/'});

				reply.redirect('/home');

			}

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