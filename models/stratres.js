const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const stratResSchema = mongoose.Schema({
  userid:{type : String, required:true},
  strategyid:{type : String, required:true},
  quotfileid:{type : String, required:true},
  path:{type : String, required:true},
  filename:{type : String, required:true, unique:true},
  date:{type : Number, required:true},
  size:{type : Number}
});

stratResSchema.plugin(uniqueValidator); //permet email unique

module.exports = mongoose.model('Stratres',stratResSchema);
