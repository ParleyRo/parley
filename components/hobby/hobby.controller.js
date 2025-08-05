const db = require('../../libraries/database.js');

module.exports = {

	async getDefault(oParams) {
			
		const oData = {
			
		}

		return oData
	},

	async getRadioData(oFilter) {
		
		const oData = await db.query(`
				SELECT * 
				FROM radio 
				ORDER BY id ASC
			`,
			[]
		);

		return {
			stations: oData
		}
	}
	
}
