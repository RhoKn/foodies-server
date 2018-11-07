'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const absenceSchema = new Schema({
    employee        :       {type: Schema.ObjectId, ref: 'Employee'},
    date            :       Date,
    created_at      :       String
});

module.exports = mongoose.model('Absence',absenceSchema);