const rpc = require('../../middlewares/Rpc');
const db = require('../../libraries/database.js');

const Home = require('./home.js');

module.exports = {

	async getDefault(oParams) {
		
		const aTexts = [
			`Hey there, code aficionados! I'm not just your run-of-the-mill developer; I'm the proud captain of a code spaceship with over a decade of experience navigating the cosmic seas of software development. Buckle up and let's take a joyride through my tech universe:`,

			`<b>Front-end Fiesta:</b>`,
			`<ul>`,
			`<li>HTML is my secret language for talking to web browsers.</li>`,
			`<li>CSS is my artistic palette; I paint masterpieces with style.</li>`,
			`<li>JavaScript? Well, that's my coffee – can't start the day without it!</li>`,
			`<li>Vue.js and React are my dynamic duo, making user interfaces dance to the rhythm of the code.</li>`,
			`</ul>`,
			`<b>Back-end Banter:</b>`,
			`<ul>`,
			`<li>PHP is my trusty sidekick, handling server-side shenanigans for over 10 years.</li>`,
			`<li>Laravel is like my code butler, ensuring everything runs smoother than a cat video on the internet.</li>`,
			`<li>Node.js? It's where I tap into my superhero mode, using JavaScript to save the day on the server.</li>`,
			`</ul>`,
			`<b>Database Dazzle:</b>`,
			`<ul>`,
			`<li>MySQL is where I play Sherlock, solving mysteries in the world of relational databases.</li>`,
			`<li>MongoDB is my flexible friend, embracing the chaos of non-relational data like a pro.</li>`,
			`</ul>`,
			`<b>Version Control Virtuoso:</b>`,
			`<ul>`,
			`<li>Git is my time machine, keeping track of all the twists and turns in the code saga for over a decade. Think of me as the code historian with a sense of humor.</li>`,
			`</ul>`,
			`So, if you're looking for a developer who doesn't just code but also brings a dash of wit to the table, you've found your match. Let's create some tech magic together – the fun way!`

		]

		const oData = {
			aTexts: aTexts
		}

		return oData
	},

	async saveSubscribeNotificationData({ip,endpoint,auth,p256dh}){ 
		
		if(await db.getScalar('select count(*) as total from subscribtionNotifications where endpoint = ?',[endpoint],'total') > 0){
			return ;
		}
		await db.insert('subscribtionNotifications',{ip,endpoint,auth,p256dh});
	},

	async sendNotifications({title,body,icon,image,tag,requireInteraction,urgency,badge,persistent}){
		
		const dataToSend = {
			title: title,
			body: body,
			icon: icon,
			image: image,
			badge: badge,
			tag: tag,
			requireInteraction: requireInteraction,
			persistent: persistent,
			urgency: urgency
		};
		  
		const aSubscriptions = await db.query('select * from subscribtionNotifications',[]);

		aSubscriptions.forEach(subscription => {
			
			Home.sendPushNotification(subscription, dataToSend);
		});

	}
	
}
