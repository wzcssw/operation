/**
 * Created by tx-0020 on 16/5/23.
 */
var common = require('../common');
var http = common.http;
var router = require('koa-router')({
    prefix: '/api/cities'
});

router.get('/', function*(){
    "use strict";
    var self = this;
    var params = self.query;
    params.fields = 'id,name,pinyin,province_id,state,go_public_sea_day,develop_coefficient,maturity';
    var result = yield http.get('/v1/config_city/list', params);
    self.body = {
        success:true,
        cities:result.cities,
        total_count: result.total_count,
        current_page: result.current_page
    }
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

router.put('/', function*(){
    "use strict";
    var self = this;
    var params = self.request.body;
    var result = yield http.put('/v1/config_city/update', params);
    self.body = {
        success:true
    }
});

module.exports = router.routes();
