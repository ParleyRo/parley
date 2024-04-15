const Controller = require('./home.controller');
const View = require('../../middlewares/View.js');

const HomeAPI = {
	get: {
		handler: async (request,reply) => {
			
			return new View(request,reply)
				.send('home/index.eta',await Controller.getDefault({}));
		},
		url:'/'
	},
	postSubscribeNotification: {
		handler: async (request,reply) => {

			const ip = request.ip;
			const endpoint = request.body.endpoint;
			const auth = request.body.keys.auth;
			const p256dh = request.body.keys.p256dh;

			Controller.saveSubscribeNotificationData({
				ip:ip,
				endpoint:endpoint,
				auth:auth,
				p256dh:p256dh
			});
		},
		url:'/subscribeNotification'
	}

}
module.exports = HomeAPI;


