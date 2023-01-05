const rpc = require('../../middlewares/Rpc');
const Controller = require('./users.controller');
// can be either class or function

function handlers(namespace) {
	rpc.setNamespace(namespace)
	.register('createUser', async (objValue) => await Controller.createUser(objValue))
	.register('getUserByUsername', async (username) => await Controller.getUserByUsername(username))
	.register('getUserById', async (id) => await Controller.getUserById(id))
}

module.exports = handlers
