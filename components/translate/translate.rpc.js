const rpc = require('../../middlewares/Rpc');
const Controller = require('./translate.controller');
// can be either class or function

function handlers(namespace) {
	rpc.setNamespace(namespace)
	.register('text', async (text,toLg) => await Controller.text(text,toLg))
}

module.exports = handlers
