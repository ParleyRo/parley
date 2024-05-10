const rpc = require('../../middlewares/Rpc');
const db = require('../../libraries/database.js');
const common = require('../../helpers/Common.js');

module.exports = {

	async getDefault(oParams) {
		
		const aTexts = [
			`Hey there, code aficionados! I'm not just your run-of-the-mill developer; I'm the proud captain of a code spaceship with over a decade of experience navigating the cosmic seas of software development. Buckle up and let's take a joyride through my tech universe:`,

			`<b>Front-end Fiesta:</b>`,
			`<li>HTML is my secret language for talking to web browsers.</li>`,
			`<li>CSS is my artistic palette; I paint masterpieces with style.</li>`,
			`<li>JavaScript? Well, that's my coffee – can't start the day without it!</li>`,
			`<li>Vue.js and React are my dynamic duo, making user interfaces dance to the rhythm of the code.</li>`,
			`<b>Back-end Banter:</b>`,
			`<li>PHP is my trusty sidekick, handling server-side shenanigans for over 10 years.</li>`,
			`<li>Laravel is like my code butler, ensuring everything runs smoother than a cat video on the internet.</li>`,
			`<li>Node.js? It's where I tap into my superhero mode, using JavaScript to save the day on the server.</li>`,
			`<b>Database Dazzle:</b>`,
			`<li>MySQL is where I play Sherlock, solving mysteries in the world of relational databases.</li>`,
			`<li>MongoDB is my flexible friend, embracing the chaos of non-relational data like a pro.</li>`,
			`<b>Version Control Virtuoso:</b>`,
			`<li>Git is my time machine, keeping track of all the twists and turns in the code saga for over a decade. Think of me as the code historian with a sense of humor.</li>`,
			`So, if you're looking for a developer who doesn't just code but also brings a dash of wit to the table, you've found your match. Let's create some tech magic together – the fun way!`

		]

		const oData = {
			aTexts: aTexts
		}

		return oData
	}
	
}
