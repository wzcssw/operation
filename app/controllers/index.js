exports.userRoutes = require('./users');


var router = require('koa-router')();

router.get('/', function *(){
    "use strict";
    yield this.render('/templates/index', {user: this.currentUser});
});

exports.rootRoutes = router.routes();