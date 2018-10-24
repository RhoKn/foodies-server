'use strict'

const express = require('express');
const usersController = require('../controllers/usersController');

var api =express.Router();

api.get('/',usersController.prueba);
api.post('/register',usersController.newUser);

module.exports= api;