const Controller = require('./home.controller');
const View = require('../../middlewares/View.js');
const Tracer = require('tracer').colorConsole();

const HomeAPI = {
	get: {
		handler: async (request,reply) => {
			
			Tracer.info(request.headers['user-agent']);

			return new View(request,reply)
				.send('home/index.eta',await Controller.getDefault({}));
		},
		url:'/'
	}

}
module.exports = HomeAPI;


