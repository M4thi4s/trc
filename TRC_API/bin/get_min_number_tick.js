module.exports={
  getRandomInt:function(max) {
    return Math.floor(Math.random() * Math.floor(max));
  },
  generate_quot:function(nb_of_data){
    var quot={};
    for(var a=0; a<nb_of_data; a++){
      var t=a+1;
      quot[t]={
        Open:(this.getRandomInt(99)+1),
        High:(this.getRandomInt(99)+1),
        Low:(this.getRandomInt(99)+1),
        Close:(this.getRandomInt(99)+1),
        Volume:(this.getRandomInt(99)+1),
      }
    }
    return quot
  },
  start:function(idctr_global_settings, indicatorsParameter, nb_of_data_for_strat, callback){

    var min_of_data=0;
    var min_find=false;
    var counterOfTrue=new Array(Object.keys(indicatorsParameter).length);

    var instruName="test";

    while(min_find==false){

      for(var a=0; a<counterOfTrue.length; a++)
        counterOfTrue[a]=false;

      min_of_data++;

      var allIsDefined=true;

      var counterIndicators=0;
      for(var selectedIndicator in indicatorsParameter){
        var data=this.generate_quot(min_of_data);

        var arr=QuotationObjToArr.start(data,idctr_global_settings[selectedIndicator]);
        if(arr!=1 && arr!=2){

          indctr_parameter = SetIndParameter.start(idctr_global_settings[selectedIndicator].option,indicatorsParameter[selectedIndicator].parameter);

          if(indctr_parameter!=1){
            var indiData=CalculateIndicators.start(instruName, arr, selectedIndicator, indctr_parameter);
            if(indiData.length>0){
              tickNb=indiData.length-1
              counterOfTrue[counterIndicators]=true;
              for(var indiKey in indiData[tickNb])
                if(indiData[tickNb][indiKey]==undefined)
                  counterOfTrue[counterIndicators]=false;

                    //GET JUSTE LAST DATA => PARAIT FONCTIONNER MAIS PK
            }
          }
        }
        counterIndicators++;
      }

      min_find=true;
      for(var a=0; a<counterOfTrue.length; a++)
        if(counterOfTrue[a]==false)
          min_find=false;

    }
    callback(min_of_data+nb_of_data_for_strat-1);
  }
}
