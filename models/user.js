'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var  userSchema = new Schema({
  firstName :   String,
  lastName  :   String,
  nickName  :   String,
  role      :   String,
  email     :   String,
  password  :   String,
  image     :   String
});

userSchema.methods.fullName = function (){
    return `${this.name} ${this.lastName}`;
}
userSchema.methods.isOwner = function () {
    if(this.role === 'gerente'){
        return true;
    }
    return false;
}
userSchema.methods.isAdminOrUpper = function () {
    if(this.role === 'admin' || this.role === 'gerente'){
        return true;
    }
    return false;
}
module.exports = mongoose.model('User',userSchema);
