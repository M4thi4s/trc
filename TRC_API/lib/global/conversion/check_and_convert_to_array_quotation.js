module.exports={
  check_quotation:function(quotation){
    for(var a=0; a<Object.keys(quotation).length-1; a++){
      if(parseInt(Object.keys(quotation)[a])>=parseInt(Object.keys(quotation)[a+1]))
        console.log("error find -> repair it needed => not coded because obj already repair before => if your wan't to repair the obj : lib/global/conversion/check_and_convert_to_array_quotation.js");
        //quotation=this.repair(quotation)
        return 1;
      }
    return 0;
  },

  createArr:function(quotation,settings){
    //use if there is only one data to send for indicators

    for(var a=0; a<Object.keys(quotation).length; a++){
      var quotationArr=[];
      for(var a in quotation){

        //construct array
        quotationArr.push(quotation[a][settings.data[0]]);

        if(settings.data[0]!="Open" && settings.data[0]!="High" && settings.data[0]!="Low" && settings.data[0]!="Close" && settings.data[0]!="Volume"){
          console.log("quotation settings name not found -> default = set close quotation");
          quotationArr.push(quotation[a].Close);
        }

      }
    }
    if(quotationArr.length==Object.keys(quotation).length)
      return quotationArr;

    else
      return 1;

  },

  createObj:function(quotation,settings){
    var returnObj={};
    for(var a=0; a<settings.data.length; a++){
      switch(settings.data[a]){

        case 'Open':
          returnObj.open=[];
        break;

        case 'High':
          returnObj.high=[];
        break;

        case 'Low':
          returnObj.low=[];
        break;

        case 'Close':
          returnObj.close=[];
        break;

        case 'Volume':
          returnObj.volume=[];
        break;

        default :
          return 1;
        break;

      }
    }

    for(var a=0; a<Object.keys(quotation).length; a++){
      var t=Object.keys(quotation)[a]
      for(var b in returnObj){
        switch(b){
          case 'open':
            returnObj.open.push(quotation[t]["Open"]);
          break;

          case 'high':
            returnObj.high.push(quotation[t]["High"]);
          break;

          case 'low':
            returnObj.low.push(quotation[t]["Low"]);
          break;

          case 'close':
            returnObj.close.push(quotation[t]["Close"]);
          break;

          case 'volume':
            returnObj.volume.push(quotation[t]["Volume"]);
          break;
        }
      }
    }

    //CHECK IF ALL DATA IS SAVE IN OBJ
    for(var a=0; a<Object.keys(returnObj).length-1; a++)
      if(returnObj[Object.keys(returnObj)[a]].length!=returnObj[Object.keys(returnObj)[a+1]].length)
        return 2;

    //CHECK ICI SI TOUTES LES LIGNES DEMANDE ONT BIEN LE MEME NB D ELEMENTS

    return returnObj;
  },

  start:function(quotation,settings){

    this.check_quotation(quotation);

    if(settings.data.length==1){
      //construct simple array
      var returnArr=this.createArr(quotation,settings);
      if(returnArr==1){
        console.log("error => quotation array and quotation obj do not have the same size");
        return 1;
      }
      return returnArr;
    }

    else{
      //construct obj with specify value
      var returnObj=this.createObj(quotation,settings);

      if(returnObj==1){
        console.log("quotation setting name not found -> error (return 1) => please check your config file");
        return 1;
      }
      else if(returnObj==2){
        console.log("error, one/pls data was not written to the object")
        return 2;
      }

      else
        return returnObj;

    }
  }
}
