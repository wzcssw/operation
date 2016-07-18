var common = require('../common');
var http = common.http;
var router = require('koa-router')({
    prefix: '/api/visit_records'
});
router.get('/', function*() {
  "use strict";
  var self = this;
  var params = self.query;
  var page = params.page || 1;
  var city_id = params.city_id || '';
  var agent_name = params.agent_name || '';
  var doctor_name = params.doctor_name || '';
  var access = yield http.get('/v1/operation/visit_records', {
    access_token: self.currentUser.access_token,
    page : page,
    agent_name : agent_name,
    doctor_name : doctor_name,
    city_id : city_id
  });
  this.body ={
    success: true,
    result: access,
    total_count:access.total_count,
    current_page:access.current_page
  };
});

module.exports = router.routes();
