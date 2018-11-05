'use strict'

const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');
const responseHelper = require('../services/responseHelper');
const jwt = require('../services/jwt');
const specification = require('../enum/specification.js');
const mongoosePaginate = require('mongoose-pagination');
var mongoose = require('mongoose');

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

function updateUser (req, res){
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

function deleteUser (req, res){
    const userToDelete = req.params.id;

    if(req.user.sub != userToDelete){
        User.findById(req.user.sub,(err, user) => {
            if(err){
                return responseHelper.helper(undefined,res,500,'Hubo un error en la busqueda del usuario actual');
            }
            if(!user){
                return responseHelper.helper(undefined,res,404,'El usuario proveniente del token es erroneo');
            }else{
                if(user.isAdminOrUpper()){
                    asyncDeleteUser(userToDelete,user.isOwner()).then((message)=>{
                        return responseHelper.helper(undefined,res,message.status,message.message);
                    });
                }else {
                    return responseHelper.helper(undefined,res,500,'No tienes permisos para eliminar usuarios'+user.isAdminOrUpper());
                }
            }
        });
    }else{
        return responseHelper.helper(undefined,res,500,'No es posible eliminarte a ti mismo');
    }
}

function updateRole(req, res){
    const userToEdit = req.params.id;
    const newRole = req.body;

    if(userToEdit != req.user.sub){
        User.findById(req.user.sub,(err,user)=>{
            if(err){
                return responseHelper.helper(undefined,res,500,'Hubo un error en la busqueda del usuario actual'); 
            }
            if(user){
                if(user.isOwner()){
                    asyncUpdateUser(userToEdit,newRole).then((json)=>{
                        if(json.status != 404){
                            return responseHelper.helper(specification.user,res,json.status,json.message,json.newUser);
                        }else{
                            return responseHelper.helper(undefined,res,json.status,json.message);
                        }
                    })
                }else{
                    return responseHelper.helper(undefined,res,500,'No tienes permiso para cambiar el rol a los usuarios');
                }
            }else{
                return responseHelper.helper(undefined,res,404,'El usuario proviniente del token es inválido');
            }
        });
    }else{
        return responseHelper.helper(undefined,res,500,'No es posible editar tu propio rol');
    }

}

async function asyncUpdateUser(userToUpdate, newRole){
    var json = {};
    var status = 200;
    var message = undefined;
    var newRoleUser = undefined;
    if(mongoose.Types.ObjectId.isValid(userToUpdate)){
        message = await User.findByIdAndUpdate(mongoose.mongo.ObjectId(userToUpdate),newRole,{new:true}).exec().then((userUpdated)=>{
            if(userUpdated){
                newRoleUser = userUpdated;
                return 'Se ha cambiado el rol del usuario con éxito';
            }else{
                status = 404;
                message = 'No se encontró al usuario que se desea editar';
            }
        }).catch((err)=>{
            return 'Hubo un problema con la busqueda del usuario a cambiar de rol';
        });
    }else{
        status = 404;
        message = 'El usuario que intentas cambiar de rol no existe';
    }
    json.status = status;
    json.message = message;

    if(status != 404){
        json.newUser = newRoleUser;
    }

    return json;
}

async function asyncDeleteUser (userToDelete,isOwner){
    var json = {};
    var status = 200;
    var message = undefined;
    var canBeDeleted = null;

    if(mongoose.Types.ObjectId.isValid(userToDelete)){
        canBeDeleted = await User.findById(mongoose.mongo.ObjectId(userToDelete)).exec().then((userFound)=>{
            if (userFound){
                if(isOwner){
                    return true;
                }else {
                    if(userFound.isAdminOrUpper()){
                        return false;
                    }else{
                        return true;
                    }
                }
            }else{
                return 'No existe el usuario a eliminar';
            }
        }).catch((err)=>{
            return 'Hubo un prolema con la busqueda del usuario a eliminar';
        });
        
    }
    
    if(canBeDeleted && typeof canBeDeleted === 'boolean'){
        message = await User.findByIdAndRemove({'_id':userToDelete}).exec().then((removed) => {
        if(removed){
            return 'Usuario eliminado con éxito';
        }else{
            status = 500;
            return 'El usuario no ha sido eliminado';
        }
        }).catch((err) => {
            return err;
        });
    }else if(canBeDeleted === null){
        status = 404;
        message = 'ID de la petición es erroneo';
    }
    else{
        status = 500;
        message = 'No tienes permisos para eliminar a este usuario';
    } 
    json.message = message;
    json.status = status;
    return json;
}
module.exports = {
    prueba,
    newUser,
    listAll,
    login,
    vieweUser,
    updateUser,
    deleteUser,
    updateRole
    /**
    soloUno,
    updetear,
    eliminar
    */
}
