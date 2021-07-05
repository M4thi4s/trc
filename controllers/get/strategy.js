const Strategy = require('../../models/strategy.js');
const StratRes = require('../../models/stratres.js');

fs = require('fs')

function reqAndReadListStrat(userid, onSuccess, onError, stratId, extension){
  var req={userid: userid};
  if(stratId)
    req._id=stratId;

  Strategy.find(req)
  .then(function(strat){

    var reject=Promise.reject;

    if(strat.length==0){
      return Promise.reject('no strategy found');
    }
    else{
      var returnStratObj={}

      var stratLength=strat.length;
      var stratCounter=0;
      var fileNotFoundDetected=false;

      for(var stratLiveCounter=0; stratLiveCounter<stratLength; stratLiveCounter++){
        (function (path, filename, id, date) {

          if(fileNotFoundDetected==false){
            fs.readFile(process.cwd()+path+"/"+filename+".json", 'utf8', function (err,data) {
              if (err && fileNotFoundDetected==false){
                fileNotFoundDetected=true;
                onError({status:404, errorMSG:"error strat file not found"})
                return 1;
              }
              else if(fileNotFoundDetected==false){

                returnStratObj[id]={
                  json:data,
                  date:date,
                }
                stratCounter++;
                if(stratCounter==stratLength){

                  onSuccess(returnStratObj);
                }
              }
            });
          }

        }(strat[stratLiveCounter].path,strat[stratLiveCounter].filename,strat[stratLiveCounter]._id, strat[stratLiveCounter].date));
      }
    }
  })
  .catch(function(err){
    var errorOBJ={status:404};
    if(err)
      errorOBJ.errorMSG=err;
    onError(errorOBJ);
  })
}
exports.reqAndReadListStrat = reqAndReadListStrat;

exports.listJSON = function(req,res,next){
  var userid=req.headers.userid;
  reqAndReadListStrat(userid,
    function(data){
      res.status(200).json(data);
    },
    function(err){
      if(err.status && err.errorMSG)
        res.status(err.status).json({error:err.errorMSG});
      else if(err.status)
        res.status(err.status).json({error:"error while reading strategy list or userID invalid"});
      else
        res.status(500);
    }
  );
};

exports.listCSV = function(req,res,next){
  var userid=req.headers.userid;

  StratRes.find({userid: userid})
  .then(function(stratRes){
    var stratResFORMAT=[];
    for(var stratResNb=0; stratResNb<stratRes.length; stratResNb++){
      stratResFORMAT.push({
        _id:stratRes[stratResNb]._id,
        strategyid:stratRes[stratResNb].strategyid,
        quotfileid:stratRes[stratResNb].quotfileid,
        date:stratRes[stratResNb].date,
        size:stratRes[stratResNb].size,
      })
    }
    res.status(200).json(stratResFORMAT);
  })
  .catch(function(err){
    if(!err.status){ err.status=500 };
    res.status(err.status).json({error:"error while getting strategy results from DB"});
  })
}
