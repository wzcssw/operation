var common = require('../common');
var session = common.session;
var http = common.http;
var router = require('koa-router')({
    prefix: '/api/feedbacks'
});

router.get('/get_feedbacks', function*(){
    "use strict";
    var self = this;
    var params = self.query;
    var result = yield http.get('/v1/operation/feedbacks',{
    fields: 'id,classify,content,feedbackcreator_id,feedbackcreator_type,phone,created_at',
    classify: params.classify?params.classify:'',
    q: params.q?params.q:'',
    page: params.page  
    });
    self.body = {
        success:true,
        feedbacks:result.feedbacks,
        total_count: result.total_count,
        current_page: result.current_page
    }
});

router.get('/get_classify', function*(){
    "use strict";
    var self = this;
    var params = self.query;
    var result = yield http.get('/v1/operation/classify_list',{
    });
    self.body = {
        success:true,
        classifies:JSON.parse(result.classifies)
    }
});


module.exports = router.routes();