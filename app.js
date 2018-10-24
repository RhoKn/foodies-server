'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/config').get(process.env.NODE_ENV == undefined ? "dev" : process.env.NODE_ENV);

const userRoutes = require('./routes/userRoutes');

var app = express();
function ignoreFavicon(req, res, next) {
    if (req.originalUrl === '/favicon.ico') {
      res.status(204).json({nope: true});
    } else {
      next();
    }
  }
//rutas
app.get('/', function(req, res) {
  res.send(config.sayHello);
});

//middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(ignoreFavicon);
//cors
// configurar cabeceras http
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

  next();
});
//rutas
app.use('/users',userRoutes);
module.exports = app;