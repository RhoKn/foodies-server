'use strict'
// Genera los tokens para los usuarios

const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../config/config').get(process.env.NODE_ENV == undefined ? "dev" : process.env.NODE_ENV);
const secret = config.secretKey;

exports.createToken = function(user){
  //Objeto que contiene los datos del usuario que se quiere tokenizar
  var payLoad = {
    sub         : user._id,
    firstName   : user.firstName,
    lastName    : user.lastName,
    nickName    : user.nickName,
    email       : user.email,
    role        : user.role,
    image       : user.image,
    //Momento de creación del token
    iat         : moment().unix(),
    //Fecha de expiración del token: creacion+30dias
    exp         : moment().add(30,'days').unix()
  };
  //Generacion del tokens
  return jwt.encode(payLoad, secret);
}
