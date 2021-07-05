exports.svg = function(req,res,next){
  res.sendFile(process.cwd()+'/public/img'+req.path);
};

exports.png = function(req,res,next){
  res.sendFile(process.cwd()+'/public/img'+req.path);
};

exports.jpg = function(req,res,next){
  res.sendFile(process.cwd()+'/public/img'+req.path);
};
