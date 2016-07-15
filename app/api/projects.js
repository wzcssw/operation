var common = require('../common');
var http = common.http;
var router = require('koa-router')({
    prefix: '/api/projects'
});
router.get('/', function*() {
    "use strict";
    var params = this.query || {};
    for (var key in params){
        if (!params[key]) delete params[key];
    }
    if (params['categoryZh']){
        if (params['categoryZh'] == '检查'){
            params['category_id'] = 1;
        } else if (params['categoryZh'] == '检验'){
            params['category_id'] = 2;
        }
        delete params['categoryZh'];
    }
    params['page'] = params['page'] || 1;
    params['fields'] = 'id,name,category_id,rank,created_at,favorite';
    var result = yield http.get('/v1/project/list', params);
    this.body = {
        success: true,
        result: result
    };
});

router.put('/edit_project', function*() {
    "use strict";
    var self = this;
    var params = self.request.body;
    var project = params.project;
    var access = yield http.put('/v1/project/edit_project', {
      access_token: self.currentUser.access_token,
      id: project.id,
      name: project.name,
      category_id: project.category_id,
      favorite: project.favorite
    });
    this.body = {success: true};
});
router.post('/add_project', function*() {
    "use strict";
    var self = this;
    var params = self.request.body;
    var project = params.project;
    var access = yield http.post('/v1/project/add_project', {
      access_token: self.currentUser.access_token,
      name: project.name,
      category_id: project.category_id,
      remark: project.remark,
      city_ids: JSON.stringify(project.cities)
    });
    this.body = {success: true};
});

router.put('/edit_bodies', function*() {
    "use strict";
    var self = this;
    var params = self.request.body;
    var access = yield http.put('/v1/project/edit_bodies', {
      access_token: self.currentUser.access_token,
      id: params.project_id,
      bodies_ids: JSON.stringify(params.bodies_ids)
    });
    this.body = {success: true};
});

router.get('/project_opened_cities', function*() {
    "use strict";
    var self = this;
    var params = self.query;
    var access = yield http.get('/v1/project/project_opened_cities', {
      access_token: self.currentUser.access_token,
      id: params.id,
    });
    this.body ={
      success: true,
      cities: access.cities
    };
});

module.exports = router.routes();
