'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var  userSchema = new Schema({
  firstName      :   String,
  lastName  :   String,
  nickName  :   String,
  role      :   String,
  email     :   String,
  password  :   String,
  image     :   String
});

userSchema.methods.fullName = ()=>{
    return `${this.name} ${this.lastName}`;
}
userSchema.methods.fullName = () => {
    if(this.role === 'gerente'){
        return true;
    }
    return false;
}
module.exports = mongoose.model('User',userSchema);
