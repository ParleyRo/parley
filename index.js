require('dotenv').config();
const fastify = require('./app')();

// Run the server!
fastify.listen({port: process.env.PORT || 80, host:"0.0.0.0"} , (err, address) => {

  if (err) throw err

})

