exports.index = function(req,res,next){
  res.sendFile(process.cwd()+'/public/view/login/index.html');
};
