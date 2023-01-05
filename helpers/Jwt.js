const jwt = require('fast-jwt');
const config = require('../config.js') // eslint-disable-line node/no-unpublished-require

let instance = null;
class JWT {
	constructor(secret = false) {
		let sSecret = secret;
		if (!sSecret) sSecret = config.jwt.secret
		this.secret = sSecret;
		this.signer = jwt.createSigner({ key: sSecret })
		this.verifier = jwt.createVerifier({ key: sSecret })
	}

	sign(payload = false,options = {}) {
		try {
			if (!payload) throw Error('Payload is required');
			return this.signer(payload);
		} catch (e) {
			console.log(e.message)
			return false;
		}

	}

	verify(token,options = {}) {
		try {
			if (!token) throw Error('Token is required');
			return this.verifier(token);
		} catch (e) {
			console.log(e.message)
			return false;
		}
	}

	static getInstance() {
        if (!instance) {
            instance = new JWT();
        }
        return instance;
    }


}

module.exports = JWT.getInstance();
