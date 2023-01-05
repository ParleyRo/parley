class BaseModelObject {
	constructor(data) {
		this.id = 0;
		this.exists = false;
		if (!data) return;
		this._initialize(data);
	}

	_initialize(data) {
		for (const [key,value] of Object.entries(data)) {
			this[key] = value;
		}
		this.exists = this.id!==0?true:false;
	}
	update(params) {
		for (const [key,value] of Object.entries(params)) {
			this[key] = value;
		}
	}
		
}

module.exports = BaseModelObject;
