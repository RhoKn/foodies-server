'use strict'

const express = require('express');
const absencesController = require('../controllers/absencesController');
const midlwrAuth = require('../middlewares/authentication');

var api =express.Router();

api.get('/',absencesController.prueba);
api.post('/new',absencesController.createAbsence);
api.get('/all/:page?',absencesController.viewAll);
api.get('/view/:id',absencesController.viewAbsence);
api.put('/update/:id',absencesController.updateAbsence);
api.delete('/delete/:id',absencesController.deleteAbsence);

module.exports= api;