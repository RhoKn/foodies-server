'use strict'

const express = require('express');
const bodyParser = require('body-parser');

var app = express();

//rutas

//middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//cors

//rutas
module.exports = app;