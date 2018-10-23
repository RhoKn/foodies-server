'use strict'

const express = require('express');
const bodyParser = require('body-parser');

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
  res.send('tis is de presenteichon olv');
});
app.use('/users',userRoutes);

//middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(ignoreFavicon);
//cors

//rutas
module.exports = app;