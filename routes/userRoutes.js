'use strict'

const express = require('express');
const usersController = require('../controllers/usersController');
const midlwrAuth = require('../middlewares/authentication');

var api =express.Router();

api.get('/',usersController.prueba);
api.post('/login',usersController.login);
api.post('/register',usersController.newUser);
api.get('/all/:page?',midlwrAuth.authentication,usersController.listAll);
api.get('/view/:id',usersController.vieweUser);


module.exports= api;