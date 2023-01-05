const fs = require('fs');
const path = require('path');
const RPCs = []
function start() {
	
	const files = fs.readdirSync(path.join(process.cwd(), 'components'));
	files.forEach((file) => {
		// Load API files
		if (!fs.existsSync(path.join(process.cwd(),'components',file,[file,'rpc','js'].join('.')))) return;

		const RPC = require(path.join(process.cwd(),'components',file,[file,'rpc'].join('.')));
		RPCs.push(new RPC(file));
	})
}

module.exports = start;
