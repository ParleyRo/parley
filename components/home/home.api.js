const Controller = require('./home.controller');
const View = require('../../middlewares/View.js');
const Tracer = require('tracer').colorConsole();

const HomeAPI = {
	get: {
		handler: async (request,reply) => {

			return new View(request,reply)
				.send('home/index.eta',await Controller.getDefault({}));
		},
		url:'/'
	},
	post:{
		handler: async (request,reply) => {
			
			const body = request.body;
			
			console.log(body);
						
			return {
				state: 'failed',
				data: null
			}
		},
		url:'/svakom/'
	}

}
module.exports = HomeAPI;