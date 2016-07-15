var app = require('koa')();
var render = require('koa-ejs');
var bodyParser = require('koa-bodyparser');
var staticServe = require('koa-static');
var config = require('./config')();
var mdKoa =require('./app/middleware/koa');
var raven = require('raven');

app.keys = ['TXPrice', 'DoNode'];


var sentry = new raven.Client('http://fc9cac2d0ee64de386b0c9ae1b09d6eb:49677cc8d42040e8ad1a586e91a377e0@101.201.210.99:9000/4');
app.on('error', function(err) {
    sentry.captureException(err);
});


// 静态文件目录
app.use(staticServe('./app/public'));
app.use(staticServe('./bower_components'));
app.use(staticServe('./app/views'));
// 处理post参数到app(this.request.body)中
app.use(bodyParser());
render(app, {
    root: './app/views',
    layout: 'layout',
    viewExt: 'html',
    cache: false,
    debug: true
});

/**
 * logger
 */
app.use(mdKoa.Logger());

/**
 * error
 */
app.on('error', function(err,ctx){
    ctx.logger.error(err)
});

/**
 * session
 */
app.use(mdKoa.Session());

/**
 * 404
 */
app.use(mdKoa.NotFound());

/**
 * response
 */
require('./app/routes')(app);
require('./app/api')(app);

module.exports = app;
if (!module.parent) {
    app.listen(config.port, function(){
        "use strict";
        console.log('app has run at port of' + config.port );
    });
}
