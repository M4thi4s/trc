module.exports={
  start:function(stock, pattern){

    var stockOrganized=true;
    for(var a=0; a<Object.keys(stock).length; a++)
      if(Object.keys(stock)[a]>Object.keys(stock)[a+1])
        stockOrganized=false;

    var stockArr=[];

    if(stockOrganized==false){
      console.log("error - timestamp data not organized");
      return 1;
    }
    else{
      var quot={
        open:[],
        high:[],
        low:[],
        close:[]
      }
      for(var a=Object.keys(stock).length-(pattern.numberOfQuotMin); a<Object.keys(stock).length; a++){

        quot.open.push(stock[Object.keys(stock)[a]].Open);
        quot.high.push(stock[Object.keys(stock)[a]].High);
        quot.low.push(stock[Object.keys(stock)[a]].Low);
        quot.close.push(stock[Object.keys(stock)[a]].Close);
      }
      return quot;
    }

  }
}
