var winston = require('winston');
var config = require('../../config')();
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            colorize: true,
            level: config.winston.level
        }),
        new (winston.transports.File)({ filename: 'app.log' })
    ]
});


exports.logger = logger;