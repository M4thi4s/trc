#!/usr/bin/env node
//download one time list and quotation, calcul one time indicaor, save all

var loadLib=require("../lib/global/require/load_module.js");
var loadModule=require("../lib/global/require/load_lib.js");

loadLib.require();
loadModule.require();

var specificalIndicatorsPattern=["abandonedbaby","darkcloudcover","dragonflydoji"];

OpenJSONquotation.start(Fs,"../data/data.json",function(instru_list_check, instru_quotation){

  OpenJSONsettingsFile.start(Fs,"../lib/global/pattern/pattern.json",function(pattern_global_settings){

    for(var a=0; a<instru_list_check.length; a++){

      for(var b=0; b<specificalIndicatorsPattern.length; b++){
        var patternData=SelectNeededQuot.start(instru_quotation.stock[instru_list_check[a]], pattern_global_settings[specificalIndicatorsPattern[b]]);

        if(patternData!=1){
          var returnStat=CheckPattern.start(specificalIndicatorsPattern[b], patternData);
          if(returnStat){
            console.log("pattern found for : "+instru_list_check[a]+" - with : "+specificalIndicatorsPattern[b]+" - at last time given");
          }
        }

      }

    }

  });

});
