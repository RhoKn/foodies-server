'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const absenceSchema = new Schema({
    employee        :       {type: Schema.ObjectId, ref: 'Employee'},
    date            :       Date,
    created_at      :       moment.unix()
});

module.exports = mongoose.model('Absence',absenceSchema);