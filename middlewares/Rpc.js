// https://stackoverflow.com/questions/40961778/returning-es6-proxy-from-the-es6-class-constructor
class RPC {
	constructor(data) {
		this.handlers = new Map();
	}

	addFunctionToPrototype(name,handler) {
		const finalName = name.pop();
		let protObg = RPC.prototype
		for (const a of name) {
			if (typeof protObg[a] === "undefined") protObg[a] = {}
			protObg = protObg[a];
		}
		protObg[finalName] = handler;
	}

	setNamespace(name) {
		
		return new Proxy(this,{ 
			get(target, prop) {
				if (prop === "register") {
					return new Proxy(target[prop],{
						apply(funcTarget, thisArg, args) {
							const newArgs = [...args];
							newArgs[0] = `${name}.${newArgs[0]}`
							return funcTarget.apply(thisArg,newArgs);
						}
					})
				}
				return Reflect.get(target,prop);
			}
		});
	}

	register(name,handler) {
		console.log(name);
		const funcName = name;
		if (this.handlers.has(funcName)) throw Error(`Function already registered ${funcName}`)
		this.addFunctionToPrototype(funcName.split('.'),handler)
		this.handlers.set(funcName,handler)
		return this;
	}

	async call(name,...args) {
		if (!this.handlers.has(name)) return null;
		return await this.handlers.get(name)(...args);
	}
}

const rpc = new RPC();

module.exports = rpc;
