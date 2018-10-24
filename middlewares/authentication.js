'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../config/config').get(process.env.NODE_ENV == undefined ? "dev" : process.env.NODE_ENV);
const secret = config.secretKey;
const responseHelper = require('../services/responseHelper');


exports.authentication = function(req,res,next){
  if(!req.headers.authorization){
    return responseHelper.helper(undefined,res,403,'La petición no tiene cabecera de autenticación');
  }

  var token = req.headers.authorization.replace(/['"]+/g,'');

  try{
    var payload = jwt.decode(token, secret);
    if(payload.exp <=moment().unix()){
      return responseHelper.helper(undefined,res,401,'Sesión expirada');
    }
  }catch(ex){
    return responseHelper.helper(undefined,res,404,'Token no valido');
  }

  req.user = payload;
  next();
}
