const Quotfile = require('../../models/quotfile.js');
fs = require('fs')

exports.list = function(req,res,next){
  Quotfile.find()
  .then(function(quotfiles){
    for(var a in quotfiles)
      if(a=="filePath")
        delete quotfiles[a];

    res.status(200).json(quotfiles);

  })
  .catch(function(){
    res.status(404).json("error while listing quotation file");
  })
};
