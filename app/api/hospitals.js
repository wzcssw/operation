var common = require('../common');
var http = common.http;
var router = require('koa-router')({
  prefix: '/api/hospitals'
});

router.get('/', function*() {
  "use strict";
  var self = this;
  var page = 1;
  var q = "";
  var city_id = "";
  var params = self.query;
  if (params.page != null) {
    page = params.page;
  };
  if (params.q!= null||params.city_id!=null) {
    q = params.q;
    city_id = params.city_id;
  };
  var result = yield http.get('/v1/hospital/list', {
    fields: 'id,name,remark,created_at,address,bus_line,flag,mbf,intro,map_image,location,lng,lat,city_id,dic_hospital_id,is_opened_system,name_code,email,should_send_email',
    page: page,
    q: q,
    city_id: city_id,
    sort_method: 'desc'
  });
  self.body = {
    success: true,
    hospitals: result.hospitals,
    total_count: result.total_count,
    current_page: result.current_page,
  }
});

router.put('/edit_hospital', function*() {
  "use strict";
  var self = this;
  var params = self.request.body;
  var hospital = params.hospital;
  var access = yield http.put('/v1/hospital/update', {
    access_token: self.currentUser.access_token,
    id: hospital.id,
    name: hospital.name,
    remark: hospital.remark,
    address: hospital.address,
    bus_line: hospital.bus_line,
    flag: hospital.flag,
    mbf: hospital.mbf,
    intro: hospital.intro,
    map_image: hospital.map_image,
    location: hospital.location,
    lng: hospital.lng,
    lat: hospital.lat,
    city_id: hospital.city_id,
    dic_hospital_id: hospital.dic_hospital_id,
    name_code: hospital.name_code,
    email: hospital.email,
    should_send_email: hospital.should_send_email
  });
  this.body = {success: true};
});

router.post('/add_hospital_projects', function*() {
  "use strict";
  var self = this;
  var params = self.request.body;
  var access = yield http.post('/v1/hospital/add_hospital_projects', {
    access_token: self.currentUser.access_token,
    hospital_id: params.hospital_id,
    project_ids: JSON.stringify(params.project_ids)
  });
  this.body = {success: true};
});

router.get('/get_hospital_projects', function*(){
  "use strict";
  var self = this;
  var params = self.query;
  var result = yield http.get('/v1/hospital/hospital_projects', {
    fields: 'id,project_id,status,mbf,windows_phone,app_make_sms,inspection_notes',
    hospital_id: params.hospital_id
  });
  self.body = {
    success: true,
    projects: result.hospital_projects
  }
})

router.put('/edit_hospital_projects', function*(){
  "use strict";
  var self = this;
  var params = self.request.body;
  var access = yield http.put('/v1/hospital/edit_hospital_projects', {
    access_token: self.currentUser.access_token,
    id: params.project.id,
    status: params.project.status?params.project.status:'',
    mbf: params.project.mbf,
    windows_phone: params.project.windows_phone?params.project.windows_phone:'',
    app_make_sms: params.project.app_make_sms?params.project.app_make_sms:'',
    inspection_notes: params.project.inspection_notes?params.project.inspection_notes:''
  })
  this.body = {success: true};
})

router.post('/add_hospital', function*(){
  "use strict";
  var self = this;
  var params = self.request.body;
  var access = yield http.post('/v1/hospital/add_hospital', {
    access_token: self.currentUser.access_token,
    dic_hospital_id: params.dic_hospital_id
  })
  this.body = {success: true};
})

router.post('/update_inspection_workflows', function*(){
  "use strict";
  var self = this;
  var params = self.request.body;
  var access = yield http.post('/v1/hospital/update_inspection_workflows', {
    access_token: self.currentUser.access_token,
    hospital_project_id: params.hospital_project_id,
    inspection_workflows: JSON.stringify(params.inspection_workflows)
  });
  this.body = {success: true};
})

router.put('/edit_hospital_assistants', function*(){
  "use strict";
  var self = this;
  var params = self.request.body;
  var hospital_assistant = params.hospital_assistant;
  var access = yield http.put('/v1/hospital/edit_hospital_assistants', {
    access_token: self.currentUser.access_token,
    id: hospital_assistant.id,
    name: hospital_assistant.name,
    phone: hospital_assistant.phone,
    address: hospital_assistant.address,
    state: hospital_assistant.state,
    remark: hospital_assistant.remark
  });
  this.body = {success: true};
})

router.get('/delete_hospital_assistants', function*(){
  "use strict";
  var self = this;
  var params = self.query;
  var result = yield http.delete('/v1/hospital/delete_hospital_assistants', {
    id: params.id
  });
  self.body = {
    success: true,
    projects: result.hospital_projects
  }
})

router.post('/add_hospital_assistants', function*(){
  "use strict";
  var self = this;
  var params = self.request.body;
  var assistant = params.assistant;
  if(assistant.state==null){
    assistant.state = "isnotsend";
  }
  if(assistant.remark==null){
    assistant.remark = "";
  }
  if(assistant.address==null){
    assistant.address = "";
  }
  var access = yield http.post('/v1/hospital/add_hospital_assistants', {
    access_token: self.currentUser.access_token,
    hospital_id: assistant.hospital_id,
    name: assistant.name,
    phone: assistant.phone,
    address: assistant.address,
    state: assistant.state,
    remark: assistant.remark
  });
  this.body = {success: true};
})

router.get('/get_hospital_resources', function*(){
  "use strict";
  var self = this;
  var params = self.query;
  var result = yield http.get('/v1/hospital/get_hospital_resources', {
    hospital_id: params.hospital_id,
    project_id: params.project_id
  });
  this.body = {
    success: true,
    co_hospital_resource: result.co_hospital_resource,
    co_appointment_config: result.co_appointment_config
  };
})

router.put('/edit_hospital_resources', function*(){
  "use strict";
  var self = this;
  var params = self.request.body;
  var access = yield http.put('/v1/hospital/edit_hospital_resources', {
    access_token: self.currentUser.access_token,
    hospital_id: params.co_hospital_resource.hospital_id,
    project_id: params.co_hospital_resource.project_id,
    device_count: params.co_hospital_resource.device_count?params.co_hospital_resource.device_count:'',
    device_hour_output: params.co_hospital_resource.device_hour_output?params.co_hospital_resource.device_hour_output:'',
    opration_expire_time: params.co_appointment_config.opration_expire_time?params.co_appointment_config.opration_expire_time:'',
    begin_at: params.co_appointment_config.begin_at?params.co_appointment_config.begin_at:'',
    end_at: params.co_appointment_config.end_at?params.co_appointment_config.end_at:''
  });
  this.body = {success: true};
})

router.get('/project_relations', function*(){
  "use strict";
  var self = this;
  var params = self.query;
  var result = yield http.get('/v1/hospital/project_relations', {
    hospital_id: params.hospital_id,
    project_id: params.project_id,
    body_id: params.body_id
  });
  self.body = {
    success: true,
    project_relations: result.project_relations
  }
})

router.put('/edit_project_relations', function*(){
  "use strict";
  var self = this;
  var params = self.request.body;
  var access = yield http.put('/v1/hospital/edit_project_relations', {
    access_token: self.currentUser.access_token,
    id: params.project_relations.id,
    hospital_id: params.project_relations.hospital_id,
    project_id: params.project_relations.project_id,
    body_id: params.project_relations.body_id,
    body_mode_id: params.project_relations.body_mode_id,
    price: params.project_relations.price,
    income_price: params.project_relations.income_price,
    state: params.project_relations.state
  });
  this.body = {success: true};
})

router.put('/edit_project_relations_multiple', function*(){
  "use strict";
  var self = this;
  var params = self.request.body;
  if(!params.price){
    params.price = "";
  }
  if(!params.income_price){
    params.income_price = "";
  }
  if(!params.state){
    params.state = "";
  }
  var access = yield http.put('/v1/hospital/edit_project_relations_multiple', {
    access_token: self.currentUser.access_token,
    hospital_id: params.hospital_id,
    project_id: params.project_id,
    body_id: params.body_id,
    price: params.price,
    income_price: params.income_price,
    state: params.state
  });
  this.body = {success: true};
})

router.get('/get_cooperating_hospital', function*(){
  "use strict";
  var self = this;
  var params = self.query;
  var result = yield http.get('/v1/hospital/get_cooperating_hospital', {
    city_id: params.city_id
  });
  self.body = {
    success: true,
    hospitals: result.hospitals
  }
})

router.put('/edit_cooperating_hospital', function*(){
  "use strict";
  var self = this;
  var params = self.request.body;
  var access = yield http.put('/v1/hospital/edit_cooperating_hospital', {
    access_token: self.currentUser.access_token,
    hospital_id: params.hospital_id,
    cooperating_hospital_ids: JSON.stringify(params.cooperating_hospital_ids)
  });
  this.body = {success: true};
})

router.post('/create_hospital_device', function*(){
  "use strict";
  var self = this;
  var params = self.request.body;
  var hospital_device = params.hospital_device;
  var access = yield http.post('/v1/hospital/create_hospital_device', {
    access_token: self.currentUser.access_token,
    hospital_id: hospital_device.hospital_id,
    project_title: hospital_device.project_title,
    project_content: hospital_device.project_content,
    project_image: hospital_device.project_image
  });
  this.body = {
    success: true,
    hospital_device: access.hospital_device
  };
})

router.put('/update_hospital_device', function*(){
  "use strict";
  var self = this;
  var params = self.request.body;
  var hospital_device = params.hospital_device;
  var access = yield http.put('/v1/hospital/update_hospital_device', {
    access_token: self.currentUser.access_token,
    hospital_id: hospital_device.hospital_id,
    project_title: hospital_device.project_title,
    project_content: hospital_device.project_content,
    project_image: hospital_device.project_image
  });
  this.body = {success: true};
})

router.get('/delete_hospital_device', function*(){
  "use strict";
  var self = this;
  var params = self.query;
  var id = JSON.parse(params.hospital_device).id;
  var result = yield http.delete('/v1/hospital/delete_hospital_devie', {
    id: id
  });
  self.body = {success: true}
})

module.exports = router.routes();
