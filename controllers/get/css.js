exports.css = function(req,res,next){
  res.sendFile(process.cwd()+'/public/css'+req.path);
};
