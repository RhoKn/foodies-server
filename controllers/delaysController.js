'use strict'

const Delay = require('../models/delay');
const responseHelper = require('../services/responseHelper');
const specification = require('../enum/specification.js');
const mongoosePaginate = require('mongoose-pagination');
var mongoose = require('mongoose');
const moment = require('moment');

function prueba (req, res) {
    res.send('olovaaaaargio');
}

function creatDelay(req, res){
    const body = req.body;
    if(body.employee && body.date && body.timeDelayed){
        if(mongoose.Types.ObjectId.isValid(body.employee)){
            const created = new Date(moment().unix()*1000);
            const newDelay = new Delay({
                employee    : body.employee,
                date        : body.date,
                timeDelayed : body.timeDelayed,
                created_at  : created
            });
            Delay.find({
                employee    : newDelay.employee,
                date        : newDelay.date
            }).exec((err,delayFounded)=>{
                if(err) return responseHelper.helper(undefined,res,500,'Hubo un error en la petición');
                if(delayFounded && delayFounded.length >0){
                    return responseHelper.helper(undefined,res,400,'El empleado ya tiene un retardo registrado en este dia');
                }else{
                    newDelay.save((err,delay)=>{
                        if(err) return responseHelper.helper(undefined,res,500, 'Hubo un error al guardar el retardo');
                        if(!delay) return responseHelper.helper(undefined,res,400,'No se pudo guardar el retardo');
                        return responseHelper.helper(specification.delay,res,200,'Se ha guardado exitosamente',delay);
                    });
                }
            });
        }else{
            return responseHelper.helper(undefined,res,404,'ID invalido');
        }
    }else{
        return responseHelper.helper(undefined,res,500,'Por favor complete todos los campos necesarios');
    }
}

function viewAll (req, res){
    let page = 1;
    let delaysPpage = 5;
    if(req.params.page){
        page = req.params.page;
    }
    Delay.find().sort('date').paginate(page,delaysPpage,(err,delays,total)=>{
        if(err) return responseHelper.helper(undefined,res,500,'Hubo un error en la petición');
        if(!delays){
            return responseHelper.helper(undefined,res,200,'No existen retardos registrados');
        }
        
        return res.status(200).send({
            message: 'Lista de retardos',
            absences: delays,
            total: total,
            pages: Math.ceil(total/delaysPpage)
        });
    });
}

function viewDelay (req,res){
    let delay = req.params.id;

    if(mongoose.Types.ObjectId.isValid(delay)){
        Delay.findById(delay,(err,delayFounded)=>{
            if(err) return responseHelper.helper(undefined,res,500,'Hubo un error en la petición');
            if(!delayFounded) return responseHelper.helper(undefined,res,404,'No existe retardo para este día');
            return responseHelper.helper(specification.absence,res,200,'Retardo encontrado',delayFounded);
        });
    }else{
        return responseHelper.helper(undefined,res,404,'ID inválido');
    }
}

function updateDelay (req,res){
    let delay = req.params.id;
    let infoToEdit = req.body;
    if(infoToEdit.employee){
        if(!mongoose.Types.ObjectId.isValid(infoToEdit.employee)){
            return responseHelper.helper(undefined,res,404,'ID  de empleado inválido');
        }
    }

    if(mongoose.Types.ObjectId.isValid(delay)){
        Delay.findByIdAndUpdate(delay,infoToEdit,{new:true},(err,delayFounded)=>{
            if(err) return responseHelper.helper(undefined,res,500,'Hubo un error en la petición');
            if(!delayFounded) return responseHelper.helper(undefined,res,404,'No existe el retardo');
            return responseHelper.helper(specification.delay,res,200,'Retardo actualizado exitosamente',delayFounded);
        });
    }else{
        return responseHelper.helper(undefined,res,404,'ID inválido');
    }

}

function deleteDelay (req, res){
    let delayToDelete = req.params.id;
    
    if(mongoose.Types.ObjectId.isValid(delayToDelete)){
        Delay.findByIdAndDelete(delayToDelete,(err,deletedDelay)=>{
            if(err) return responseHelper.helper(undefined,res,500,'Hubo un error en la petición');
            if(!deletedDelay) return responseHelper.helper(undefined,res,400,'No se pudo eliminar el retardo');
            return responseHelper.helper(undefined,res,200,'Retardo eliminado exitosamente');
        })
    }else{
        return responseHelper.helper(undefined,res,404,'ID inválido');
    }
}

module.exports = {
    prueba,
    creatDelay,
    viewAll,
    viewDelay,
    updateDelay,
    deleteDelay
}