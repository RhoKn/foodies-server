'use strict'

const Employee = require('../models/employee');
const Absence = require('../models/absence');
const Delay = require('../models/delay');
const responseHelper = require('../services/responseHelper');
const jwt = require('../services/jwt');
const specification = require('../enum/specification.js');
const mongoosePaginate = require('mongoose-pagination');
var mongoose = require('mongoose');

function prueba (req, res) {
    res.send('olovaaaaargio');
}

module.exports = {
    prueba
}