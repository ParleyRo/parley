const mysql = require(`mysql2/promise`);
const config = require('../config.js') // eslint-disable-line node/no-unpublished-require

let instance = false;

class Database {

	constructor(conn = false) {
		if (conn) this.connection = conn
	}

	async connect() {
		this.connection = await mysql.createPool({
			host: config.db.host,
			user: config.db.username,
			password: config.db.password,
			database: config.db.database,
			port: config.db.port,
			connectionLimit: 10,
			waitForConnections: true,
			queueLimit: 0,
			decimalNumbers: true,
			bigNumberStrings:true,
			supportBigNumbers:true,
			timezone: '+00:00'
		});

		this.connection.on(`error`, (err) => {
			console.error(`Connection error ${err.code}`);
			this.connect();
		});

	}

	async getRow(sql,params) {
		try {
			const [oResult] = await this.connection.query([sql,'limit 1'].join(' '),params)
			if (!oResult.length) return false;

			return oResult[0];
		} catch (err) {
			console.log(err,sql);
			throw new Error("Error on row")
		}
		
	}

	async getScalar(sql,params,position = 0) {
		try {
			const oResult = await this.getRow(sql,params);
			if (!oResult) return false;
			return oResult[position];
		} catch (err) {
			console.log(err);
			throw new Error("Error on scalar")
		}
		
	}

	async query(strQuery,params) {
		try {
			const [oResult] = await this.connection.query(strQuery,params);
			return oResult;
		} catch (err) {
			console.log(err);
			throw new Error("Error on query")
		}
		
	}

	async insert(table,params) {
		try {
			const [oResult] = await this.connection.query(`INSERT INTO ${table} SET ?`,params);
			return oResult;
			
		} catch (err) {
			console.log('database.insert',err);
			throw new Error("Error on insert")
		}
	}

	async delete(table,where) {
		try {
			const [oResult] = await this.connection.query(`DELETE FROM ${table} WHERE ?`,where);
			return oResult;
		} catch (err) {
			console.log('database.delete',err);
			throw new Error("Error on delete")
		}
	}

	async update(table,params,where) {
		try {
			const oSet = [];
			const oWhere = []
			const oValues = []
			for (const [key,value] of Object.entries(params)) {
				oSet.push(`${key}=?`);
				oValues.push(value);
			}
			for (const [key,value] of Object.entries(where)) {
				oWhere.push(`${key}=?`);
				oValues.push(value);
			}
			const [oResult] =  await this.connection.query([`UPDATE ${table} SET`,oSet.join(','),`WHERE`,oWhere.join(' AND ')].join(' '),oValues);
			return oResult;
			
		} catch (err) {
			console.log(err);
			throw new Error("Error on update")
		}
		
	}

	async beginTransaction() {
		const r = await this.connection.getConnection()
		await r.beginTransaction()

		return new Database(r)
	}

	async commit() {
		return await this.connection.commit()
	}

	async rollback() {
		return await this.connection.rollback()
	}

	async release() {
		return await this.connection.release()
	}

	/**
	* returns a singleton for the class
	* @constructs Database
	* @return {Database}
	*/
	static getInstance() {
		if (!instance) {
			instance = new Database();
		}
		return instance;
	}

}

module.exports = Database.getInstance();
