exports.transform = function(obj, onSuccess, onError){
  var str="";
  try{


    var str="";
    function add_ligne(str2){
      str+=str2+"\n"
      return str;
    }




    str+="module.exports={\n\n";
    str+="global_settings:{\n";
    str+="  minimum_of_data : "+obj.global_settings.minimum_of_data+",\n";
    str+="  number_of_data_for_strategy : "+obj.global_settings.number_of_data_for_strategy+"\n";
    str+="},\n";

    str+="specificalIndicatorsSettings:{\n";
    var first=true;
    for(var indiName in obj.parameter.indicators){
      if(!first)
        str+=",\n";
      first=false;

      str+="  "+indiName+":{";
      str+="parameter:{";

      for(var keyNb=0; keyNb<Object.keys(obj.parameter.indicators[indiName]).length; keyNb++){
        str+="\n    "+Object.keys(obj.parameter.indicators[indiName])[keyNb]+":"+obj.parameter.indicators[indiName][Object.keys(obj.parameter.indicators[indiName])[keyNb]];
        if(keyNb<Object.keys(obj.parameter.indicators[indiName]).length-1)
          str+=",";
      }
      str+="}\n  }"
    }
    str+="\n},\n";
    str+="specificalIndicatorsPattern:[";
    first=true;
    for(var patName in obj.parameter.pattern)
      if(patName!=undefined){
        if(!first)
          str+=","
        str+="'"+patName+"'";
        first=false;
      }
    str+="],\n";







    //  add_ligne("/* ##################### TAKE POSITION FUNCTION ##############*/");

    add_ligne("position:{");

    var step=1;
    while(step==1 || step==2){
      if(step==1)
        add_ligne("  take:function(instru, quot, rd){");
      else
        add_ligne("  close:function(instru, quot, rd,direction){");

      //check number of tick receive BTW number_expected
      add_ligne("    if(Object.keys(rd).length!="+obj.global_settings.number_of_data_for_strategy+"){");
      add_ligne("      console.log('error expected number of tick != number of tick receive');");
      add_ligne("      return [0,{fiability : 0}];");
      add_ligne("    }");

      add_ligne("    var counter_tick=0;");
      add_ligne("    var success=[0,0];");

      add_ligne("    for(var t in rd){");
      add_ligne("      var O=rd[t].quot.Open;");
      add_ligne("      var H=rd[t].quot.High;");
      add_ligne("      var L=rd[t].quot.Low;");
      add_ligne("      var C=rd[t].quot.Close;");
      add_ligne("      var V=rd[t].quot.Volume;");

      //FORMER ARRAY VIA ALIAS

      if(step==1)
        var dir_arr=[
          ["tp_bul","bullish"],
          ["tp_bea","bearish"],
        ]

      else
        var dir_arr=[
          ["cp_bul","bullish"],
          ["cp_bea","bearish"],
        ]

      for(var dNb=0; dNb<dir_arr.length;dNb++){
        add_ligne("      var success_"+dir_arr[dNb][1]+"=0;");
        for(var tickNb=0; tickNb<obj.global_settings.number_of_data_for_strategy; tickNb++){
          var null_size=false;
          add_ligne  ("      if(counter_tick=="+tickNb+"){");
          if(Object.keys(obj.strat[dir_arr[dNb][0]][tickNb]).length==0){
            add_ligne("        success_"+dir_arr[dNb][1]+"++;")
          }
          else{

            //VERIFIER QUE obj.strat[dir_arr[dNb][0]][tickNb][a].value.operator.length==obj.strat[dir_arr[dNb][0]][tickNb][a].value.nb.length

            var nbAtt=0;
            for(var name in obj.strat[dir_arr[dNb][0]][tickNb])
              nbAtt+=1;

            add_ligne("        var nbAttMax="+nbAtt+";");

            for(var name in obj.strat[dir_arr[dNb][0]][tickNb]){

              str+="        if(";
              var first=true;
              for(var key_name in obj.strat[dir_arr[dNb][0]][tickNb][name]){
                for(var strat_counter=0; strat_counter<obj.strat[dir_arr[dNb][0]][tickNb][name][key_name].operator.length; strat_counter++){
                  if(first==true)
                    first=false;
                  else
                    str+=" && ";

                  if(key_name=="value"){
                    str+="rd[t]."+name+" "+obj.strat[dir_arr[dNb][0]][tickNb][name][key_name].operator[strat_counter]+" "+obj.strat[dir_arr[dNb][0]][tickNb][name][key_name].nb[strat_counter];
                  }
                  else{
                    str+="rd[t]."+name+"."+key_name+" "+obj.strat[dir_arr[dNb][0]][tickNb][name][key_name].operator[strat_counter]+" "+obj.strat[dir_arr[dNb][0]][tickNb][name][key_name].nb[strat_counter];
                  }
                }
              }
              str+="){\n";

              add_ligne("          success_"+dir_arr[dNb][1]+" += 1/nbAttMax+0.00001;");

              add_ligne("        }");

            }


          }
          add_ligne("      }");

          if(null_size==true)
            add_ligne("      }");

        }
      }
      add_ligne("      counter_tick++;");

      add_ligne("    }");

      //ICI CONDITION LIGNE  README
      for(var dNb=0; dNb<dir_arr.length;dNb++){
        add_ligne("    if(success_"+dir_arr[dNb][1]+" >= "+obj.global_settings.number_of_data_for_strategy+"){\n      success["+dNb+"]=1;\n    }");
      }

      if(step==1){
        add_ligne("    if(success[0]==success[1] && success[0]==1){\n      console.log('ERROR IN STRATEGY : TREND IS BULLISH AND BEARISH');\n      return [0,{fiability : 0}];\n    }");
        add_ligne("    if(success[0]==1){\n      return ['"+dir_arr[0][1]+"',{fiability : 1}];\n    }");
        add_ligne("    if(success[1]==1){\n      return ['"+dir_arr[1][1]+"',{fiability : 1}];\n    }");
        add_ligne("    else{\n      return [0,{fiability : 0}];\n    }");
      }

      else{
    //    add_ligne("    if(success[0]==success[1] && success[0]==1){\n      console.log('WARNING : TREND CLOSED WITH BULLISH AND BEARISH STRAT');\n      return [0,{fiability : 0}];\n    }");

        add_ligne("    if(success[0]==success[1] && success[0]==1){\n      return [1,{fiability : 1}];\n    }");
        add_ligne("    if(success[0]==1 && direction=='"+dir_arr[0][1]+"'){\n      return [1,{fiability : 1}];\n    }");
        add_ligne("    if(success[1]==1 && direction=='"+dir_arr[1][1]+"'){\n      return [1,{fiability : 1}];\n    }");
        add_ligne("    else{\n      return 0;\n    }");
      }

      add_ligne("  },");
      step++;
    }

    add_ligne("}\n}");

    onSuccess(str);
  }
  catch(err){
    onError(err);
  }
}
