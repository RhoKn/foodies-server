'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const delaySchema = new Schema ({
    employee        : {type: Schema.ObjectId, ref:'Employee'},
    timeDelayed     : String,
    date            : String,
    created_at      : String
});

module.exports = mongoose.model('Delay',delaySchema);