'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/config').get(process.env.NODE_ENV == undefined ? "dev" : process.env.NODE_ENV);

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

//rutas
module.exports = app;