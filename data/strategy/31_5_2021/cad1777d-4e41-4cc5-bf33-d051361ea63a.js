module.exports={

global_settings:{
  minimum_of_data : 29,
  number_of_data_for_strategy : 2
},
specificalIndicatorsSettings:{
  RSI:{parameter:{
    period:14}
  },
  Stochastic:{parameter:{
    period:15,
    signalPeriod:14}
  }
},
specificalIndicatorsPattern:['bullishmarubozu'],
position:{
  take:function(instru, quot, rd){
    if(Object.keys(rd).length!=2){
      console.log('error expected number of tick != number of tick receive');
      return [0,{fiability : 0}];
    }
    var counter_tick=0;
    var success=[0,0];
    for(var t in rd){
      var O=rd[t].quot.Open;
      var H=rd[t].quot.High;
      var L=rd[t].quot.Low;
      var C=rd[t].quot.Close;
      var V=rd[t].quot.Volume;
      var success_bullish=0;
      if(counter_tick==0){
        var nbAttMax=1;
        if(rd[t].RSI < 50){
          success_bullish += 1/nbAttMax+0.00001;
        }
      }
      if(counter_tick==1){
        var nbAttMax=1;
        if(rd[t].RSI < 50){
          success_bullish += 1/nbAttMax+0.00001;
        }
      }
      var success_bearish=0;
      if(counter_tick==0){
        var nbAttMax=1;
        if(rd[t].RSI < 50){
          success_bearish += 1/nbAttMax+0.00001;
        }
      }
      if(counter_tick==1){
        var nbAttMax=1;
        if(rd[t].Stochastic.d < 10 && rd[t].Stochastic.k < 10){
          success_bearish += 1/nbAttMax+0.00001;
        }
      }
      counter_tick++;
    }
    if(success_bullish >= 2){
      success[0]=1;
    }
    if(success_bearish >= 2){
      success[1]=1;
    }
    if(success[0]==success[1] && success[0]==1){
      console.log('ERROR IN STRATEGY : TREND IS BULLISH AND BEARISH');
      return [0,{fiability : 0}];
    }
    if(success[0]==1){
      return ['bullish',{fiability : 1}];
    }
    if(success[1]==1){
      return ['bearish',{fiability : 1}];
    }
    else{
      return [0,{fiability : 0}];
    }
  },
  close:function(instru, quot, rd,direction){
    if(Object.keys(rd).length!=2){
      console.log('error expected number of tick != number of tick receive');
      return [0,{fiability : 0}];
    }
    var counter_tick=0;
    var success=[0,0];
    for(var t in rd){
      var O=rd[t].quot.Open;
      var H=rd[t].quot.High;
      var L=rd[t].quot.Low;
      var C=rd[t].quot.Close;
      var V=rd[t].quot.Volume;
      var success_bullish=0;
      if(counter_tick==0){
        var nbAttMax=1;
        if(rd[t].bullishmarubozu == true){
          success_bullish += 1/nbAttMax+0.00001;
        }
      }
      if(counter_tick==1){
        success_bullish++;
      }
      var success_bearish=0;
      if(counter_tick==0){
        var nbAttMax=1;
        if(rd[t].Stochastic.d < 50 && rd[t].Stochastic.k < 50){
          success_bearish += 1/nbAttMax+0.00001;
        }
      }
      if(counter_tick==1){
        var nbAttMax=1;
        if(rd[t].bullishmarubozu == true){
          success_bearish += 1/nbAttMax+0.00001;
        }
      }
      counter_tick++;
    }
    if(success_bullish >= 2){
      success[0]=1;
    }
    if(success_bearish >= 2){
      success[1]=1;
    }
    if(success[0]==success[1] && success[0]==1){
      return [1,{fiability : 1}];
    }
    if(success[0]==1 && direction=='bullish'){
      return [1,{fiability : 1}];
    }
    if(success[1]==1 && direction=='bearish'){
      return [1,{fiability : 1}];
    }
    else{
      return 0;
    }
  },
}
}
