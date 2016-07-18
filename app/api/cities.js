var common = require('../common');
var http = common.http;
var router = require('koa-router')({
    prefix: '/api/cities'
});

router.get('/opened', function*(){
    "use strict";
    var self = this;
    var params = self.query;
    params.fields = 'id,name,pinyin,province_id,state,develop_coefficient,maturity';
    var result = yield http.get('/v1/config_city/open_city_list', params);
    self.body = {
        success:true,
        cities:result.cities,
        total_count: result.total_count,
        current_page: result.current_page
    }
});

module.exports = router.routes();
