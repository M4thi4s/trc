module.exports = {
  start:function(fs,jsonFile,callback){
    GlobalFunction.open_file(fs,jsonFile,function(content){
      var obj=JSON.parse(content);
      console.log("\n# settings load")
      callback(obj);
    },0,1);

  }
}
