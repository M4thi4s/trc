const ReadStrategy = require('../get/strategy.js');
const Quotfile = require('../../models/quotfile.js');
const Strategy = require('../../models/strategy.js');

const StratRes = require('../../models/stratres.js');

const execStrat = require('../../TRC_API/server_interaction/execute_strategy_v2.js');
const uuid = require('uuid');

function getFilesizeInBytes(filename) {
  var stats = fs.statSync(filename);
  return stats.size;
}

exports.exec = function(req,res,next){
  var userid=req.headers.userid;

  var stratid=req.body.idStrat;
  var idQuotFile=req.body.idQuotFile;

  Strategy.find({userid: userid, _id:stratid})
  .then(function(strat){
    Quotfile.find({_id:idQuotFile})
    .then(function(quotfile){
      if(quotfile.length==1 && strat.length==1){
      //  console.log("start calculing : "+userid);
        var date1 = new Date();
        execStrat.start(process.cwd()+strat[0].path+"/"+strat[0].filename+".js", process.cwd()+quotfile[0].filePath,
        function(str){

          var date2 = new Date();
      //    console.log("time : "+(date2 - date1)); //milliseconds interval

          var date = new Date();

          var pathName=date.getDate()+"_"+(date.getMonth()+1)+"_"+date.getFullYear();
          var path="/data/strategy/"+pathName;

          var filename=uuid.v4();

          fs.appendFile(process.cwd()+path+"/"+filename+".csv", str, function (err) {
            if (err)
              res.status(500).json({error:"error during saving strategy in CSV file"});
            else{

              const stratresModel = new StratRes({
                userid:userid,
                strategyid:stratid,
                quotfileid:idQuotFile,
                path:path,
                filename:filename,
                date:date.getTime(),
                size:getFilesizeInBytes(process.cwd()+path+"/"+filename+".csv")
              });

              stratresModel.save()
                .then(function(){
                  console.log(userid+" saved csv");
                  res.status(201).json({message:'CSV created and added to DB'});
                })
                .catch(function(e){
                  res.status(500).json({error:"error during saving strategy results in DB"});
                })

            }
          });

        },
        function(err){
          res.status(500).json({error:"error during calculation strategy"});
        });
      }
      else
        res.status(500).json({error:"quote file or strat length is to length error"});

    })
    .catch(function(err){
      res.status(404).json({error:"error during loading quotfile from DB"});
    });
  })
  .catch(function(err){
    res.status(404).json({error:"error during loading strategy from DB"});
  });

}

exports.downCSV = function(req,res,next){
  var userid=req.headers.userid;
  var stratResId=req.body.stratresid;

  StratRes.find({userid: userid, _id:stratResId})
    .then(function(stratres){
      if(stratres.length!=1)
        res.status(404).json({error:"error : no data found OR multiple file found"});
      else{
        stratres=stratres[0];
        fs.readFile(process.cwd()+stratres.path+"/"+stratres.filename+".csv", 'utf8', function (err,data) {
          if(err)
            res.status(404).json({error:err});
          else
            res.status(201).json({data:data});
        });
      }

    })
    .catch(function(err){
      console.log("exec strat err : "+err);
      if(!err.status){ err.status=500 };
      res.status(err.status).json({error:"error while getting strategies results path from DB"});
    })
}
