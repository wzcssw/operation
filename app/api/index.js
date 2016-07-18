function JoinedApi(app){
    "use strict";
    app.use(require('./user.js'));
    app.use(require('./feedbacks.js'));
}

module.exports = JoinedApi;
