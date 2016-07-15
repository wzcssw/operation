var winston = require('../../common').winston;

function Logger(){
    "use strict";
    return function *(next){
        this.logger = winston.logger;

        var start = new Date;
        yield next;
        var ms = new Date - start;
        this.logger.info('%s %s - %sms', this.method, this.url, ms);
    }
}

module.exports = Logger;