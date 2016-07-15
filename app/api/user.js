var common = require('../common');
var session = common.session;
var http = common.http;
var router = require('koa-router')({
    prefix: '/api/users'
});

router.post('/login', function *(){
    "use strict";
    var params = this.request.body;
    var self = this;
    var access = yield http.post('/v1/login', {
        login_type: 'user',
        login: params.username,
        password: params.password
    });
    var info = yield http.get('/v1/account_info', {
        login_type: 'user',
        access_token: access.access_token
    });
    var userInfo = info.data;
    var customInfo = {
        access_token: access.access_token,
        id: userInfo.id,
        name: userInfo.name,
        phone: userInfo.phone,
        email: userInfo.email,
        role: userInfo.role,
        realname: userInfo.realname
    };
    yield new Promise((resolve, reject) => {
        session.save(customInfo, function(err, user){
            if (err){
                self.body = {success: false};
                reject(err);
            }
            resolve(user);
        });
    }).then(function(user){
        self.cookies.set("uid", user.uid, {signed: true});
        self.body = {success: true, user: user};
    });

});

router.post('/logout', function *(){
    "use strict";
    this.cookies.set("uid", null, {signed: true});
    this.body = {success: true};
});

router.put('/update_password', function *(){
    "use strict";
    var self = this;
    var params = self.request.body;
    var user = params.user;
    var access = yield http.put('/v1/update_password', {
      access_token: self.currentUser.access_token,
      login_type: 'user',
      password: user.password,
      new_password: user.new_password,
      new_password_again: user.new_password_again
    });
    this.body = {success: true,result: access};
});

router.get('/userInfo', function *(){
    "use strict";
    var user = this.currentUser;
    if (user){
        this.body = {success: true, user: user};
    }else {
        this.body = {success: false, msg: '未登陆'};
    }
});

module.exports = router.routes();
