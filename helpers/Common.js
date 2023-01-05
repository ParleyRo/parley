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

	static getInstance() {
        if (!instance) {
            instance = new Common();
        }
        return instance;
    }
}
module.exports = Common.getInstance();
