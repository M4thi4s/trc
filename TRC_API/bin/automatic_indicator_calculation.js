module.exports={
  start:function(instruName, instruQuot, idctr_global_settings, indicatorsParameter, check_data){

    var returnObj={
      //TIMESTAMP:{ SMA:[V], RSI:[V,V] }
    }

    for(var a in indicatorsParameter){

      var selectedIndicator=a;

      var arr=QuotationObjToArr.start(instruQuot,idctr_global_settings[selectedIndicator]);
      if(arr!=1 && arr!=2){

        indctr_parameter = SetIndParameter.start(idctr_global_settings[selectedIndicator].option,indicatorsParameter[selectedIndicator].parameter);

        if(indctr_parameter!=1){
          var indiData=CalculateIndicators.start(instruName, arr, selectedIndicator, indctr_parameter);

          var timestampArr=Object.keys(instruQuot);

          var offset=GetOffset.start(indctr_parameter, idctr_global_settings[selectedIndicator].offset,timestampArr.length,indiData);

          var success=1;
          for(var y=0; y<timestampArr.length-1; y++)
            if(timestampArr[y]>timestampArr[y+1]){
              console.log(" - error: the timestamps are not organized or there is a bug in the creation of the array")
              success=0;
            }
          if(success==1){
            var organizedIndData=OrganizeInd.start(indiData,timestampArr,offset,selectedIndicator);

            for(var z in organizedIndData){
              if(returnObj[z]==undefined){
                returnObj[z]={}
                returnObj[z][selectedIndicator]=organizedIndData[z]
              }
              else
                returnObj[z][selectedIndicator]=organizedIndData[z]
            }
        //    if(organizedIndData!=1)
        //      callback(instruName,organizedIndData);
          }

        }
      }

    }
    return returnObj;
  }
}
