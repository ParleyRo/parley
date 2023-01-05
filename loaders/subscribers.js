const fs = require('fs');
const path = require('path');
const Subscribers = []
function start() {
	
	const files = fs.readdirSync(path.join(process.cwd(), 'components'));
	files.forEach((file) => {
		// Load API files
		if (!fs.existsSync(path.join(process.cwd(),'components',file,[file,'subscriber','js'].join('.')))) return;

		const Subscriber = require(path.join(process.cwd(),'components',file,[file,'subscriber'].join('.')));
		Subscribers.push(new Subscriber());
	})
}

module.exports = start;
