#!/usr/bin/env node
//download one time list and quotation, calcul one time indicaor, save all

var loadLib=require("../../lib/global/require/load_module.js");
var loadModule=require("../../lib/global/require/load_lib.js");
var loadMoreIndi=require("../../lib/global/require/require_all_indicators.js");
var strat=require("../../../data/strategy/1_2_2021/24260c9e-106a-4bb9-af37-1499a2afa502.js");

loadLib.require();
loadModule.require();
loadMoreIndi.require();

var main={

  global:{
    instrument_array:[],  //is also contain in stock_obj but more easy to access
    stock_obj:{},
  },

  patternResults:{  //add pattern results for each instru at each timestamp

  },

  live_position:{ /*used to list open positions more easily than searching in timestamps
    /*

    INSTRU1:["bullish",TIMESTAMP],    // bullish position opened
    INSTRU2:["bearish",TIMESTAMP],    // bearish position opened
    INSTRU3:0,            // no position open
    */
  },

  position:{
    /*
      INSTRU:{
        5482544326:{
          direction : bullish,
          close:true,
          firstStockPrice:62353,
          lastStockPrice:356985,
          closeDate:5482544327,
          optional_values:{
            strength :2
          }
        }
      }

    */
  }
};

function calcul_pattern(stock, pattern_global_settings, instru){
  var results={};
  //calcul pattern data
  for(var b=0; b<strat.specificalIndicatorsPattern.length; b++){
    var patternData=SelectNeededQuot.start(stock, pattern_global_settings[strat.specificalIndicatorsPattern[b]]);

    if(patternData!=1){
      results[strat.specificalIndicatorsPattern[b]]=0;
      var returnStat=CheckPattern.start(strat.specificalIndicatorsPattern[b], patternData);
      if(returnStat){
        results[strat.specificalIndicatorsPattern[b]]=1
    //    console.log("pattern found for : "+instru+" - with : "+strat.specificalIndicatorsPattern[b]+" - at last time given");
      }
    }
    else
      console.log("error : data not organized (l33 <-> SelectNeededQuot)");
  }
  return results;
}

function select_quot(quot, needData){
  var returnQuot={};

  for(var a=0; a<needData; a++)
    returnQuot[Object.keys(quot)[a]]=quot[Object.keys(quot)[a]]

  return returnQuot
}

function organize_all_data_for_start(quot, indi, pattern, counter, instru){
  var results={};

  for(var a=counter-strat.global_settings.number_of_data_for_strategy; a<counter; a++){
    var actualTimestamp=Object.keys(quot)[a];
    results[actualTimestamp]={};
    for(var indiName in indi[actualTimestamp])
      results[actualTimestamp][indiName]=indi[actualTimestamp][indiName];

    results[actualTimestamp].quot={}
    for(var dataType in quot[actualTimestamp])
      results[actualTimestamp].quot[dataType]=quot[actualTimestamp][dataType]

    for(var patternName in pattern[actualTimestamp])
      results[actualTimestamp][patternName]=pattern[actualTimestamp][patternName];

  }

  return results;

  /*
  {
    '1605293700': {
      SMA: 69.12015991210937,
      ADL: 624477,
      BollingerBands: {
        middle: 69.12008056640624,
        upper: 69.15556153289221,
        lower: 69.08459959992028,
        pb: 0.6397465739222138
      },
      quotation: {
        Open : X,
        High : X,
        Low: X,
        Close : X,
        Volume : X
      },
      pattern: {
        xxpattern1:0,
        xxpattern2:1,
      }
    },
    {...},{...},...
  }
  */


}

function delete_data_when_SE_not_open(data){

  var newData={}
  for(var a in data){
    newData[a]={}
    for(var b in data[a]){
      var date = new Date(b * 1000);
      var time=date.getHours()*60+date.getMinutes()

      if(time>Parameter.SE.stock_exchange.NASDAQ.schedule[0][0]*60+Parameter.SE.stock_exchange.NASDAQ.schedule[0][1] && time<Parameter.SE.stock_exchange.NASDAQ.schedule[1][0]*60+Parameter.SE.stock_exchange.NASDAQ.schedule[1][1]){     //starts 5 minutes after SE open
        newData[a][b]=data[a][b]
      }
    }
  }
  return newData;
}

function exports_position_as_csv(dataToWrite){
  //data to save : instrument; direction; t0; take placement stock price; t1; close placement stock price; is closed ?; EXTRA VALUE

  var csvString="instrument; direction; t0; take placement stock price; t1; close placement stock price; is closed ?; EXTRA VALUE ...\n";

  for(var instru in dataToWrite){
    for(var t in dataToWrite[instru]){
      csvString+=instru+";";
      csvString+=dataToWrite[instru][t].direction+";";
      csvString+=t+";";
      csvString+=dataToWrite[instru][t].firstStockPrice+";";
      csvString+=dataToWrite[instru][t].closeDate+";";
      csvString+=dataToWrite[instru][t].lastStockPrice+";";
      csvString+=dataToWrite[instru][t].close+";";

      for(var optionalKey in dataToWrite[instru][t].optional_values)
        if(optionalKey!=undefined)
          csvString+=optionalKey+":"+dataToWrite[instru][t].optional_values[optionalKey]+";";

      csvString+="\n";
    }
  }
  return csvString;
}

OpenJSONquotation.start(Fs,"../../data/11_25_2020_1m",function(instru_list_check, instru_quotation){

  instru_quotation.stock=delete_data_when_SE_not_open(instru_quotation.stock);

  //init results position object with no data
  for(var a=0; a<instru_list_check.length; a++){
    main.position[instru_list_check[a]]={};
    main.live_position[instru_list_check[a]]=0;
  }


  OpenJSONsettingsFile.start(Fs,"../../lib/global/indicators/indicators_global_config.json",function(idctr_global_settings){
    OpenJSONsettingsFile.start(Fs,"../../lib/global/pattern/pattern.json",function(pattern_global_settings){

      console.log("LOAD DATA => OK");

      // add bars
      const Ld = new LoadingBar(100,2);
      Ld.init();
      var ldProgress=[0,0];

      for(var a=0; a<instru_list_check.length; a++){

        ldProgress[0]=Math.round((a)/(instru_list_check.length)*100);
        Ld.update(ldProgress);

        var instru=instru_list_check[a];
        main.patternResults[instru]={}
    //    console.log(Object.keys(instru_quotation.stock[instru]).length+" - "+Object.keys(allIndiData).length);

        for(var b=strat.global_settings.minimum_of_data; b<Object.keys(instru_quotation.stock[instru]).length; b++){

          ldProgress[1]=Math.round((b-strat.global_settings.minimum_of_data)/(Object.keys(instru_quotation.stock[instru]).length-strat.global_settings.minimum_of_data)*100);
          Ld.update(ldProgress);

          var actualTimestamp=Object.keys(instru_quotation.stock[instru])[b]
      //    console.log(b+"/"+(Object.keys(instru_quotation.stock[instru]).length-1));

          var lastData=select_quot(instru_quotation.stock[instru],b);
          var patternResults=calcul_pattern(lastData, pattern_global_settings);   //automatically selects the last values

          main.patternResults[instru][actualTimestamp]=patternResults;

          var indiResults=AutomaticIndicatorCalculation.start(instru, lastData, idctr_global_settings, strat.specificalIndicatorsSettings);

          var data=organize_all_data_for_start(lastData, indiResults, main.patternResults[instru], b, instru)

          if(main.live_position[instru]==0){
            var [results, optional_data] = strat.position.take(instru, lastData, data);

            if(results=="bullish" || results=="bearish"){
            //  console.log("take position -> expected direction : "+results);

              var lastTime=Object.keys(data)[strat.global_settings.number_of_data_for_strategy-1];

              main.live_position[instru]=[results,lastTime];

              main.position[instru][lastTime]={};

              main.position[instru][lastTime].firstStockPrice=data[lastTime].quot.Close;
              main.position[instru][lastTime].direction=results;
              main.position[instru][lastTime].close=false;
              main.position[instru][lastTime].optional_values=optional_data

            }
          }
          else if(main.live_position[instru][0]=="bearish" || main.live_position[instru][0]=="bullish"){
            var results = strat.position.close(instru, lastData, data, main.live_position[instru][0]);

            if(results[0]==1){
              var takeTimestamp=main.live_position[instru][1];

              main.position[instru][takeTimestamp].lastStockPrice=data[Object.keys(data)[Object.keys(data).length-1]].quot.Close;
              main.position[instru][takeTimestamp].close=true;
              main.position[instru][takeTimestamp].closeDate=Object.keys(data)[Object.keys(data).length-1];

              main.live_position[instru]=0;
            }
          }
          else{
            console.log("error -> position status is unknown (check the data you send to $live_position)");
          }

        }

      }

      //optionnal : set as closing value for each live_position the last stock price

      for(var a in main.position){
        for(var b in main.position[a]){
          if(main.position[a][b].close==false){
            main.position[a][b].closeDate=Object.keys(instru_quotation.stock[a])[Object.keys(instru_quotation.stock[a]).length-1];
            main.position[a][b].lastStockPrice=instru_quotation.stock[a][main.position[a][b].closeDate].Close
          }
        }
      }


      var str=exports_position_as_csv(main.position);

      GlobalFunction.append_file(Fs, "../../data/test.csv", str, function(){
        Display.log("file save");
      });

    });
  });

});
