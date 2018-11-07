'use strict'

const Absence = require('../models/absence');
const responseHelper = require('../services/responseHelper');
const jwt = require('../services/jwt');
const specification = require('../enum/specification.js');
const mongoosePaginate = require('mongoose-pagination');
var mongoose = require('mongoose');
const moment = require('moment');

function prueba (req, res) {
    res.send('olovaaaaargio');
}

function createAbsence(req, res){
    const body = req.body;
    if(body.employee && body.date){
        if(mongoose.Types.ObjectId.isValid(body.employee)){
            const created = new Date(moment().unix()*1000);
            const newAbsence = new Absence({
                employee    : body.employee,
                date        : body.date,
                created_at  : created
            });
            Absence.find({
                employee    : newAbsence.employee,
                date        : newAbsence.date
            }).exec((err,absenceFounded)=>{
                if(err) return responseHelper.helper(undefined,res,500,'Hubo un error en la petición');
                if(absenceFounded && absenceFounded.length >0){
                    return responseHelper.helper(undefined,res,400,'El empleado ya tiene una ausencia registrada en este dia');
                }else{
                    newAbsence.save((err,absence)=>{
                        if(err) return responseHelper.helper(undefined,res,500, 'Hubo un error al guardar la ausencia');
                        if(!absence) return responseHelper.helper(undefined,res,400,'No se pudo guardar la ausencia');
                        return responseHelper.helper(specification.absence,res,200,'Se ha guardado exitosamente',absence);
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
module.exports = {
    prueba,
    createAbsence
}