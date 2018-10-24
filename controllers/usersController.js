'use strict'

const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');
const responseHelper = require('../services/responseHelper');
const specification = require('../enum/specification.js');
const saltRounds = 10;

function prueba (req, res) {
    res.send('olovaaaaargio');
}

/**
 * Función que permitira crear un nuevo usuario.
 */
function newUser (req, res) {
    const body = req.body;
    if(body.firstName && body.lastName && body.nickName && body.email && body.password && body.role){
        let user = new User({
            name: body.firstName,
            lastName: body.lastName,
            nickName: body.nickName,
            email: body.email,
            role: body.role,
            image : null
        });
        User.find({
            $or: [
                {email: user.email},
                {nick: user.nickName}
            ]
        }).exec((err,foundedUsers) => {
            if(err){
                return responseHelper.helper(undefined,res,500,'Error en la petición');
            }
            if(foundedUsers && foundedUsers.length >0){
                return responseHelper.helper(undefined,res, 404, 'El usuario ya se encuentra registrado');
            }
            bcrypt.hash(body.password, null, null, (err, hash)=>{
                user.password = hash;

                user.save((err,newUser)=>{
                    if(err) return responseHelper.helper(undefined,res,500,'Hubo un error en la petición');

                    if(newUser){
                        return responseHelper.helper(specification.user, res, 200, 'Se ha registrado con éxito', newUser);
                    }else{
                        return responseHelper.helper(undefined,res, 404, 'No se ha registrado el usuario',newUser);
                    }
                });
              });
            
        });
    } else {
        return responseHelper.helper(undefined,res, 404,'Por favor complete todos los campos');
    }
    
}

module.exports = {
    prueba,
    newUser
    /**
    lista,
    soloUno,
    updetear,
    eliminar
    */
}