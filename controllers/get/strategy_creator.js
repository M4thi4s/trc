exports.index = function(req,res,next){
  res.sendFile(process.cwd()+'/public/view/strategy_creator/index.html');
};
