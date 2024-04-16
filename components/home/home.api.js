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

			await Controller.saveSubscribeNotificationData({
				ip:ip,
				endpoint:endpoint,
				auth:auth,
				p256dh:p256dh
			});
		},
		url:'/subscribeNotification'
	},
	getSendNotifications: {
		handler: async (request,reply) => {

			const ip = request.query.title || 'poftim , mesajul tau este aici!';
			const endpoint = request.query.body || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
			const icon = request.protocol + '://' + request.hostname + '/assets/default/img/logo_large.png';
			const image = request.protocol + '://' + request.hostname + '/assets/default/img/logo-inline.png';
			const tag = request.query.tag || null;

			await Controller.sendNotifications({
				title:ip,
				body:endpoint,
				icon:icon,
				image:image,
				tag:tag
			});
		},
		url:'/sendNotifications'
	},

}
module.exports = HomeAPI;


