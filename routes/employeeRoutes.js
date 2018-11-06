'use strict'

const express = require('express');
const employeesController = require('../controllers/employeesController');
const midlwrAuth = require('../middlewares/authentication');

var api =express.Router();

api.get('/',employeesController.prueba);
api.post('/new',employeesController.createEmployee);
/*
api.get('/all/:page?',);
api.get('/view/:id',);
api.put('/update/:id',);
api.delete('/delete/:id',);
api.post('/newAbsence',);
api.post('/newDelay',);
*/


module.exports= api;