module.exports={
  one_file:function(fs, src,quotation_obj){
    //resultat par mouvement, %
    var str=JSON.stringify(quotation_obj);

    GlobalFunction.append_file(fs, src, str, function(){
      Display.log("file save");
    });
  },
}
