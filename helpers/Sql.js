class Query {
	constructor() {
		this._columns = []
		this._from = ""
		this._leftJoin = []
		this._where = []
		this._values = []
		this._limit = {
			start:0,
			length:8
		}
	}

	select(...args) {
		this._columns = this._columns.concat(args);
		return this;
	}

	from(table) {
		this._from = table;
		return this;
	}

	leftJoin(table,...where) {
		this._leftJoin.push({
			table:table,
			on: where
		})
		return this;
	}

	where(...args) {
		function processWhere(v) {
			const aObj = []
			aObj.push(v[0]);
			let value = null;
			if (typeof v[1] !== "undefined") {
				if (v[1] === "" || v[1] === "auto") {
					if (v[2] && Array.isArray(v[2]) && v[2].length) {
						if (v[2].length === 1) {
							aObj.push(`= ?`);	
							value = v[2][0];
						} else {
							aObj.push(`IN (?)`);
							value = v[2]
						}
						
					} else if (v[2]) {
						aObj.push(`= ?`);
						value = v[2];
					}
				} else {
					aObj.push(v[1]);
					aObj.push(`?`)
					value = v[2]
				}
			} 
			return {sStr:aObj.join(' '),uVal:value}
		}	

		if (Array.isArray(args[0])) {
			const aOrStr = []
			const aOrVal = []

			for (const v of args) {
				const r = processWhere(v);
				aOrStr.push(r.sStr);
				if (r.uVal !== null) aOrVal.push(r.uVal);

			}
			this._where.push(`(${aOrStr.join(' OR ')})`);
			this._values.concat(aOrVal);
		} else {
			const whereObj = processWhere(args);
			if (whereObj.sStr) this._where.push(whereObj.sStr);
			if (whereObj.uVal !== null) this._values.push(whereObj.uVal);
		}
		
		return this;
	}

	limit(start,length) {
		this._limit.start = start
		this._limit.length = length

		return this;
	}

	get() {
		const query = []
		query.push(`SELECT ${this._columns.join(',')} FROM ${this._from}`)
		if (this._leftJoin.length) {
			for (const v of this._leftJoin) {
				query.push(`LEFT JOIN ${v.table} ON`);
				const sOn = [];
				for (const w of v.on) {
					if (typeof w[1] !== "undefined") sOn.push(`${w[0]} = ${w[1]}`)
					else sOn.push(w[0])
				}
				query.push(sOn.join(" AND "))
			}
		}
		if (this._where.length) {
			query.push("WHERE");
			query.push(this._where.join(' AND '));
		}
		
		query.push("LIMIT");
		query.push(`${this._limit.start},${this._limit.length}`);
		

		return [query.join(' '),this._values];

	}

	static buildConditions(params) {
		const conditions = [];
		const values = [];
		for (const [k,v] of Object.entries(params)) {
			
				if (v && Array.isArray(v) && v.length) {
					conditions.push(`${k} IN (?)`);
					values.push(v);
				} else if (v) {
					conditions.push(`${k} = ?`);
					values.push(v[0]);
				}
			
		}
		return {
			where: conditions.length
					? conditions.join(' AND ') : '1',
			values: values
		};
	}
}

module.exports = Query
