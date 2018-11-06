'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

var employeeSchema = new Schema({
    firstName           : String,
    lastName            : String,
    age                 : Number,
    registrationDate    : String, 
    role                : String,
    shift               : String,
    weeklyHours         : Number
});

module.exports = mongoose.model('Employee',employeeSchema);