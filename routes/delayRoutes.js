'use strict'

const express = require('express');
const delaysController = require('../controllers/delaysController');
const midlwrAuth = require('../middlewares/authentication');

var api =express.Router();

api.get('/',delaysController.prueba);
api.post('/new',delaysController.creatDelay);
api.get('/all/:page?',delaysController.viewAll);
api.get('/view/:id',delaysController.viewDelay);
api.put('/update/:id',delaysController.updateDelay);
api.delete('/delete/:id',delaysController.deleteDelay);

module.exports= api;
