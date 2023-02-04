const Translate = require('./translate');

module.exports = {
	
	async text(sText,sToLanguage = 'en') {

		return await Translate.text(sText.trim(),sToLanguage);
			
	}
}
