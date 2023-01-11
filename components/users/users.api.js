const Controller = require('./users.controller');
const View = require('../../middlewares/View.js');

const UsersAPI = {
	getLogin:{
		handler: async (request,reply) => new View(request,reply)
			.send('users/login.eta',await Controller.getDefault({
				auth: request.auth
			})),
		url:'/users/login'
	},
	getUser:{
		handler: async (request,reply) => {
			
			const oUser = await Controller.getUserById(request.params.id);

			delete oUser.password;
console.log(request.auth)
			return oUser;
		},
		url:'/users/:id',
		config: {
			hasScope : {
				user:true
			}
		}
	}

}
module.exports = UsersAPI;


