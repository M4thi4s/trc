module.exports={
  start:function(option, offset, timestamp_length, indiData){

    if(offset==0)
      return(0);

    else if(typeof offset === 'string' || offset instanceof String){

      if(offset=="auto"){

        var pos=-1;
        var compteur=0;

        while(pos==-1){
          var allIsNotUndefined=true;
          for(var b in indiData[compteur]){
            if(indiData[compteur][b]==undefined){
          //    console.log("WARNINGS : indi data not defined for : INDI."+b+" -> set automatically");
              allIsNotUndefined=false;
            }
          }
          if(allIsNotUndefined==true)
            pos=compteur;
          else
            compteur++;
        }

        return timestamp_length-indiData.length+pos;
      }

      else if(option[offset]!=undefined)
        return option[offset];      //WORKS ON MOVING AVERAGE INIDCATORS

      else{
        if(offset.indexOf("+")!=-1){
          if(option[offset.slice(0,offset.indexOf("+"))]!=undefined){
            return option[offset.slice(0,offset.indexOf("+"))]+parseInt(offset.slice(offset.indexOf("+")+1,offset.length));
          }
          else
            console.log("operation found but no corresponding variable")
        }
        else if(offset.indexOf("-")!=-1){
          if(option[offset.slice(0,offset.indexOf("-"))]!=undefined)
            return option[offset.slice(0,offset.indexOf("-"))]-parseInt(offset.slice(offset.indexOf("-")+1,offset.length));
          else
            console.log("operation found but no corresponding variable")
        }
        else{
          console.log("the offset ("+offset+") was detected as defined by a variable but no variable matches");
          return 1;
        }
      }
    }
    else if(Number.isInteger(offset))
      return offset;

    else{
      console.log("undefined offset")
      return 1;
    }

  }
}
