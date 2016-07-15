var redis = require("redis");
var winston = require('../../common').winston;

rdb = redis.createClient();

// 选择数据库，比如第5个数据库，默认是第0个
rdb.select(4);

//错误监听
rdb.on("error", function (err) {
    throw(err);
    winston.logger.error(err);
});

module.exports = rdb;
