var loadLib=require("../lib/global/require/load_module.js");
var loadModule=require("../lib/global/require/load_lib.js");
var loadMoreIndi=require("../lib/global/require/require_all_indicators.js");

loadLib.require();
loadModule.require();
loadMoreIndi.require();

var indicatorsParameter={ //replace it with your value
  /* ##################### GLOBAL SETTINGS #####################*/
  global_settings:{
    number_of_data_for_strategy:3,
    //possibility of programming system for downloading quotation by adding an interval parameter
  },

  /* ##################### REQUIRE INDICATORS ##################*/
  specificalIndicatorsSettings:{ //check indicators list at => ../lib/global/indicators/indicators_global_config.json
    Stochastic:{
      parameter:{period:14,signalPeriod:3}
    },
    RSI:{
      parameter:{period:14},
    },
  },
}

OpenJSONsettingsFile.start(Fs,"../lib/global/indicators/indicators_global_config.json",function(idctr_global_settings){
  GetMinOfTick.start(idctr_global_settings,indicatorsParameter.specificalIndicatorsSettings,indicatorsParameter.global_settings.number_of_data_for_strategy);
});
