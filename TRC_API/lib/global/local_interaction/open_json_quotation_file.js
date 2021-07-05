module.exports = {
  start:function(fs,jsonFile,callback){
    GlobalFunction.open_file(fs,jsonFile,function(content){
      var obj=JSON.parse(content);
      console.log("\n# FILE -> OK\n# GET INSTRUMENT LIST & STOCK -> OK")
      callback(obj.instrument_list,obj);

    },0,1);

  }
}
