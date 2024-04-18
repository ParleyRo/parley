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
			const endpoint = request.body.subscription.endpoint;
			const auth = request.body.subscription.keys.auth;
			const p256dh = request.body.subscription.keys.p256dh;

			const details = {
				browser: request.body.details.browser,
				os: request.body.details.os
			}
			
			console.log(111,request.body.navigator);

			await Controller.saveSubscribeNotificationData({
				ip:ip,
				endpoint:endpoint,
				auth:auth,
				p256dh:p256dh,
				details: JSON.stringify(details)
			});
		},
		url:'/subscribeNotification'
	},
	getSendNotifications: {
		handler: async (request,reply) => {
			
			const data = {
				title: 'poftim , mesajul tau este aici!',
				body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
				icon: request.protocol + '://' + request.hostname + '/assets/default/img/logo_large.png',
				badge: request.protocol + '://' + request.hostname + '/assets/default/img/logo-inline.png',
				image: request.protocol + '://' + request.hostname + '/assets/default/img/logo-inline.png',
				tag: '',
				requireInteraction: false,
				persistent: true,
				urgency: 'normal',
				dir: 'auto',
			};
			return new View(request,reply)
				.send('home/notifications.eta', {data});

		},
		url:'/sendNotifications'
	},
	postSendNotifications: {
		handler: async (request,reply) => {

			const data = {
				title: request.body.title,
				body: request.body.body,
				icon: request.body.icon,
				badge: request.body.badge,
				image: request.body.image,
				tag: request.body.tag,
				requireInteraction: request.body.requireInteraction,
				persistent: request.body.persistent,
				urgency: request.body.urgency,
				dir: request.body.dir

			};

			//return data;
			return await Controller.sendNotifications(data);

		},
		url:'/sendNotifications'
	},

}
module.exports = HomeAPI;


