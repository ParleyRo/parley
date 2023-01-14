const rpc = require('../../middlewares/Rpc');

module.exports = {
	async connectOauthAccount(data) {

		const oUser = await rpc.users.getUserByLogin(data.username,data.password);

		if(oUser.exists){
			return {
				token: oUser.id
			};
		}

		return {
			error:"login-failed",
			message: "We couldn't verify your credentials."
		}
	}

}
