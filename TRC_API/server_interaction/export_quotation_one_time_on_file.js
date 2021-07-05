#!/usr/bin/env node
//download one time quotation

// YOU SHOULD CHANGE SE SCHEDULE IF YOU WANT TO DOWN DATA OVER SE SCHEDULE
// if error : SE schedule not corrsponding => go to data/default_value/value.js and change SE_schedule in the array (juste add 2 at the hours key)

// BASED ON test/export_quotation_one_time_on_file.js

var loadLib=require("../lib/global/require/load_module.js");
var loadModule=require("../lib/global/require/load_lib.js");
const Quotfile = require("../../models/quotfile.js");
const path = require('path')

loadLib.require();
loadModule.require();

/* CHANGE DEFAULT PARAMETER */
Parameter.interval_in_minutes=1;
Parameter.interval="1m";

var main={
  global:{
    indice_array:[],
    stock_obj:{},
  },
};

exports.down = function(callback){
  Down.list.start(function(instrument_arr){
    Down.quotation.start(instrument_arr,function(instru_quotation, instru_list_check){
      main.global.stock_obj=instru_quotation;

      main.global.instrument_array=instru_list_check;

      var file=__dirname+"/../../data/quotfile/"+GlobalFunction.return_time()+"_"+Parameter.interval_in_minutes+"m";
      file=path.normalize(file)

      MakeJSONfile.one_file(Fs,file, main.global.stock_obj);

      const quotfile = new Quotfile({
        length:   main.global.instrument_array.length,
        instru:   JSON.stringify(main.global.instrument_array),
        interval: Parameter.interval_in_minutes,
        filePath: file,
        date:     GlobalFunction.return_time(),
      });

      quotfile.save()
        .then(function(){
          console.log("data saved on disk and on DB");
          if(callback)
            callback();
        })
        .catch(function(e){
          console.log("error while saving quotation data on DB");
        })

    })
  })
}
