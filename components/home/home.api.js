const Controller = require('./home.controller');
const View = require('../../middlewares/View.js');
const Tracer = require('tracer').colorConsole();

const HomeAPI = {
	get: {
		handler: async (request,reply) => {
			
			const isGooglebot = () => {
				const userAgent = navigator.userAgent;
				const botNames = ['Googlebot','Chrome-Lighthouse']
				for (const botName of botNames) {
				  if (userAgent.includes(botName)) {
					return true;
				  }
				}
			  return false
				
			  }
			Tracer.info('Is googleBot?: ' + isGooglebot());
			Tracer.debug(request.headers['user-agent']);

			return new View(request,reply)
				.send('home/index.eta',await Controller.getDefault({}));
		},
		url:'/'
	}

}
module.exports = HomeAPI;


