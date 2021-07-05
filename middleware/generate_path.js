module.exports = function(req,res,next){
  try{
    var date = new Date();
    var pathName=date.getDate()+"_"+(date.getMonth()+1)+"_"+date.getFullYear();
    var path=process.cwd()+"/data/strategy/"+pathName;

    //EXECUTE THAT EVERYDAY
    fs.access(path, function(err){
      if (err && err.code === 'ENOENT')
        fs.mkdir(path,next); //Create dir in case not found
      else
        next();
    });

  } catch(e){
    console.log("error during generating folder : "+e)
    res.status(500).json({error:'error during generating folder'});
  }
}
