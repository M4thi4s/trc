const Strategy = require('../../models/strategy.js');
const uuid = require('uuid');
const fs = require('fs');
const get_min_number_tick = require('../../TRC_API/server_interaction/get_min_number_tick.js');
const obj_to_strat_str = require('../../TRC_API/server_interaction/obj_to_strat_str.js')

exports.createStrat = function(req,res,next){
  var date = new Date();

  var pathName=date.getDate()+"_"+(date.getMonth()+1)+"_"+date.getFullYear();
  var path="/data/strategy/"+pathName;

  var filename=uuid.v4();

  var userid=req.headers.userid;

  //FIRST CALCUL MIN OF DATA
  if(req.body.strat.tp_bul.length!=req.body.strat.tp_bea.length || req.body.strat.tp_bul.length != req.body.strat.cp_bul.length || req.body.strat.tp_bul.length != req.body.strat.cp_bea.length)
    res.status(500).json({error:"error the number of ticks does not match"});
  else{

    var isOnlyNumberInParameter=true

    for(var indicators in req.body.parameter.indicators){
      for(var opt in req.body.parameter.indicators[indicators]){
        if(isNaN(req.body.parameter.indicators[indicators][opt])){
          res.status(500).json({error:"error: parameters are not numbers "});
          isOnlyNumberInParamter=false;
        }
        else{
          req.body.parameter.indicators[indicators][opt]=parseInt(req.body.parameter.indicators[indicators][opt]);
        }
      }
    }
    if(isOnlyNumberInParameter==true){
      var tickNb=req.body.strat.tp_bul.length;

      var specificalIndicatorsSettings={};
      for(var indicator in req.body.parameter.indicators)
        specificalIndicatorsSettings[indicator]={parameter:req.body.parameter.indicators[indicator]}

      var format_global_settings={
        global_settings:{
          number_of_data_for_strategy:tickNb
        },
        specificalIndicatorsSettings:specificalIndicatorsSettings
      }

      get_min_number_tick.get(idctr_global_settings,format_global_settings,function(min){

        req.body.global_settings={
          minimum_of_data : min,
          number_of_data_for_strategy : tickNb
        },

        //AFTER SAVE FILE
        fs.appendFile(process.cwd()+path+"/"+filename+".json", JSON.stringify(req.body), function (err) {
          if (err)
            res.status(500).json({error:"error during saving json strat file - "+err});
           else{
             obj_to_strat_str.transform(req.body,
                function(str){
                  if(str!="-1")
                    fs.appendFile(process.cwd()+path+"/"+filename+".js", str, function (err) {
                      console.log(err);
                      if(err)
                        res.status(500).json({error:"error during saving script file"});
                      else
                        sendStratDb();
                    });
                  else
                    res.status(500).json({error:"error during convert your file to a script"});
                },
                function(err){
                  if(err)
                    res.status(500).json({error:err});
                  else
                    res.status(500).json({error:"error during scripting strategy"});
                })

           }
        });
      });
    }
  }

  function sendStratDb(){

    const createStratMdlComplete = new Strategy({
      userid : userid,
      path:path,
      filename:filename,
      date: date.getTime(),
    });
    createStratMdlComplete.save()
      .then(function(){
        console.log(userid+" create strat");
        res.status(201).json({message:'strate created'});
      })
      .catch(function(e){
        console.log("error create strat : "+e);
        res.status(500).json({error:"error during saving strategy in DB"});
      })
  }

/*
  bcrypt.hash(req.body.password, 10)
  .then(function(hash){
    const user = new User({
      email : req.body.email,
      password:hash,
      creationDate:timestamp,
      isConfirm: false
    });
    user.save()
      .then(function(){
        res.status(201).json({message:'Utilisateur créé'});
      })
      .catch(function(e){
        res.status(400).json({error:"email already used"});
      })
  })
  .catch(function(e){
    console.log(e);
    res.status(500).json({error:"error during hash"});
  })*/
};
