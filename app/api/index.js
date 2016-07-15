function JoinedApi(app){
    "use strict";
    app.use(require('./user.js'));
    app.use(require('./visit_records.js'));
    app.use(require('./feedbacks.js'));
}

module.exports = JoinedApi;
