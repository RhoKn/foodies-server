'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var employeeSchema = new Schema({
    firstName           : String,
    lastName            : String,
    age                 : Number,
    registrationDate    : String, 
    role                : String,
    shift               : String,
    weeklyHours         : Number,
    fullTime            : Boolean
});

module.exports = mongoose.model('Employee',employeeSchema);