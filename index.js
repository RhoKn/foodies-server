'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const port = 3000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/foodies',{ useNewUrlParser: true }).then(()=>{
    console.log('La conexion seasdas hizo chidamente');
    //crear server
    app.listen(port,()=>{
        console.log('server corriendo');
    });
}).catch(err => console.log(err));