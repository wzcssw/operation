var crypto = require('crypto');
module.exports = function(params){
    "use strict";
    var keys = Object.keys(params).sort();
    var paramsString = params.app_token;
    keys.forEach(function (key) {
        if (key == 'sign') return true;
        paramsString += (key + params[key])
    });
    paramsString += params.app_token;
    return md5Encryption(paramsString).toUpperCase();
};

function md5Encryption(string){
    "use strict";
    var Buffer = require("buffer").Buffer;
    var buf = new Buffer(string);
    var str = buf.toString("binary");
    return crypto.createHash("md5").update(str).digest("hex");
}