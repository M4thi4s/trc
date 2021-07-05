module.exports={

global_settings:{
  minimum_of_data : 18,
  number_of_data_for_strategy : 1
},
specificalIndicatorsSettings:{
  Stochastic:{parameter:{
    period:14,
    signalPeriod:3
  }},
  RSI:{parameter:{
    period:14
  }}
},
specificalIndicatorsPattern:[],


/* ##################### TAKE POSITION FUNCTION ##############*/
position:{
  take:function(instru, quot, rd){
    if(Object.keys(rd).length!=1){
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
        var nbAttMax=2;
        if(rd[t].Stochastic.d < 20 && rd[t].Stochastic.k < 20){
          success_bullish += 1/nbAttMax+0.00001;
        }
        if(rd[t].RSI < 30){
          success_bullish += 1/nbAttMax+0.00001;
        }
      }
      var success_bearish=0;
      if(counter_tick==0){
        var nbAttMax=2;
        if(rd[t].Stochastic.d > 80 && rd[t].Stochastic.k > 80){
          success_bearish += 1/nbAttMax+0.00001;
        }
        if(rd[t].RSI > 70){
          success_bearish += 1/nbAttMax+0.00001;
        }
      }
      counter_tick++;
    }
    if(success_bullish >= 1){
      success[0]=1;
    }
    if(success_bearish >= 1){
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
    if(Object.keys(rd).length!=1){
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
        var nbAttMax=2;
        if(rd[t].Stochastic.d > 70 && rd[t].Stochastic.k > 70){
          success_bullish += 1/nbAttMax+0.00001;
        }
        if(rd[t].RSI > 60){
          success_bullish += 1/nbAttMax+0.00001;
        }
      }
      var success_bearish=0;
      if(counter_tick==0){
        var nbAttMax=2;
        if(rd[t].Stochastic.d < 30 && rd[t].Stochastic.k < 30){
          success_bearish += 1/nbAttMax+0.00001;
        }
        if(rd[t].RSI < 40){
          success_bearish += 1/nbAttMax+0.00001;
        }
      }
      counter_tick++;
    }
    if(success_bullish >= 1){
      success[0]=1;
    }
    if(success_bearish >= 1){
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
