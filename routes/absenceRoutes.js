'use strict'

const express = require('express');
const absencesController = require('../controllers/absencesController');
const midlwrAuth = require('../middlewares/authentication');

var api =express.Router();

api.get('/',absencesController.prueba);
api.post('/new',absencesController.createAbsence);/*
api.get('/all/:page?',absencesController.viewAll);
api.get('/view/:id',absencesController.viewEmployee);
api.put('/update/:id',absencesController.updateEmployee);
api.delete('/delete/:id',absencesController.deleteEmployee);

*/
module.exports= api;