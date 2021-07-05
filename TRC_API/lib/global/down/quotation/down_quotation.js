module.exports={
  download_instrument:{
    var:{ },

    start:function(input, callback){
      Display.log("<----> DOWNLOAD ACTION + CHECK INPUT AND AUTO REPAIR <---->");

      this.var={
        instru_list:{
          input_1:[],
          input_2:[],
          counter:[0,0],  //[i, MAX]
        },
        on_success:callback,
        stock:{}, //[{instrument:X, stock:[{Open, High, Low, Close, Volume},{Open, High, Low, Close, Volume}, ...]
      }

      this.main(input)
    },

    main:function(instrument_list){
      var this_=this;

      var five_minutes_multiple=false;
      Display.log("CHECK FIVE MINUTES SCHEDULE");
      var first_time=false;

      while(five_minutes_multiple!=true){
        var t=new Date().getMinutes();

        if(t > 9){
          if((t.toString(10)).split("")[1] != 0 && (t.toString(10)).split("")[1] != 5)
            five_minutes_multiple=true;
          else{
            if(first_time==false){
              Display.log("MINUTES NOT CORRESPONDING - WAIT A MINUTE BEFORE DOWNLOADING")
              first_time=true;
            }
          }
        }
        else{
          if(t!=0 && t!=5)
            five_minutes_multiple=true;
          else{
            if(first_time==false){
              Display.log("MINUTES NOT CORRESPONDING - WAIT A MINUTE BEFORE DOWNLOADING")
              first_time=true;
            }
          }
        }
      }

      Display.log("OK :  MINUTES CORRESPONDING")

      GlobalFunction.check_connection("google.gg", function(err){
        if(err==0){
          Display.log("--> connexion --------> OK");

          this_.var.instru_list.input_1    = instrument_list;
          this_.var.instru_list.counter[1] = instrument_list.length;

          Display.log("--> COUNTER : OK")

          for(var a=0; a<instrument_list.length; a++){

            var instrument=instrument_list[a];
            Display.log("---> "+instrument)

            this_.request(instrument, Parameter.interval,function(res,instrument){
              Display.log("----> "+instrument)

              if(res==1){
                Display.log("-----> ERROR WITH DOWN DATA (INSTRUMENT NOT FOUND)");
                this_.check_counter();
              }
              else if(res.chart.result[0].timestamp){
                var quote=this_.organize(res, res.chart.result[0].timestamp, res.chart.result[0].indicators.quote[0])

                this_.var.stock[instrument]=quote;
                this_.var.instru_list.input_2.push(instrument);
                this_.check_counter();

              }
              else{
                Display.log("----> ERROR WITH DATA FORMAT / NO DATA TO DOWNLOAD / FINANCIAL MARKET CLOSE");
                this_.check_counter();
              }

            },instrument);

          }
        }
        else
          Display.log("--> ERROR -> site innaccessible");

      });
    },

    request : function(instrument, interval, callback, instrument){
      const api = new YahooFinance(Parameter.api);

      try{
        var d = api.getIntradayChartData(instrument, interval, true)

        d.then ( function(res){ callback(res,instrument) } );
        d.catch( function( e ){ callback(1  ,instrument) } );
      }
      catch(e){
        callback(1,instrument);
      }
    },

    organize: function(data, timestamp, quote){

      var returnData={};
      for(var a=0; a<timestamp.length; a++){

        //returnData+=new Date(z).getFullYear(z)+'-'+new Date(z).getMonth(z)+'-'+new Date(z).getDate(z)+",";
        returnData[timestamp[a]]={};

        var z=quote;

        var null_bool=0;

      /*  if(z.open[a]==null || z.high[a]==null || z.low[a]==null || z.close[a]==null || z.volume[a]==null){
          Display.log("ERROR IN DOWNLOAD - DATA => LAST DATA : "+z.open[a]+" - "+z.high[a]+" - "+z.low[a]+" - "+z.close[a]+" - "+z.volume[a])
          if(a==timestamp.length-2){
            Display.log(timestamp[a]);
            Display.log(timestamp[a-1]);
            Display.log(timestamp[a+1]);
          }
          null_bool=1;
        }*/

        if(z.open[a]==null)
          z.open[a]=z.open[a+1];

        if(z.high[a]==null)
          z.high[a]=z.high[a+1];

        if(z.low[a]==null)
          z.low[a]=z.low[a+1];

        if(z.close[a]==null)
          z.close[a]=z.close[a+1];

        if(z.volume[a]==null)
          z.volume[a]=z.volume[a+1];

        /*if(null_bool){
          null_bool=0;
          //Display.log(z);
        }*/

        returnData[timestamp[a]].Open   = z.open[a]  ;
        returnData[timestamp[a]].High   = z.high[a]  ;
        returnData[timestamp[a]].Low    = z.low[a]   ;
        returnData[timestamp[a]].Close  = z.close[a] ;
        returnData[timestamp[a]].Volume = z.volume[a];

      }
      return returnData;

    },

    repair_instrument_list : function(){
      var instrument_list_array=[];
      Display.log("--------> repair instrument list ...");

      if(this.var.instru_list.input_1.length!=this.var.instru_list.input_2.length){
        Display.log("---------> need repair")
        for(var a=0; a<this.var.instru_list.input_2.length; a++)
          instrument_list_array.push(this.var.instru_list.input_2[a]);

          Display.log("---------> SUCCESSFUL <---------");

      }
      else{
        Display.log("--------> no need for repair")
        for(var a=0; a<this.var.instru_list.input_1.length; a++)
          instrument_list_array.push(this.var.instru_list.input_1[a])

      }

      this.var.on_success({instrument_list:instrument_list_array, stock:this.var.stock});

    },

    check_counter: function(){

      this.var.instru_list.counter[0]++;
      if(this.var.instru_list.counter[0]==this.var.instru_list.counter[1]){
        Display.log("------> download finish");
        this.repair_instrument_list();
      }
    },

  },
}
