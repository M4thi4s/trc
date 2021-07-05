#!/usr/bin/env node
//download one time quotation

var loadLib=require("../lib/global/require/load_module.js");
var loadModule=require("../lib/global/require/load_lib.js");

loadLib.require();
loadModule.require();

var main={
  global:{
    indice_array:[],
    stock_obj:{},
  },
};

Down.list.start(function(instrument_arr){

  Down.quotation.start(instrument_arr,function(instru_quotation, instru_list_check){
    main.global.stock_obj=instru_quotation;

    main.global.instrument_array=instru_list_check;

    var dirName="../data/multiple_file/"+GlobalFunction.return_time()+"_"+Parameter.interval_in_minutes+"m";

    Fs.mkdir(dirName, { recursive: true }, (err) => {
      if (err) display.log(err);
      else
        SaveDataForDisplaying.multiple_file(Fs,dirName+"/", main.global.stock_obj);
    })

  })

});
