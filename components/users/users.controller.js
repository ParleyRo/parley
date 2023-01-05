// const aws = require('./aws').getInstance();
const User = require('./user');


module.exports = {

	async getDefault(params) {
			
		const oData = {
			test: true
		}

		return oData
	},

	async getUserByUsername(username) {
		if (!username) throw {"error":"username-required","message":"Username is required"};
		return await User.getByUsername(username);
	},
	async getUserById(id) {
		if (!id) throw {"error":"id-required","message":"id is required"};
		return await User.getById(id);
	},
	async createUser(objValue = {}) {
		
		return await User.create(objValue);
	}
	
	

}
