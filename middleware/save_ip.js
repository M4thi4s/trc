const fs = require('fs');
const file="./data/logs/ip.log";

module.exports = function(req,res,next){
  try{
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null);

    var date = new Date();
    var dateStr=date.getDate()+"_"+(date.getMonth()+1)+"_"+date.getFullYear()+" | "+date.getHours()+" : "+date.getMinutes();

    fs.appendFile(file, dateStr+" -> "+ip+" -> "+req.originalUrl+"\n", function (err) {
      if (err) throw err;
      next();
    });
  }
  catch(e){
    console.log("error during saving IP : "+e);
  }
}
