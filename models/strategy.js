const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const createStratSchema = mongoose.Schema({
  userid:{type : String, required:true},
  path:{type : String, required:true},
  filename:{type : String, required:true, unique:true},
  date:{type : String, required:true},
});

createStratSchema.plugin(uniqueValidator); //permet email unique

module.exports = mongoose.model('Createstrat',createStratSchema);
