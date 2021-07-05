module.exports={
  singleLine:function(fs,file,data){

    console.log(data[Object.keys(data)[0]].lengthw)

    //CHECK SI BIEN OBJ AVEC UNE LIGNE
    if(data[Object.keys(data)[0]].length>1){
      console.log("err to many data or no data");
      return 1
    }
    else{
      var str="Date,S1\n";
      for(var a in data){
        str+=a+","+data[a]+"\n"
      }
      console.log(file);
      GlobalFunction.append_file(fs, file, str, function(){
        Display.log("file save");
      });
    }
  },
  multiple_file:function(fs, path,quotation_obj){
    for(var a=0; a<quotation_obj.instrument_list.length; a++){
      var str="Date,Open,High,Low,Close,Volume\n";
      var instruData=quotation_obj.stock[quotation_obj.instrument_list[a]]

      for(var b in instruData){
        str+=parseInt(b)+","+instruData[b].Open+","+instruData[b].High+","+instruData[b].Low+","+instruData[b].Close+","+instruData[b].Volume+"\n";
      }

      GlobalFunction.append_file(fs, path+"/"+quotation_obj.instrument_list[a]+"_"+Parameter.interval_in_minutes, str, function(){
        Display.log("file save");
      });

    }
  }
}
