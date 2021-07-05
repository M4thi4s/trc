const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const quotfileSchema = mongoose.Schema({
  length:{type : Number, required:true},
  instru:{type : String, required: true},
  interval:{type : Number, required:true},
  filePath:{type : String, required:true},
  date:{type : String, required:true},
});

quotfileSchema.plugin(uniqueValidator); //permet email unique

module.exports = mongoose.model('Quotfile',quotfileSchema);
