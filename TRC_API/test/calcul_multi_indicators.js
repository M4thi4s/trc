#!/usr/bin/env node
//download one time list and quotation, calcul one time indicaor, save all

var loadLib=require("../lib/global/require/load_module.js");
var loadModule=require("../lib/global/require/load_lib.js");

loadLib.require();
loadModule.require();

var main={

  global:{
    instrument_array:[],  //is also contain in stock_obj but more easy to access
    stock_obj:{},
  },
};

var specificalIndicatorsSettings={ //check indicators list at => ../lib/global/indicators/indicators_global_config.json
  SMA:{
    parameter:{period:5},
  },

  ADL:{
    parameter:{period:0},
  },

  BollingerBands:{
    parameter:{period:10,stdDev:2},
  },
}

OpenJSONquotation.start(Fs,"../data/data.json",function(instru_list_check, instru_quotation){

  OpenJSONsettingsFile.start(Fs,"../lib/global/indicators/indicators_global_config.json",function(idctr_global_settings){

    for(var a=0; a<instru_list_check.length; a++){

      var allIndiData=AutomaticIndicatorCalculation.start(instru_list_check[a], instru_quotation.stock[instru_list_check[a]], idctr_global_settings, specificalIndicatorsSettings);

      console.log(allIndiData);

      /*
      '1605293700': {
        SMA: 69.12015991210937,
        ADL: 624477,
        BollingerBands: {
          middle: 69.12008056640624,
          upper: 69.15556153289221,
          lower: 69.08459959992028,
          pb: 0.6397465739222138
        }
      }
      */


    }

  });

});
