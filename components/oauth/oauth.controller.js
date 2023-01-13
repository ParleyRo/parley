const rpc = require('../../middlewares/Rpc');

module.exports = {
	async connectOauthAccount(data) {

		const oUser = await rpc.users.getUserByLogin(data.username,data.password);

		if(oUser.exists){
			return {
				token: oUser.id
			};
		}
		return {"state":"failed"}
	}

}
