exports.json = function(req,res,next){
  res.sendFile(process.cwd()+'/public/json'+req.path);
};
