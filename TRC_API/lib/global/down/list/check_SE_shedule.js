module.exports = {
  check: function(se, data){

    if(data.interval_in_minutes==0 || Parameter.interval_in_minutes==undefined)
      data.interval_in_minutes = Parameter.interval_in_minutes;

    if(data.period==0 || data.period==undefined)
      data.period = Parameter.period;

    var t   = new Date();
    var m_t = t.getMinutes();
    var h_t = t.getHours();

    var actual_minutes=m_t+h_t*60

    if(Parameter.SE.stock_exchange.hasOwnProperty(se)==false)
      return [1];  //SE NOT FOUND

    var shedule=Parameter.SE.stock_exchange[se].schedule;

    var inter=data.interval_in_minutes*data.period; //=interval minimum avec le cours d' ouverture et l'heure actuelle (en minute)

    switch(shedule.length){
      case 2:
        var se_open  = [ shedule[0][0]*60+shedule[0][1] ];
        var se_close = [ shedule[1][0]*60+shedule[1][1] ];

        se_open [0] += inter;
        se_close[0] -= inter;

      break;
      case 4:

        var se_open  = [ shedule[0][0]*60+shedule[1][1] , shedule[2][0]*60+shedule[2][1] ];
        var se_close = [ shedule[1][0]*60+shedule[1][1] , shedule[3][0]*60+shedule[3][1] ];

        se_open [0] += inter;
        se_open [1] += inter;
        se_close[0] -= inter;
        se_close[1] -= inter;

      break;
      default:
        return [3];   //CHECK SE SCHEDULE
    }

    if(se_open.length==se_close.length){
      for(var a=0; a<se_open.length; a++)
        if(actual_minutes>=se_open[a] && actual_minutes<=se_close[a])
          return [0];   //OK
    }

    else
      return [4];

    return [2];      //SCHEDULE NOT CORRESPONDING

    //1- convertir heure actuel en minutes
    //2- convertir heure ouverture et fermeture en minutes
    //3- ajouter à heure ouverture + interval minimum
    //3- ajouter à heure fermeture - interval minimum
    //4- regarder si l'heure se situe bien dans cette encadrement
    // return 0 si bien dans l' interval
    // return 1 sinon
  }
}
