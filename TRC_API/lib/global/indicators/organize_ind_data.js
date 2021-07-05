module.exports={

  check_correction:function(indiData, offset, quot_length){

    var first_data_pos=indiData.length-quot_length+offset; //before this value: undefined   after and on this value: defined value

    var is_undefined=[false,false];
    for(var a in indiData[first_data_pos]){

      if(indiData[first_data_pos-1][a]==undefined)
        is_undefined[0]=true;

      if(indiData[first_data_pos][a]==undefined)
        is_undefined[1]=true;
    }

    if(is_undefined[0]==true && is_undefined[1]==false)
      return 1

    return 0
  },

  start:function(dataArr,timestampArr,gap,indicator){   //indicator is only given for debug

    if(dataArr.length+gap==timestampArr.length){

      var dataObj={}
      for(var a=0; a<dataArr.length; a++)
        dataObj[timestampArr[a+gap]]=dataArr[a];

      return dataObj;
    }
    else if(this.check_correction(dataArr, gap, timestampArr.length)){

      var ignoring_tick_number = dataArr.length-timestampArr.length+gap;

      var dataObj={}
      for(var a=ignoring_tick_number; a<dataArr.length; a++){
        dataObj[timestampArr[a+gap-ignoring_tick_number]]=dataArr[a];
      }

      return dataObj;


    }
    else{
      console.log(indicator+" - error the indicator plus the offset does not give the initial timestamp number")
      return 1;
    }
  }
}
