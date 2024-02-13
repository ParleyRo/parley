const Controller = require('./translate.controller');

const TranslateAPI = {
	post:{
		handler: async (request,reply) => {
			
			const text = request.body.text;
			const sToLanguage = request.body.toLanguage;

			if(typeof text === 'string'){
				return {
					state: 'success',
					data: {
						text: text
					}
				}
			}

			if(typeof text === 'object'){
				
				const aText = [];
				
				for (const [key,sText] of Object.entries(text)) {
					
					const oTranslated = await Controller.text(sText,sToLanguage);

					aText[key] = oTranslated.TranslatedText;
				}

				return {
					state: 'success',
					data: {
						text: aText
					}
				}
			}
						
			return {
				state: 'failed',
				data: null
			}
		},
		url:'/translate/'
	}

}
module.exports = TranslateAPI;
