exports.js = function(req,res,next){
  res.sendFile(process.cwd()+'/public/js'+req.path);
};
