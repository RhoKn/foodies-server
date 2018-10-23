
const config = {
    production: {
        'sayHello': 'Hola perrooooo'
    },
    dev: {
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
