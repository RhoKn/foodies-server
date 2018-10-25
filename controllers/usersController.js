'use strict'

const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');
const responseHelper = require('../services/responseHelper');
const jwt = require('../services/jwt');
const specification = require('../enum/specification.js');
const mongoosePaginate = require('mongoose-pagination');

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

function listAll(req, res){
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }
    const usrs_per_page = 5;
    User.find().sort('name').paginate(page,usrs_per_page,(err,users,total)=>{
        if(err){
            return responseHelper.helper(undefined,res,500,'Hubo un error en la petición');
        }
        
        if(!users){
            return responseHelper.helper(undefined,res,200,'No existen usuarios');
        }
        
        return res.status(200).send({
            message: 'Lista de usuarios',
            users: users,
            total: total,
            pages: Math.ceil(total/usrs_per_page)
        });
    });
}

function login(req, res){
    const userToLogin = req.body;
    User.findOne({email : userToLogin.email},(err,user)=>{
        if(err){
            return responseHelper.helper(undefined,res,500,'Hubo un error en la petición');
        }
        if(user){
            bcrypt.compare(userToLogin.password, user.password,(err, areEqual)=>{
                if(err){
                    return responseHelper.helper(undefined,res,500,'Hubo un error en la petición');
                }
                if(areEqual){
                    user.password = undefined;
                    if(userToLogin.getToken){
                        //generar y devolver token
                        return responseHelper.helper(specification.token,res,200,'token del usuario',jwt.createToken(user));
                    }else{
                        //devolver datos de usuario
                        return responseHelper.helper(specification.user,res,200,'Usuario loggeado',user);
                    }
                }else{
                    return responseHelper.helper(undefined,res,404,'Contraseña incorrecta');
                }
            });
        }else{
            return responseHelper.helper(undefined,res,404,'No existe un usuario con ese correo');
        }
    });
}

function vieweUser (req,res){
    const userToView = req.params.id;

    User.findById(userToView,(err,user)=>{
        if(err){
            return responseHelper.helper(undefined,res,500,'Hubo un error en la petición');
        }
        if(user){
            user.password = undefined;
            return responseHelper.helper(specification.user,res,200,'Usuario encontrado',user);
        }else{
            return responseHelper.helper(undefined,res,404,'El usuario no existe');
        }
    });
}

function update (req, res){
    const userToUpdate = req.params.id;
    var updateInfo = req.body;
    delete userToUpdate.password;
    if(userToUpdate != req.user.sub){
        return responseHelper.helper(undefined,res,500,'No puedes editar la información de otros usuarios');
    }
    User.findByIdAndUpdate(userToUpdate,updateInfo,{new: true}, (err, updatedUser)=>{
        if(err){
            return responseHelper.helper(undefined,res,500,'Hubo un error en la petición');
        }
        if(!updatedUser){
            return responseHelper.helper(undefined,res,404,'No se pudo actualizar');
        }else{
            return responseHelper.helper(specification.user,res,200,'Usuario actualizado',updatedUser);
        }    
    });
}

module.exports = {
    prueba,
    newUser,
    listAll,
    login,
    vieweUser,
    update
    /**
    soloUno,
    updetear,
    eliminar
    */
}