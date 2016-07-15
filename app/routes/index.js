var controllers = require('../controllers');

function joinedRoute(app){
    "use strict";
    if (!app) throw new Error('必须传入app参数');
    app.use(controllers.rootRoutes);
    app.use(controllers.userRoutes);
}
module.exports = joinedRoute;