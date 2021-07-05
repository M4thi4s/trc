module.exports = {

  //DownloadList lib add here with load_module


  start:function(callback){

    DownloadList=this.DownloadList;

    if(Parameter.nb_page_to_down_list!=0)
      DownloadList.nasdaq.v1.address.nasdaq.nb_page_to_down=Parameter.nb_page_to_down_list;

    DownloadList.wil.v1.start((instrument_obj_1) => {
      DownloadList.nasdaq.v1.start((instrument_obj_2) => {
        var instrument_obj={};

        for(var a in instrument_obj_1)
          instrument_obj[a]={ SE : instrument_obj_1[a].SE };

        for(var a in instrument_obj_2)
          instrument_obj[a]={ SE : instrument_obj_2[a].SE };

        var instrument_array=[];

        //check if schedule corresponding

        for(var a in instrument_obj){
          var return_data=CheckSEschedule.check(instrument_obj[a].SE, {interval_in_minutes:0, period:0});

          switch(return_data[0]){
            case 0:
              instrument_array.push(a);
              Display.log("OK : SE Schedule Corresponding : "+a+" - "+instrument_obj[a].SE)
            break;
            case 1:
              Display.log("add SE time before continuing - "+instrument_obj[a].SE);
            //  return 1;
            break;
            case 2:
              Display.log("SE schedule not corrsponding : "+a+" - "+instrument_obj[a].SE)
            break;
            case 3:
            //  Display.log("Too much SE time : "+a+" - "+instrument_obj[a].SE)
            break;
            case 4:
            //  Display.log("ERROR -  the market doesn't have as much closure as openness")
            break;
            default:
            //  Display.log("error with : "+a+" - "+instrument_obj[a].SE)
          }
        }

        Display.log(instrument_array);

        callback(instrument_array)
      });
    });

  }
}
