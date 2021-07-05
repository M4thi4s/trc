module.exports={
  start:function(instru, quotation, indiName, indiConfig){

    /*
    indiConfig ={
      period: 5,
      values: [50,65,25,36,52,52,...]
    }
    */

    if(Object.keys(indiConfig).length==0){
      return TechInd[indiName].calculate(quotation);
    }
    else if(quotation.length>0){
      indiConfig.values=quotation;
      return TechInd[indiName].calculate(indiConfig);
    }
    else{
      for(var a in quotation)
        indiConfig[a]=quotation[a];
      return TechInd[indiName].calculate(indiConfig);

    }

  }
}
