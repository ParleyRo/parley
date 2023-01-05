const fs = require('fs');
const path = require('path');
const Services = []
function start() {
	
	const files = fs.readdirSync(path.join(process.cwd(), 'components'));
	files.forEach((file) => {
		// Load API files
		if (!fs.existsSync(path.join(process.cwd(),'components',file,[file,'service','js'].join('.')))) return;

		const Service = require(path.join(process.cwd(),'components',file,[file,'service'].join('.')));
		Services.push(new Service());
	})
}

module.exports = start;
