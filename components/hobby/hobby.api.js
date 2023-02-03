const Controller = require('./hobby.controller');
const View = require('../../middlewares/View.js');

const HobbyAPI = {
	get:{
		handler: async (request,reply) => {
			
			return new View(request,reply)
				.send('hobby/pescuit/lungimefire/index.eta',await Controller.getDefault({}));

		},
		url:'/hobby/pescuit/lungimeFire'
	}

}
module.exports = HobbyAPI;


