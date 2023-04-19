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
	getPutereAruncareDinLBS: {
		handler: async (request,reply) => {
			
			return new View(request,reply)
				.send('hobby/pescuit/lbstograme/index.eta',await Controller.getDefault({}));

		},
		url:'/hobby/pescuit/puterearuncaredinlbs'
	}

}
module.exports = HobbyAPI;


