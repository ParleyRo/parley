const fs = require('fs');
const path = require('path');
const jwt = require('../helpers/Jwt');
const mercurius = require('mercurius');
class GraphQL {

	static schema() {
		const typeDefs = [
			`
			scalar Upload
			type ObjectName {
				id: String,
				name: String,
			}
			type ObjectValue {
				id: String,
				value: String,
			}
			type MutationState {
				"Can be only 'success'"
				state: String,
				msg: String,
			}
			
			`

		]
		const resolvers = []

		const files = fs.readdirSync(path.join(process.cwd(), 'components'));
		files.forEach((file) => {
			// Load Schema Files

			if (!fs.existsSync(path.join(process.cwd(),'components',file,[file,'gql.js'].join('.')))) return;

			const componentSchema = require(path.join(process.cwd(),'components',file,[file,'gql'].join('.')));
			if (componentSchema.types) {
				typeDefs.push(componentSchema.types);
			}
			if (componentSchema.resolvers) {
				resolvers.push(componentSchema.resolvers);
			}

		});
		return {typeDefs,resolvers};
	}

	static errorFormatter(err,ctx) {
		let statusCode = 200;
		if (err.errors)
		for (const error of err.errors) {
			if (typeof error?.extensions?.statusCode !== "undefined") {
				if (error.extensions.statusCode > statusCode) statusCode = error.extensions.statusCode;
				delete error.extensions.statusCode;
			}
		}
		const response = mercurius.defaultErrorFormatter(err, ctx)
		response.statusCode = statusCode
		return response
	}

	static context(request, reply) {
		// Return an object that will be available in your GraphQL resolvers
		let sJwt = false;
		if (request.headers.authorization) {
			sJwt = request.headers.authorization.split(' ').pop();
			return {user: jwt.verify(sJwt)}
		}
		return {user:{uid:0}};
	}

}


module.exports = GraphQL;
