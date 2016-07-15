var common = require('../common');
var http = common.http;
var router = require('koa-router')({
    prefix: '/api/categories'
});

router.get('/', function*(){
    "use strict";
    var self = this;
    var params = self.query;

    params.fields = 'id,name,created_at,body_name,body_mode_name,project_name,flag';
    var result = yield http.get('/v1/category/list', params);
    self.body = {
        success:true,
        categories:result.categories,
    }
});

router.post('/new_category', function*(){
    "use strict";
    var self = this;
    var params = self.request.body;
    var category = params.category;
    var access = yield http.post('/v1/category/add', {
      access_token: self.currentUser.access_token,
      name: category.name,
      body_name: category.body_name,
      project_name: category.project_name,
      body_mode_name: category.body_mode_name
    });
    this.body = {success: true};
});

router.get('/delete', function*(){
    "use strict";
    var self = this;
    var params = self.query;
    var access = yield http.delete('/v1/category/delete', {
      access_token: self.currentUser.access_token,
      id: params.id,
    });
    this.body = {success: true};
});

router.post('/update', function*(){
    "use strict";
    var self = this;
    var params = self.request.body;
    var category = params.category;
    var access = yield http.put('/v1/category/update', {
      access_token: self.currentUser.access_token,
      id: category.id,
      name: category.name,
      body_name: category.body_name,
      project_name: category.project_name,
      body_mode_name: category.body_mode_name,
      flag: category.flag
    });
    this.body = {success: true};
});

module.exports = router.routes();
