const fs = require('fs');
const path = require('path');
function getFuncAndMethod(funcName) {
		const aSplitFuncName = funcName.replace(/([a-z0-9])([A-Z])/gu, '$1 $2').split(' ')
		let sMethod = aSplitFuncName.shift();
		const sFuncName = aSplitFuncName.join('');
		let bPrivate = false;
		if (sMethod.charAt(0) === "_") {
			sMethod = sMethod.substring(1);
			bPrivate = true;
		}
		return {method:sMethod.toUpperCase(),func:sFuncName,private:bPrivate};
	}

function getRouteObject(oPath,oFuncMethod,file,oRouteInit = {},apiSchema) {
	let oRoute = oRouteInit;
	if (typeof oPath === "object") {
		oRoute = Object.assign(oRoute,oPath);
		if (typeof oRoute.method === "undefined") {
			oRoute.method = oFuncMethod.method
		}
		if (typeof oRoute.url === "undefined") {
			oRoute.url = ['/',[file,oFuncMethod.func.toLowerCase()].join('/')].join('')
		} else if (oRoute.url.startsWith("~//")) {
			oRoute.url = ['/',[file,oFuncMethod.func.toLowerCase(),oRoute.url.substring(3)].join('/')].join('')
		} else if (oRoute.url.startsWith("~/")) {
			oRoute.url = ['/',[file,oRoute.url.substring(2)].join('/')].join('')
		}
 		
		if ((typeof oRoute.schema !== "undefined") && (typeof oRoute.schema === "object")) {
			const newSchema = {

			}
			for ([schemaName,schemaObject] of Object.entries(oRoute.schema)) {
				newSchema[schemaName] = {
					type:"object",
					required:[],
					properties:{}
				};
				
				if (Array.isArray(schemaObject)) {
					for (objName of schemaObject) {
						let isRequired=false;
						let cleanObjName = objName;
						if (objName.endsWith('!')) {
							isRequired=true;
							cleanObjName = objName.slice(0,-1);
						}

						const uProp = apiSchema[cleanObjName];
						let [propKey,propObj] = [false,false]
						if (Array.isArray(uProp)) {
							[propKey,propObj] = uProp;
						} else {
							[propKey,propObj] = [cleanObjName,uProp];
						}
						if (isRequired)	
							newSchema[schemaName].required.push(propKey);
						newSchema[schemaName].properties[propKey] = propObj;
					}
				} else {
					newSchema[schemaName] = schemaObject
				}
			}
			oRoute.schema = newSchema;
		}
	
		if (oFuncMethod.private) {
			oRoute.preValidation = [globalThis.fastify.authenticate,globalThis.fastify.authorize]
		}

		if (oRoute?.config?.hasPermissions) {
			if (typeof oRoute.config.hasPermissions === "boolean") {
				oRoute.config.hasPermissions = [[file,oFuncMethod.func.toLowerCase(),oFuncMethod.method.toLowerCase()].filter((e) => e).join('.')]
			}
		}
	} else {
		oRoute = Object.assign({
			method: oFuncMethod.method,
			url: ['/',[file,oFuncMethod.func.toLowerCase()].join('/')].join(''),
			handler: oPath
		}, oRouteInit)
		if (oFuncMethod.private) {
			oRoute.preValidation = [globalThis.fastify.authenticate,globalThis.fastify.authorize]
		}
	}
	return oRoute;
}

function handlers(fastify,opts,next) {
	
	const folders = fs.readdirSync(path.join(process.cwd(), 'components'));
	
	folders.forEach((folder) => {
		
		// Load API files
		const files = fs.readdirSync(path.join(process.cwd(), 'components',folder));
		let oApiSchemaDefault = false;
		if (fs.existsSync(path.join(process.cwd(),'components',folder,[folder,'schema','js'].join('.')))) {
			const LocalClass = require(path.join(process.cwd(),'components',folder,[folder,'schema'].join('.')));
			oApiSchemaDefault = new LocalClass();
		}
		files.forEach((file) => {

			if (!file.endsWith('.api.js')) return

			const sApiNamespace = file.split('.api.js').shift();
			const oApiComponent = require(path.join(process.cwd(),'components',folder,file));
			let oApiSchema = oApiSchemaDefault;
			if (fs.existsSync(path.join(process.cwd(),'components',folder,[sApiNamespace,'schema','js'].join('.')))) {
				const LocalClass = require(path.join(process.cwd(),'components',folder,[sApiNamespace,'schema'].join('.')))
				oApiSchema = new LocalClass();
			}
			 
			const exportedFunctions = Object.keys(oApiComponent);
			const componentGlobalFunction = { };
			for (let i = 0; i < exportedFunctions.length; i++) {
				if (exportedFunctions[i].startsWith("__")) {
					switch (exportedFunctions[i]) { // eslint-disable-line
						case "__preHandler":
							componentGlobalFunction.preHandler = oApiComponent[exportedFunctions[i]];
						break;
						case "__config":
							componentGlobalFunction.config = oApiComponent[exportedFunctions[i]];
						break;
					}
				}
			}

			for (let i = 0; i < exportedFunctions.length; i++) {

				if (exportedFunctions[i].startsWith("__")) continue;
				
				const oRoute = Object.assign({preValidation:fastify.silentAuthenticate},componentGlobalFunction);
				const oPathHandlers = oApiComponent[exportedFunctions[i]]
				const routePath = sApiNamespace == folder ? sApiNamespace : [sApiNamespace,folder].join("/");
				
				if (Array.isArray(oPathHandlers)) {
					for (const oPath of oPathHandlers) {
						fastify.route(getRouteObject(oPath,getFuncAndMethod(exportedFunctions[i]),routePath,oRoute,oApiSchema))
					}
				} else {
					fastify.route(getRouteObject(oPathHandlers,getFuncAndMethod(exportedFunctions[i]),routePath,oRoute,oApiSchema));
				}
			}
		})
	})
	next();
}

module.exports = handlers;
