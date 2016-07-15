var common = require('../common');
var http = common.http;
var router = require('koa-router')({
  prefix: '/api/manage_orders'
});

router.get('/list', function*() {
  "use strict";
  var self = this;
  var page = 1;
  var params = self.query;
  if (params.page != null) {
    page = params.page;
  };
  var q = params.q;
  var city_id = params.city_id;
  var hospital_q = params.hospital_q;
  var agent_q = params.agent_q;
  var doctor_q = params.doctor_q;
  var assistant_q = params.assistant_q;
  var body_mode_q = params.body_mode_q;
  var project_id = params.project_id;
  var state_ids = null;
  var make_time_start = params.make_time_start;
  var make_time_end = params.make_time_end;
  var finish_time_start = params.finish_time_start;
  var finish_time_end = params.finish_time_end;
  if (params.state_ids&&params.state_ids.length>1){
    state_ids = JSON.stringify(params.state_ids);
  }else{
    state_ids = params.state_ids;
  }


  var result = yield http.get('/v1/manage_order/list', {
    fields: 'id,doctor_id,hospital_id,patient_name,patient_phone,order_code,created_at,project_id,make_at,receiver,state',
    page: page,
    city_id: city_id?city_id:'',
    q: q?q:'',
    agent_q: agent_q?agent_q:'',
    hospital_q: hospital_q?hospital_q:'',
    doctor_q: doctor_q?doctor_q:'',
    assistant_q: assistant_q?assistant_q:'',
    body_mode_q: body_mode_q?body_mode_q:'',
    project_id: project_id?project_id:'',
    state_ids: state_ids?state_ids:'',
    make_time_start: make_time_start?make_time_start:'', 
    make_time_end: make_time_end?make_time_end:'',
    finish_time_start: finish_time_start?finish_time_start:'',
    finish_time_end: finish_time_end?finish_time_end:'',
    sort_method: 'desc'
  });
  self.body = {
    success: true,
    orders: result.orders,
    total_count: result.total_count,
    current_page: result.current_page,
    order_statistic: {
      order_count: result.order_count,
      order_waiting: result.order_waiting,
      order_processing: result.order_processing,
      order_pending: result.order_pending,
      order_unpaid: result.order_unpaid
    }
  }
});

router.get('/get_option_attr', function*() {
  "use strict";
  var self = this;
  var city_result = yield http.get('/v1/config_city/open_city_list', {
  fields:'id,name,state'
  });
  var project_result = yield http.get('/v1/project/project_list', {
  fields: 'id,name'
  });

  self.body = {
    success: true,
    cities: city_result.cities,
    projects: project_result.projects
  };
});

router.get('/get_order_detail', function*() {
  "use strict";
  var self = this;
  var order_id = self.query.order_id;
  var order_result = yield http.get('/v1/manage_order/get_order_detail', {
  fields: 'id,doctor_id,hospital_id,patient_name,patient_phone,order_code,price,sex,age,receiver,project_id,state,precaution',  
  order_id: order_id
  });
  var order_detail = order_result.order_detail;
  self.body = {
    success: true,
    order_detail: order_detail
  };
});

module.exports = router.routes();
