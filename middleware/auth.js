const jwt = require('jsonwebtoken');

module.exports = function(req,res,next){
  try{
    if(req.headers.token != null && req.headers.userid!=null){
      const decodeToken = jwt.verify(req.headers.token, 'Uw68dLOHFXqcbPi1mhUyRONBxCMMLFD2iujLGG2BfIWi4dsOvuzfUTerXybg4LEdgwQWpe4t5YYj5xwPwQWqML8JxehJpNjomzmg');
      const userid = decodeToken.userid;

      if(req.headers.userid && req.headers.userid !==userid){
        throw new Error('Invalid user ID');
      } else{
        next();
      }
    }
    //ELSE : PAS DE REPONSE
  } catch(e){
    e.statusCode=401;
    next(e);
  }
}
