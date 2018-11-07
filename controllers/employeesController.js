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

function viewAll (req, res){
    const empPerPage = 5;
    let page = 1;
    if(req.params.page){
        page = req.params.page;
    } 

    Employee.find().sort('firstName').paginate(page,empPerPage,(err,employees,total)=>{
        if(err) return responseHelper.helper(undefined,res,500,'Hubo un error en la petición');

        if(!employees){
            return responseHelper.helper(undefined,res,200,'No existen usuarios');
        }
        
        return res.status(200).send({
            message: 'Lista de empleados',
            employees: employees,
            total: total,
            pages: Math.ceil(total/empPerPage)
        });
    });
}

function viewEmployee (req,res){
    const employee = req.params.id;

    if(mongoose.Types.ObjectId.isValid(employee)){
        Employee.findById(employee,(err,empFounded)=>{
            if(err) return responseHelper.helper(undefined,res, 500,'Hubo un error en la petición');
            
            if(!empFounded) return responseHelper.helper(undefined,res, 404, 'No existe el usuario');

            return responseHelper.helper(specification.employee, res,200,'Empleado encontrado',empFounded);
        });
    }else{
        return responseHelper.helper(undefined,res,404,'ID no es válido');
    }
}
/**
 * @todo hacer que solo admin o superior pueda editar empleados
 */
function updateEmployee (req, res){
    const infoToEdit = req.body;
    const empToEdit = req.params.id;

    if(mongoose.Types.ObjectId.isValid(empToEdit)){
        Employee.findByIdAndUpdate(empToEdit,infoToEdit,{new:true},(err,userEdited)=>{
            if(err) return responseHelper.helper(undefined,res,500,'Hubo un error en la petición');

            if(userEdited){
                return responseHelper.helper(specification.employee,res,200,'Empleado editado',userEdited);
            }else{
                return responseHelper.helper(undefined,res,404,'No se pudo editar el empleado');
            }
        })
    }else{
        return responseHelper.helper(undefined,res,404,'ID no es válido');
    }
}

/**
 * @todo hacer que solo admin o superior pueda eliminar empleados
 */
function deleteEmployee (req, res){
    const empToDelete = req.params.id;

    Employee.findByIdAndDelete(empToDelete,(err,deleted)=>{
        if(err) return responseHelper.helper(undefined,res,500,'Hubo un error en la petición');
        if(deleted) return responseHelper.helper(undefined,res,200,'Empleado eliminado con éxito');
        return responseHelper.helper(undefined,res,404,'No se pudo eliminar al empleado');
    });
}

module.exports = {
    prueba,
    createEmployee,
    viewAll,
    viewEmployee,
    updateEmployee,
    deleteEmployee
}