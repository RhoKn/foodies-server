'use strict'

const express = require('express');
const bodyParser = require('body-parser');

var app = express();
function ignoreFavicon(req, res, next) {
    if (req.originalUrl === '/favicon.ico') {
      res.status(204).json({nope: true});
    } else {
      next();
    }
  }
//rutas

//middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(ignoreFavicon);
//cors

//rutas
module.exports = app;