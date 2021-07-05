//IS AN ADAPTATION FROM test/get_min_number_tick.js
var loadLib=require("../lib/global/require/load_module.js");
var loadModule=require("../lib/global/require/load_lib.js");
var loadMoreIndi=require("../lib/global/require/require_all_indicators.js");

loadLib.require();
loadModule.require();
loadMoreIndi.require();

exports.get = function(idctr_global_settings, indicatorsParameter, callback){
  GetMinOfTick.start(idctr_global_settings,indicatorsParameter.specificalIndicatorsSettings,indicatorsParameter.global_settings.number_of_data_for_strategy,callback);
}
/*
var indicatorsParameter=
{ //replace it with your value
  // ##################### GLOBAL SETTINGS #####################
  global_settings:{
    number_of_data_for_strategy:3,
    //possibility of programming system for downloading quotation by adding an interval parameter
  },

  // ##################### REQUIRE INDICATORS ##################
  specificalIndicatorsSettings:{ //check indicators list at => ../lib/global/indicators/indicators_global_config.json
    Stochastic:{
      parameter:{period:14,signalPeriod:3}
    },
    RSI:{
      parameter:{period:14},
    },
  },
}
*/
