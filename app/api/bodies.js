var common = require('../common');
var http = common.http;
var router = require('koa-router')({
    prefix: '/api/bodies'
});

router.get('/', function*(){
    "use strict";
    var self = this;
    var page = 1;
    var params = self.query;
    params.limit = 200;
    if (params.page != null) {
       page = params.page;
    }
    params.fields = 'id,name,price,created_at,rank,category_id';
    var result = yield http.get('/v1/body/list', params);
    self.body = {
        success:true,
        bodies:result.bodies,
        total_count: result.total_count,
        current_page: result.current_page
    }
});

router.get('/by_project', function*(){
    "use strict";
    var self = this;
    var page = 1;
    var params = self.query;
    if (params.page != null) {
       page = params.page;
    }
    params.fields = 'id,name,price,created_at,rank,category_id';
    var result = yield http.get('/v1/body/by_project', params);
    self.body = {
        success:true,
        bodies:result.bodies,
        total_count: result.total_count,
        current_page: result.current_page
    }
});

router.post('/new_body', function*(){
    "use strict";
    var self = this;
    var params = self.request.body;
    var body = params.body;
    var access = yield http.post('/v1/body/add', {
      access_token: self.currentUser.access_token,
      name: body.name,
      category_id: body.category_id
    });
    this.body = {success: true};
});

router.post('/update_body', function*(){
    "use strict";
    var self = this;
    var params = self.request.body;
    var body = params.body;
    var access = yield http.put('/v1/body/update', {
      access_token: self.currentUser.access_token,
      id: body.id,
      name: body.name,
      category_id: body.category_id
    });
    this.body = {success: true};
});

router.get('/delete', function*(){
    "use strict";
    var self = this;
    var params = self.query;
    var access = yield http.delete('/v1/body/delete', {
      access_token: self.currentUser.access_token,
      id: params.id,
    });
    this.body = {success: true};
});

router.post('/add_project', function*(){
    "use strict";
    var self = this;
    var params = self.request.body;
    var access = yield http.post('/v1/body/add_project', {
      access_token: self.currentUser.access_token,
      body_id: params.body_id,
      project_ids: JSON.stringify(params.project_ids)
    });
    console.log(access);
    this.body = {success: true};
});

module.exports = router.routes();
