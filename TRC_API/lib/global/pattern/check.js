module.exports={
  start:function(patternName, shortQuot){
    var res=TechInd[patternName](shortQuot);
/*    if(res==1 && patternName=="darkcloudcover"){      //for checking if there is pattern result
      console.log(shortQuot);
    }**/
    return res;
  }
}
