function JoinedApi(app){
    "use strict";
    app.use(require('./user.js'));
    app.use(require('./dic_hospitals.js'));
    app.use(require('./projects.js'));
    app.use(require('./cities.js'));
    app.use(require('./bodies.js'));
    app.use(require('./categories.js'));
    app.use(require('./operation_logs.js'));
    app.use(require('./body_modes.js'));
    app.use(require('./hospitals.js'));
    app.use(require('./manage_orders.js'));
}

module.exports = JoinedApi;
