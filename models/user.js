const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email:{type : String, required:true, unique:true},
  password:{type : String, required:true},
  creationDate:{type:Number, required:true},
  isConfirm:{type : Boolean}
})

userSchema.plugin(uniqueValidator); //permet email unique

module.exports = mongoose.model('User',userSchema);
