module.exports={

  //possibility to add function to load file here

  start:function(ind,parameter){
    var returnOBJ={};
    for(var a=0; a<ind.length; a++){
      if(parameter[ind[a]]!=undefined)
        returnOBJ[ind[a]]=parameter[ind[a]]
      else{
        console.log("error a parameter is missing")
        return 1;
      }
    }
    return returnOBJ;
  }
}
