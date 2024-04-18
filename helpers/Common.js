const crypto = require('crypto');

let instance = null;
class Common {
	round(number = 0, decimals = 0) {
		return Number(`${Math.round(`${number}e+${decimals}`)}e-${decimals}`);
	}

    dateFormat(iTimestamp){
       
        function pad(n) {return n<10 ? "0"+n : n}

        const d = new Date(parseInt(iTimestamp))

        return pad(d.getDate())+', '
            + d.toLocaleString('default', { month: 'short' }) + ' '
            + d.getFullYear()
            // +pad(d.getMonth()+1)+dash
           
            // +d.getFullYear()+dash
            // +pad(d.getHours())+colon+
            // +pad(d.getMinutes())+colon+
            // +pad(d.getSeconds())
    }

    md5Hash(data) {
        // Convert data to a string if needed (e.g., if it's a buffer)
        const dataString = typeof data === 'string' ? data : data.toString();
      
        // Create an MD5 hash object
        const hash = crypto.createHash('md5');
      
        // Update the hash with the data
        hash.update(dataString);
      
        // Digest the hash and return it in hexadecimal format (common choice)
        return hash.digest('hex');
    }

	static getInstance() {
        if (!instance) {
            instance = new Common();
        }
        return instance;
    }
}
module.exports = Common.getInstance();
