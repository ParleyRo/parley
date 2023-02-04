const rpc = require('../../middlewares/Rpc');

module.exports = {

	async getDefault(oParams) {
		
		const aTexts = [
			`I am a highly experienced web developer with over 10 years in the field. My expertise includes technologies such as HTML, CSS, JavaScript, Vue.js, PHP, Laravel framework, Node.js, React, MySQL, MongoDB, Git, and many others. With a strong foundation in front-end and back-end development, I bring a unique blend of technical skills and creativity to every project.`,
			`My passion for web development started early on, and it has only grown over the years. I have worked on a variety of projects, from simple websites to complex web applications, and I have consistently delivered high-quality results to my clients.`,
			`I have a deep understanding of the latest web development trends and technologies, and I am always seeking new ways to improve my skills and stay ahead of the curve. I am a problem solver at heart, and I take great pride in delivering solutions that exceed my clients' expectations.`,
			`Whether you are looking for a simple website, a complex web application, or anything in between, I am here to help. I offer a range of web development services, including custom web design and development, website maintenance, and more.`,
			`If you are ready to take your web presence to the next level, I would love to hear from you. Contact me today to schedule a consultation and learn more about how I can help bring your vision to life.`
		]

		//await rpc.translate.text(aTexts[0],'rddo')

		const oData = {
			aTexts: aTexts
		}

		return oData
	}
	
}
