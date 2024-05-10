const Controller = require('./home.controller');
const View = require('../../middlewares/View.js');
const Tracer = require('tracer').colorConsole();
const crypto = require('crypto');

const HomeAPI = {
	get: {
		handler: async (request,reply) => {
			
			return new View(request,reply)
				.send('home/index.eta',await Controller.getDefault({}));
		},
		url:'/'
	}

}
module.exports = HomeAPI;


