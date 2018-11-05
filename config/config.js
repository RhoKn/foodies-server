
const config = {
    production: {
        'sayHello': 'Hola perrooooo',
        'databaseURL' : 'mongodb://localhost:27017/foodies',
        'mlabDatabaseUrl' : 'mongodb://rhoKn:321123321KiRi@ds141043.mlab.com:41043/foodies',
        'secretKey' : 'La_llave_secreta_esta_hecha_secretamente_sin_____que__nadie______lo_____-----sepa'
    },
    dev: {
        'port' :3000,
        'databaseURL' : 'mongodb://localhost:27017/foodies',
        'mlabDatabaseUrl' : 'mongodb://rhoKn:321123321KiRi@ds141043.mlab.com:41043/foodies',
        'sayHello': 'hello dooooog',
        'secretKey' : 'La_llave_secreta_esta_hecha_secretamente_sin_____que__nadie______lo_____-----sepa'
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
