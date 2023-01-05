const db = require('../../libraries/database.js');
const BaseModel = require('../../abstracts/BaseModel.js');

class User extends BaseModel {
	constructor(result) {
		
		super(result);
		this.state = 1;
	}

	static async getByUsername(username) {
		if (!username) throw {"error":"bad-query","message":"username required"} 
		const result = await db.getRow("SELECT * FROM users WHERE username = ?",[username]);
		return new User(result);

    }

	static async getById(id) {
		if (!id) throw {"error":"bad-query","message":"id required"} 
		const result = await db.getRow("SELECT * FROM users WHERE id = ?",[id]);
		return new User(result);

    }

	static async create(objValue) {
		
		const result = await db.insert('users',objValue);
		return new User({...objValue,id:result.insertId});

    }

	async update(params) {
		super.update(params);
		return await db.update('users',params,{id:this.id}); 
	}

	get(param) {
		return typeof this[param] !== 'undefined' ? this[param] : null;
	}
}

module.exports = User;
