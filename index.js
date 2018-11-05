'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config').get(process.env.NODE_ENV == undefined ? "dev" : process.env.NODE_ENV);
const port = config.port;

mongoose.Promise = global.Promise;
mongoose.connect(config.databaseURL,{ useNewUrlParser: true }).then(()=>{
    console.log('La conexion seasdas hizo chidamente');
    //crear server
    app.listen(port,()=>{
        console.log('animo principe si puedes hacerlo');
    });
}).catch(err => console.log(err));