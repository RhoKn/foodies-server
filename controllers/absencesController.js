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

function viewAll (req, res){
    let page = 1;
    let absencesPPage = 5;
    if(req.params.page){
        page = req.params.page;
    }
    Absence.find().sort('firstName').paginate(page,absencesPPage,(err,absences,total)=>{
        if(err) return responseHelper.helper(undefined,res,500,'Hubo un error en la petición');
        if(!absences){
            return responseHelper.helper(undefined,res,200,'No existen ausencias registradas');
        }
        
        return res.status(200).send({
            message: 'Lista de ausencias',
            absences: absences,
            total: total,
            pages: Math.ceil(total/absencesPPage)
        });
    });
}

function viewAbsence (req,res){
    let absence = req.params.id;

    if(mongoose.Types.ObjectId.isValid(absence)){
        Absence.findById(absence,(err,absenceFounded)=>{
            if(err) return responseHelper.helper(undefined,res,500,'Hubo un error en la petición');
            if(!absenceFounded) return responseHelper.helper(undefined,res,404,'No existe ausencia para este día');
            return responseHelper.helper(specification.absence,res,200,'Ausencia encontrada',absenceFounded);
        });
    }else{
        return responseHelper.helper(undefined,res,404,'ID inválido');
    }
}

function updateAbsence (req,res){
    let absence = req.params.id;
    let infoToEdit = req.body;
    if(infoToEdit.employee){
        if(!mongoose.Types.ObjectId.isValid(infoToEdit.employee)){
            return responseHelper.helper(undefined,res,404,'ID  de empleado inválido');
        }
    }

    if(mongoose.Types.ObjectId.isValid(absence)){
        Absence.findByIdAndUpdate(absence,infoToEdit,{new:true},(err,absenceFounded)=>{
            if(err) return responseHelper.helper(undefined,res,500,'Hubo un error en la petición');
            if(!absenceFounded) return responseHelper.helper(undefined,res,404,'No existe la ausencia');
            return responseHelper.helper(specification.absence,res,200,'Ausencia actualizada exitosamente',absenceFounded);
        });
    }else{
        return responseHelper.helper(undefined,res,404,'ID inválido');
    }

}

function deleteAbsence (req, res){
    let absenceToDelete = req.params.id;
    
    if(mongoose.Types.ObjectId.isValid(absenceToDelete)){
        Absence.findByIdAndDelete(absenceToDelete,(err,absenceDeleted)=>{
            if(err) return responseHelper.helper(undefined,res,500,'Hubo un error en la petición');
            if(!absenceDeleted) return responseHelper.helper(undefined,res,400,'No se pudo eliminar la ausencia');
            return responseHelper.helper(undefined,res,200,'Ausencia eliminada exitosamente');
        })
    }else{
        return responseHelper.helper(undefined,res,404,'ID inválido');
    }
}

module.exports = {
    prueba,
    createAbsence,
    viewAll,
    viewAbsence,
    updateAbsence,
    deleteAbsence
}