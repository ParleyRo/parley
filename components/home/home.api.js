const Controller = require('./home.controller');
const View = require('../../middlewares/View.js');

const HomeAPI = {
	get:{
		handler: async (request,reply) => {
			
			if(request.auth == null){
				return reply.redirect('/users/login');
			}

			return new View(request,reply)
				.send('home/index.eta',await Controller.getDefault({
					auth: request.auth
				}));

		},
		url:'/'
	},
	getHome:{
		handler: async (request,reply) => {
			
			if(request.auth == null){
				return reply.redirect('/users/login');
			}

			return new View(request,reply)
				.send('home/index.eta',await Controller.getDefault({
					auth: request.auth
				}));

		},
		url:'/home'
	}

}
module.exports = HomeAPI;


