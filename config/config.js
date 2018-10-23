
const config = {
    production: {
        'sayHello': 'Hola perrooooo',
        'databaseURL' : 'mongodb://localhost:27017/foodies',
        'mlabDatabaseUrl' : 'mongodb://rhoKn:321123321KiRi@ds141043.mlab.com:41043/foodies',
    },
    dev: {
        'port' :3000,
        'databaseURL' : 'mongodb://localhost:27017/foodies',
        'mlabDatabaseUrl' : 'mongodb://rhoKn:321123321KiRi@ds141043.mlab.com:41043/foodies',
        'sayHello': 'hello dooooog'
    }
};

exports.get = function get(env) {
    return config[env] || config.dev;
};

let getEnv = () => {
    return !process.env.NODE_ENV ? "dev" : process.env.NODE_ENV;
};


exports.getBaseUrl = function () {
    if(getEnv() === "production"){
        return config.production.baseUrl;
    }else{
        return config.dev.baseUrl;
    }
};
