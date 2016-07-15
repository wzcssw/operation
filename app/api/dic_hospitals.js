var common = require('../common');
var http = common.http;
var router = require('koa-router')({
  prefix: '/api/dic_hospitals'
});

//获取医院列表
router.get('/', function*() {
  "use strict";
  var self = this;
  var params = self.query;
  var page = params.page || 1;
  var city_id = params.city_id || "";
  var q = params.q || "";
  var limit = params.limit || 20;
  var result = yield http.get('/v1/config_hospital/list', {
    fields: 'id,name,pinyin,level,city_id,province_id,nature',
    page: page,
    q: q,
    city_id: city_id,
    limit: limit
  });
  self.body = {
    success: true,
    hospitals: result.hospitals,
    total_count: result.total_count,
    current_page: result.current_page,
  }
});

//添加医院
router.post('/new_hospital', function *(){
  "use strict";
  var self = this;
  var params = self.request.body;
  var hospital = params.hospital;
  var access = yield http.post('/v1/config_hospital/add', {
    access_token: self.currentUser.access_token,
    name: hospital.name,
    level: hospital.level,
    city_id: hospital.city_id,
    nature: hospital.nature
  });
  this.body = {success: true};
});

//更新医院
router.put('/edit_hospital', function *(){
  "use strict";
  var self = this;
  var hospital = self.request.body.hospital;
  var access = yield http.put('/v1/config_hospital/update', {
    access_token:self.currentUser.access_token,
    hospital_id:hospital.id,
    name:hospital.name,
    level:hospital.level,
    city_id:hospital.city_id,
    nature:hospital.nature
  });
  this.body = {success: true};
});

//获取属性列表
router.get('/options_attr', function*() {
  "use strict";
  var self = this;
  var city_result = yield http.get('/v1/config_city/open_city_list', {
  fields:'id,name,state'
  });
  var level_result = yield http.get('/v1/config_hospital/hospital_level_list', {
  });
  var nature_result = yield http.get('/v1/config_hospital/hospital_nature_list', {
  });
  var project_result = yield http.get('/v1/project/project_list', {
  fields: 'id,name'
  });
  var device_state_result = yield http.get('/v1/config_hospital/device_state_list', {
  });
  // var arr = city_result.cities;
  // var city_arr = [];
  // for (var i = 0; i < arr.length ; i++) {
  //   if(arr[i].state){
  //       city_arr.push(arr[i]);
  //   }
  // };
  self.body = {
    success: true,
    levels: JSON.parse(level_result.hospital_level),
    cities: city_result.cities,
    natures: JSON.parse(nature_result.hospital_nature),
    projects: project_result.projects,
    device_states: JSON.parse(device_state_result.device_state)
  };
});
//获取医院设备信息
router.get('/get_hospital_device', function*(){
  "use strict";
  var self = this;
  var hospital_id = this.query.hospital_id;
  var dic_hospital_device = yield http.get('/v1/config_hospital/get_hospital_device', {
    hospital_id: hospital_id
  });
  self.body = {
    success: true,
    dic_hospital_device: dic_hospital_device
  };
});

//保存医院设备信息
router.post('/save_hospital_device', function*(){
  "use strict";
  var self = this;
  var params = self.request.body;
  var access = yield http.post('/v1/config_hospital/save_hospital_device', {
    access_token: self.currentUser.access_token,
    hospital_id: params.hospital_id,
    dic_hospital_device: JSON.stringify(params.dic_hospital_device)
  });
  this.body = {success: true};
});

router.get('/delete_hospital', function*(){
  "use strict";
  var self = this;
  var params = self.query;
  console.log(params.id);
  var id = params.id;
  console.log(id);
  var result = yield http.delete('/v1/config_hospital/delete_hospital', {
    id: id
  });
  self.body = {success: true}
})

module.exports = router.routes();
