module.exports = function(){
    "use strict";
    if (process.env.NODE_ENV == 'staging'){
        return require('./staging');
    }else if (process.env.NODE_ENV == 'production'){
        return require('./production');
    }else {
        process.env.NODE_ENV = 'development';
        return require('./development');
    }
};