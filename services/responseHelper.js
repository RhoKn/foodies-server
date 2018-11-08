'use strict'

module.exports.helper = (specification, res, status, msj, objs)=>{
    const content = {}
    if(msj != undefined){
        content.message = msj;
    }
    if(specification != undefined){
        if(specification === 'user'){
            content.user = objs;
        }
        if(specification === 'users'){
            content.users = objs;
        }
        if(specification === 'dish'){
            content.dish = objs;
        }
        if(specification === 'dishes'){
            content.dishes = objs;
        }
        if(specification === 'ingredient'){
            content.ingredient = objs;
        }
        if(specification === 'ingredients'){
            content.ingredients = objs;
        }
        if(specification === 'employee'){
            content.employee = objs;
        }
        if(specification === 'employees'){
            content.employees = objs;
        }
        if(specification === 'token'){
            content.employees = objs;
        }
        if(specification === 'absence'){
            content.absence = objs;
        }
        if(specification === 'absences'){
            content.absences = objs;
        }
        if(specification === 'delay'){
            content.delay = objs;
        }
        if(specification === 'delays'){
            content.delays = objs;
        }
        return res.status(status).send(content);
    }else{
        if(objs != undefined){
            content.objects = objs;
        }
        if(Object.keys(content).length == 0){
            return res.status(status);
        }
        return res.status(status).send(content);
    }
}