#!/usr/bin/env node
//download one time quotation

// YOU SHOULD CHANGE SE SCHEDULE IF YOU WANT TO DOWN DATA OVER SE SCHEDULE
// if error : SE schedule not corrsponding => go to data/default_value/value.js and change SE_schedule in the array (juste add 2 at the hours key)

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

    var file="../data/"+GlobalFunction.return_time()+"_"+Parameter.interval_in_minutes+"m";

    MakeJSONfile.one_file(Fs,file, main.global.stock_obj);

  })

});
