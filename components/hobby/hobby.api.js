const Controller = require('./hobby.controller');
const View = require('../../middlewares/View.js');

const HobbyAPI = {
	getLungimeFire: {
		handler: async (request,reply) => {
			
			return new View(request,reply)
				.send('hobby/pescuit/lungimefire/index.eta',await Controller.getDefault({}));

		},
		url:'/hobby/pescuit/lungimeFire'
	},
	getPutereAruncareDinLbs: {
		handler: async (request,reply) => {
			
			return new View(request,reply)
				.send('hobby/pescuit/lbstograme/index.eta',await Controller.getDefault({}));

		},
		url:'/hobby/pescuit/putereAruncareDinLbs'
	},
	getRegula3Simpla: {
		handler: async (request,reply) => {
			
			return new View(request,reply)
				.send('hobby/math/regula3simpla/index.eta',await Controller.getDefault({}));

		},
		url:'/hobby/math/regula3simpla'
	},
	getRadio: {
		handler: async (request,reply) => {
			
			return new View(request,reply)
				.send('hobby/radio/list.eta',await Controller.getRadioData({}));

		},
		url:'/hobby/radio'
	}

}
module.exports = HobbyAPI;


