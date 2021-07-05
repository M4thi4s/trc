module.exports = {

  //DownQuotation lib add here with load_module

  start:function(instrument_array,callback){

    DownQuotation=this.DownQuotation;

    Display.log("DOWN START");
    DownQuotation.download_instrument.start(instrument_array, (stock_obj) => {
      callback(stock_obj,stock_obj.instrument_list);

    });
  },
}
