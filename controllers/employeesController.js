'use strict'

const Employee = require('../models/employee');
const Absence = require('../models/absence');
const Delay = require('../models/delay');
const responseHelper = require('../services/responseHelper');
const jwt = require('../services/jwt');
const specification = require('../enum/specification.js');
const mongoosePaginate = require('mongoose-pagination');
var mongoose = require('mongoose');
const moment = require('moment');

function prueba (req, res) {
    res.send('olovaaaaargio');
}

/**
 * @todo Hacer que solo el gerente o admin puedan crear empleados
 */
function createEmployee(req, res){
    const bodyParams = req.body;
    if(bodyParams.firstName && bodyParams.lastName && bodyParams.age && bodyParams.role && bodyParams.shift && bodyParams.weeklyHours && bodyParams.fullTime){
        let newEmployee = new Employee({
            firstName: bodyParams.firstName,
            lastName: bodyParams.lastName,
            age: bodyParams.age,
            role: bodyParams.role,
            shift: bodyParams.shift,
            weeklyHours : bodyParams.weeklyHours
        });
        
        newEmployee.registrationDate = new Date(moment().unix());
        Employee.find({
            firstName: newEmployee.firstName,lastName: newEmployee.lastName
        }).exec((err,employeesFound)=>{
            if(err){
                return responseHelper.helper(undefined,res,500,'Error en la petición');
            }
            if(employeesFound && employeesFound.length >0){
                return responseHelper.helper(undefined,res,400,employeesFound);
            }
            newEmployee.save((err,savedUser)=>{
                if(err) return responseHelper.helper(undefined,res,500,'Hubo un error en la petición');

                if(savedUser){
                    return responseHelper.helper(specification.employee, res, 200, 'Se ha registrado con éxito', savedUser);
                }else{
                    return responseHelper.helper(undefined,res, 404, 'No se ha registrado el empleado');
                }
            });
        });
    }else{
        return responseHelper.helper(undefined,res, 404,'Por favor complete todos los campos');
    }
    
    /*
    var x = new Date(moment().unix());

    res.send(`${x.getDay()}--${x.getMonth()}---${x.getFullYear()}--${x.getHours()}---${x.getMinutes()}---${x.getSeconds()}----${x.get()}`);
    */
}

module.exports = {
    prueba,
    createEmployee
}