const Config = require("../config")
const Tracer = require('tracer').colorConsole({ level: Config.app.logLevel })

function handler(error, request, reply) {
    /* Custom Error response */
    let oResponse = {
        statusCode: 500,
        message: "An error has occurred, please try again. If this problem persists please contact our support team."
    }

    try {
        /* Exclude Internal Server Error */
        if(!(error instanceof Error)) {
            /* Check type of custom error */
            switch(typeof error) {
                case "object":
                    /* Merge Error with response */
                    oResponse = {...oResponse,...error}
                break;
                case "string":
                    /* Set Error message */
                    oResponse.message = (error.length ? error : oResponse.message)
                    /* Set Error Code */
                    oResponse.statusCode = 401
                break;
                default: 
                    throw "Type of custom error is undefined"
            }
        } else {
            /* Log only Internal Server Error */
            Tracer.error("Internal Server Error: %j", error)
        }
    } catch(Err) {
        /* Log Error */
        Tracer.error("loaders/error: %j", (typeof Err === "string" ? {message: Err} : Err))
    }

    /* Reply with custom error */
    reply.code(oResponse.statusCode).send(oResponse)
}

module.exports = handler