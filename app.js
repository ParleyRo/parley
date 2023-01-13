const path = require('path');
const resolve = require('path').resolve;

const config = require('./config.js')
const db = require('./libraries/database.js');
const loadServices = require('./loaders/services')

const loadRPC = require('./loaders/rpc')

const Fastify = require('fastify')

function App() {

  const fastify = Fastify({
    logger:true,
    ignoreTrailingSlash: true,
    maxParamLength: 300,
    trustProxy: true
  });
  fastify.register(require('@fastify/swagger'), config.swagger);
  fastify.register(require('@fastify/formbody'))
  fastify.register(require('@fastify/multipart'), { attachFieldsToBody: true })
  fastify.register(require('@fastify/view'), {
    engine: {
      eta: require('eta')
    },
    root:path.join(__dirname, 'web'),
    options: {
      filename: resolve('web'),
      async:true
    }
  }) 
  fastify.register(require('@fastify/static'), {
    root: path.join(__dirname,'web/assets'),
    prefix: '/assets/'
  }) 
  fastify.register(require('@fastify/cors'), {
      origin: "*",
      methods: ["POST"]
    // put your options here
  })
  fastify.register(require('fastify-qs'));
  fastify.register(require('@fastify/cookie'), {
    // for cookies signature
    secret: config.cookie.secret, 
    // options for parsing cookies
    parseOptions: {}     
  })

  // load schema

  fastify.register(require('./loaders/authenticate'));

  fastify.register(require('./loaders/api'));

  // create globals
  globalThis.fastify = fastify;

  // loading parts
  (async () => {
    await db.connect()
    loadServices();
    loadRPC();
  })()

  return fastify
}

module.exports = App;

