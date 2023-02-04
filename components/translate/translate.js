const config = require('../../config.js') // eslint-disable-line node/no-unpublished-require

const AWS = require("aws-sdk");
AWS.config.update({
	accessKeyId: config.aws.accessKeyId,
	secretAccessKey: config.aws.secretAccessKey,
	region: config.aws.region
});

class Translate {
	
	static async text(sText,sToLg) {
		
		
		const oTranslate = new AWS.Translate();

		const oParams = {
			SourceLanguageCode: 'auto',
			TargetLanguageCode: sToLg,
			Text: sText
		};

		return new Promise((resolve, reject) => {
			
			oTranslate.translateText(oParams, (err, data) => {
				if (err) {
					resolve(err.toString())
				}
				resolve(data)
			});
		
		});


	}

}

module.exports = Translate; 