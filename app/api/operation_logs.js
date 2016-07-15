var common = require('../common');
var http = common.http;
var router = require('koa-router')({
    prefix: '/api/operation_logs'
});
router.get('/', function*() {
    "use strict";
    var params = this.query || {};
    for (var key in params){
        if (!params[key]) delete params[key];
    }
    params['page'] = params['page'] || 1;
    params['limit'] = 20;
    params['fields'] = 'id,operation_log_type_id,user_id,user_realname,content,created_at';
    var result = yield http.get('/v1/operation_logs/list', params);
    this.body = {
        success: true,
        result: result
    };
});

router.get('/types', function*() {
    "use strict";
    var params = {};
    var result = yield http.get('/v1/operation_logs/types', params);
    this.body = {
        success: true,
        result: result
    };
});

module.exports = router.routes();
