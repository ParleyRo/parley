const config = require('../config.js');
const rpc = require('./Rpc');
const fs = require('fs');
const { dirname } = require('path');
const appDir = dirname(require.main.filename);
class View {

	constructor(req = false,reply = false) {
		this.req = req
		this.reply = reply
		this.template = 'default'
		this.layout = `templates/default/layouts/main.eta` 
		this.version = '1.0.3'
		this.meta = {
			title: '',
			hostname: req.hostname
		}
		this.subdomanins = config.subdomains;

		if (this.req) {
			this.meta = Object.assign(this.meta,{
				url : {
					path: this.req.routerPath,
					params : this.req.params,
					query: this.req.query
				}
			})
		}
		this.js = []
		this.css = []
		this.data = {}
	}

	addJs(data) {
		if (Array.isArray(data)) {
			for (const js of data) {
				try {
					if (js.startsWith('https://')) { 
						this.js.push(js)
					} else if (fs.existsSync(`${appDir}/web/assets/${this.template}/js/${js}`)) {
						this.js.push(`/assets/${this.template}/js/${js}`)
					} else {
						this.js.push(`/assets/default/js/${js}`)
					}
				} catch (err) {
					console.error(err)
					this.js.push(`/assets/default/js/${js}`)
				}
			}
		} else {
			try {
				if (data.startsWith('https://')) { 
					this.js.push(data)
				} else 	if (fs.existsSync(`${appDir}/web/assets/${this.template}/js/${data}`)) {
					this.js.push(`/assets/${this.template}/js/${data}`)
				} else {
					this.js.push(`/assets/default/js/${data}`)
				}
			} catch (err) {
				console.error(err)
				this.js.push(`/assets/default/js/${data}`)
			}
		}
		return this
	}

	addCss(data) {
		if (Array.isArray(data)) {
			for (const css of data) {
				try {
					if (fs.existsSync(`${appDir}/web/assets/${this.template}/css/${css}`)) {
						this.css.push(`/assets/${this.template}/css/${css}`)
					} else {
						this.css.push(`/assets/default/css/${css}`)
					}
				} catch (err) {
					console.error(err)
					this.css.push(`/assets/default/css/${css}`)
				}
			}
		} else {
			try {
				if (fs.existsSync(`${appDir}/web/assets/${this.template}/css/${data}`)) {
					this.css.push(`/assets/${this.template}/css/${data}`)
				} else {
					this.css.push(`/assets/default/css/${data}`)
				}
			} catch (err) {
				console.error(err)
				this.css.push(`/assets/default/css/${data}`)
			}
		}
		return this
	}

	setViewData(data = false) {
		if (!data) return this;
		
		if (typeof data === "object")
			for (const [key,value] of Object.entries(data)) {
				if (['layout','meta'].includes(key))
					this[key] = value;
				else	
					this.data[key] = value;
			}
		return this;
	}

	setMeta(data = false) {
		if (!data) return this;
		
		if (typeof data === "object")
			for (const [key,value] of Object.entries(data)) {
				this.meta[key] = value;
			}
		return this;
	}

	setLayout(layout = false,full = false) {
		if (full)
			this.layout = layout;
		else 
			this.layout = `templates/${this.template}/${layout}`
		return this
	}

	setTemplate(template = false, layout = false, fullLayout = false) {
		if (template) {
			this.template = template;
			const newLayout = layout || 'main.eta'
			this.setLayout(newLayout, fullLayout)
		}
		return this
	}

	static async widget(name, data = {}) {
		return await rpc.call(name,data);
	}

	static async parse(templateFile,data = {}) {
		return await globalThis.fastify.view(templateFile,Object.assign(data,{RPC: rpc }));
	}

	async render(templateFile, data = {}) {
		const viewMode = this.req.cookies?.viewMode || 0
		return await View.parse(
			this.layout,
			{
				...this.data,
				subdomains: this.subdomanins,
				...data,
				meta: this.meta,
				version: this.version,
				body: templateFile,
				css: this.css,
				js: this.js,
				viewMode: viewMode
			}
		)
	}

	async send(templateFile,data) {
		const tFile = `templates/${this.template}/${templateFile}`
		if (!this.reply) throw new Error("reply is required");
		/** TODO: check if this is a security issue  */
		if (this.req.headers.accept === "application/json") {
			return Object.assign(this.data,data);
		}
		if (this.req.headers['x-fetch']) {
			this.reply.header('Content-Type', 'text/html; charset=utf-8').send(await View.parse(tFile,Object.assign(this.data,data)));
		} else this.reply.header('Content-Type', 'text/html; charset=utf-8').send(await this.render(tFile,data));
		return this.reply;
	}
}

module.exports = View;
